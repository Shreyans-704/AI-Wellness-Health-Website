import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "../routes/demo";
import { handleGeminiQuery } from "../routes/gemini";
import { handleUploadPdf } from "../routes/uploadPdf";

export function createServer() {
  const app = express();

  app.use(cors({ origin: "*" }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.get("/", (_req, res) => {
    res.send("Server is running");
  });

  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);
  app.post("/api/gemini", handleGeminiQuery);
  app.post("/api/upload-pdf", handleUploadPdf);

  return app;
}

/**
 * IMPORTANT:
 * Do NOT start the server during builds (Vite/Netlify/Render build step),
 * otherwise the build hangs forever.
 *
 * We only start the server when `npm start` is executed, because the start script
 * sets START_SERVER=true.
 */
const shouldStartServer = process.env.START_SERVER === "true";

if (shouldStartServer) {
  const app = createServer();
  const port = process.env.PORT || 3000;

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}