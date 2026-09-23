import express from "express";
import Redis from "ioredis";

const app = express();

app.use(express.json());

const port = process.env.PORT || 3000;

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

const QUEUE_KEY = "queue:emails";

app.get("/", (req, res) => {
  return res.json({ success: true, message: "Backend running!" });
});

app.post('/emails', async (req, res) => {
  const { to, subject, body } = req.body;
  const job = {
    to,
    subject,
    body,
    createdAt: new Date().toISOString(),
  }
  await redis.lpush(QUEUE_KEY, JSON.stringify(job));
  return res.json({ queued: true, message: "Email added to queue!", job });
});

// DRAWBACKS
// Once process is called/popped, it is removed from queue forever regardless of whether it succeeded
// No retry mechanism
// No parallel workers
app.get('/emails/process-one', async (req, res) => {
  const job = await redis.rpop(QUEUE_KEY);
  if (!job) {
    return res.json({ message: "No jobs in queue!" });
  }

  // logic for sending emails

  return res.json({ processed: true, message: "Job processed!", job: JSON.parse(job) });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
