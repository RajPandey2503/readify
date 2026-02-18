import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

const handleLogin = async () => {
  setLoading(true);

  try {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/Login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email.trim(),
        password: password.trim()
      })
    });

    const data = await res.json();

    alert(data.message || (res.ok ? "Logged in" : "Login failed"));
    if (res.ok && data.success) {
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/upload");
    }
  } catch (err) {
    console.error(err);
    alert("Login failed");
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
      />
      <br />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br />

      <button onClick={handleLogin} disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>
    </div>
  );
}

export default Login;
