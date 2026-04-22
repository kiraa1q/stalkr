import { Router } from 'express';
import { getMcData } from '../services/mcservice.js';
import { getUuidFromName } from '../services/uuidservice.js';
import { getPlayerInventory, getPlayerData } from '../services/nbtservice.js';

const router = Router();

router.get('/status', async (req, res) => {
  try {
    const status = await getMcData("list");
    res.json({ message: status });
  } catch (error: any) {
    // Das hier hilft uns beim Suchen:
    console.error("RCON Verbindungsfehler Details:", error.message);
    
    res.status(500).json({ 
      error: "MC Server nicht erreichbar", 
      details: error.message 
    });
  }
});

router.get('/:name/inventory', async (req, res) => {
  try {
    const playerName = req.params.name;
    const uuid = await getUuidFromName(playerName);
    const structuredInventory = await getPlayerInventory(uuid);
    res.json(structuredInventory);
  } catch (error: any) {
    // SEHR WICHTIG: Das zeigt dir in deinem Terminal genau, WAS schiefgeht
    console.error("Inventar-Fehler:", error); 
    res.status(500).json({ 
      error: "Inventar konnte nicht geladen werden", 
      details: error.message 
    });
  }
});

router.get('/:name/data', async (req, res) => {
  try {
    const playerName = req.params.name;
    const uuid = await getUuidFromName(playerName);
    const playerData = await getPlayerData(uuid);
    
    // Wir fügen den Namen noch hinzu
    res.json({ name: playerName, ...playerData });
  } catch (error: any) {
    res.status(500).json({ error: "Datenfehler", details: error.message });
  }
});

export default router;