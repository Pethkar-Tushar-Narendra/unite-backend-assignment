import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

const redisClient = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: Number(process.env.REDIS_PORT) || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  retryStrategy: (times) => {
    // Retry connection every 2 seconds if it fails
    return Math.min(times * 50, 2000);
  },
});

redisClient.on('connect', () => {
  console.log('✅ Redis Connected Successfully');
});

redisClient.on('error', (err) => {
  console.error('❌ Redis Connection Error:', err);
});

export default redisClient;
