const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../models/db");

const makeTokens = (user) => ({
  access: jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  ),
  refresh: jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" }),
});

exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ error: "All fields required" });
    if ((await db.query("SELECT id FROM users WHERE email=$1", [email])).rows.length)
      return res.status(409).json({ error: "Email already registered" });
    const hash = await bcrypt.hash(password, 12);
    const { rows } = await db.query(
      "INSERT INTO users (name,email,password_hash,role) VALUES ($1,$2,$3,'member') RETURNING id,name,email,role",
      [name, email, hash]
    );
    res.status(201).json({ user: rows[0], ...makeTokens(rows[0]) });
  } catch (err) { next(err); }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { rows } = await db.query("SELECT * FROM users WHERE email=$1", [email]);
    if (!rows[0] || !(await bcrypt.compare(password, rows[0].password_hash)))
      return res.status(401).json({ error: "Invalid credentials" });
    const u = rows[0];
    res.json({ user: { id: u.id, name: u.name, email: u.email, role: u.role }, ...makeTokens(u) });
  } catch (err) { next(err); }
};
