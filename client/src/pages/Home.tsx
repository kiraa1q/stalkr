import { useEffect, useState } from 'react'
import type { ServerStats, Player } from '../types'
import { fetchServerStats, fetchPlayers } from '../api'
import Header from '../components/Header'
import ServerStatsComponent from '../components/ServerStats'
import PlayerCard from '../components/PlayerCard'

export default function Home() {
  const [stats, setStats] = useState<ServerStats | null>(null)
  const [players, setPlayers] = useState<Player[]>([])

  useEffect(() => {
    const load = async () => {
      setStats(await fetchServerStats())
      setPlayers(await fetchPlayers())
    }
    load()
    const interval = setInterval(load, 10000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="layout">
      <Header online={stats?.online ?? false} address="mc.local:25565" />
      <ServerStatsComponent stats={stats} />

      <div className="section-title">Players</div>
      <div className="players-grid">
        {players.map(p => <PlayerCard key={p.uuid} player={p} />)}
      </div>

      <div className="section-title" style={{ marginTop: '24px' }}>Map</div>
      <div style={{
        width: '100%',
        height: '500px',
        borderRadius: '12px',
        overflow: 'hidden',
        border: '1px solid var(--border)',
        marginBottom: '24px',
      }}>
        <iframe
          src="http://localhost:8100/"
          style={{ width: '100%', height: '100%', border: 'none' }}
          title="BlueMap"
        />
      </div>

      <div className="page-footer">
        <div className="footer-text">Auto-refresh 10s</div>
        <a href="/admin" className="refresh-btn">Admin</a>
      </div>
    </div>
  )
}