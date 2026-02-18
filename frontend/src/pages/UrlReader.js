import { useState } from "react";

function UrlReader() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const handleAnalyze = async () => {
    if (!url) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/analyze-url`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token
        },
        body: JSON.stringify({ url })
      });

      const data = await res.json();
      setResult(data);
    } catch {
      alert("Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "80px" }}>
      <h1>Analyze Web Article</h1>

      <input
        type="text"
        placeholder="Paste URL..."
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        style={{ width: "60%", padding: "10px" }}
      />

      <br /><br />

      <button onClick={handleAnalyze}>
        Analyze
      </button>

      {loading && <p>Analyzing...</p>}

      {result && (
        <div style={{ marginTop: "30px" }}>
          <h3>Summary</h3>
          <p>{result.summary}</p>
        </div>
      )}
    </div>
  );
}

export default UrlReader;
