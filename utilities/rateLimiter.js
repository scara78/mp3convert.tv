const { RateLimiterMemory } = require("rate-limiter-flexible");

const opts = {
  points: 10.5, // 10 points
  duration: 60, //  Half min
};

export const rateLimiter = new RateLimiterMemory(opts);
