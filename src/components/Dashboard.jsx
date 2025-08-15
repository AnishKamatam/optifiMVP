import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useOrg } from '../context/OrgContextCore'
import './Dashboard.css'
import { DollarSign, Activity, Users, Briefcase } from 'lucide-react'
import Sidebar from './Sidebar'
import CSVUploadModal from './CSVUploadModal'
// icons removed for minimal layout

const Dashboard = () => {
  const navigate = useNavigate()
  const { signOut } = useAuth()
  const { currentOrgId } = useOrg()
  const [showCSVUpload, setShowCSVUpload] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    navigate('/', { replace: true })
  }

  const handleImportCSV = () => {
    setShowCSVUpload(true)
  }

  return (
    <div className="dash">
      <aside className="dash-sidebar"><Sidebar /></aside>

      <main className="dash-main">
        <header className="dash-header" data-org-id={currentOrgId || ''}>
          <div className="dash-header-left" />
          <div className="dash-header-right">
            <button className="logout-btn" style={{ marginRight: '8px' }} onClick={handleImportCSV}>Import CSV</button>
            <button className="logout-btn" onClick={handleSignOut}>Sign Out</button>
          </div>
        </header>

        {/* KPI Row */}
        <section className="bo">
          <div className="bo-grid">
            <div className="bo-card">
              <div className="bo-row">
                <div className="bo-label">Monthly Revenue</div>
                <div className="bo-ico bo-ico-green"><DollarSign size={16} /></div>
              </div>
              <div className="bo-value">$127,340</div>
              <div className="bo-trend bo-up">+12.5% <span className="bo-muted">from last month</span></div>
            </div>
            <div className="bo-card">
              <div className="bo-row">
                <div className="bo-label">Monthly Expenses</div>
                <div className="bo-ico bo-ico-red"><Activity size={16} /></div>
              </div>
              <div className="bo-value">$84,210</div>
              <div className="bo-trend bo-down">+3.2% <span className="bo-muted">from last month</span></div>
            </div>
            <div className="bo-card">
              <div className="bo-row">
                <div className="bo-label">Team Members</div>
                <div className="bo-ico"><Users size={16} /></div>
              </div>
              <div className="bo-value">47</div>
              <div className="bo-trend bo-up">+3 new hires <span className="bo-muted">this quarter</span></div>
            </div>
            <div className="bo-card">
              <div className="bo-row">
                <div className="bo-label">Active Projects</div>
                <div className="bo-ico"><Briefcase size={16} /></div>
              </div>
              <div className="bo-value">24,847</div>
              <div className="bo-trend bo-up">+18.4% <span className="bo-muted">from last month</span></div>
            </div>
          </div>
        </section>
      </main>

      {/* CSV Upload Modal */}
      <CSVUploadModal 
        isOpen={showCSVUpload} 
        onClose={() => setShowCSVUpload(false)} 
      />
    </div>
  )
}

export default Dashboard


