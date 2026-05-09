const router = require("express").Router();
const { authenticate } = require("../middleware/auth");
const db = require("../models/db");

router.get("/me", authenticate, async (req, res, next) => {
  try {
    const { rows } = await db.query(
      "SELECT id,name,email,role,created_at FROM users WHERE id=$1", [req.user.id]
    );
    if (!rows.length) return res.status(404).json({ error: "Not found" });
    res.json(rows[0]);
  } catch (err) { next(err); }
});
module.exports = router;
