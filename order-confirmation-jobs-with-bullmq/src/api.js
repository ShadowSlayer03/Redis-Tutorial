import express from "express";
import { emailQueue } from "./queue.js";

const app = express();

app.use(express.json());

const port = process.env.PORT || 3000;

app.post("/welcome-email", async (req, res) => {
  const { to, subject, name, from } = req.body;

  emailQueue.add(
    "send-welcome-email",
    { to, subject, name, from },
    { delay: 1000, attempts: 3, backoff: { type: "exponential", delay: 500 } }
  );

  res.json({ success: true, message: `Welcome email sent to ${to} from ${from}` });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
