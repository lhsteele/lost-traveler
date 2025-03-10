import { FunctionComponent, useState } from "react";
import axios from "axios";
import "./PDFDownload.css";

type PDFDownloadProps = {
  fileUrl: string;
  fileName?: string;
};

const PDFDownload: FunctionComponent<PDFDownloadProps> = ({
  fileUrl,
  fileName,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(fileUrl, {
        responseType: "blob",
        headers: {
          "Content-Type": "application/pdf",
        },
      });

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName || "download.pdf");
      document.body.appendChild(link);
      link.click();

      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
      setLoading(false);
    } catch (error) {
      console.error("Download failed:", error);
      setError("Failed to download file. Please try again later.");
      setLoading(false);
    }
  };

  return (
    <div className="pdf-download">
      <label htmlFor="download-btn">{fileName}</label>
      <button
        onClick={handleDownload}
        disabled={loading}
        className="download-btn"
        id="download-btn"
      >
        {loading ? "Downloading..." : "Download"}
      </button>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default PDFDownload;
