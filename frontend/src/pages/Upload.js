import { useState } from "react";

function Upload() {
  const [fileName, setFileName] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setFileName(file.name);
    setLoading(true);
    setError("");
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/upload`, {
        method: "POST",
        headers: {
          Authorization: localStorage.getItem("token") || ""
        },
        body: formData
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      setResult(data);

    } catch (err) {
      console.error(err);
      setError("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "80px", padding: "20px" }}>
      <h1>Upload Document</h1>

      <input
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
      />

      {fileName && (
        <p style={{ marginTop: "20px" }}>
          Selected File: <strong>{fileName}</strong>
        </p>
      )}

      {loading && <p>Processing document...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {result && (
        <div
          style={{
            marginTop: "30px",
            maxWidth: "750px",
            marginLeft: "auto",
            marginRight: "auto",
            textAlign: "left",
            background: "#f9f9f9",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 0 12px rgba(0,0,0,0.08)",
            wordWrap: "break-word",
            overflowWrap: "break-word",
            whiteSpace: "pre-wrap",
            maxHeight: "350px",
            overflowY: "auto"
          }}
        >
          <h3 style={{ marginBottom: "10px" }}>Analysis Result</h3>

          <p>
            <strong>File:</strong> {result.fileName}
          </p>

          <p style={{ marginTop: "15px" }}>
            <strong>Summary:</strong>
          </p>

          <p style={{ lineHeight: "1.6" }}>
            {result.summary}
          </p>
        </div>
      )}
    </div>
  );
}

export default Upload;
