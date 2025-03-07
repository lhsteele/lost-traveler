import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import { uploadToSupabase } from "./util.js";
const upload = multer({ storage: multer.memoryStorage() });

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});

app.post("/upload-file", upload.single("file"), async (req, res) => {
  try {
    await uploadToSupabase(req, res);
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ error: "Error uploading file" });
  }
});
