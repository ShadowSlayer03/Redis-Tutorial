# order-confirmation-jobs-with-bullmq

This is a project to understand how queues work in production and what are its use-cases.

BullMQ is a simple queue used by many enterprises to simply push messages onto a queue to be pulled later and some task can be performed on it. Enhances decoupling, prevents choke from multiple requests and makes things easier.

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run src/index.js
```

This project was created using `bun init` in bun v1.3.1. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.
