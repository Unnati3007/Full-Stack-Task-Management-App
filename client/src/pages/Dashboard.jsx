import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { api } from "../api.js";
import { useTaskSocket } from "../hooks/useTaskSocket.js";
import Navbar from "../components/Navbar.jsx";
import TaskCard, { NEXT_STATUS } from "../components/TaskCard.jsx";
import TaskFormModal from "../components/TaskFormModal.jsx";

export default function Dashboard() {
  const { token } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [modalTask, setModalTask] = useState(null); // null = closed, {} = new, {...} = edit
  const [showModal, setShowModal] = useState(false);

  const loadTasks = async (filters = {}) => {
    setLoading(true);
    try {
      setTasks(await api.getTasks(token, filters));
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks(statusFilter ? { status: statusFilter } : {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  // Live updates from other tabs/users via the backend's WebSocket broadcast.
  useTaskSocket((msg) => {
    if (msg.type === "task_created") {
      setTasks((prev) => [msg.task, ...prev]);
    } else if (msg.type === "task_updated") {
      setTasks((prev) => prev.map((t) => (t.id === msg.task.id ? msg.task : t)));
    } else if (msg.type === "task_deleted") {
      setTasks((prev) => prev.filter((t) => String(t.id) !== String(msg.id)));
    }
  });

  const openNew = () => {
    setModalTask(null);
    setShowModal(true);
  };

  const openEdit = (task) => {
    setModalTask(task);
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  const handleSubmit = async (form) => {
    if (modalTask) {
      await api.updateTask(token, modalTask.id, form);
    } else {
      await api.createTask(token, form);
    }
    setShowModal(false);
  };

  const handleDelete = async (task) => {
    if (!confirm(`Delete "${task.title}"?`)) return;
    try {
      await api.deleteTask(token, task.id);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAdvanceStatus = async (task) => {
    const next = NEXT_STATUS[task.status] || "todo";
    try {
      await api.updateTask(token, task.id, { status: next });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-canvas">
      <Navbar />

      <main className="mx-auto max-w-5xl px-6 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex gap-2">
            {["", "todo", "in_progress", "done"].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                  statusFilter === s ? "bg-ink text-white" : "bg-white text-ink/60 border border-ink/10"
                }`}
              >
                {s === "" ? "All" : s === "todo" ? "To do" : s === "in_progress" ? "In progress" : "Done"}
              </button>
            ))}
          </div>

          <button
            onClick={openNew}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent/90"
          >
            + New task
          </button>
        </div>

        {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

        {loading ? (
          <p className="text-ink/50">Loading tasks…</p>
        ) : tasks.length === 0 ? (
          <div className="rounded-xl border border-dashed border-ink/15 p-10 text-center text-ink/50">
            No tasks yet. Click "New task" to add one.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={openEdit}
                onDelete={handleDelete}
                onAdvanceStatus={handleAdvanceStatus}
              />
            ))}
          </div>
        )}
      </main>

      {showModal && (
        <TaskFormModal initial={modalTask} onClose={closeModal} onSubmit={handleSubmit} />
      )}
    </div>
  );
}
