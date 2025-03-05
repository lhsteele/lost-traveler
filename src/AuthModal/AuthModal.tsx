import { FunctionComponent, useState } from "react";
import { supabase } from "../supabaseClient.ts";
import { useNavigate } from "react-router-dom";
import "./AuthModal.css";

type AuthModalProps = {
  onClose: () => void;
};

const AuthModal: FunctionComponent<AuthModalProps> = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<null | string>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError) {
      setError(userError.message);
      console.error("Error querying Users table:", userError.message);
      setLoading(false);
      return;
    }

    // If the user exists, proceed with the app logic
    console.log("User logged in successfully", userData);
    onClose();
    navigate("/admin");

    setLoading(false);
  };

  return (
    <div className="auth-modal">
      <h2 className="text-xl font-bold mb-4">Admin Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-2 border rounded mb-2"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-2 border rounded mb-4"
      />
      {error && <p className="text-red-500">{error}</p>}
      <button
        onClick={handleLogin}
        className="bg-blue-500 text-white p-2 w-full rounded"
        disabled={loading}
      >
        {loading ? "Logging in..." : "Login"}
      </button>
      <button onClick={onClose} className="mt-2 w-full p-2 bg-gray-300 rounded">
        Cancel
      </button>
    </div>
  );
};

export default AuthModal;
