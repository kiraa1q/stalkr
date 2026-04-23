import { Router } from 'express';
import { login } from '../services/authservice.js';

const router = Router();

router.post('/login', (req, res) => {
    const { password } = req.body;
    try {
        const token = login(password);
        res.json({ token });
    } catch (error: any) {
        res.status(401).json({ error: error.message });
    }
});

export default router;