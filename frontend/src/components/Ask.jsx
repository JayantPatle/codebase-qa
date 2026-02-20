
import { useState, useEffect } from "react";
import api from "../api/api";

function Ask({ repoName, setRepoName, repos }) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [references, setReferences] = useState([]);
  const [snippet, setSnippet] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (repoName && !repos.includes(repoName)) {
      setRepoName("");
    }
  }, [repos]);

  useEffect(() => {
    fetchHistory();
  }, [repoName]);

  const fetchHistory = async () => {
    if (!repoName) return;
    try {
      const res = await api.get(`/ask/history/${encodeURIComponent(repoName)}`);
      setHistory(res.data || []);
    } catch (err) {
      // ignore
    }
  };


  const handleAsk = async () => {
    if (!repoName || !question) {
      setError("Please select a repo and enter a question");
      return;
    }

    setLoading(true);
    setError(null);
    setAnswer("");

    try {
      const res = await api.post("/ask", { repoName, question });
      setAnswer(res.data.answer || "");
      setReferences(res.data.references || []);
      // refresh history so the new Q&A appears immediately
      await fetchHistory();
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to get answer");
    } finally {
      setLoading(false);
    }
  };

  // refactor suggestion feature removed

  const handleShowSnippet = async (ref) => {
    try {
      setSnippet(null);
      const res = await api.get(`/repos/${encodeURIComponent(repoName)}/file`, {
        params: { path: ref.filePath, startLine: ref.startLine, endLine: ref.endLine }
      });
      setSnippet({ filePath: ref.filePath, startLine: res.data.startLine, endLine: res.data.endLine, content: res.data.content });
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch snippet');
    }
  };

  return (
    <div>
      <h2>Ask Question</h2>
      <div className="form-row">
        <select value={repoName} onChange={e => setRepoName(e.target.value)}>
          <option value="">Select Repo</option>
          {repos.map(r => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
        <input
          placeholder="Your Question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <button className="btn" onClick={handleAsk} disabled={loading}>
          {loading ? "Asking..." : "Ask"}
        </button>
        
      </div>
      {error && <div className="message error">❌ {error}</div>}
      {answer && <div className="answer"><strong>Answer:</strong> <div style={{whiteSpace:'pre-wrap'}}>{answer}</div></div>}
      {references && references.length > 0 && (
        <div className="references">
          <h3>References</h3>
          <ul>
            {references.map((r, i) => (
              <li key={i}>
                <button className="link-btn" onClick={() => handleShowSnippet(r)}>
                  {r.filePath} [{r.startLine}-{r.endLine}]
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {snippet && (
        <div className="snippet card">
          <h4>{snippet.filePath} ({snippet.startLine}-{snippet.endLine})</h4>
          <pre className="code-block">{snippet.content}</pre>
        </div>
      )}

      {history && history.length > 0 && (
        <div className="history card">
          <h3>Recent Q&amp;A</h3>
          <ul>
            {history.map(h => (
              <li key={h._id}>
                <button className="link-btn" onClick={() => { setQuestion(h.question); setAnswer(h.answer); setReferences(h.references || []); }}>{h.question}</button>
                <div className="meta">{new Date(h.createdAt).toLocaleString()}</div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Ask;