import { sequelize } from './config/db';
import { connectRedis } from './config/redis';
import './models/user.model';
import './models/room.model';

import { seedRooms } from './seed/room.seed';

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Connexion à MySQL réussie');

    await sequelize.sync();
    console.log('✅ Tables synchronisées');

    await connectRedis();
    console.log('🚀 Serveur démarré');
    
    await seedRooms();
    
  } catch (error) {
    console.error('Erreur de connexion à MySQL :', error);
  }
}

startServer();