const express = require("express");
const next = require("next");

const port = Number(process.env.PORT) || 3000;
const dev =
  process.env.NODE_ENV !== "production" &&
  process.env.npm_lifecycle_event !== "start";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  server.disable("x-powered-by");

  server.get("/api/express/health", (_req, res) => {
    res.json({ success: true, data: { service: "news-app" } });
  });

  server.use((req, res) => handle(req, res));

  server.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`> Ready on http://localhost:${port}`);
  });
});
