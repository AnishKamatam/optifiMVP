import { useState } from 'react'
import { useAuth } from './context/AuthContext'
import AuthModal from './components/AuthModal'
import './App.css'

function App() {
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState('login')
  const { user, signOut, loading } = useAuth()

  const handleLoginClick = () => {
    setAuthMode('login')
    setAuthModalOpen(true)
  }

  const handleSignupClick = () => {
    setAuthMode('signup')
    setAuthModalOpen(true)
  }

  const handleSignOut = async () => {
    await signOut()
  }

  if (loading) {
    return (
      <div className="App">
        <div className="loading">Loading...</div>
      </div>
    )
  }

  return (
    <div className="App">
      {/* Header */}
      <header className="header">
        <div className="logo">
          <span className="logo-text">OPTIFI</span>
        </div>
        <nav className="nav">
          <a href="#features">Features</a>
          <a href="#pricing">Pricing</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </nav>
        <div className="auth-buttons">
          {user ? (
            <>
              <span className="user-email">Welcome, {user.email}</span>
              <button className="logout-btn" onClick={handleSignOut}>
                Sign Out
              </button>
            </>
          ) : (
            <>
              <button className="login-btn" onClick={handleLoginClick}>
                Login
              </button>
              <button className="signup-btn" onClick={handleSignupClick}>
                Sign Up
              </button>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <main className="hero-section">
        <div className="hero-left">
          <h1 className="hero-headline">An ERP That Works for You, Not the Other Way Around</h1>
          <p className="hero-subheading">Replace dozens of tools and manual processes with one autonomous system that works like a full-time team.</p>
          <button className="request-demo-btn">Request Demo</button>
        </div>
        <div className="hero-right">
          <div className="hero-visual">
            {/* Video placeholder */}
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-container">
          <div className="features-header">
          <div className="features-header-left">
            <span className="features-label">Highlights</span>
            <h2 className="features-title">The complete platform for<br />AI support agents</h2>
          </div>
          <div className="features-header-right">
            <p className="features-description">
              OPTIFI is designed for building AI support agents that solve your 
              customers' hardest problems while improving business outcomes.
            </p>
          </div>
        </div>
        
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <div className="icon-placeholder icon-llm"></div>
            </div>
            <h3 className="feature-title">Stay ahead of the numbers.</h3>
            <ul className="feature-list">
              <li>Automated reconciliations</li>
              <li>Real-time cashflow & forecasting</li>
              <li>AI-driven expense categorization</li>
            </ul>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <div className="icon-placeholder icon-simplicity"></div>
            </div>
            <h3 className="feature-title">Run smoother, faster, smarter.</h3>
            <ul className="feature-list">
              <li>Supply chain monitoring & alerts</li>
              <li>Predictive maintenance</li>
              <li>Smart task assignments</li>
            </ul>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <div className="icon-placeholder icon-security"></div>
            </div>
            <h3 className="feature-title">Empower your people and processes.</h3>
            <ul className="feature-list">
              <li>Automated onboarding</li>
              <li>Time-off tracking</li>
              <li>Performance insights</li>
            </ul>
          </div>
        </div>
        </div>
      </section>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        mode={authMode}
      />
    </div>
  )
}

export default App
