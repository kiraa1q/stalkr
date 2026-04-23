import { useNavigate } from 'react-router-dom'
import ServerControls from '../components/admin/ServerControls.tsx'
import LiveConsole from '../components/admin/LiveConsole.tsx'
import ConfigEditor from '../components/admin/ConfigEditor.tsx'

export default function Admin() {
  const navigate = useNavigate()

  const handleLogout = (): void => {
    
    localStorage.removeItem('stalkr_token');
    

    navigate('/login', { replace: true });
  };

  return (
    <div className="layout">
      <div className="header">
        <div className="header-left">
          <div className="wordmark">stalkr</div>
          <span className="server-addr">admin panel</span>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <a href="/" className="refresh-btn">← Dashboard</a>
          <button onClick={handleLogout} className="refresh-btn">Logout</button>
        </div>
      </div>

      <div className="section-title">Server Controls</div>
      <ServerControls />

      <div className="section-title" style={{ marginTop: '24px' }}>Live Console</div>
      <LiveConsole />

      <div className="section-title" style={{ marginTop: '24px' }}>Config</div>
      <ConfigEditor />
    </div>
  )
}