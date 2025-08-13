import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Dashboard = () => {
  const navigate = useNavigate()
  const { signOut } = useAuth()

  const handleSignOut = async () => {
    await signOut()
    navigate('/', { replace: true })
  }

  return (
    <div style={{ padding: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontWeight: 600 }}>test</div>
        <button onClick={handleSignOut} style={{ padding: '0.5rem 0.9rem', border: '1px solid #000', background: '#000', color: '#fff', borderRadius: 6, cursor: 'pointer' }}>
          Sign Out
        </button>
      </div>
    </div>
  )
}

export default Dashboard


