import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import playerRoutes from './routes/playerroutes.js';
import serverRoutes from './routes/serverroutes.js';   

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routen einbinden
app.use('/api/players', playerRoutes);
app.use('/api/server', serverRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Stalkr-Backend läuft auf Port ${PORT}`);
});