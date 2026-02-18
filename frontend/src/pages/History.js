import { useEffect, useState } from "react";

function History() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = () => {
    fetch(`${process.env.REACT_APP_API_URL}/History`)

      .then(res => res.json())
      .then(data => setItems(data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const clearHistory = () => {
    fetch("http://localhost:5000/history", {
      method: "DELETE"
    }).then(() => fetchHistory());
  };

  return (
    <div style={{ textAlign: "center", marginTop: "60px" }}>
      <h1>Upload History</h1>

      {loading && <p>Loading history...</p>}
      {!loading && items.length === 0 && <p>No uploads yet.</p>}

      {items.map((item, index) => (
        <div key={index} style={{ marginTop: "20px" }}>
          <p><strong>{item.fileName}</strong></p>
          <p>Type: {item.type}</p>
          <p>Summary: {item.summary}</p>
          <hr />
        </div>
      ))}

      {items.length > 0 && (
        <button onClick={clearHistory} style={{ marginTop: "20px" }}>
          Clear History
        </button>
      )}
    </div>
  );
}

export default History;
