// src/api.ts
import type { ServerStats, Player } from './types'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

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
      ram: { used: "0", max: "0" },
      uptime: worldData.uptime,
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
      time: "--:--",
      tick: 0,
      weather: "Unknown",
      version: "---"
    } as ServerStats;
  }
};
const MOCK_PLAYERS: Player[] = [
  {
    name: 'STONER_COOKIE',
    uuid: 'a8f03-001',
    online: true,
    gamemode: 'SURVIVAL',
    health: 18,
    hunger: 15,
    xp: 23,
    kills: 142,
    deaths: 7,
    distanceTraveled: 142,
    playtime: '48h',
    armor: [
      { slot: 'helmet',     material: 'netherite', name: 'Netherite Helmet' },
      { slot: 'chestplate', material: 'netherite', name: 'Netherite Chestplate' },
      { slot: 'leggings',   material: 'netherite', name: 'Netherite Leggings' },
      { slot: 'boots',      material: 'netherite', name: 'Netherite Boots' },
    ],
    inventory: [
      { name: 'Diamond Sword', count: 1 },
      { name: 'Iron Axe',      count: 1 },
      { name: 'Stone',         count: 64 },
      { name: 'Apple',         count: 12 },
      { name: 'Cobblestone',   count: 42 },
    ],
    position: { x: 120, y: 64, z: -340, dimension: 'Overworld' },
  },
  {
    name: 'kira1q',
    uuid: 'b3d21-002',
    online: true,
    gamemode: 'SURVIVAL',
    health: 20,
    hunger: 20,
    xp: 41,
    kills: 89,
    deaths: 2,
    distanceTraveled: 389,
    playtime: '72h',
    armor: [
      { slot: 'helmet',     material: 'netherite', name: 'Netherite Helmet' },
      { slot: 'chestplate', material: 'netherite', name: 'Netherite Chestplate' },
      { slot: 'leggings',   material: 'netherite', name: 'Netherite Leggings' },
      { slot: 'boots',      material: 'netherite', name: 'Netherite Boots' },
    ],
    inventory: [
      { name: 'Bow',           count: 1 },
      { name: 'Enchanted Pick', count: 1 },
      { name: 'Blaze Rod',     count: 8 },
      { name: 'Gold Ingot',    count: 32 },
    ],
    position: { x: -88, y: 78, z: 441, dimension: 'Nether' },
  },
  {
    name: 'klammern',
    uuid: 'c9f44-003',
    online: false,
    gamemode: 'CREATIVE',
    health: 12,
    hunger: 8,
    xp: 0,
    kills: 0,
    deaths: 0,
    distanceTraveled: 12,
    playtime: '3h',
    armor: [
      { slot: 'helmet',     material: 'none', name: 'No Helmet' },
      { slot: 'chestplate', material: 'none', name: 'No Chestplate' },
      { slot: 'leggings',   material: 'none', name: 'No Leggings' },
      { slot: 'boots',      material: 'none', name: 'No Boots' },
    ],
    inventory: [
      { name: 'Dirt', count: 64 },
      { name: 'Wood', count: 20 },
    ],
    position: { x: 0, y: 64, z: 0, dimension: 'Overworld' },
    lastSeen: '2h ago',
  },
  {
    name: 'JohnPorkJ',
    uuid: 'd2e55-004',
    online: true,
    gamemode: 'SURVIVAL',
    health: 14,
    hunger: 18,
    xp: 17,
    kills: 54,
    deaths: 11,
    distanceTraveled: 67,
    playtime: '21h',
    armor: [
      { slot: 'helmet',     material: 'netherite', name: 'Netherite Helmet' },
      { slot: 'chestplate', material: 'netherite', name: 'Netherite Chestplate' },
      { slot: 'leggings',   material: 'netherite', name: 'Netherite Leggings' },
      { slot: 'boots',      material: 'netherite', name: 'Netherite Boots' },
    ],
    inventory: [
      { name: 'Netherite Sword', count: 1 },
      { name: 'Golden Apple',    count: 4 },
      { name: 'Obsidian',        count: 32 },
      { name: 'Ender Pearl',     count: 16 },
      { name: 'Totem',           count: 2 },
    ],
    position: { x: 884, y: 71, z: -122, dimension: 'Overworld' },
  },
]

// ── API Calls ─────────────────────────────────────────────



export const fetchPlayers = async (): Promise<Player[]> => {
  // TODO: echte API
  // const res = await fetch(`${BASE_URL}/api/players`)
  // return res.json()
  return MOCK_PLAYERS
}