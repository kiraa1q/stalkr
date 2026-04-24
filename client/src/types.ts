// src/types.ts

export interface ServerStats {
  online: boolean;
  players: {
    online: number;
    max: number;
    names: string[];
  };
  tps: number;
  uptime: string;
  version: string;
  weather: string;
  isDay: boolean; // Optional, wird in der API berechnet 
  time: string;
  tick: number;
  ram: {
    used: string;
    max: string;
  };
}

export interface ArmorSlot {
  slot: 'helmet' | 'chestplate' | 'leggings' | 'boots'
  // Wir ändern material auf string, da Minecraft-IDs wie "minecraft:netherite_helmet" kommen
  material: string 
  name: string
}

// Neu: Ein Interface für die Offhand (oder allgemeine Items)
export interface InventoryItem {
  material: string
  count: number
  name?: string
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
  distanceTraveled: string | number // String, falls du .toFixed(1) nutzt
  playtime: string
  armor: ArmorSlot[]
  
  // HIER DIE ERGÄNZUNG:
  offhand: InventoryItem 
  
  inventory: { name: string; count: number }[]
  position: { x: number; y: number; z: number; dimension: string }
  lastSeen?: string
}