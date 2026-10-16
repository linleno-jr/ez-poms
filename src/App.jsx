import { useEffect, useState } from "react";
import PomRow from "./components/PomRow.jsx";
import { countWords, getStatus } from "./wordCount.js";
import { exportDocx, exportPdf } from "./exporters.js";

const STORAGE_KEY = "ez-poms-v1";

const newId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : String(Date.now()) + Math.random().toString(16).slice(2);

const newPom = () => ({ id: newId(), title: "", text: "" });

function loadSaved() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      if (Array.isArray(data.poms) && data.poms.length > 0) {
        return { poms: data.poms, goal: data.goal ?? "" };
      }
    }
  } catch {
    // Storage unavailable or corrupted: start fresh.
  }
  return { poms: [newPom()], goal: "" };
}

export default function App() {
  const [{ poms, goal }, setState] = useState(loadSaved);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ poms, goal }));
    } catch {
      // Ignore storage errors; the app still works without saving.
    }
  }, [poms, goal]);

  const setPoms = (fn) => setState((s) => ({ ...s, poms: fn(s.poms) }));
  const setGoal = (value) => setState((s) => ({ ...s, goal: value }));

  const addPom = () => setPoms((list) => [...list, newPom()]);
  const updatePom = (updated) =>
    setPoms((list) => list.map((p) => (p.id === updated.id ? updated : p)));
  const removePom = (id) => setPoms((list) => list.filter((p) => p.id !== id));

  const validCount = poms.filter((p) => getStatus(countWords(p.text)) === "valid").length;
  const exportable = poms.filter((p) => p.text.trim());

  return (
    <>
      <header className="taskbar">
        <h1 className="brand">Ez Poms</h1>
        <div className="progress" aria-live="polite">
          <span className="progress-count">{validCount}</span>
          <span>valid {validCount === 1 ? "POM" : "POMs"}</span>
          <label className="goal">
            <span>of</span>
            <input
              type="number"
              min="0"
              inputMode="numeric"
              value={goal}
              placeholder="goal"
              aria-label="Number of POMs required"
              onChange={(e) => setGoal(e.target.value)}
            />
          </label>
        </div>
      </header>

      <main className="page">
        <p className="rule">
          Each POM should be more than 25 words and no more than 40.
        </p>

        <ul className="pom-list">
          {poms.map((pom) => (
            <PomRow
              key={pom.id}
              pom={pom}
              onChange={updatePom}
              onRemove={() => removePom(pom.id)}
            />
          ))}
        </ul>

        <button className="btn btn-primary add" onClick={addPom}>
          Add a POM
        </button>
      </main>

      <footer className="export">
        <p>Export your POMs</p>
        <div className="export-buttons">
          <button
            className="btn btn-outline"
            disabled={exportable.length === 0}
            onClick={() => exportDocx(exportable)}
          >
            Download .docx
          </button>
          <button
            className="btn btn-outline"
            disabled={exportable.length === 0}
            onClick={() => exportPdf(exportable)}
          >
            Download .pdf
          </button>
        </div>
      </footer>
    </>
  );
}
