import { useEffect, useState } from "react";
import type { ServerStats, Player } from "../types";
import { fetchServerStats, fetchPlayers } from "../api";
import Header from "../components/Header";
import ServerStatsComponent from "../components/ServerStats";
import PlayerCard from "../components/PlayerCard";

export default function Home() {
  const [stats, setStats] = useState<ServerStats | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    const loadData = async () => {
      console.log("Refreshing data..."); // Prüfe, ob das alle 5 Sek. in der Konsole steht
      try {
        const [newStats, newPlayers] = await Promise.all([
          fetchServerStats(),
          fetchPlayers(),
        ]);

        console.log("New stats received:", newStats);
        setStats(newStats);
        setPlayers(newPlayers);
      } catch (err) {
        console.error("Fetch-Fehler im Intervall:", err);
      }
    };

    // Einmal sofort laden
    loadData();

    // Intervall starten
    const interval = setInterval(() => {
      loadData();
    }, 5000);

    // Cleanup
    return () => {
      console.log("Interval cleared");
      clearInterval(interval);
    };
  }, []);
  return (
    <div className="layout">
      {/* Header erhält den Online-Status aus den Stats */}
      <Header online={stats?.online ?? false} address="mc.local:25565" />

      {/* Stats-Komponente mit den aktuellen Daten */}
      <ServerStatsComponent stats={stats} />

      <div className="section-title">Players</div>
      <div className="players-grid">
        {players.length > 0 ? (
          players.map((p) => <PlayerCard key={p.uuid} player={p} />)
        ) : (
          <div style={{ color: "var(--text-muted)", fontSize: "12px" }}>
            Keine Spieler online
          </div>
        )}
      </div>

      <div className="section-title" style={{ marginTop: "24px" }}>
        Map
      </div>
      {/* Das Iframe für BlueMap lassen wir so, das refresht sich meist selbst */}
      <div
        style={{
          width: "100%",
          height: "500px",
          borderRadius: "12px",
          overflow: "hidden",
          border: "1px solid var(--border)",
          marginBottom: "24px",
        }}
      >
        <iframe
          src="http://localhost:8100"
          style={{ width: "100%", height: "100%", border: "none" }}
          title="BlueMap"
        />
      </div>

      <div className="page-footer">
        <div className="footer-text">Auto-refresh: 5s</div>
        <a href="/admin" className="refresh-btn">
          Admin Panel
        </a>
      </div>
    </div>
  );
}
