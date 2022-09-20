const express = require("express");
const next = require("next");
const helmet = require("helmet");

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();
const cron = require("node-cron");
const { rmSync, mkdirSync } = require("fs");

cron.schedule("00 11 * * *", () => {
  rmSync("./files", { recursive: true, force: true });
  mkdirSync("./files");
});

app.prepare().then(() => {
  const server = express();
  server.disable("X-Powered-By");
  server.use(
    helmet({
      crossOriginEmbedderPolicy: false,
      contentSecurityPolicy: false,
    })
  );

  // server.use((req, res, next) => {
  //   if ((!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Macintosh/i.test(req.headers["user-agent"]) && !req.headers["user-agent"].match(/chrome|chromium|crios/i)) || !/^((?!chrome|android).)*safari/i.test(req.headers["user-agent"])) {
  //     res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
  //     res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  //   }
  //   next();
  // });

  server.all("*", (req, res) => {
    return handle(req, res);
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
