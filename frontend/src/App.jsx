import { useState, useEffect } from "react";

import Upload from "./components/Upload";
import Ask from "./components/Ask";
import Status from "./components/Status";
import api from "./api/api";


function App() {
  const [lastRepo, setLastRepo] = useState("");
  const [repos, setRepos] = useState([]);

  // Fetch repo list on mount and after upload
  const fetchRepos = async () => {
    try {
      const res = await api.get("/repos");
      setRepos(res.data.map(r => r.repoName || r));
    } catch (err) {
      setRepos([]);
    }
  };

  useEffect(() => {
    fetchRepos();
  }, []);

  const handleUploadSuccess = (repoName) => {
    setLastRepo(repoName);
    fetchRepos();
  };

  return (
    <div className="app-wrap">
      <div className="app-header">
        <h1 className="app-title">Codebase Q&amp;A</h1>
      </div>
      <div className="section card">
        <Upload onSuccess={handleUploadSuccess} />
      </div>

      <div className="section card">
        <Ask repoName={lastRepo} setRepoName={setLastRepo} repos={repos} />
      </div>

      <div className="section card">
        <Status />
      </div>
      
    </div>
  );
}

export default App;