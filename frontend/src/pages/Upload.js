import { useState } from "react";

function Upload() {
  const [fileName, setFileName] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
    }
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
    </div>
  );
}

export default Upload;
