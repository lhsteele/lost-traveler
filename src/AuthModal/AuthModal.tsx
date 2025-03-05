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

    console.log("User logged in successfully", userData);
    onClose();
    navigate("/admin");

    setLoading(false);
  };

  return (
    <div className="auth-modal">
      <h2>Admin Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="auth-input"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="auth-input"
      />
      {error && <p className="text-red-500">{error}</p>}
      <button
        onClick={handleLogin}
        className="auth-modal-btn"
        disabled={loading}
      >
        {loading ? "Logging in..." : "Login"}
      </button>
      <button onClick={onClose} className="auth-modal-btn">
        Cancel
      </button>
    </div>
  );
};

export default AuthModal;
