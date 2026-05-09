const router = require("express").Router();
const { authenticate } = require("../middleware/auth");
const c = require("../controllers/taskController");
router.use(authenticate);
router.get("/",     c.getTasks);
router.post("/",    c.createTask);
router.put("/:id",  c.updateTask);
router.delete("/:id", c.deleteTask);
module.exports = router;
