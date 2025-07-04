// // config/redisClient.js
// const { createClient } = require("redis");

// const redisClient = createClient({
//   url: process.env.REDIS_URL,
//   socket: {
//     tls: true, // ✅ required for Upstash (because it's rediss://)
//   },
// });

// redisClient.on("error", (err) => console.error("Redis error:", err));
// redisClient.on("connect", () => console.log("✅ Redis client connected"));
// redisClient.on("ready", () => console.log("🚀 Redis client ready"));

// module.exports = redisClient;

// config/redisClient.js
const { createClient } = require("redis");
require("dotenv").config();

const redisClient = createClient({
  url: process.env.REDIS_URL,
  socket: {
    tls: true, // Required for Upstash
  },
});

redisClient.on("error", (err) => console.error("@@Redis error:", err));
redisClient.on("connect", () => console.log("Redis client connected"));
redisClient.on("ready", () => console.log("🚀 Redis client ready"));

const connectRedis = async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
};

module.exports = { redisClient, connectRedis };
