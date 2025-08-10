import { useState } from 'react'
import { supabase } from '../lib/supabase'
import './DemoRequestModal.css'

const DemoRequestModal = ({ isOpen, onClose }) => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Insert demo request into Supabase
      const { data, error: supabaseError } = await supabase
        .from('demo_requests')
        .insert([
          {
            first_name: firstName,
            last_name: lastName,
            email: email,
            company_name: companyName
          }
        ])
        .select()

      if (supabaseError) {
        console.error('Supabase error:', supabaseError)
        throw new Error('Failed to submit demo request. Please try again.')
      }

      console.log('Demo request saved successfully:', data)
      setSuccess(true)
      
      // Close modal after 2 seconds
      setTimeout(() => {
        onClose()
        resetForm()
      }, 2000)

    } catch (err) {
      setError(err.message || 'An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFirstName('')
    setLastName('')
    setEmail('')
    setCompanyName('')
    setError('')
    setSuccess(false)
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="demo-modal-overlay" onClick={handleClose}>
      <div className="demo-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="demo-modal-close" onClick={handleClose}>×</button>
        
        {!success ? (
          <>
            <h2>Request a Demo</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  placeholder="Enter your first name"
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
                  placeholder="Enter your last name"
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
                  placeholder="Enter your company name"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your email address"
                />
              </div>
              
              {error && <div className="error-message">{error}</div>}
              
              <button type="submit" className="demo-submit-btn" disabled={loading}>
                {loading ? 'Sending Request...' : 'Request Demo'}
              </button>
            </form>
          </>
        ) : (
          <div className="success-message">
            <div className="success-icon">✓</div>
            <h3>Demo Request Sent!</h3>
            <p>Thank you for your interest. We'll contact you within 24 hours to schedule your demo.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default DemoRequestModal 