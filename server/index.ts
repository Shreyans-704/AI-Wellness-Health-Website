import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "../routes/demo";
import { handleGeminiQuery } from "../routes/gemini";
import { handleUploadPdf } from "../routes/uploadPdf";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors({
    origin: "*"
  }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);
  app.post("/api/gemini", handleGeminiQuery);
  app.post("/api/upload-pdf", handleUploadPdf);

  return app;
}

// 🔥 IMPORTANT: Start server (REQUIRED for Render)
const app = createServer();

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});