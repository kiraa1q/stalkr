import { Router } from 'express';
import { getMcData } from '../services/mcservice.js';

const router = Router();

router.get('/status', async (req, res) => {
  try {
    const status = await getMcData("list");
    res.json({ message: status });
  } catch (error) {
    res.status(500).json({ error: "MC Server nicht erreichbar" });
  }
});

export default router;