import { useState } from 'react';

export default function ServerControls() {
  const [loading, setLoading] = useState<string | null>(null);

  const handleAction = async (action: 'start' | 'stop' | 'restart') => {
    setLoading(action);
    
    // API URL aus der .env ziehen
    const API_URL = import.meta.env.VITE_API_URL;
    const token = localStorage.getItem('stalkr_token');

    try {
      const res = await fetch(`${API_URL}/server/control`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ action })
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Aktion fehlgeschlagen');
      
      alert(`Erfolg: ${data.message}`);
    } catch (err: any) {
      alert(`Fehler: ${err.message}`);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div style={{ display: 'flex', gap: '8px' }}>
      {/* START BUTTON */}
      <button 
        className="refresh-btn" 
        onClick={() => handleAction('start')}
        disabled={loading !== null}
        style={{
          flex: 1, padding: '14px', fontSize: '12px', letterSpacing: '0.06em',
          border: '1px solid rgba(74,222,128,0.3)',
          color: 'var(--green)',
          background: 'rgba(74,222,128,0.06)',
          opacity: loading !== null ? 0.5 : 1,
          cursor: loading !== null ? 'not-allowed' : 'pointer'
        }}
      >
        {loading === 'start' ? '...' : '▶ Start'}
      </button>

      {/* STOP BUTTON */}
      <button 
        className="refresh-btn" 
        onClick={() => handleAction('stop')}
        disabled={loading !== null}
        style={{
          flex: 1, padding: '14px', fontSize: '12px', letterSpacing: '0.06em',
          border: '1px solid rgba(248,113,113,0.3)',
          color: 'var(--red)',
          background: 'rgba(248,113,113,0.06)',
          opacity: loading !== null ? 0.5 : 1,
          cursor: loading !== null ? 'not-allowed' : 'pointer'
        }}
      >
        {loading === 'stop' ? '...' : '■ Stop'}
      </button>

      {/* RESTART BUTTON */}
      <button 
        className="refresh-btn" 
        onClick={() => handleAction('restart')}
        disabled={loading !== null}
        style={{
          flex: 1, padding: '14px', fontSize: '12px', letterSpacing: '0.06em',
          border: '1px solid rgba(251,191,36,0.3)',
          color: 'var(--yellow)',
          background: 'rgba(251,191,36,0.06)',
          opacity: loading !== null ? 0.5 : 1,
          cursor: loading !== null ? 'not-allowed' : 'pointer'
        }}
      >
        {loading === 'restart' ? '...' : '↺ Restart'}
      </button>
    </div>
  );
}