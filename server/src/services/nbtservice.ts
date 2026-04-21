import nbt from 'prismarine-nbt';
import fs from 'fs';

export const getPlayerInventory = async (uuid: string) => {
  // Pfad anpassen (lokal auf dem Pi oder absoluter Pfad)
  const path = `/path/to/server/world/playerdata/${uuid}.dat`;
  
  if (!fs.existsSync(path)) {
    throw new Error(`Spieler-Datei für UUID ${uuid} nicht gefunden.`);
  }

  const fileData = fs.readFileSync(path);
  
  // 1. NBT-Daten parsen
  const result = await nbt.parse(fileData);
  
  // 2. nbt.simplify() braucht nur den 'parsed'-Teil des Ergebnisses.
  // Wir nutzen hier 'as any', um den strengen Typ-Check an dieser Stelle
  // zu umgehen, da die Library-Typen oft ungenau definiert sind.
  const simplified: any = nbt.simplify(result.parsed);
  
  // 3. 'Inventory' zurückgeben (das ist das Array mit den Items)
  return simplified.Inventory;
};