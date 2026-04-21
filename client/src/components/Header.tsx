// src/components/Header.tsx

interface HeaderProps {
  online: boolean
  address: string
}

export default function Header({ online, address }: HeaderProps) {
  return (
    <div className="header">
      <div className="header-left">
        <div className="wordmark">stalkr</div>
        <span className="server-addr">{address}</span>
      </div>
      {online ? (
        <div className="status-pill">
          <div className="status-dot" />
          ONLINE
        </div>
      ) : (
        <div className="status-pill" style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.08)', color: 'var(--text-muted)' }}>
          OFFLINE
        </div>
      )}
    </div>
  )
}