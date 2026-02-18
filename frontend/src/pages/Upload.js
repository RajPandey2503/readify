import { useState } from "react";

function Upload() {
  const [fileName, setFileName] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setFileName(file.name);
    setLoading(true);
    setError("");
    setResult(null);

    fetch(`${process.env.REACT_APP_API_URL}/upload`
, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fileName: file.name })
    })
      .then(res => res.json())
      .then(data => setResult(data))
      .catch(() => setError("Upload failed. Please try again."))
      .finally(() => setLoading(false));
  };

  return (
    <div style={{ textAlign: "center", marginTop: "80px" }}>
      <h1>Upload Document</h1>

      <input type="file" onChange={handleFileChange} />

      {fileName && (
        <p style={{ marginTop: "20px" }}>
          Selected File: <strong>{fileName}</strong>
        </p>
      )}

      {loading && <p>Processing document...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {result && (
        <div style={{ marginTop: "30px" }}>
          <h3>Analysis Result</h3>
          <p><strong>Type:</strong> {result.type}</p>
          <p><strong>Summary:</strong> {result.summary}</p>
        </div>
      )}
    </div>
  );
}

export default Upload;
