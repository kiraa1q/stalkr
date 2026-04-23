// src/api.ts
import type { ServerStats, Player } from './types'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';


// ── API Calls ─────────────────────────────────────────────
export const fetchServerStats = async (): Promise<ServerStats | null> => {
  try {
    const playerRes = await fetch(`${API_BASE}/players/status`);
    // Wenn die API gar nicht antwortet (404/500), ist der Server offline
    if (!playerRes.ok) throw new Error("Offline");

    const playerData = await playerRes.json();
    const worldRes = await fetch(`${API_BASE}/server/server-info`);
    const worldData = await worldRes.json();

    const playerMsg = playerData.message;
    const onlineCount = parseInt(playerMsg.match(/are (\d+)/)?.[1] || "0");
    const maxCount = parseInt(playerMsg.match(/max of (\d+)/)?.[1] || "20");
    const namesPart = playerMsg.split(': ')[1] || "";

    return {
      online: true, // Erreichbar!
      players: {
        online: onlineCount,
        max: maxCount,
        names: namesPart ? namesPart.split(', ') : []
      },
      tps: worldData.tps,
      ram: { 
        used: worldData.ram?.used ?? "0", 
        max: worldData.ram?.max ?? "0"
      },
      uptime: worldData.uptime,
      isDay: worldData.time.isDay,
      time: worldData.time.formatted,
      tick: worldData.time.ticks,
      weather: worldData.weather,
      version: worldData.version
    };
  } catch (error) {
    console.warn("Server ist offline oder API nicht erreichbar");
    // Wir geben ein Teil-Objekt zurück, das "online: false" signalisiert
    return {
      online: false,
      players: { online: 0, max: 20, names: [] },
      tps: 0,
      ram: { used: "0", max: "0" },
      uptime: "0m",
      isDay: true,
      time: "--:--",
      tick: 0,
      weather: "Unknown",
      version: "---"
    } as ServerStats;
  }
};



export const fetchPlayers = async (): Promise<Player[]> => {
  try {
    // 1. Liste der Online-Spieler holen (den String parsen wir wieder)
    const res = await fetch(`${API_BASE}/players/status`);
    const data = await res.json();
    
    const namesPart = data.message.split(': ')[1] || "";
    const onlineNames = namesPart ? namesPart.split(', ') : [];

    // 2. Für jeden Namen die Detail-Daten laden
    const playerDetails = await Promise.all(
      onlineNames.map(async (name: string) => {
        try {
          const detailRes = await fetch(`${API_BASE}/players/${name}/data`);
          const d = await detailRes.json();

          // Hier mappen wir das Backend-Format auf dein Player-Interface
          return {
            name: d.name,
            online: true,
            health: d.health,
            hunger: d.food, // Mapping von food auf hunger
            xp: d.xpLevel,
            gamemode: d.gamemode === 1 ? 'CREATIVE' : 'SURVIVAL',
            playtime: '—', // Falls nicht im Backend, lassen wir es leer
            kills: d.stats.kills,
            deaths: d.stats.deaths,
            distanceTraveled: (d.stats.distance / 1000).toFixed(1),
            position: {
              x: Math.floor(d.position.x),
              y: Math.floor(d.position.y),
              z: Math.floor(d.position.z),
              dimension: d.dimension.replace('minecraft:', '').toUpperCase()
            },
            armor: [
              { slot: 'helmet', material: d.inventory.armor.helmet?.id || 'none', name: 'Helmet' },
              { slot: 'chestplate', material: d.inventory.armor.chestplate?.id || 'none', name: 'Chest' },
              { slot: 'leggings', material: d.inventory.armor.leggings?.id || 'none', name: 'Leggings' },
              { slot: 'boots', material: d.inventory.armor.boots?.id || 'none', name: 'Boots' },
            ],
            inventory: d.inventory.items.map((item: any) => ({
              name: item.id.replace('minecraft:', '').replace('_', ' '),
              count: item.count
            })),
            lastSeen: 'Now'
          };
        } catch (e) {
          console.error(`Fehler bei Player ${name}`, e);
          return null;
        }
      })
    );

    return playerDetails.filter(p => p !== null) as Player[];
  } catch (err) {
    return [];
  }
};