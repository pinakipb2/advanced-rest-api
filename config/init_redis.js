import { createClient } from 'redis';

// Connect to Redis
const RedisClient = createClient({
  host: process.env.REDIS_URL,
  port: parseInt(process.env.REDIS_PORT, 10),
});

RedisClient.on('connect', () => {
  console.log('Redis Connected 🤝🔌');
});

RedisClient.on('error', (err) => {
  console.log(err.message);
});

RedisClient.on('end', () => {
  console.log('Client Disconnected from Redis 🔴');
});

export default RedisClient;
