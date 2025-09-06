const Redis = require('ioredis');

const redis = new Redis({
  host: '127.0.0.1',
  port: 6379
});

redis.on('connect', () => console.log('Connected to Redis'));
redis.on('error', (err) => console.error('Redis error', err));

module.exports = redis;
