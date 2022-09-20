const ytdl = require("ytdl-core");
const ffmpeg = require("fluent-ffmpeg");
const { PassThrough } = require("stream");
const { getVideoInfo } = require("youtube-video-exists");
const { rateLimiter } = require("../../../utilities/rateLimiter");
const contentDisposition = require("content-disposition");
const { existsSync, mkdirSync, writeFile } = require("fs");
// const ffmpeg = require("../../../utilities/ffmpeg");

// const { logger } = require("../../../utilities/logger");
// const cookie = require("cookie");

// FFMPEG
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
ffmpeg.setFfmpegPath(ffmpegPath);

if (!existsSync("./files")) mkdirSync("./files");

export default function handler(req, res) {
  rateLimiter
    .consume(req.headers["x-forwarded-for"], 2.5)
    .then(async () => {
      try {
        if (!req.query.video)
          return res.status(400).json({ error: "No video ID in url" });

        if (
          !ytdl.validateID(req.query.video) &&
          !ytdl.validateURL(req.query.video)
        ) {
          return res.status(400).json({ error: "Please enter a valid link" });
        }

        const videoID = ytdl.getVideoID(req.query.video);

        const videoInfo = await getVideoInfo(videoID);
        const videoLength = await ytdl.getBasicInfo(videoID);
        const audioFormats = ["mp3", "webm", "opus", "flac", "wav", "aiff"];
        const audioQualities = [128, 256, 320];

        if (!videoInfo.existing)
          return res.status(400).json({ error: "Video does not exist" });

        if (videoLength.videoDetails.isLiveContent)
          return res
            .status(400)
            .json({ error: "Live videos cannot be converted" });

        if (req.query.bitrate) {
          if (!audioQualities.some((bitrate) => bitrate == req.query.bitrate)) {
            return res.status(400).json({ error: "Bitrate is not valid" });
          }
        }

        if (req.query.format) {
          if (!audioFormats.some((format) => format == req.query.format)) {
            return res.status(400).json({ error: "Format is not valid" });
          }
        }

        if (videoLength.videoDetails.lengthSeconds > 1830)
          return res.status(400).json({
            error: "Max video length is 30 minutes",
          });

        let title = /[/\\?%*:|"<>]/g.test(videoInfo.info.title)
          ? videoInfo.info.title.replace(/[/\\?%*:|"<>]/g, "")
          : videoInfo.info.title;

        const options = [
          // '-metadata', `artist=${videoInfo.info.author.name}`,
          // '-metadata', `title=${title}`
        ];

        // Set the read stream
        const stream = ytdl(videoID, {
          filter: "audioonly",
          format: "webm",
        }).on("error", (error) => console.log(error));

        let buffers = [];
        res.setHeader("Content-Type", "`audio/mpeg");
        const passThrough = new PassThrough();

        if (req.query.side == 1) {
          if (existsSync(`./files/${videoID}.mp3`))
            return res.json({
              file: `https://mp3convert.tv/api/files?id=${videoID}`,
            });

          res.setHeader(
            "Content-Disposition",
            contentDisposition(`${title}.mp3`)
          );

          ffmpeg(stream)
            .inputOptions("-threads", 6)
            .noVideo()
            .format("mp3")
            .audioBitrate(req.query.bitrate ? req.query.bitrate : 256)
            // .save(`./files/${videoID}.mp3`)
            .on("error", (error) => console.log(error))
            .on("end", () => {
              res.end();
              buffers = Buffer.concat(buffers);
              writeFile(`./files/${videoID}.mp3`, buffers, (err) => {
                if (err) console.log(err);
              });

              // res.json({
              //   file: `https://mp3convert.tv/api/files?id=${videoID}`,
              // });
            })
            .writeToStream(passThrough);

          passThrough.on("data", (chunk) => {
            buffers.push(chunk);
            res.write(chunk);
          });
        } else {
          if (!req.query.noDisposition)
            res.setHeader(
              "Content-Disposition",
              contentDisposition(`${title}.webm`)
            );
          stream.pipe(res, { end: true });
        }
      } catch (error) {
        if (error.message === "Request failed with status code 403")
          return res.status(400).json({ error: "Video is private" });

        if (error.message === "Video unavailable")
          return res.status(400).json({ error: "Video is unavailable" });
        console.log(error);
      }
    })
    .catch(() => {
      // res.removeHeader('Content-Disposition');
      return res.status(429).json({ error: "You're being rate limited" });
    });
}
