import Redis from 'ioredis';

const subscriber = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

subscriber.subscribe('notifications', (err, count) => {
  if (err) {
    console.error("Failed to subscribe:", err);
    return;
  }
  console.log(`Subscribed to ${count} channel(s)`);
});

subscriber.on('message', (channel, message) => {
  console.log(`Received message on ${channel}: ${message}`);
});
