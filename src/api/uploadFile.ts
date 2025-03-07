import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const uploadFile = async (file: File, fileLabel: string) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("label", fileLabel);

  try {
    const response = await axios.post(`${BACKEND_URL}/upload-file`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    console.log("Upload success", response.data);
  } catch (error) {
    const e = error as Error;
    if (axios.isAxiosError(e)) {
      console.error("Upload error:", e.response?.data || e.message);
      throw e;
    } else {
      console.error("Unexpected error:", e);
      throw e;
    }
  }
};
