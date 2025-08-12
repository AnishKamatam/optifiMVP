import { useEffect, useMemo, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './AuthContext'
import { OrgContext } from './OrgContextCore'

export const OrgProvider = ({ children }) => {
  const { user } = useAuth()
  const [organizations, setOrganizations] = useState([])
  const [currentOrgId, setCurrentOrgId] = useState(null)
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
      const { data, error: qError } = await supabase
        .from('org_members')
        .select('org_id, organizations:org_id ( id, name )')
        .eq('user_id', user.id)

      if (qError) throw qError

      const orgs = (data || []).map((row) => ({ id: row.organizations?.id, name: row.organizations?.name })).filter(Boolean)
      setOrganizations(orgs)

      // Pick first org if none selected
      if (!currentOrgId && orgs.length > 0) {
        setCurrentOrgId(orgs[0].id)
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
        setOrganizations((prev) => [...prev, { id: org.id, name: org.name }])
        setCurrentOrgId(org.id)
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
    loading,
    error,
    refresh: loadOrganizations,
    createOrganization,
  }), [organizations, currentOrgId, loading, error, loadOrganizations, createOrganization])

  return (
    <OrgContext.Provider value={value}>{children}</OrgContext.Provider>
  )
}


