import { Router } from "express";
import { getServerStats, sendConsoleCommand } from "../services/mcservice.js";
import { controlServer, getServerLogs, getContainerStats } from "../services/dockerservice.js";
import {
  playerAction,
  getWhitelistWithStatus,
} from "../services/playerservice.js";
import { authenticateToken } from "../services/authservice.js";

const router = Router();

/**
 * ÖFFENTLICHE ROUTE
 * Jeder darf die Grund-Stats sehen (für das Home-Dashboard)
 */
router.get("/server-info", async (req, res) => {
  try {
    // Wir führen beide Abfragen parallel aus, um Zeit zu sparen
    const [mcStats, ramStats] = await Promise.all([
      getServerStats(), // Holt TPS, Time, Weather, Uptime, Version
      getContainerStats(), // Holt den RAM vom Docker-Container
    ]);

    // Wir kombinieren beides in ein Objekt, das exakt zu deinem Frontend-Interface passt
    res.json({
      ...mcStats, // Kopiert alle Felder aus getServerStats (tps, uptime, etc.)
      ram: ramStats, // Fügt das ram-Objekt { used, max } hinzu
    });
  } catch (error: any) {
    console.error("Fehler beim Zusammenstellen der Server-Info:", error);
    res.status(500).json({
      error: "Stats konnten nicht geladen werden",
      details: error.message,
    });
  }
});

/**
 * GESCHÜTZTE ROUTEN (Nur mit Admin-Token)
 */

// Server-Steuerung (Start/Stop/Restart)
router.post("/control", authenticateToken, async (req, res) => {
  // <-- Middleware hinzugefügt
  const { action } = req.body;
  try {
    const message = await controlServer(action);
    res.json({ success: true, message });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Konsole auslesen
router.get("/logs", authenticateToken, async (req, res) => {
  // <-- Middleware hinzugefügt
  try {
    const logs = await getServerLogs();
    res.json({ logs });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Whitelist anzeigen
router.get("/whitelist", authenticateToken, async (req, res) => {
  try {
    const list = await getWhitelistWithStatus();
    console.log("Sende an Frontend:", list); // Schau hier in dein Terminal!
    res.json({ list }); // Das Frontend erwartet data.list
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Spieler-Aktionen (Add, Remove, Ban, Op etc.)
router.post("/action", authenticateToken, async (req, res) => {
  const { action, playerName } = req.body;

  if (!action || !playerName) {
    return res.status(400).json({ error: "Missing action or playerName" });
  }

  try {
    const result = await playerAction(action, playerName);
    res.json({ success: true, message: result });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/command", authenticateToken, async (req, res) => {
  const { command } = req.body;

  if (!command) {
    return res.status(400).json({ error: "Kein Befehl angegeben" });
  }

  try {
    const output = await sendConsoleCommand(command);
    res.json({ success: true, output });
  } catch (error: any) {
    res
      .status(500)
      .json({ error: "Befehl fehlgeschlagen", details: error.message });
  }
});

export default router;
