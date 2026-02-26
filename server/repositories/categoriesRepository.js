const db = require("../database/db_index");
function getAllCategories() {
  return db.prepare(`SELECT * FROM categories c`).all();
}

module.exports = {
  getAllCategories
}