import { useEffect, useState } from "react";

function History() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/history")
      .then(res => res.json())
      .then(data => setItems(data))
      .finally(() => setLoading(false));
  }, []);

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
    </div>
  );
}

export default History;
