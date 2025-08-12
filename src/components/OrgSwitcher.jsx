import { useOrg } from '../context/OrgContextCore'
import './OrgSwitcher.css'

const OrgSwitcher = () => {
  const { organizations, currentOrgId, setCurrentOrgId, loading } = useOrg()

  if (loading || organizations.length === 0) return null

  return (
    <div className="org-switcher">
      <select
        className="org-select"
        value={currentOrgId || ''}
        onChange={(e) => setCurrentOrgId(e.target.value)}
      >
        {organizations.map((o) => (
          <option key={o.id} value={o.id}>{o.name}</option>
        ))}
      </select>
    </div>
  )
}

export default OrgSwitcher


