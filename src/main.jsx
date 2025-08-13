import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Root from './Root.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { OrgProvider } from './context/OrgContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <OrgProvider>
        <Root />
      </OrgProvider>
    </AuthProvider>
  </StrictMode>,
)
