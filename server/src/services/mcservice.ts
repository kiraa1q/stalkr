import { Rcon } from "rcon-client";
import dotenv from "dotenv";
import { getWorldWeather } from './nbtservice.js';

dotenv.config();

const serverStartTime = Date.now();

// --- HILFSFUNKTIONEN (Zuerst deklarieren, damit TS sie kennt) ---

const formatUptime = (seconds: number): string => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
};

const parseTps = (raw: string): number => {
    const match = raw.match(/\d+\.\d+/);
    return match ? parseFloat(match[0]) : 20.0;
};

const formatMcTime = (ticks: number): string => {
    // Modulo sorgt dafür, dass wir immer im 24h Bereich bleiben
    const hours = Math.floor((ticks / 1000 + 6) % 24);
    const minutes = Math.floor((ticks % 1000) * 0.06);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

// --- RCON BASIS FUNKTION ---

export const getMcData = async (command: string): Promise<string> => {
    try {
        const rcon = await Rcon.connect({
            host: process.env.MC_HOST || "localhost",
            port: parseInt(process.env.MC_PORT || "25575"),
            password: process.env.MC_RCON_PASSWORD || "password",
        });
        const response = await rcon.send(command);
        rcon.end();
        return response;
    } catch (error) {
        console.error("RCON Error:", error);
        return "error";
    }
};

// --- HAUPTFUNKTION ---

export const getServerStats = async () => {
    // 1. Live-Daten über RCON abfragen
    const rawTime = await getMcData("time query daytime");
    const rawVersion = await getMcData("version");
    const rawTps = await getMcData("tps");

    // 2. Wetter über NBT (nbtservice)
    const worldInfo = await getWorldWeather();

    // 3. Zeit-Parsing (Live & Robust)
    const timeMatch = rawTime.match(/\d+/);
    let liveTicks = timeMatch ? parseInt(timeMatch[0]) : 0;
    liveTicks = liveTicks % 24000; // Normalisieren auf einen Tag

    // 4. Version extrahieren
    const versionMatch = rawVersion.match(/\d+\.\d+(\.\d+)?/);
    const version = versionMatch ? versionMatch[0] : "Unknown";

    // 5. Uptime berechnen
    const uptimeSeconds = Math.floor((Date.now() - serverStartTime) / 1000);

    return {
        time: {
            ticks: liveTicks,
            formatted: formatMcTime(liveTicks),
            isDay: liveTicks < 13000 || liveTicks > 23000
        },
        weather: worldInfo.weather,
        version: version,
        uptime: formatUptime(uptimeSeconds),
        tps: parseTps(rawTps)
    };
};

// Diese Funktion schickt einen Befehl an den Minecraft Server
export const sendConsoleCommand = async (command: string) => {
    // Falls der User den "/" mitschickt (z.B. /op), entfernen wir ihn, 
    // da RCON Befehle ohne Schrägstrich erwartet.
    const cleanCommand = command.startsWith('/') ? command.substring(1) : command;
    
    const response = await getMcData(cleanCommand);
    return response; // Das ist die Rückmeldung vom Server (z.B. "Made Stoner_Cookie a server operator")
};