import { Router } from 'express';
import { getServerStats } from '../services/mcservice.js';
import { controlServer, getServerLogs } from '../services/dockerservice.js';

const router = Router();

router.get('/server-info', async (req, res) => {
  try {
    const stats = await getServerStats();
    res.json(stats);
  } catch (error: any) {
    res.status(500).json({ error: "Stats konnten nicht geladen werden", details: error.message });
  }
});

router.post('/control', async (req, res) => {
    const { action } = req.body; // 'start', 'stop' oder 'restart'
    try {
        const message = await controlServer(action);
        res.json({ success: true, message });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.get('/logs', async (req, res) => {
    try {
        const logs = await getServerLogs();
        res.json({ logs });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

export default router;