import { useState, useEffect, useRef } from "react";

export default function LiveConsole() {
  const [logs, setLogs] = useState<string[]>([]);
  const [command, setCommand] = useState<string>("");
  const [sending, setSending] = useState<boolean>(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("stalkr_token");

  // 1. Funktion zum Laden der Logs
  const fetchLogs = async () => {
    try {
      const res = await fetch(`${API_URL}/server/logs`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (res.ok && data.logs) {
        // Falls data.logs ein Array ist, aber nur ein langes Element hat:
        if (Array.isArray(data.logs) && data.logs.length === 1) {
          const splitLogs = data.logs[0].split(/\r?\n|\r/);
          setLogs(splitLogs);
        } else {
          setLogs(data.logs);
        }
      }
    } catch (err) {
      console.error("Fetch error");
    }
  };

  // 2. Automatisches Update alle 3 Sekunden
  useEffect(() => {
    fetchLogs(); // Erster Aufruf
    const interval = setInterval(fetchLogs, 3000);
    return () => clearInterval(interval); // Aufräumen beim Schließen
  }, []);

  // 3. Automatisches Scrollen nach unten bei neuen Logs
  useEffect(() => {
    if (scrollRef.current) {
      // Scrollt den Container ganz nach unten
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  // 4. Befehl absenden
  const handleSendCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim() || sending) return;

    setSending(true);
    try {
      const res = await fetch(`${API_URL}/server/command`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ command }),
      });

      if (res.ok) {
        setCommand(""); // Input leeren
        fetchLogs(); // Sofort Logs neu laden, um Bestätigung zu sehen
      }
    } catch (err) {
      console.error("Failed to send command");
    } finally {
      setSending(false);
    }
  };

  return (
    <div
      style={{
        background: "rgba(0,0,0,0.35)",
        border: "1px solid var(--border)",
        borderRadius: "12px",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
      }}
    >
      {/* Log-Fenster */}
      <div
        ref={scrollRef}
        style={{
          height: "300px", // Etwas höher für bessere Übersicht
          overflowY: "auto",
          fontFamily: "Geist Mono, monospace",
          fontSize: "11px",
          display: "block", // WICHTIG: block statt flex, falls es Probleme gab
          textAlign: "left",
        }}
      >
        {logs.map((line, index) => (
          <div
            key={index}
            style={{
              padding: "2px 0",
              borderBottom: "1px solid rgba(255,255,255,0.02)", // Hauchdünne Trennlinie
              color: line.includes("WARN")
                ? "#fbbf24"
                : line.includes("ERROR")
                  ? "#f87171"
                  : "#9ca3af",
              wordBreak: "break-word",
              lineHeight: "1.4",
            }}
          >
            <span
              style={{ color: "rgba(255,255,255,0.2)", marginRight: "8px" }}
            >
              {index + 1}
            </span>
            {line}
          </div>
        ))}
      </div>
      {/* Input-Bereich */}
      <form
        onSubmit={handleSendCommand}
        style={{
          display: "flex",
          gap: "8px",
          borderTop: "1px solid var(--border)",
          paddingTop: "12px",
        }}
      >
        <span
          style={{
            color: "var(--text-muted)",
            fontFamily: "Geist Mono",
            fontSize: "12px",
          }}
        >
          $
        </span>
        <input
          type="text"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          placeholder="Type a command (e.g. op Player)..."
          disabled={sending}
          style={{
            flex: 1,
            background: "none",
            border: "none",
            outline: "none",
            color: "var(--text)",
            fontFamily: "Geist Mono",
            fontSize: "12px",
          }}
        />
      </form>
    </div>
  );
}
