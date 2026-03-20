import { RequestHandler } from "express";
import { createClient } from "@supabase/supabase-js";

// Use service role key for server-side operations (bypasses RLS)
const supabaseUrl = process.env.VITE_SUPABASE_URL as string;
const supabaseServiceKey = process.env.SECRET_KEY as string;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("Missing Supabase credentials in server environment");
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export const handleUploadPdf: RequestHandler = async (req, res) => {
  try {
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
        contentType: "application/pdf"
      });

    if (error) {
      console.error("Supabase upload error:", error);
      return res.status(500).json({ error: error.message });
    }

    res.json({
      success: true,
      message: "PDF uploaded successfully",
      data
    });
  } catch (error: any) {
    console.error("PDF upload error:", error);
    res.status(500).json({ error: error.message || "Failed to upload PDF" });
  }
};
