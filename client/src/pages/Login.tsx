import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (!res.ok) throw new Error('Wrong password')
      const { token } = await res.json()
      localStorage.setItem('stalkr_token', token)
      navigate('/admin')
    } catch {
      setError('Invalid password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="layout" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <div className="player-card" style={{ width: '100%', maxWidth: '360px', padding: '32px' }}>
        <div className="wordmark" style={{ marginBottom: '24px' }}>stalkr</div>
        <div className="stat-label" style={{ marginBottom: '8px' }}>Admin Password</div>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleLogin()}
          placeholder="••••••••"
          style={{
            width: '100%',
            background: 'var(--slot-bg)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            padding: '10px 14px',
            color: 'var(--text)',
            fontFamily: 'Geist Mono, monospace',
            fontSize: '14px',
            marginBottom: '12px',
            outline: 'none',
          }}
        />
        {error && (
          <div style={{ fontSize: '11px', color: 'var(--red)', fontFamily: 'Geist Mono', marginBottom: '12px' }}>
            {error}
          </div>
        )}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="refresh-btn"
          style={{ width: '100%', padding: '10px', fontSize: '12px' }}
        >
          {loading ? 'Logging in...' : 'Login →'}
        </button>
      </div>
    </div>
  )
}