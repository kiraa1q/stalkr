export default function ServerControls() {
  return (
    <div style={{ display: 'flex', gap: '8px' }}>
      <button className="refresh-btn" style={{
        flex: 1, padding: '14px',
        fontSize: '12px', letterSpacing: '0.06em',
        border: '1px solid rgba(74,222,128,0.3)',
        color: 'var(--green)',
        background: 'rgba(74,222,128,0.06)',
      }}>
        ▶ Start
      </button>
      <button className="refresh-btn" style={{
        flex: 1, padding: '14px',
        fontSize: '12px', letterSpacing: '0.06em',
        border: '1px solid rgba(248,113,113,0.3)',
        color: 'var(--red)',
        background: 'rgba(248,113,113,0.06)',
      }}>
        ■ Stop
      </button>
      <button className="refresh-btn" style={{
        flex: 1, padding: '14px',
        fontSize: '12px', letterSpacing: '0.06em',
        border: '1px solid rgba(251,191,36,0.3)',
        color: 'var(--yellow)',
        background: 'rgba(251,191,36,0.06)',
      }}>
        ↺ Restart
      </button>
    </div>
  )
}