// src/api.ts
import type { ServerStats, Player } from './types'

// const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

// ── Mockdata ──────────────────────────────────────────────

const MOCK_STATS: ServerStats = {
  online: true,
  tps: 19.8,
  ram: { used: 2.1, max: 4 },
  uptime: '14h 32m',
  time: 'Night',
  tick: 13420,
  weather: 'Rain',
  version: '1.21.4',
  players: {
    online: 3,
    max: 20,
    names: ['STONER_COOKIE', 'kira1q', 'JohnPorkJ'],
  },
}

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

export const fetchServerStats = async (): Promise<ServerStats> => {
  // TODO: echte API
  // const res = await fetch(`${BASE_URL}/api/server/stats`)
  // return res.json()
  return MOCK_STATS
}

export const fetchPlayers = async (): Promise<Player[]> => {
  // TODO: echte API
  // const res = await fetch(`${BASE_URL}/api/players`)
  // return res.json()
  return MOCK_PLAYERS
}