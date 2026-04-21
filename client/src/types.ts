// src/types.ts

export interface ServerStats {
  online: boolean
  tps: number
  ram: { used: number; max: number }
  uptime: string
  time: string
  tick: number
  weather: string
  version: string
  players: {
    online: number
    max: number
    names: string[]
  }
}

export interface ArmorSlot {
  slot: 'helmet' | 'chestplate' | 'leggings' | 'boots'
  material: 'netherite' | 'diamond' | 'iron' | 'gold' | 'leather' | 'none'
  name: string
}

export interface Player {
  name: string
  uuid: string
  online: boolean
  gamemode: string
  health: number
  hunger: number
  xp: number
  kills: number
  deaths: number
  distanceTraveled: number
  playtime: string
  armor: ArmorSlot[]
  inventory: { name: string; count: number }[]
  position: { x: number; y: number; z: number; dimension: string }
  lastSeen?: string
}