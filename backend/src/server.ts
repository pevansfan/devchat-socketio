import { sequelize } from './config/db';
import { connectRedis } from './config/redis';
import { createServer } from "node:http";
import { createWebSocketServer } from "./socket/WebSocket";


import { app } from './app';

import './models/user.model';
import './models/room.model';

import { seedRooms } from './seed/room.seed';

const PORT = process.env.PORT || 3001;

async function startServer() {
  try {
    // MySQL
    await sequelize.authenticate();
    console.log('✅ Connexion à MySQL réussie');

    // Synchronisation des modèles
    await sequelize.sync();
    console.log('✅ Tables synchronisées');

    // Redis
    await connectRedis();
    console.log('✅ Connexion à Redis réussie');

    // Seed
    await seedRooms();
    console.log('✅ Rooms initialisées');

    // Serveur HTTP et Socket.IO
    const httpServer = createServer(app);
    createWebSocketServer(httpServer);

    httpServer.listen(PORT, () => {
      console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Erreur lors du démarrage du serveur :', error);
    process.exit(1);
  }
}

startServer();