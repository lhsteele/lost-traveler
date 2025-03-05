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

  return (
    <div>
      <h1>Admin Panel</h1>
      {user && <p>Welcome, {user.email}</p>}
      {/* Upload functionality goes here */}
    </div>
  );
};
export default Admin;
