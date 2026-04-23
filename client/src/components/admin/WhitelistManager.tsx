import { useState, useEffect } from "react";

interface Player {
  name: string;
  isOp: boolean;
  isBanned: boolean;
}

export default function WhitelistManager() {
  const [whitelist, setWhitelist] = useState<Player[]>([]);
  const [newPlayer, setNewPlayer] = useState("");
  const [loading, setLoading] = useState<string | null>(null);

  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("stalkr_token");

  const fetchWhitelist = async () => {
    try {
      const res = await fetch(`${API_URL}/server/whitelist`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      // Wir erwarten hier das Array von Objekten aus dem Backend
      setWhitelist(data.list || []);
    } catch (error) {
      console.error("Fehler beim Laden der Whitelist:", error);
    }
  };

  useEffect(() => {
    fetchWhitelist();
  }, []);

  const handleAction = async (playerName: string, action: string) => {
    if (!playerName) return;
    setLoading(`${playerName}-${action}`);
    try {
      const res = await fetch(`${API_URL}/server/action`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action, playerName }),
      });

      if (res.ok) {
        fetchWhitelist();
      } else {
        console.error("Aktion vom Server abgelehnt");
      }
    } catch (error) {
      console.error("Netzwerkfehler:", error);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div
      style={{
        background: "rgba(0,0,0,0.2)",
        borderRadius: "12px",
        border: "1px solid var(--border)",
        padding: "20px",
      }}
    >
      <div
        className="wordmark"
        style={{ fontSize: "14px", marginBottom: "16px" }}
      >
        Whitelist Management
      </div>

      {/* Add Player Input */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="New Player Name..."
          value={newPlayer}
          onChange={(e) => setNewPlayer(e.target.value)}
          style={{
            flex: 1,
            background: "var(--slot-bg)",
            border: "1px solid var(--border)",
            borderRadius: "6px",
            padding: "8px 12px",
            color: "white",
            fontFamily: "Geist Mono",
            outline: "none",
          }}
        />
        <button
          className="refresh-btn"
          disabled={loading !== null}
          onClick={() => {
            handleAction(newPlayer, "whitelist add");
            setNewPlayer("");
          }}
        >
          {loading?.includes("whitelist add") ? "..." : "+ Add"}
        </button>
      </div>

      {/* Player List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {whitelist.map((player, index) => (
          <div
            key={`${player.name}-${index}`} // Kombiniert Name und Index für absolute Eindeutigkeit
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "10px",
              background: "rgba(255,255,255,0.03)",
              borderRadius: "8px",
              border: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            {/* Avatar & Name */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <img
                src={`https://mc-heads.net/avatar/${player.name}/32`}
                alt={player.name}
                style={{ width: "32px", height: "32px", borderRadius: "4px" }}
              />
              <span style={{ fontFamily: "Geist Mono", fontSize: "13px" }}>
                {player.name || "Unbekannt"}
              </span>
            </div>

            {/* Action Buttons */}
            <div style={{ display: "flex", gap: "6px" }}>
                {/* REMOVE Button */}
              <button
                onClick={() => handleAction(player.name, "whitelist remove")}
                disabled={loading !== null}
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid var(--border)",
                  color: "var(--text-muted)",
                  borderRadius: "4px",
                  padding: "4px 8px",
                  fontSize: "10px",
                  cursor: "pointer",
                }}
              >
                REMOVE
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
