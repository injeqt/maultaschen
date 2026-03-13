import type { StatusViewModel } from "../types/status";

type StatusPanelProps = {
  status: StatusViewModel;
};

export function StatusPanel({ status }: StatusPanelProps) {
  return (
    <div className="answer-panel">
      <p className="answer-word">{status.answer}</p>
      <h2>{status.headline}</h2>
      <p className="answer-copy">{status.copy}</p>
    </div>
  );
}
