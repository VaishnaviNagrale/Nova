import { createClient } from "redis";

export const redisClient = createClient({
  url: process.env.REDIS_URL,
  socket: {
    reconnectStrategy: (retries) => {
      console.log("Redis reconnect attempt:", retries);
      return Math.min(retries * 50, 500); // retry with backoff
    }
  }
});

redisClient.on("connect", () => {
  console.log("Redis connected");
});

redisClient.on("reconnecting", () => {
  console.log("Redis reconnecting...");
});

redisClient.on("error", (err) => {
  console.error("Redis Error:", err);
});

await redisClient.connect();