const { createReadStream, stat } = require("fs");
const { rateLimiter } = require("../../../utilities/rateLimiter");
const contentDisposition = require("content-disposition");
const { getVideoInfo } = require("youtube-video-exists");

export default function handler(req, res) {
  rateLimiter
    .consume(req.headers["x-forwarded-for"], 3)
    .then(() => {
      if (!req.query.id)
        return res.status(400).json({ error: "No video ID in the URL" });

      stat(`./files/${req.query.id}.mp3`, async (error) => {
        if (error)
          return res.status(400).json({ error: "Cannot find this file" });

        let title = (await getVideoInfo(req.query.id)).info.title;

        title = /[/\\?%*:|"<>]/g.test(title)
          ? title.replace(/[/\\?%*:|"<>]/g, "")
          : title;

        res.setHeader(
          "Content-Disposition",
          contentDisposition(`${title}.mp3`)
        );

        const stream = createReadStream(`./files/${req.query.id}.mp3`, {
          highWaterMark: 128 * 1024,
        });
        stream.pipe(res);
        stream.on("end", res.end);
      });
    })
    .catch(() => {
      res.status(429).json({ error: "You're being rate limited" });
    });
}
