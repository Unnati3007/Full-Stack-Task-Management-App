import React from "react";

const STATUS_STYLES = {
  todo: "bg-slate-100 text-slate-700",
  in_progress: "bg-blue-100 text-blue-700",
  done: "bg-emerald-100 text-emerald-700",
};

const PRIORITY_STYLES = {
  low: "bg-ink/5 text-ink/50",
  medium: "bg-accentSoft text-accent",
  high: "bg-red-100 text-red-700",
};

const NEXT_STATUS = { todo: "in_progress", in_progress: "done", done: "todo" };
const STATUS_LABEL = { todo: "To do", in_progress: "In progress", done: "Done" };

export default function TaskCard({ task, onEdit, onDelete, onAdvanceStatus }) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-ink/10 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-medium text-ink">{task.title}</h3>
        <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${PRIORITY_STYLES[task.priority] || PRIORITY_STYLES.medium}`}>
          {task.priority}
        </span>
      </div>

      {task.description && (
        <p className="text-sm text-ink/60 line-clamp-3">{task.description}</p>
      )}

      <div className="flex items-center justify-between pt-1">
        <button
          onClick={() => onAdvanceStatus(task)}
          className={`rounded-full px-2.5 py-1 text-xs font-medium transition hover:opacity-80 ${STATUS_STYLES[task.status] || STATUS_STYLES.todo}`}
          title="Click to advance status"
        >
          {STATUS_LABEL[task.status] || task.status}
        </button>

        <div className="flex gap-2 text-sm">
          <button onClick={() => onEdit(task)} className="text-ink/50 hover:text-ink">
            Edit
          </button>
          <button onClick={() => onDelete(task)} className="text-ink/50 hover:text-red-600">
            Delete
          </button>
        </div>
      </div>

      {task.due_date && (
        <p className="text-xs text-ink/40">Due {new Date(task.due_date).toLocaleDateString()}</p>
      )}
    </div>
  );
}

export { NEXT_STATUS };
