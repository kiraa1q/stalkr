// src/components/ServerStats.tsx
import type { ServerStats } from '../types'

interface Props {
  stats: ServerStats | null
}

export default function ServerStats({ stats }: Props) {
  return (
    <>
      <div className="section-title">Server</div>
      <div className="server-stats" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: '12px' }}>
        <div className="stat-card">
          <div className="stat-label">Players</div>
          <div className="stat-value">
            {stats?.players.online ?? '—'}
            <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>/{stats?.players.max ?? 20}</span>
          </div>
          <div className="stat-sub">{stats?.players.names.join(', ') ?? '—'}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">TPS</div>
          <div className="stat-value">{stats?.tps ?? '—'}</div>
          <div className="tps-bar-bg">
            <div className="tps-bar-fill" style={{ width: `${((stats?.tps ?? 0) / 20) * 100}%` }} />
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">RAM</div>
          <div className="stat-value">
            {stats?.ram.used ?? '—'}
            <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}> GB</span>
          </div>
          <div className="stat-sub">of {stats?.ram.max ?? '—'} GB allocated</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Uptime</div>
          <div className="stat-value">{stats?.uptime ?? '—'}</div>
        </div>
      </div>

      <div className="section-title">World</div>
      <div className="server-stats" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: '24px' }}>
        <div className="stat-card">
          <div className="stat-label">World Time</div>
          <div className="stat-value">{stats?.time ?? '—'}</div>
          <div className="stat-sub">tick {stats?.tick ?? '—'}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Weather</div>
          <div className="stat-value">{stats?.weather ?? '—'}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Version</div>
          <div className="stat-value">{stats?.version ?? '—'}</div>
          <div className="stat-sub">Paper · Java</div>
        </div>
      </div>
    </>
  )
}