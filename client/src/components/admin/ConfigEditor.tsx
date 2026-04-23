import WhitelistManager from "./WhitelistManager";

export default function ConfigEditor() {
  return (
    <div style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px', fontFamily: 'Geist Mono', fontSize: '11px', color: 'var(--text-muted)' }}>
      <WhitelistManager />
    </div>
  )
}