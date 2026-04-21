import { useEffect, useState } from 'react'
import type { ServerStats, Player } from './types'
import { fetchServerStats, fetchPlayers } from './api'
import Header from './components/Header'
import ServerStatsComponent from './components/ServerStats'
import PlayerCard from './components/PlayerCard'

function App() {
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
    </div>
  )
}

export default App