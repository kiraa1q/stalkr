import fs from 'fs';
import path from 'path';

export const getUuidFromName = async (name: string): Promise<string> => {
  // Pfad zur usercache.json (aus .env oder relativ)
  const cachePath = process.env.MC_USERCACHE_PATH || '../minecraft/usercache.json';
  
  if (!fs.existsSync(cachePath)) {
    throw new Error("usercache.json nicht gefunden");
  }

  const data = JSON.parse(fs.readFileSync(cachePath, 'utf-8'));
  
  // Suche den Spieler im Cache
  const player = data.find((p: any) => p.name.toLowerCase() === name.toLowerCase());
  
  if (!player) {
    throw new Error(`Spieler ${name} nicht im Cache gefunden`);
  }

  return player.uuid;
};