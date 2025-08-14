import { useEffect, useMemo, useState } from 'react'
import { DollarSign, Building2, Calculator, LayoutDashboard, Settings } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useOrg } from '../context/OrgContextCore'
import { supabase } from '../lib/supabase'
import './Sidebar.css'

const MODULE_CATALOG = {
  finance: {
    title: 'Finance',
    subtitle: 'Financial Management',
    route: '/dashboard/finance',
    icon: DollarSign,
  },
  operations: {
    title: 'Operations',
    subtitle: 'Business Operations',
    route: '/dashboard/operations',
    icon: Building2,
  },
  accounting: {
    title: 'Accounting',
    subtitle: 'Accounting & Compliance',
    route: '/dashboard/accounting',
    icon: Calculator,
  },
  // alias support for your DB change
  acct: {
    title: 'Accounting',
    subtitle: 'Accounting & Compliance',
    route: '/dashboard/accounting',
    icon: Calculator,
  },
}

const Sidebar = () => {
  const { user } = useAuth()
  const { currentOrgId, organizations } = useOrg()
  const [modules, setModules] = useState([])
  const [loading, setLoading] = useState(false)

  const orgName = useMemo(() => {
    const org = organizations.find(o => o.id === currentOrgId)
    return org?.name || 'Organization'
  }, [organizations, currentOrgId])

  useEffect(() => {
    const load = async () => {
      if (!currentOrgId) return
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from('org_modules')
          .select('enabled, modules:module_id ( code, name )')
          .eq('org_id', currentOrgId)
          .eq('enabled', true)

        if (error) throw error
        const enabled = (data || []).map(r => r.modules?.code).filter(Boolean)
        setModules(enabled)
      } catch (_) {
        setModules([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [currentOrgId])

  const renderItem = (code, isActive) => {
    const meta = MODULE_CATALOG[code]
    if (!meta) return null
    const RightIcon = meta.icon
    return (
      <a key={code} className={`sb-item ${isActive ? 'active' : ''}`} href={meta.route}>
        <div className="sb-item-text">
          <div className="sb-title">{meta.title}</div>
          <div className="sb-sub">{meta.subtitle}</div>
        </div>
        <div className="sb-right-ico">{RightIcon ? <RightIcon size={18} /> : null}</div>
      </a>
    )
  }

  return (
    <div className="sb-wrap">
      <div className="sb-brand">
        <div className="sb-brand-text">
          <div className="sb-brand-name">{orgName}</div>
        </div>
      </div>

      <div className="sb-nav">
        <a className="sb-item active" href="/dashboard">
          <div className="sb-item-text">
            <div className="sb-title">Dashboard</div>
            <div className="sb-sub">Business Overview</div>
          </div>
          <div className="sb-right-ico"><LayoutDashboard size={18} /></div>
        </a>

        {!loading && modules.map(code => renderItem(code, false))}

        <a className="sb-item" href="/dashboard/settings">
          <div className="sb-item-text">
            <div className="sb-title">Settings</div>
            <div className="sb-sub">Account & Preferences</div>
          </div>
          <div className="sb-right-ico"><Settings size={18} /></div>
        </a>
      </div>

      <div className="sb-footer">
        <div className="sb-user">
          <div className="sb-avatar">{(user?.email || 'SJ').slice(0,2).toUpperCase()}</div>
          <div className="sb-user-text">
            <div className="sb-user-name">{user?.email || 'User'}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar


