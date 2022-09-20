const { rateLimiter } = require("../../../utilities/errorLimiter");
const axios = require("axios");

export default function handler(req, res) {
  if (!req.body.error) return;

  rateLimiter.consume(req.headers["x-forwarded-for"], 1).then(() => {
    axios.post(
      "https://discord.com/api/webhooks/988869613947355226/cHabWpUhwlDrw3G2bdKtlFpuivmF5MVBYG7kBhsZkTL2qNqooq7KVWJ0QX83sVmO3TO0",
      {
        content: `**New Error Logged**\n\`\`\`${req.body.error}\`\`\`\n\`\`\`${req.headers["user-agent"]}}\`\`\``,
      }
    );
  });
}
