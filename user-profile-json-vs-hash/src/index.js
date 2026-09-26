import express from "express";
import Redis from "ioredis";

const app = express();

app.use(express.json());

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello via Bun!");
});

app.post("/user/:id/json", async (req, res) => {
  const { id } = req.params;
  const { body } = req;
  await redis.set(`user:${id}:json`, JSON.stringify(body), "EX", 60);
  res.json({ success: true, id, savedAs: "json" });
});

app.get("/user/:id/json", async (req, res) => {
  const { id } = req.params;
  const data = await redis.get(`user:${id}:json`);
  res.json({ success: true, data: JSON.parse(data) });
});

app.post("/user/:id/hash", async (req, res) => {
  const { id } = req.params;
  const { body } = req;
  await redis.hset(`myhash:${id}`, `user:${id}:hash`, JSON.stringify(body));
  res.json({ success: true, id, savedAs: "hash" });
});

app.get("/user/:id/hash", async (req, res) => {
  const { id } = req.params;
  const getOne = await redis.hget(`myhash:${id}`, `user:${id}:hash`);
  const getAll = await redis.hgetall(`myhash:${id}`);
  res.json({ success: true, getOne: JSON.parse(getOne), getAll });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
