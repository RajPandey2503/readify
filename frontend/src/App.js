import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Upload from "./pages/Upload";
import History from "./pages/History";
import Login from "./pages/Login";



function App() {
  return (
    <BrowserRouter>
      <nav style={{
        background: "#111",
        color: "white",
        padding: "15px",
        textAlign: "center"
      }}>
        <Link to="/" style={{ color: "white", marginRight: "20px" }}>Home</Link>
        <Link to="/upload" style={{ color: "white", marginRight: "20px" }}>Upload</Link>
        <Link to="/history" style={{ color: "white" }}>History</Link>
        <Link to="/login" style={{ color: "white", marginLeft: "20px" }}>Login</Link>

      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/history" element={<History />} />
        <Route path="/login" element={<Login />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
