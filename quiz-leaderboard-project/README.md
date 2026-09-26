# quiz-leaderboard-project

A project to condense all the information and implement a leaderboard using Redis.

### Endpoints

1. POST -> /quiz/:id/view -> increment view count of a quiz
2. POST -> /leaderboard/score -> add points to a user score
3. GET -> /leaderboard -> get the top 10 leaders
4. GET -> /leaderboard/:userid/rank -> get a user's rank
5. GET -> /quiz/:id/view -> get view count of a quiz

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run src/index.js
```

This project was created using `bun init` in bun v1.3.1. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.
