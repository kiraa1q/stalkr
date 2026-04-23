// src/components/ServerStats.tsx
import type { ServerStats } from "../types";

interface Props {
  stats: ServerStats | null;
}

export default function ServerStatsComponent({ stats }: Props) {
  // Kleiner Trick: Den TPS-Wert für die Farbe berechnen
  const tpsColor =
    (stats?.tps ?? 0) > 18
      ? "var(--green)"
      : (stats?.tps ?? 0) > 15
        ? "var(--yellow)"
        : "var(--red)";

  return (
    <>
      <div className="section-title">Server</div>
      <div
        className="server-stats"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "12px",
          marginBottom: "12px",
        }}
      >
        <div className="stat-card">
          <div className="stat-label">Players</div>
          <div className="stat-value">
            {stats?.players.online ?? "0"}
            <span style={{ fontSize: "14px", color: "var(--text-muted)" }}>
              /{stats?.players.max ?? 20}
            </span>
          </div>
          <div
            className="stat-sub"
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {stats?.players.names && stats.players.names.length > 0
              ? stats.players.names.join(", ")
              : "No players online"}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-label">TPS</div>
          <div className="stat-value" style={{ color: tpsColor }}>
            {stats?.tps ?? "—"}
          </div>
          <div
            className="tps-bar-bg"
            style={{
              height: "4px",
              background: "rgba(255,255,255,0.1)",
              borderRadius: "2px",
              marginTop: "8px",
            }}
          >
            <div
              className="tps-bar-fill"
              style={{
                height: "100%",
                borderRadius: "2px",
                background: tpsColor,
                width: `${Math.min(((stats?.tps ?? 0) / 20) * 100, 100)}%`,
                transition: "width 0.5s ease",
              }}
            />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-label">RAM</div>
          <div className="stat-value">
            {stats?.ram.used ?? "—"}
            <span style={{ fontSize: "14px", color: "var(--text-muted)" }}>
              {" "}
              GB
            </span>
          </div>
          <div className="stat-sub">of {stats?.ram.max ?? "—"} GB total</div>

          {/* Optional: Ein kleiner Fortschrittsbalken für den RAM */}
          <div
            style={{
              height: "4px",
              background: "rgba(255,255,255,0.1)",
              borderRadius: "2px",
              marginTop: "8px",
            }}
          >
            <div
              style={{
                height: "100%",
                background: "var(--blue)", // Oder eine Farbe deiner Wahl
                width: `${Math.min((parseFloat(stats?.ram.used || "0") / parseFloat(stats?.ram.max || "1")) * 100, 100)}%`,
                transition: "width 1s ease",
                borderRadius: "2px",
              }}
            />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Uptime</div>
          <div className="stat-value">{stats?.uptime ?? "—"}</div>
        </div>
      </div>

      <div className="section-title">World</div>
      <div
        className="server-stats"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "12px",
          marginBottom: "24px",
        }}
      >
        <div className="stat-card">
          <div className="stat-label">World Time</div>
          {/* Hier steht jetzt groß "Day" oder "Night" */}
          <div className="stat-value">{stats?.isDay ? "Day" : "Night"}</div>
          {/* Hier steht jetzt klein die Uhrzeit, z.B. "03:13" */}
          <div className="stat-sub">{stats?.time ?? "—"}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Weather</div>
          <div className="stat-value" style={{ textTransform: "capitalize" }}>
            {stats?.weather ?? "—"}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Version</div>
          <div className="stat-value">{stats?.version ?? "—"}</div>
          <div className="stat-sub">Paper · Java 21</div>
        </div>
      </div>
    </>
  );
}
