import { fromBuffer } from "pdf2pic";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

const convertPdfToThumbnail = (pdfBuffer) => {
  const converter = fromBuffer(pdfBuffer, {
    density: 100,
    format: "png",
  });

  return converter(1);
};

export const uploadToSupabase = async (req, res) => {
  try {
    const pdfFile = req.file;
    const mapLabel = req.body.label;

    if (!pdfFile) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const fileName = `${mapLabel}-${Date.now()}.${pdfFile.originalname
      .split(".")
      .pop()}`;
    const pdfFilePath = `uploads/${fileName}`;

    const pdfBuffer = pdfFile.buffer;
    const thumbnailBuffer = await convertPdfToThumbnail(pdfBuffer);

    const { error: pdfError } = await supabase.storage
      .from("maps")
      .upload(pdfFilePath, pdfBuffer, {
        contentType: "application/pdf",
      });

    if (pdfError) {
      console.error("PDF upload error:", pdfError.message);
      return res.status(500).json({ error: "PDF upload failed" });
    }

    const thumbnailFilePath = `thumbnails/${fileName.replace(".pdf", ".png")}`;
    const { error: thumbnailError } = await supabase.storage
      .from("maps")
      .upload(thumbnailFilePath, thumbnailBuffer, {
        contentType: "image/png",
      });

    if (thumbnailError) {
      console.error("Thumbnail upload error:", thumbnailError.message);
      return res.status(500).json({ error: "Thumbnail upload failed" });
    }

    res
      .status(200)
      .json({ message: "File and thumbnail uploaded successfully" });
  } catch (error) {
    console.error("Error in file upload:", error);
    res.status(500).json({ error: "File upload failed" });
  }
};
