const rateLimit = require("express-rate-limit");
const { getRedisClient } = require("../config/redis");

// Initialize Redis client
let redisClient;
(async () => {
  const { connectRedis } = require("../config/redis");
  redisClient = await connectRedis();
})();

const rateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // limit each IP to 30 requests per windowMs
  message: {
    status: "error",
    message: "Too many requests from this IP, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  store: {
    // Custom Redis store implementation
    async increment(key) {
      if (!redisClient) return { totalHits: 1, resetTime: new Date() };

      const redisKey = `rate_limit:${key}`;
      const current = await redisClient.incr(redisKey);

      if (current === 1) {
        await redisClient.expire(redisKey, 60); // 60 seconds
      }

      const ttl = await redisClient.ttl(redisKey);
      const resetTime = new Date(Date.now() + ttl * 1000);

      return {
        totalHits: current,
        resetTime,
      };
    },

    async decrement(key) {
      if (!redisClient) return;

      const redisKey = `rate_limit:${key}`;
      await redisClient.decr(redisKey);
    },

    async resetKey(key) {
      if (!redisClient) return;

      const redisKey = `rate_limit:${key}`;
      await redisClient.del(redisKey);
    },
  },
});

module.exports = rateLimiter;
