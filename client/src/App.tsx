import { useEffect, useMemo, useState } from "react";
import "./App.css";

type ChatItem = {
  id: string;
  prompt: string;
  response: string;
  createdAt: number;
};

const STORAGE_KEY = "ai_prompt_history_v1";

export default function App() {
  const [prompt, setPrompt] = useState("");
  const [history, setHistory] = useState<ChatItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      setHistory(JSON.parse(raw));
    } catch {
      // ignore corrupted storage
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  }, [history]);

  const canSubmit = useMemo(() => prompt.trim().length > 0 && !loading, [prompt, loading]);

  async function submitPrompt(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const p = prompt.trim();
    if (!p) return;

    setLoading(true);
    try {
      const resp = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: p })
      });

      const data = await resp.json();
      if (!resp.ok) throw new Error(data?.error || "Request failed");

      const item: ChatItem = {
        id: crypto.randomUUID(),
        prompt: p,
        response: data.text ?? "",
        createdAt: Date.now()
      };

      setHistory((prev) => [item, ...prev]);
      setPrompt("");
    } catch (err: any) {
      setError(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function clearAll() {
    setPrompt("");
    setError(null);
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  }

  return (
    <div className="page">
      <header className="header">
        <h1>AI Prompt App</h1>
        <p className="sub">Prompt in, response out. History included.</p>
      </header>

      <main className="grid">
        <section className="card">
          <form onSubmit={submitPrompt}>
            <label className="label" htmlFor="prompt">Prompt</label>
            <textarea
              id="prompt"
              className="textarea"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ask something..."
              rows={6}
            />

            <div className="row">
              <button className="btn" type="submit" disabled={!canSubmit}>
                {loading ? "Generating..." : "Submit"}
              </button>
              <button className="btn secondary" type="button" onClick={clearAll}>
                Clear
              </button>
            </div>

            {error && <p className="error" role="alert">{error}</p>}
          </form>
        </section>

        <section className="card">
          <h2>History</h2>
          {history.length === 0 ? (
            <p className="muted">No prompts yet.</p>
          ) : (
            <ul className="list">
              {history.map((h) => (
                <li key={h.id} className="item">
                  <div className="meta">
                    <span className="pill">Prompt</span>
                    <span className="time">{new Date(h.createdAt).toLocaleString()}</span>
                  </div>
                  <pre className="block">{h.prompt}</pre>
                  <div className="meta">
                    <span className="pill">Response</span>
                  </div>
                  <pre className="block">{h.response}</pre>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
