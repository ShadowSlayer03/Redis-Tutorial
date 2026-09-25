import express from "express";
import Redis from "ioredis";

const app = express();

const port = process.env.PORT || 3000;

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

const BANNER_KEY = "app:banner";

app.use(express.json());

app.get("/banner", async (req, res) => {
  const message = await redis.get(BANNER_KEY);
  res.json({ success: true, message });
});

app.get("/banner/exists", async (req, res) => {
  const exists = await redis.exists(BANNER_KEY);
  res.json({ success: true, message: Boolean(exists) });
});

app.post("/banner", async (req, res) => {
  const { key } = await req.body;
  await redis.set(BANNER_KEY, key);
  res.json({ success: true, message: "Banner updated" });
});

app.delete("/banner", async (req, res) => {
  await redis.del(BANNER_KEY);
  res.json({ success: true, message: "Banner deleted" });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
