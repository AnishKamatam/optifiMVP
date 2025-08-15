import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import App from './App'
import Dashboard from './components/Dashboard'
import { useAuth } from './context/AuthContext'
import { useOrg } from './context/OrgContextCore'

const RequireAuth = () => {
  const { user, loading } = useAuth()
  const { organizations, loading: orgLoading, currentOrgId } = useOrg()

  if (loading || orgLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        color: '#64748b'
      }}>
        Loading...
      </div>
    )
  }

  // Redirect to landing if not authenticated
  if (!user) {
    return <Navigate to="/" replace />
  }

  // Redirect to landing if user has no organizations
  if (organizations.length === 0) {
    return <Navigate to="/" replace />
  }

  // Redirect to landing if no current organization is selected
  if (!currentOrgId) {
    return <Navigate to="/" replace />
  }

  // Verify user has access to the current organization
  const hasAccess = organizations.some(org => org.id === currentOrgId)
  if (!hasAccess) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

const LandingOrRedirect = () => {
  const { user, loading } = useAuth()
  const { organizations, loading: orgLoading } = useOrg()

  if (loading || orgLoading) return null
  
  // If user is logged in and has organizations, redirect to dashboard
  if (user && organizations.length > 0) {
    return <Navigate to="/dashboard" replace />
  }
  
  // Show landing page for:
  // - Not logged in users
  // - Logged in users with no organizations (they can create one)
  return <App />
}

const Root = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<LandingOrRedirect />} />
      <Route element={<RequireAuth />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </BrowserRouter>
)

export default Root


