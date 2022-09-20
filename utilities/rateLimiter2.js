const { RateLimiterMemory } = require("rate-limiter-flexible");

const opts = {
    points: 1, // 1 point
    duration: 600 //  10 mins
  };

  export const rateLimiter = new RateLimiterMemory(opts);