import { useEffect, useState } from "react";

function History() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const fetchHistory = () => {
    setLoading(true);
    setError("");

    fetch(`${process.env.REACT_APP_API_URL}/history`, {
      headers: { Authorization: token }
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed");
        return res.json();
      })
      .then(data => setItems(data))
      .catch(() => setError("Could not load history"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const deleteOne = (id) => {
    fetch(`${process.env.REACT_APP_API_URL}/history/${id}`, {
      method: "DELETE",
      headers: { Authorization: token }
    }).then(fetchHistory);
  };

  const clearHistory = () => {
    fetch(`${process.env.REACT_APP_API_URL}/history`, {
      method: "DELETE",
      headers: { Authorization: token }
    }).then(fetchHistory);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "60px" }}>
      <h1>Upload History</h1>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && items.length === 0 && <p>No uploads yet.</p>}

      {items.map(item => (
        <div key={item._id} style={{ marginTop: "20px" }}>
          <p><strong>{item.fileName}</strong></p>
          <p>Type: {item.type}</p>
          <p>Summary: {item.summary}</p>

          <button
            onClick={() => deleteOne(item._id)}
            style={{ background: "red", color: "white" }}
          >
            Delete This
          </button>

          <hr />
        </div>
      ))}

      {items.length > 0 && (
        <button onClick={clearHistory}>
          Clear All History
        </button>
      )}
    </div>
  );
}

export default History;
