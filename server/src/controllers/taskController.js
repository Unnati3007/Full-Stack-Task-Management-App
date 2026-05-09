const db = require("../models/db");

exports.getTasks = async (req, res, next) => {
  try {
    const { status, priority, assignee } = req.query;
    let q = "SELECT * FROM tasks WHERE 1=1";
    const p = [];
    if (status)   { p.push(status);   q += ` AND status=$${p.length}`; }
    if (priority) { p.push(priority); q += ` AND priority=$${p.length}`; }
    if (assignee) { p.push(assignee); q += ` AND assignee_id=$${p.length}`; }
    q += " ORDER BY created_at DESC";
    res.json((await db.query(q, p)).rows);
  } catch (err) { next(err); }
};

exports.createTask = async (req, res, next) => {
  try {
    const { title, description, priority, due_date, assignee_id } = req.body;
    if (!title) return res.status(400).json({ error: "Title required" });
    const { rows } = await db.query(
      `INSERT INTO tasks (title,description,priority,due_date,assignee_id,created_by,status)
       VALUES ($1,$2,$3,$4,$5,$6,'todo') RETURNING *`,
      [title, description, priority || "medium", due_date, assignee_id, req.user.id]
    );
    req.app.get("broadcast")?.({ type: "task_created", task: rows[0] });
    res.status(201).json(rows[0]);
  } catch (err) { next(err); }
};

exports.updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, status, priority, due_date, assignee_id } = req.body;
    const { rows } = await db.query(
      `UPDATE tasks SET title=COALESCE($1,title), description=COALESCE($2,description),
       status=COALESCE($3,status), priority=COALESCE($4,priority),
       due_date=COALESCE($5,due_date), assignee_id=COALESCE($6,assignee_id),
       updated_at=NOW() WHERE id=$7 RETURNING *`,
      [title, description, status, priority, due_date, assignee_id, id]
    );
    if (!rows.length) return res.status(404).json({ error: "Task not found" });
    req.app.get("broadcast")?.({ type: "task_updated", task: rows[0] });
    res.json(rows[0]);
  } catch (err) { next(err); }
};

exports.deleteTask = async (req, res, next) => {
  try {
    const { rows } = await db.query(
      "DELETE FROM tasks WHERE id=$1 RETURNING id", [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: "Task not found" });
    req.app.get("broadcast")?.({ type: "task_deleted", id: req.params.id });
    res.json({ message: "Deleted" });
  } catch (err) { next(err); }
};
