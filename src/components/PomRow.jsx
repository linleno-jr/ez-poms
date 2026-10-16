import { useState } from "react";
import { countWords, getStatus, MIN_WORDS, MAX_WORDS } from "../wordCount.js";

const HINTS = {
  short: `Needs at least ${MIN_WORDS} words`,
  long: `Over the ${MAX_WORDS}-word limit`,
  valid: "Valid",
};

export default function PomRow({ pom, onChange, onRemove }) {
  const [confirming, setConfirming] = useState(false);
  const count = countWords(pom.text);
  const status = getStatus(count);

  return (
    <li className="pom">
      <div className={`pom-count ${status === "valid" ? "is-valid" : "is-invalid"}`}>
        <span className="pom-count-number">{count}</span>
        <span className="pom-count-label">{count === 1 ? "word" : "words"}</span>
        <span className="pom-count-hint">{HINTS[status]}</span>
      </div>

      <div className="pom-body">
        <input
          className="pom-title"
          type="text"
          value={pom.title}
          placeholder="Title (optional)"
          aria-label="POM title (optional)"
          onChange={(e) => onChange({ ...pom, title: e.target.value })}
        />
        <textarea
          className="pom-text"
          value={pom.text}
          placeholder="Summarize the main point from your textbook here…"
          aria-label="POM text"
          rows={4}
          onChange={(e) => onChange({ ...pom, text: e.target.value })}
        />
      </div>

      <div className="pom-actions">
        {confirming ? (
          <div className="confirm" role="alertdialog" aria-label="Confirm removal">
            <p>Are you sure?</p>
            <div className="confirm-buttons">
              <button className="btn btn-danger" onClick={onRemove}>
                Yes, remove
              </button>
              <button className="btn btn-quiet" onClick={() => setConfirming(false)}>
                Keep it
              </button>
            </div>
          </div>
        ) : (
          <button className="btn btn-quiet" onClick={() => setConfirming(true)}>
            Remove
          </button>
        )}
      </div>
    </li>
  );
}
