import { Router } from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { fileURLToPath } from "url";
import { dirname } from "path";
import dotenv from "dotenv";

dotenv.config();

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = Router();
const upload = multer({ dest: "uploads/" });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

router.post("/analyze-pdf", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Read file
    const filePath = path.join(__dirname, "..", req.file.path);
    const pdfBuffer = fs.readFileSync(filePath);

    // ✅ Gemini API with file input
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent([
      {
        inlineData: {
          data: pdfBuffer.toString("base64"),
          mimeType: "application/pdf",
        },
      },
      { text: "Analyze this medical report PDF and summarize key findings, possible issues, and recommendations." },
    ]);

    const report = result.response.text();

    // Delete file after processing (to avoid clutter)
    fs.unlinkSync(filePath);

    res.json({ report });
  } catch (error) {
    console.error("Error analyzing PDF:", error);
    res.status(500).json({ error: "Error analyzing PDF" });
  }
});

export default router;