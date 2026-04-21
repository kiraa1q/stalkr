import { Router } from 'express';
import { getServerStats } from '../services/mcservice.js';

const router = Router();

router.get('/server-info', async (req, res) => {
  try {
    const stats = await getServerStats();
    res.json(stats);
  } catch (error: any) {
    res.status(500).json({ error: "Stats konnten nicht geladen werden", details: error.message });
  }
});

export default router;