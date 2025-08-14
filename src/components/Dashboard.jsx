import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useOrg } from '../context/OrgContextCore'
import './Dashboard.css'
import Sidebar from './Sidebar'
// icons removed for minimal layout

const Dashboard = () => {
  const navigate = useNavigate()
  const { signOut } = useAuth()
  const { currentOrgId } = useOrg()

  const handleSignOut = async () => {
    await signOut()
    navigate('/', { replace: true })
  }

  return (
    <div className="dash">
      <aside className="dash-sidebar"><Sidebar /></aside>

      <main className="dash-main">
        <header className="dash-header" data-org-id={currentOrgId || ''}>
          <div className="dash-header-left" />
          <div className="dash-header-right">
            <button className="logout-btn" onClick={handleSignOut}>Sign Out</button>
          </div>
        </header>
      </main>
    </div>
  )
}

export default Dashboard


