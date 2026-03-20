import { RequestHandler } from "express";
import { createClient } from "@supabase/supabase-js";

// Get env variables
const supabaseUrl = process.env.VITE_SUPABASE_URL as string;
const supabaseServiceKey = process.env.SECRET_KEY as string;

// Safe initialization (prevents build crash)
let supabase: any = null;

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn("Supabase credentials missing during build");
} else {
  supabase = createClient(supabaseUrl, supabaseServiceKey);
}

export const handleUploadPdf: RequestHandler = async (req, res) => {
  try {
    // Check if supabase is initialized
    if (!supabase) {
      return res.status(500).json({ error: "Supabase not configured" });
    }

    const { fileName, fileData } = req.body;

    if (!fileName || !fileData) {
      return res.status(400).json({ error: "Missing fileName or fileData" });
    }

    // Convert base64 string to buffer
    const buffer = Buffer.from(fileData, "base64");

    // Upload to Supabase storage
    const { data, error } = await supabase.storage
      .from("health-pdfs")
      .upload(fileName, buffer, {
        cacheControl: "3600",
        upsert: false,
        contentType: "application/pdf",
      });

    if (error) {
      console.error("Supabase upload error:", error);
      return res.status(500).json({ error: error.message });
    }

    res.json({
      success: true,
      message: "PDF uploaded successfully",
      data,
    });
  } catch (error: any) {
    console.error("PDF upload error:", error);
    res.status(500).json({ error: error.message || "Failed to upload PDF" });
  }
};