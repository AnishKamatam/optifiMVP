import { useState, useEffect, useRef } from 'react'
import { useAuth } from './context/AuthContext'
import AuthModal from './components/AuthModal'
import DemoRequestModal from './components/DemoRequestModal'
import './App.css'
import OrgSwitcher from './components/OrgSwitcher'

function App() {
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [demoModalOpen, setDemoModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState('login')
  const [pricingPeriod, setPricingPeriod] = useState('monthly')
  const [animatedPrices, setAnimatedPrices] = useState({})
  const { user, signOut, loading } = useAuth()
  const animationRefs = useRef({})

  const handleLoginClick = () => {
    setAuthMode('login')
    setAuthModalOpen(true)
  }

  const handleSignupClick = () => {
    setAuthMode('signup')
    setAuthModalOpen(true)
  }

  const handleDemoRequestClick = () => {
    setDemoModalOpen(true)
  }

  const handleSignOut = async () => {
    await signOut()
  }

  const handlePricingToggle = (period) => {
    setPricingPeriod(period)
    // Trigger count-up animation for all prices
    Object.keys(pricingData[period]).forEach(plan => {
      const price = pricingData[period][plan].price
      if (typeof price === 'number') {
        animatePrice(plan, price)
      }
    })
  }

  const animatePrice = (plan, targetPrice) => {
    const duration = 300 // Animation duration in milliseconds
    const steps = 15 // Number of steps in the animation
    const stepDuration = duration / steps
    let currentStep = 0

    const animate = () => {
      currentStep++
      const progress = currentStep / steps
      const currentPrice = Math.floor(targetPrice * progress)
      
      setAnimatedPrices(prev => ({
        ...prev,
        [plan]: currentPrice
      }))

      if (currentStep < steps) {
        setTimeout(animate, stepDuration)
      } else {
        // Ensure final price is exact
        setAnimatedPrices(prev => ({
          ...prev,
          [plan]: targetPrice
        }))
      }
    }

    animate()
  }

  // Initialize animated prices
  useEffect(() => {
    const initialPrices = {}
    Object.keys(pricingData[pricingPeriod]).forEach(plan => {
      const price = pricingData[pricingPeriod][plan].price
      if (typeof price === 'number') {
        initialPrices[plan] = price
      }
    })
    setAnimatedPrices(initialPrices)
  }, [])

  // Pricing data
  const pricingData = {
    monthly: {
      free: { price: 0, period: 'per month' },
      starter: { price: 49, period: 'per month' },
      growth: { price: 199, period: 'per month' },
      enterprise: { price: 'Custom', period: 'starts at $499/month' }
    },
    yearly: {
      free: { price: 0, period: 'per year' },
      starter: { price: 470, period: 'per year', savings: 118 },
      growth: { price: 1910, period: 'per year', savings: 478 },
      enterprise: { price: 'Custom', period: 'annual pricing' }
    }
  }

  const getCurrentPricing = (plan) => {
    return pricingData[pricingPeriod][plan]
  }

  const getDisplayPrice = (plan) => {
    const pricing = getCurrentPricing(plan)
    if (typeof pricing.price === 'number') {
      return animatedPrices[plan] || pricing.price
    }
    return pricing.price
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
          {user && (
            <OrgSwitcher />
          )}
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
              <button className="signup-btn" onClick={handleDemoRequestClick}>
                Request Demo
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
          <button className="request-demo-btn" onClick={handleDemoRequestClick}>Request Demo</button>
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
            <span className="features-label">Features</span>
            <h2 className="features-title">The agentic ERP that transforms your business</h2>
          </div>
          <div className="features-header-right">
            <p className="features-description">
              Intelligent automation that understands your business, streamlines every department, and evolves as your needs change.
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

      {/* Pricing Section */}
      <section className="pricing-section">
        <div className="pricing-container">
          <div className="pricing-header">
            <h2 className="pricing-title">Predictable pricing<br />scalable plans</h2>
            <p className="pricing-description">Designed for every stage of your journey.</p>
            
            <div className="pricing-toggle">
              <button 
                className={`toggle-btn ${pricingPeriod === 'monthly' ? 'active' : ''}`}
                onClick={() => handlePricingToggle('monthly')}
              >
                Monthly
              </button>
              <button 
                className={`toggle-btn ${pricingPeriod === 'yearly' ? 'active' : ''}`}
                onClick={() => handlePricingToggle('yearly')}
              >
                Yearly
              </button>
            </div>
          </div>
          
          <div className="pricing-grid">
            <div className="pricing-card">
              <div className="card-header">
                <h3 className="plan-name">Free</h3>
              </div>
              <div className="plan-price">
                <span className="price">${getDisplayPrice('free')}</span>
                <span className="period">{getCurrentPricing('free').period}</span>
              </div>
              <button className="plan-button primary">Get Started</button>
              <ul className="plan-features">
                <li>Access to 1 ERP module (Finance OR Operations)</li>
                <li>Up to 3 seats</li>
                <li>Basic AI automations (10/month)</li>
                <li>1 GB data storage</li>
                <li>Standard reports</li>
                <li>Community support</li>
              </ul>
            </div>

            <div className="pricing-card">
              <div className="card-header">
                <h3 className="plan-name">Starter</h3>
              </div>
              <div className="plan-price">
                <span className="price">${getDisplayPrice('starter')}</span>
                <span className="period">{getCurrentPricing('starter').period}</span>
                {pricingPeriod === 'yearly' && getCurrentPricing('starter').savings && (
                  <div className="savings-badge">Saves ${getCurrentPricing('starter').savings}/year</div>
                )}
              </div>
              <button className="plan-button outline">Subscribe</button>
              <ul className="plan-features">
                <li>Everything in Free +</li>
                <li>Access to 3 ERP modules (Finance, Operations, HR)</li>
                <li>Up to 10 seats</li>
                <li>Unlimited basic AI automations</li>
                <li>5 advanced automations/month</li>
                <li>10 GB data storage</li>
                <li>Automated weekly reports</li>
              </ul>
            </div>

            <div className="pricing-card popular">
              <div className="popular-badge">Popular</div>
              <div className="card-header">
                <h3 className="plan-name">Growth</h3>
              </div>
              <div className="plan-price">
                <span className="price">${getDisplayPrice('growth')}</span>
                <span className="period">{getCurrentPricing('growth').period}</span>
                {pricingPeriod === 'yearly' && getCurrentPricing('growth').savings && (
                  <div className="savings-badge">Saves ${getCurrentPricing('growth').savings}/year</div>
                )}
              </div>
              <button className="plan-button primary">Subscribe</button>
              <ul className="plan-features">
                <li>Everything in Starter +</li>
                <li>All ERP modules included</li>
                <li>Up to 25 seats</li>
                <li>Unlimited advanced automations</li>
                <li>Predictive forecasting & analytics dashboard</li>
                <li>50 GB data storage</li>
                <li>Automated custom workflows</li>
                <li>Priority support</li>
              </ul>
            </div>

            <div className="pricing-card">
              <div className="card-header">
                <h3 className="plan-name">Enterprise</h3>
              </div>
              <div className="plan-price">
                <span className="price">{getCurrentPricing('enterprise').price}</span>
                <span className="period">{getCurrentPricing('enterprise').period}</span>
              </div>
              <button className="plan-button outline">Contact Sales</button>
              <ul className="plan-features">
                <li>Everything in Growth +</li>
                <li>Unlimited seats</li>
                <li>Custom AI model fine-tuning</li>
                <li>Dedicated account manager</li>
                <li>API & custom integrations (Salesforce, SAP, NetSuite, etc.)</li>
                <li>On-premise or private cloud deployment</li>
                <li>SLA-backed uptime</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="footer-logo">OPTIFI</div>
              <p className="footer-copyright">© {new Date().getFullYear()} OPTIFI, Inc.</p>
              
              
            </div>

            <div className="footer-columns">
              <div className="footer-col">
                <h4>Product</h4>
                <ul>
                  <li><a href="#">Customer Service</a></li>
                  <li><a href="#pricing">Pricing</a></li>
                  <li><a href="#">Security</a></li>
                  <li><a href="#">Affiliates</a></li>
                </ul>
              </div>
              <div className="footer-col">
                <h4>Resources</h4>
                <ul>
                  <li><a href="#contact">Contact us</a></li>
                  <li><a href="#">API</a></li>
                  <li><a href="#">Guide</a></li>
                  <li><a href="#">Blog</a></li>
                  <li><a href="#">Changelog</a></li>
                </ul>
              </div>
              <div className="footer-col">
                <h4>Company</h4>
                <ul>
                  <li><a href="#">Careers</a></li>
                  <li><a href="#">Privacy policy</a></li>
                  <li><a href="#">Terms of service</a></li>
                  <li><a href="#">DPA</a></li>
                  <li><a href="#">Cookie policy</a></li>
                  <li><a href="#">Trust center</a></li>
                  <li><a href="#">Cookie preferences</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        mode={authMode}
      />
      
      <DemoRequestModal
        isOpen={demoModalOpen}
        onClose={() => setDemoModalOpen(false)}
      />
    </div>
  )
}

export default App
