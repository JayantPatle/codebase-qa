import { useState } from "react";
import api from "../api/api";


function Upload({ onSuccess }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await api.post("/upload", formData);
      setSuccess("Uploaded: " + res.data.repoName);
      setFile(null);
      if (onSuccess) onSuccess(res.data.repoName);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Upload Repo ZIP</h2>
      <div className="form-row">
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <button className="btn" onClick={handleUpload} disabled={loading}>
          {loading ? "Uploading..." : "Upload"}
        </button>
      </div>
      {error && <div className="message error">❌ {error}</div>}
      {success && <div className="message success">✅ {success}</div>}
    </div>
  );
}

export default Upload;