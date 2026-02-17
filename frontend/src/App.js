import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Upload from "./pages/Upload";

function App() {
  return (
    <BrowserRouter>
      <nav style={{
        background: "#111",
        color: "white",
        padding: "15px",
        textAlign: "center"
      }}>
        <Link to="/" style={{color:"white", marginRight:"20px"}}>Home</Link>
        <Link to="/upload" style={{color:"white"}}>Upload</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/upload" element={<Upload />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
