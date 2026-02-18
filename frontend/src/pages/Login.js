import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          password: password.trim()
        })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        localStorage.setItem("token", data.token);
        alert("Login Successful");
        navigate("/upload");
      } else {
        alert(data.message || "Login failed");
      }

    } catch (err) {
      console.error("Login Error:", err);
      alert("Server error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "80px" }}>
      <h1>Login</h1>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ padding: "10px", margin: "10px" }}
      />
      <br />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ padding: "10px", margin: "10px" }}
      />
      <br />

      <button
        onClick={handleLogin}
        disabled={loading}
        style={{ padding: "10px 20px", cursor: "pointer" }}
      >
        {loading ? "Logging in..." : "Login"}
      </button>
    </div>
  );
}

export default Login;
