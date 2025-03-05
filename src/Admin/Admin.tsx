import { FunctionComponent, useEffect, useState } from "react";
import "./Admin.css";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient.ts";

type SupabaseUserType = {
  id: string;
  email?: string;
  aud: string;
  role?: string;
  app_metadata?: {
    provider?: string;
    provider_id?: string;
  };
  user_metadata: object;
  created_at: string;
  updated_at?: string;
};

const Admin: FunctionComponent = () => {
  const [user, setUser] = useState<null | SupabaseUserType>(null);
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [mapLabel, setMapLabel] = useState("");

  useEffect(() => {
    const checkUser = async () => {
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        console.error("Error fetching user:", error.message);
        return;
      }

      const supabaseUser = data?.user;
      if (supabaseUser) {
        setUser({
          id: supabaseUser.id,
          email: supabaseUser.email,
          aud: supabaseUser.aud,
          role: supabaseUser.role,
          app_metadata: supabaseUser.app_metadata,
          user_metadata: supabaseUser.user_metadata,
          created_at: supabaseUser.created_at,
          updated_at: supabaseUser.updated_at,
        });
      } else {
        navigate("/");
      }
    };

    checkUser();
  }, [navigate]);

  const handleMapLabelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMapLabel(event.target.value);
  };

  const handleBackClick = () => {
    navigate("/");
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const uploadFile = async () => {
    if (!file) return alert("Please select a file");

    setUploading(true);
    const fileExt = file.name.split(".").pop();
    const fileName = `${mapLabel}.${fileExt}`;
    const filePath = `uploads/${fileName}`;

    const { error } = await supabase.storage
      .from("maps")
      .upload(filePath, file);

    setUploading(false);

    if (error) {
      console.error("Upload error:", error.message);
      alert("Upload failed");
    } else {
      alert("File uploaded successfully!");
      setFile(null);
    }
  };

  return (
    <div className="admin">
      <h1>Admin Panel</h1>
      {user && (
        <div className="admin-content">
          <label htmlFor="map-label-input">Map label:</label>
          <input
            id="map-label-input"
            type="text"
            onChange={handleMapLabelChange}
            className="admin-input"
          />
          <input
            type="file"
            onChange={handleFileChange}
            accept="image/*,.pdf"
          />
          <button
            onClick={uploadFile}
            disabled={uploading}
            className="admin-btn"
          >
            {uploading ? "Uploading..." : "Upload file"}
          </button>
          <button onClick={handleBackClick} className="admin-btn">
            Back
          </button>
        </div>
      )}
    </div>
  );
};
export default Admin;
