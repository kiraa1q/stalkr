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