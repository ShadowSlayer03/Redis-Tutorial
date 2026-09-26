import express from 'express';
import Redis from 'ioredis';

const app = express();

app.use(express.json());

const port = process.env.PORT || 3000;

const publisher = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.post('/notifications', async (req, res) => {
  const { title, createdAt } = req.body;
  await publisher.publish('notifications', JSON.stringify({ title, createdAt }));
  res.json({ success: true, message: 'Notification sent' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
