import { useEffect, useState } from "react";

function Dashboard() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/history`,
          {
            headers: { Authorization: token }
          }
        );

        const data = await res.json();

        // ✅ Ensure it's always an array
        if (Array.isArray(data)) {
          setItems(data);
        } else {
          setItems([]);
        }

      } catch (err) {
        console.error("Dashboard error:", err);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [token]);

  if (loading) {
    return <h2 style={{ textAlign: "center" }}>Loading dashboard...</h2>;
  }

  return (
    <div style={{ textAlign: "center", marginTop: "60px" }}>
      <h1>Dashboard</h1>

      <p>Total Uploads: {items.length}</p>

      <h3>Recent Activity</h3>

      {items.length === 0 && <p>No uploads yet.</p>}

      {items.slice(0, 5).map((item) => (
        <div key={item._id} style={{ marginTop: "15px" }}>
          <strong>{item.fileName}</strong>
          <p>Type: {item.type}</p>
          <hr />
        </div>
      ))}
    </div>
  );
}

export default Dashboard;
