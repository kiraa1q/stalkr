import nbt from 'prismarine-nbt';
import fs from 'fs';
import dotenv from 'dotenv';

export const getPlayerInventory = async (uuid: string) => {
  const path = process.env.MC_WORLD_PATH + `/playerdata/${uuid}.dat`;
  
  if (!fs.existsSync(path)) throw new Error("Playerdata nicht gefunden");

  const fileData = fs.readFileSync(path);
  const result = await nbt.parse(fileData);
  const simplified: any = nbt.simplify(result.parsed);
  
  const rawInventory = simplified.Inventory as any[] || [];
  const eq = simplified.equipment || {};

  // Wir bauen das strukturierte Objekt für das Frontend
  const structuredInventory = {
    armor: {
      helmet: eq.head || null,
      chestplate: eq.chest || null,
      leggings: eq.legs || null,
      boots: eq.feet || null,
    },
    offhand: eq.offhand || null,
    // Nur das normale Inventar (Slots 0-35)
    items: rawInventory.filter(i => {
      const s = Number(i.Slot);
      return s >= 0 && s <= 35;
    })
  };

  return structuredInventory;
};

export const getWorldWeather = async () => {
  // Der Pfad zur level.dat (liegt direkt im Welt-Ordner)
  const path = process.env.MC_WORLD_PATH + `/level.dat`;
  
  if (!fs.existsSync(path)) throw new Error("level.dat nicht gefunden");

  const fileData = fs.readFileSync(path);
  const result = await nbt.parse(fileData);
  const simplified: any = nbt.simplify(result.parsed);

  // In der level.dat liegen die Daten unter 'Data'
  const worldData = simplified.Data;

  let weather = "Clear";
  
  // Minecraft speichert Wetter als 1 (wahr) oder 0 (falsch)
  if (worldData.thundering === 1 || worldData.thundering === true) {
    weather = "Thunder";
  } else if (worldData.raining === 1 || worldData.raining === true) {
    weather = "Rain";
  }

  return {
    weather
  };

};

export const getPlayerData = async (uuid: string) => {
  const path = process.env.MC_WORLD_PATH + `/playerdata/${uuid}.dat`;
  if (!fs.existsSync(path)) throw new Error("Playerdata nicht gefunden");

  const fileData = fs.readFileSync(path);
  const result = await nbt.parse(fileData);
  const simplified: any = nbt.simplify(result.parsed);

  // Koordinaten sind ein Array [x, y, z]
  const pos = simplified.Pos || [0, 0, 0];

  return {
    health: Math.round(simplified.Health || 0),
    food: simplified.foodLevel || 0,
    xpLevel: simplified.XpLevel || 0,
    gamemode: simplified.playerGameType || 0, // 0=Survival, 1=Creative, etc.
    dimension: simplified.Dimension || "minecraft:overworld",
    position: {
      x: Math.round(pos[0]),
      y: Math.round(pos[1]),
      z: Math.round(pos[2])
    },
    inventory: {
        armor: {
          helmet: simplified.equipment?.head || null,
          chestplate: simplified.equipment?.chest || null,
          leggings: simplified.equipment?.legs || null,
          boots: simplified.equipment?.feet || null,
        },
        offhand: simplified.equipment?.offhand || null,
        items: (simplified.Inventory as any[] || []).filter(i => Number(i.Slot) >= 0 && Number(i.Slot) <= 35)
    }
  };
};
export const getPlayerStats = (uuid: string) => {
  const statsPath = process.env.MC_WORLD_PATH + `/stats/${uuid}.json`;
  if (!fs.existsSync(statsPath)) return { kills: 0, deaths: 0, distance: 0 };

  const statsData = JSON.parse(fs.readFileSync(statsPath, 'utf-8'));
  const s = statsData.stats || {};

  // Die Keys in Minecraft Stats sind etwas kryptisch:
  const custom = s["minecraft:custom"] || {};
  
  return {
    kills: custom["minecraft:player_kills"] || 0,
    deaths: custom["minecraft:deaths"] || 0,
    // Zentimeter in Kilometer umrechnen (/ 100 / 1000)
    distance: Math.round((custom["minecraft:walk_one_cm"] || 0) / 100000) 
  };
};