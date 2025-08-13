import { useEffect, useMemo, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './AuthContext'
import { OrgContext } from './OrgContextCore'

export const OrgProvider = ({ children }) => {
  const { user } = useAuth()
  const [organizations, setOrganizations] = useState([])
  const [currentOrgId, setCurrentOrgId] = useState(null)
  const [currentRole, setCurrentRole] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const loadOrganizations = useCallback(async () => {
    if (!user) {
      setOrganizations([])
      setCurrentOrgId(null)
      return
    }

    setLoading(true)
    setError('')
    try {
      // Fetch orgs for the current user via membership
      // 1) Fetch memberships
      const { data: members, error: qError } = await supabase
        .from('org_members')
        .select('org_id, role')
        .eq('user_id', user.id)

      if (qError) throw qError

      const orgIds = (members || []).map(m => m.org_id)

      // 2) Fetch organizations in a separate query to avoid relation embedding issues
      let orgRows = []
      if (orgIds.length > 0) {
        const { data: orgsData, error: orgErr } = await supabase
          .from('organizations')
          .select('id, name')
          .in('id', orgIds)
        if (orgErr) throw orgErr
        orgRows = orgsData || []
      }

      const idToRole = new Map((members || []).map(m => [m.org_id, m.role]))
      const orgs = orgRows.map(o => ({ id: o.id, name: o.name, role: idToRole.get(o.id) }))
      setOrganizations(orgs)

      // Pick first org if none selected
      if (!currentOrgId && orgs.length > 0) {
        setCurrentOrgId(orgs[0].id)
        setCurrentRole(orgs[0].role)
      }
      // Sync role when current org changes
      if (currentOrgId) {
        const found = orgs.find(o => o.id === currentOrgId)
        setCurrentRole(found?.role || null)
      }
    } catch (e) {
      // Silently ignore if schema isn't set up yet
      setError(e?.message || 'Failed to load organizations')
    } finally {
      setLoading(false)
    }
  }, [user, currentOrgId])

  const createOrganization = useCallback(async (name) => {
    if (!user) return { error: new Error('Not authenticated') }
    try {
      // Prefer RPC if available; fall back to direct inserts
      const { data: rpcData, error: rpcError } = await supabase
        .rpc('create_org_with_owner', { p_name: name })

      if (rpcError && rpcError.message?.includes('create_org_with_owner')) {
        // RPC not found; attempt minimal direct create (requires policies)
        const { data: org, error: orgErr } = await supabase
          .from('organizations')
          .insert({ name, created_by: user.id })
          .select()
          .single()
        if (orgErr) throw orgErr
        await supabase.from('org_members').insert({ org_id: org.id, user_id: user.id, role: 'owner' })
        setOrganizations((prev) => [...prev, { id: org.id, name: org.name, role: 'owner' }])
        setCurrentOrgId(org.id)
        setCurrentRole('owner')
        return { data: org, error: null }
      }

      if (rpcError) throw rpcError
      // RPC returns uuid org_id
      const newOrgId = Array.isArray(rpcData) ? rpcData[0] : rpcData
      await loadOrganizations()
      setCurrentOrgId(newOrgId)
      return { data: { id: newOrgId }, error: null }
    } catch (e) {
      return { data: null, error: e }
    }
  }, [user, loadOrganizations])

  useEffect(() => {
    loadOrganizations()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id])

  const value = useMemo(() => ({
    organizations,
    currentOrgId,
    setCurrentOrgId,
    currentRole,
    loading,
    error,
    refresh: loadOrganizations,
    createOrganization,
  }), [organizations, currentOrgId, currentRole, loading, error, loadOrganizations, createOrganization])

  return (
    <OrgContext.Provider value={value}>{children}</OrgContext.Provider>
  )
}


