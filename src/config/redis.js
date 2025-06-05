const redis = require("redis");

let client;

const connectRedis = async () => {
  try {
    client = redis.createClient({
      url: process.env.REDIS_URL,
    });

    client.on("error", (err) => {
      console.error("Redis Client Error:", err);
    });

    client.on("connect", () => {
      console.log("Connected to Redis");
    });

    await client.connect();
    return client;
  } catch (error) {
    console.error("Redis connection error:", error);
    throw error;
  }
};

const getRedisClient = () => {
  if (!client) {
    throw new Error("Redis client not initialized");
  }
  return client;
};

module.exports = { connectRedis, getRedisClient };
