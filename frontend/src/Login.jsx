import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "./api"; // ✅ USE CUSTOM AXIOS

const Login = ({ setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("officer");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const endpoint = isSignup ? "/register" : "/login";
      const data = isSignup ? { email, password, role } : { email, password };

      const res = await api.post(`/auth${endpoint}`, data);

      // ✅ Save token & role
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);

      // ✅ Set user globally
      if (setUser) {
        setUser(res.data);
      }

      console.log("✅ Success:", res.data);

      navigate("/dashboard");
    } catch (error) {
      const errorMsg = error.response?.data?.error || "Something went wrong!";
      setError(errorMsg);
      console.error("Login Error:", error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #667eea, #764ba2)",
        padding: "20px",
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "40px",
          borderRadius: "20px",
          width: "100%",
          maxWidth: "400px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
        }}
      >
        <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
          {isSignup ? "Admission CRM" : "Admission CRM"}
        </h1>
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
          {isSignup ? "Create Account" : "Login"}
        </h2>

        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "15px" }}
        >
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          />

          {isSignup && (
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={{ padding: "12px", borderRadius: "8px" }}
            >
              <option value="officer">Admission Officer</option>
              <option value="admin">Admin</option>
              <option value="management">Management</option>
            </select>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "12px",
              borderRadius: "8px",
              background: "#3b82f6",
              color: "#fff",
              border: "none",
              cursor: "pointer",
            }}
          >
            {loading ? "⏳ Processing..." : isSignup ? "Sign Up" : "Login"}
          </button>
        </form>

        <div style={{ marginTop: "15px", textAlign: "center" }}>
          <button
            onClick={() => {
              setIsSignup(!isSignup);
              setError("");
            }}
            style={{
              background: "none",
              border: "none",
              color: "#3b82f6",
              cursor: "pointer",
            }}
          >
            {isSignup ? "← Back to Login" : "Create Account →"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
