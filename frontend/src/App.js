import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Upload from "./pages/Upload";
import History from "./pages/History";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";



function App() {
  const user = localStorage.getItem("user");

  const logout = () => {
    localStorage.removeItem("user");
    window.location.reload();
  };

  const PrivateRoute = ({ children }) => {
    return user ? children : <Navigate to="/login" />;
  };

  return (
    <BrowserRouter>
      <nav style={{ background:"#111", padding:"15px", textAlign:"center" }}>
        <Link to="/" style={{ color:"white", margin:"10px" }}>Home</Link>
        <Link to="/upload" style={{ color:"white", margin:"10px" }}>Upload</Link>
        <Link to="/history" style={{ color:"white", margin:"10px" }}>History</Link>
        {user && <Link to="/profile" style={{ color:"white", margin:"10px" }}>Profile</Link>}


        {!user && <Link to="/login" style={{ color:"white", margin:"10px" }}>Login</Link>}
        {user && <button onClick={logout}>Logout</button>}
      </nav>

  <Routes>
    <Route path="/" element={<Home />} />

    <Route path="/upload" element={
      <PrivateRoute><Upload /></PrivateRoute>
    } />

    <Route path="/history" element={
      <PrivateRoute><History /></PrivateRoute>
    } />
    <Route path="/profile" element={
      <PrivateRoute><Profile /></PrivateRoute>
    } />


    <Route path="/login" element={<Login />} />
    <Route path="*" element={<NotFound />} />

  </Routes>

  <footer style={{
    marginTop: "60px",
    padding: "20px",
    background: "#111",
    color: "white",
    textAlign: "center"
  }}>
    <p>Readify © 2026</p>
  </footer>
</BrowserRouter>
  );
}

export default App;
