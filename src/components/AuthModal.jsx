import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import './AuthModal.css'

const AuthModal = ({ isOpen, onClose, mode = 'login' }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [currentMode, setCurrentMode] = useState(mode)

  // Update currentMode when mode prop changes
  useEffect(() => {
    setCurrentMode(mode)
    setError('') // Clear any previous errors when switching modes
    // Clear form fields when switching modes
    setEmail('')
    setPassword('')
    setFirstName('')
    setLastName('')
    setCompanyName('')
  }, [mode])

  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      let result
      if (currentMode === 'login') {
        result = await signIn(email, password)
      } else {
        result = await signUp(email, password, firstName, lastName, companyName)
      }

      if (result.error) {
        setError(result.error.message)
      } else {
        onClose()
        setEmail('')
        setPassword('')
        setFirstName('')
        setLastName('')
        setCompanyName('')

        // Navigate to dashboard after auth
        navigate('/dashboard', { replace: true })
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const toggleMode = () => {
    setCurrentMode(currentMode === 'login' ? 'signup' : 'login')
    setError('')
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        
        <h2>{currentMode === 'login' ? 'Login' : 'Sign Up'}</h2>
        
        <form onSubmit={handleSubmit}>
          {currentMode === 'signup' && (
            <>
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="companyName">Company Name</label>
                <input
                  type="text"
                  id="companyName"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                />
              </div>
            </>
          )}
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Loading...' : (currentMode === 'login' ? 'Login' : 'Sign Up')}
          </button>
        </form>
        
        <p className="toggle-mode">
          {currentMode === 'login' ? "Don't have an account? " : "Already have an account? "}
          <button type="button" className="toggle-btn" onClick={toggleMode}>
            {currentMode === 'login' ? 'Sign Up' : 'Log In'}
          </button>
        </p>
      </div>
    </div>
  )
}

export default AuthModal