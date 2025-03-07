import { fromBuffer } from "pdf2pic";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

const convertPdfToThumbnail = async (pdfBuffer) => {
  try {
    const converter = fromBuffer(pdfBuffer, {
      density: 100,
      format: "png",
    });

    const thumbnailInfo = await converter(1);

    // Read the image file into a buffer
    const thumbnailBuffer = fs.readFileSync(path.resolve(thumbnailInfo.path)); // Read the file

    // Clean up the temporary file
    fs.unlink(thumbnailInfo.path, (err) => {
      if (err) {
        console.error("Error deleting temporary file:", err);
      } else {
        console.log("Temporary file deleted.");
      }
    });

    return thumbnailBuffer;
  } catch (error) {
    console.error("Error during PDF to thumbnail conversion:", error);
    return null;
  }
};

export const uploadToSupabase = async (req, res) => {
  try {
    const pdfFile = req.file;
    const mapLabel = req.body.label;

    if (!pdfFile) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const fileName = `${mapLabel}.${pdfFile.originalname.split(".").pop()}`;

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

    res.status(200).json({
      success: true,
      message: "File and thumbnail uploaded successfully",
    });
  } catch (error) {
    console.error("Error in file upload:", error);
    res.status(500).json({ error: "File upload failed" });
  }
};
