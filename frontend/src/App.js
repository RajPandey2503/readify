import { Routes, Route, Link, Navigate, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import Upload from "./pages/Upload";
import History from "./pages/History";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import UrlReader from "./pages/UrlReader";

function App() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  /* ---------- LOGOUT ---------- */
  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  /* ---------- PRIVATE ROUTE ---------- */
  const PrivateRoute = ({ children }) => {
    return token ? children : <Navigate to="/login" />;
  };

  return (
    <div>

      {/* ---------- NAVBAR ---------- */}
      <nav style={{ background: "#111", padding: "15px", textAlign: "center" }}>
        <Link to="/" style={{ color: "white", margin: "10px" }}>Home</Link>

        {token && (
          <>
            <Link to="/upload" style={{ color: "white", margin: "10px" }}>Upload</Link>
            <Link to="/history" style={{ color: "white", margin: "10px" }}>History</Link>
            <Link to="/profile" style={{ color: "white", margin: "10px" }}>Profile</Link>
            <Link to="/dashboard" style={{ color: "white", margin: "10px" }}>Dashboard</Link>
            <Link to="/reader" style={{ color: "white", margin: "10px" }}>Reader</Link>
          </>
        )}

        {!token && (
          <Link to="/login" style={{ color: "white", margin: "10px" }}>Login</Link>
        )}

        {token && (
          <button
            onClick={logout}
            style={{
              marginLeft: "15px",
              padding: "6px 12px",
              cursor: "pointer",
              background: "#e74c3c",
              color: "white",
              border: "none",
              borderRadius: "4px"
            }}
          >
            Logout
          </button>
        )}
      </nav>

      {/* ---------- ROUTES ---------- */}
      <Routes>

        <Route path="/" element={<Home />} />

        <Route
          path="/upload"
          element={
            <PrivateRoute>
              <Upload />
            </PrivateRoute>
          }
        />

        <Route
          path="/history"
          element={
            <PrivateRoute>
              <History />
            </PrivateRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/reader"
          element={
            <PrivateRoute>
              <UrlReader />
            </PrivateRoute>
          }
        />

        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />

      </Routes>

      {/* ---------- FOOTER ---------- */}
      <footer
        style={{
          marginTop: "60px",
          padding: "20px",
          background: "#111",
          color: "white",
          textAlign: "center"
        }}
      >
        <p>Readify © 2026</p>
      </footer>

    </div>
  );
}

export default App;
