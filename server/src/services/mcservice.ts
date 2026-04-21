import { Rcon } from "rcon-client";

export const getMcData = async (command: string) => {
  const rcon = await Rcon.connect({
    host: process.env.MC_HOST || "localhost",
    port: parseInt(process.env.MC_RCON_PORT || "25575"),
    password: process.env.MC_RCON_PASSWORD || "pass",
  });

  const response = await rcon.send(command);
  await rcon.end();
  return response;
};

export const getOnlinePlayers = async () => {
  const rawStatus = await getMcData("list");
  // Logik: Alles nach dem Doppelpunkt nehmen und bei Kommas trennen
  const playerString = rawStatus.split(":")[1] || "";
  return playerString.split(",").map(name => name.trim()).filter(name => name !== "");
};


const serverStartTime = Date.now();

export const getServerStats = async () => {
  const rawTime = await getMcData("time query daytime");
  const rawWetter = await getMcData("weather query");
  const rawVersion = await getMcData("version");
  const rawTps = await getMcData("tps");

  // 1. Wetter-Parsing (Antwort ist oft: "Weather is: clear" oder "The weather has been set to...")
  const weatherString = rawWetter.toLowerCase();
  let weather = "Clear";
  if (weatherString.includes("rain")) weather = "Rain";
  if (weatherString.includes("thunder")) weather = "Thunder";

  // 2. Versions-Parsing
  // Die Antwort sieht oft so aus: "This server is running Paper version 1.21.4..."
  // Wir extrahieren nur die Versionsnummer
  const versionMatch = rawVersion.match(/\d+\.\d+(\.\d+)?/);
  const version = versionMatch ? versionMatch[0] : "Unknown";

  // 3. Uptime berechnen (Zeit seit Backend-Start)
  const uptimeSeconds = Math.floor((Date.now() - serverStartTime) / 1000);
  const uptime = formatUptime(uptimeSeconds);

  // 4. Zeit-Parsing
  const timeMatch = rawTime.match(/\d+/);
  const ticks = timeMatch ? parseInt(timeMatch[0]) : 0;

  return {
    time: {
      ticks,
      formatted: formatMcTime(ticks),
      isDay: ticks < 13000 || ticks > 23000
    },
    weather,
    version,
    uptime,
    tps: parseTps(rawTps)
  };
};

// Hilfsfunktion: Uptime formatieren (z.B. "2h 15m")
function formatUptime(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

// Hilfsfunktion: TPS sicher extrahieren
function parseTps(raw: string) {
  const match = raw.match(/\d+\.\d+/);
  return match ? parseFloat(match[0]) : 20.0;
}

// Hilfsfunktion: MC Ticks in Uhrzeit
function formatMcTime(ticks: number) {
  let hours = Math.floor((ticks / 1000 + 6) % 24);
  let minutes = Math.floor((ticks % 1000) * 0.06);
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}