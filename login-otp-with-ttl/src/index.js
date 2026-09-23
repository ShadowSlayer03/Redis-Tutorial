import express from "express";
import Redis from "ioredis";

const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

function otpKey(phone) {
  return `otp:${phone}`;
}

app.post("/otp", async (req, res) => {
  const { phone } = req.body;
  const key = otpKey(phone);
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  await redis.set(key, otp, "EX", 20); // OTP expiration 20 seconds
  res.json({ success: true, message: "OTP sent", otp });
});

app.post("/otp/verify", async (req, res) => {
  const { phone, otp } = req.body;
  const key = otpKey(phone);
  const storedOtp = await redis.get(key);

  if (!storedOtp) {
    return res.json({ success: false, message: "OTP not found" });
  }

  if (storedOtp === otp) {
    await redis.del(key);
    res.json({ success: true, message: "OTP verified" });
  } else {
    res.json({ success: false, message: "Invalid OTP" });
  }
});

app.get('/otp/:phone/ttl', async (req, res) => {
  const { phone } = req.params;
  const key = otpKey(phone);
  const ttl = await redis.ttl(key);
  res.json({ success: true, message: "TTL retrieved", ttl });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
