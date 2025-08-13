import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import App from './App'
import Dashboard from './components/Dashboard'
import { useAuth } from './context/AuthContext'

const RequireOwner = () => {
  const { user, loading } = useAuth()
  if (loading) return null
  if (!user) return <Navigate to="/" replace />
  // Temporary: allow any authenticated user until org policies are finalized
  return <Outlet />
}

const LandingOrRedirect = () => {
  const { user, loading } = useAuth()
  if (loading) return null
  if (user) return <Navigate to="/dashboard" replace />
  return <App />
}

const Root = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<LandingOrRedirect />} />
      <Route element={<RequireOwner />}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </BrowserRouter>
)

export default Root


