const ytdl = require("ytdl-core");
const { getVideoInfo } = require("youtube-video-exists");
const { rateLimiter } = require("../../../utilities/rateLimiter");
const { existsSync } = require("fs");

// FFMPEG
// const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
// const ffmpeg = require("fluent-ffmpeg");
// ffmpeg.setFfmpegPath(ffmpegPath);

export default function handler(req, res) {
  if (req.method === "POST") {
    const formats = ["audio", "video"];

    if (req.body.termsAgree) return;

    if (!req.body.url || !req.body.format) {
      return res.status(400).json({ error: "Fill all the parameters" });
    }

    if (!ytdl.validateID(req.body.url) && !ytdl.validateURL(req.body.url)) {
      return res.status(400).json({ error: "Please enter a valid link" });
    }

    if (!formats.some((format) => format == req.body.format)) {
      return res.status(400).json({ error: "Format is not valid" });
    }

    // if (!qualities.some((quality) => quality == req.body.quality)) {
    //   return res.status(400).json({ error: "Quality is not valid" });
    // }

    rateLimiter
      .consume(req.headers["x-forwarded-for"], 2)
      .then(() => {
        // MP3 DOWNLOAD
        if (req.body.format == "audio") {
          (async () => {
            const id = ytdl.getVideoID(req.body.url);

            try {
              const videoInfo = await getVideoInfo(id);
              const videoLength = await ytdl.getBasicInfo(id);

              if (!videoInfo.existing)
                return res.status(400).json({ error: "Video does not exist" });

              if (videoLength.videoDetails.isLiveContent)
                return res
                  .status(400)
                  .json({ error: "Live videos cannot be converted" });

              if (videoLength.videoDetails.lengthSeconds > 1830)
                return res.status(400).json({
                  error: "Max video length is 30 minutes",
                });

              let title = videoInfo.info.title;
              if (/[/\\?%*:|"<>]/g.test(title)) {
                title = title.replace(/[/\\?%*:|"<>]/g, "");
              }

              return res.json({
                file: `https://mp3convert.tv/api/files?id=${id}`,
                title,
                length: videoLength.videoDetails.lengthSeconds,
                exists: existsSync(`./files/${id}.mp3`),
              });
            } catch (error) {
              if (error.message === "Request failed with status code 403")
                return res.status(400).json({ error: "Video is private" });

              if (error.message === "Video unavailable")
                return res.status(400).json({ error: "Video is unavailable" });
            }
          })();
        } else {
          return res
            .status(400)
            .json({ error: "MP4 is currently not supported" });
        }
      })
      .catch(() => {
        res.status(429).json({ error: "You're being rate limited" });
      });
  }
}
