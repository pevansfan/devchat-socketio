import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

export const redis = createClient({
  socket: {
    host: process.env.REDIS_HOST ?? 'redis',
    port: parseInt(process.env.REDIS_PORT ?? '6379', 10),
  },
});

redis.on('error', (error) => {
  console.error('❌ Redis error:', error);
});

export async function connectRedis() {
  if (!redis.isOpen) {
    await redis.connect();
    console.log('✅ Redis connecté');
  }
}