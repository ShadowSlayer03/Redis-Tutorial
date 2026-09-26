import express from "express";
import Redis from "ioredis";

const app = express();

const port = process.env.PORT || 3000;

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

app.use(express.json());

const LEADERBOARD_KEY = "quiz:leaderboard:latest";

// HEALTHCHECK
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// QUIZ
app.get("/quiz/:id/view", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.json({
        success: false,
        message: "Quiz ID not provided",
        statusCode: 400,
      });
    }

    const quizCount = await redis.get(`quiz:${id}`);

    return res.json({
      success: true,
      message: `Retrieved view count of quiz ${id} successfully`,
      data: quizCount,
      statusCode: 200,
    });
  } catch (error) {
    return res.json({
      success: false,
      message: "Error occurred while viewing quiz count",
      statusCode: 500,
    });
  }
});

app.post("/quiz/:id/view", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.json({
        success: false,
        message: "Quiz ID not provided",
        statusCode: 400,
      });
    }

    await redis.incr(`quiz:${id}`);

    return res.json({
      success: true,
      message: `Quiz ${id} view count incremented`,
      statusCode: 200,
    });
  } catch (error) {
    return res.json({
      success: false,
      message: `Error occurred while incrementing quiz count: ${error.message}`,
      statusCode: 500,
    });
  }
});

// LEADERBOARD
app.get("/leaderboard", async (req, res) => {
  try {
    const topTen = await redis.zrange(
      LEADERBOARD_KEY,
      0,
      9,
      "REV",
      "WITHSCORES",
    );

    return res.json({
      success: true,
      message: "Top ten leaderboard retrieved successfully",
      data: topTen,
      statusCode: 200,
    });
  } catch (error) {
    return res.json({
      success: false,
      message: `Error occurred while fetching leaderboard: ${error.message}`,
      statusCode: 500,
    });
  }
});

app.post("/leaderboard/score", async (req, res) => {
  try {
    const { userId, points } = req.body;

    if (!userId) {
      return res.json({
        success: false,
        message: "User ID not provided",
        statusCode: 400,
      });
    }

    if (!points) {
      return res.json({
        success: false,
        message: "Points not provided",
        statusCode: 400,
      });
    }

    const userKey = `user:${userId}`;

    const val = await redis.zadd(LEADERBOARD_KEY, "INCR", points, userKey);

    return res.json({
      success: true,
      message: `Updated points of user ${userId} successfully`,
      data: val,
      statusCode: 200,
    });
  } catch (error) {
    return res.json({
      success: false,
      message: `Error occurred while adding points to leaderboard: ${error.message}`,
      statusCode: 500,
    });
  }
});

// USER
app.get("/leaderboard/:userId/rank", async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.json({
        success: false,
        message: "User ID not provided",
        statusCode: 400,
      });
    }

    const userRank = await redis.zrevrank(
      LEADERBOARD_KEY,
      `user:${userId}`,
      "WITHSCORE",
    );

    return res.json({
      success: true,
      message: "Retrieved user's rank successfully",
      data: userRank,
      statusCode: 200,
    });
  } catch (error) {
    return res.json({
      success: false,
      message:
        "Error occurred while retrieving user's leaderboard position: " +
        error.message,
      statusCode: 500,
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
