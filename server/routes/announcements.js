const router = require("express").Router();
const auth = require("../middleware/auth_middleware");
const announcementsController = require("../controllers/announcementsController");

// /api/announcements
//router.use(auth);

// GET /api/announcements?q=text&category_id
router.get("/", announcementsController.getAll);

// GET /api/announcements/:id
router.get("/:id", announcementsController.getOne);

// POST /api/announcements
router.post("/", announcementsController.create);

// PUT /api/announcements/:id
router.put("/:id", announcementsController.update);

// DELETE /api/announcements/:id
router.delete("/:id", announcementsController.remove);


module.exports = router;
