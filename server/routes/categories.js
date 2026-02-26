const router = require("express").Router();
const categoriesController = require("../controllers/categoriesController");


// GET /api/categories
router.get("/", categoriesController.getAll);


module.exports = router;
