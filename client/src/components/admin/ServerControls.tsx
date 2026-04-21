export default function ServerControls() {
  return (
    <div style={{ display: 'flex', gap: '8px' }}>
      {['Start', 'Stop', 'Restart'].map(a => (
        <button key={a} className="refresh-btn" style={{ flex: 1, padding: '12px' }}>{a}</button>
      ))}
    </div>
  )
}