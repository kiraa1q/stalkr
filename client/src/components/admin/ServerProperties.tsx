import { useState, useEffect } from "react";

const IMPORTANT_KEYS = [
  { key: "motd", label: "Server Name (MOTD)", type: "text" },
  { key: "max-players", label: "Max Players", type: "number" },
  {
    key: "difficulty",
    label: "Difficulty",
    type: "select",
    options: ["peaceful", "easy", "normal", "hard"],
  },
  { key: "white-list", label: "Whitelist", type: "boolean" },
  { key: "view-distance", label: "View Distance", type: "number" },
  { key: "online-mode", label: "Online Mode (Premium)", type: "boolean" },
];

export default function ConfigEditor() {
  const [props, setProps] = useState<any>({});
  const [isSaving, setIsSaving] = useState<string | null>(null);
  const [needsRestart, setNeedsRestart] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("stalkr_token");

  useEffect(() => {
    fetch(`${API_URL}/server/properties`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setProps(data));
  }, []);

  // Erlaubt das Tippen im Feld
  const handleLocalChange = (key: string, value: string) => {
    setProps({ ...props, [key]: value });
  };

  const saveProp = async (key: string, value: any) => {
    setIsSaving(key);
    const finalValue =
      typeof value === "boolean" ? String(value) : String(value);

    try {
      const res = await fetch(`${API_URL}/server/properties`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ [key]: finalValue }),
      });
      if (res.ok) {
        setProps({ ...props, [key]: finalValue });
        setNeedsRestart(true); // <--- Hinweis aktivieren
      }
    } finally {
      setTimeout(() => setIsSaving(null), 500); // Kurzes Feedback-Delay
    }
  };
  
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        width: "100%",
      }}
    >
      {/* 1. NEUSTART BANNER (Erscheint nur wenn needsRestart true ist) */}
      {needsRestart && (
        <div
          style={{
            background: "rgba(255, 165, 0, 0.1)",
            border: "1px solid var(--yellow)",
            borderRadius: "12px",
            padding: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            animation: "pulse-bg 2s infinite ease-in-out",
            backdropFilter: "blur(10px)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "20px" }}>⚠️</span>
            <div>
              <div
                style={{
                  color: "var(--yellow)",
                  fontWeight: "bold",
                  fontSize: "13px",
                  fontFamily: "Geist Mono",
                }}
              >
                RESTART REQUIRED
              </div>
              <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "11px" }}>
                Properties saved. Restart server to apply changes.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. DEINE BESTEHENDE CONFIG BOX */}
      <div
        style={{
          background: "rgba(255,255,255,0.02)",
          padding: "24px",
          borderRadius: "16px",
          border: "1px solid var(--border)",
          backdropFilter: "blur(10px)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <div className="wordmark" style={{ fontSize: "14px" }}>
            Server Configuration
          </div>

          {/* Kleiner Status-Punkt, der gelb leuchtet wenn nicht gespeichert */}
          <div
            style={{
              fontSize: "10px",
              color: needsRestart ? "var(--yellow)" : "var(--text-muted)",
              textTransform: "uppercase",
              letterSpacing: "1px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <div
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: needsRestart ? "var(--yellow)" : "var(--green)",
                boxShadow: needsRestart ? "0 0 8px var(--yellow)" : "none",
              }}
            />
            {needsRestart ? "Pending Restart" : "Synced"}
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px",
          }}
        >
          {IMPORTANT_KEYS.map((item) => (
            <div
              key={item.key}
              style={{
                background: "rgba(0,0,0,0.2)",
                padding: "12px 16px",
                borderRadius: "10px",
                border: "1px solid rgba(255,255,255,0.05)",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <label
                  style={{
                    fontSize: "11px",
                    color: "var(--text-muted)",
                    fontWeight: 600,
                  }}
                >
                  {item.label}
                </label>
                {isSaving === item.key && (
                  <span style={{ fontSize: "10px", color: "var(--green)" }}>
                    Saving...
                  </span>
                )}
              </div>

              {/* ... restliches Item-Handling (Input/Boolean/Select) bleibt gleich ... */}
              {item.type === "text" || item.type === "number" ? (
                <input
                  type={item.type}
                  value={props[item.key] || ""}
                  onChange={(e) => handleLocalChange(item.key, e.target.value)}
                  onBlur={(e) => saveProp(item.key, e.target.value)}
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid var(--border)",
                    color: "white",
                    padding: "8px",
                    borderRadius: "6px",
                    fontFamily: "Geist Mono",
                    fontSize: "13px",
                    outline: "none",
                  }}
                />
              ) : item.type === "boolean" ? (
                <div
                  onClick={() => saveProp(item.key, props[item.key] !== "true")}
                  style={{
                    width: "100%",
                    padding: "8px",
                    textAlign: "center",
                    borderRadius: "6px",
                    fontSize: "12px",
                    fontWeight: "bold",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    background:
                      props[item.key] === "true"
                        ? "rgba(46, 204, 113, 0.1)"
                        : "rgba(231, 76, 60, 0.1)",
                    border: `1px solid ${props[item.key] === "true" ? "var(--green)" : "var(--red)"}`,
                    color:
                      props[item.key] === "true"
                        ? "var(--green)"
                        : "var(--red)",
                  }}
                >
                  {props[item.key] === "true" ? "ENABLED" : "DISABLED"}
                </div>
              ) : (
                <select
                  value={props[item.key]}
                  onChange={(e) => saveProp(item.key, e.target.value)}
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    color: "white",
                    padding: "8px",
                    borderRadius: "6px",
                    border: "1px solid var(--border)",
                    outline: "none",
                  }}
                >
                  {item.options?.map((opt) => (
                    <option
                      key={opt}
                      value={opt}
                      style={{ background: "#111" }}
                    >
                      {opt}
                    </option>
                  ))}
                </select>
              )}
            </div>
          ))}
        </div>
      </div>

      <style>{`
      @keyframes pulse-bg {
        0% { background: rgba(255, 165, 0, 0.1); border-color: rgba(255, 165, 0, 0.3); }
        50% { background: rgba(255, 165, 0, 0.15); border-color: rgba(255, 165, 0, 0.6); }
        100% { background: rgba(255, 165, 0, 0.1); border-color: rgba(255, 165, 0, 0.3); }
      }
    `}</style>
    </div>
  );
}
