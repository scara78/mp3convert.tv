const youtubeSearchAPI = require("youtube-search-api");
const { rateLimiter } = require("../../../utilities/rateLimiter");

export default function handler(req, res) {
  if (!req.query.video)
    return res.status(400).json({ error: "Fill all the parameters" });

  rateLimiter
    .consume(req.headers["x-forwarded-for"], 1.5)
    .then(async () => {
      const videos = (
        await youtubeSearchAPI.GetListByKeyword(req.query.video, false, 10)
      ).items.filter((video) => video.id.length == 11 && video.isLive == false);

      res.json(videos);
    })
    .catch(() => {
      return res.status(429).json({ error: "You're being rate limited" });
    });
}
