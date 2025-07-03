// server.js
const app = require("./app");
const http = require("http");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { createClient } = require("redis");
const socketIo = require("socket.io");
const scheduleTaskReminder = require("./cron/reminderJob");

dotenv.config();

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
const REDIS_URL = process.env.REDIS_URL || "redis://127.0.0.1:6379";

// MongoDB connection
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ MongoDB connected");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
  });

scheduleTaskReminder(); // 🔥 start the cron job

// Redis connection (optional)
const redisClient = createClient({ url: REDIS_URL });
redisClient
  .connect()
  .then(() => {
    console.log("✅ Redis connected");
  })
  .catch((err) => {
    console.error("❌ Redis connection failed:", err.message);
  });
// ===========TO CHECK REDIS==========
// (async () => {
//   try {
//     if (!redisClient.isOpen) await redisClient.connect();

//     await redisClient.set("health-check", "OK");
//     const value = await redisClient.get("health-check");
//     console.log("🔍 Redis test value:", value);
//   } catch (err) {
//     console.error("❌ Redis test failed:", err);
//   }
// })();

// HTTP + Socket.io setup
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
  },
});

global.io = io;

io.on("connection", (socket) => {
  console.log("🔌 Socket connected:", socket.id);
  socket.on("disconnect", () => {
    console.log("❌ Socket disconnected:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
