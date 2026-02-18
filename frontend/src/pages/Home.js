import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Home() {
  const [count, setCount] = useState(0);
  const user = localStorage.getItem("user");

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/history`)


      .then(res => res.json())
      .then(data => setCount(data.length))
      .catch(() => setCount(0));
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "80px" }}>
      <h1>Welcome to Readify</h1>

      {user && <p>Hello, <strong>{user}</strong></p>}

      <div style={{ marginTop: "30px" }}>
        <h3>Total Documents Uploaded</h3>
        <p style={{ fontSize: "24px" }}>{count}</p>
      </div>

      <div style={{ marginTop: "40px" }}>
        <Link to="/upload">
          <button style={{ margin: "10px" }}>Upload Document</button>
        </Link>

        <Link to="/history">
          <button style={{ margin: "10px" }}>View History</button>
        </Link>
      </div>
    </div>
  );
}

export default Home;
