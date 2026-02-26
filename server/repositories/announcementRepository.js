const db = require("../database/db_index");

// =======================
// GET ALL
// =======================
function getAll(search = "", category_id = null) {
  const where = [];
  const params = [];

  if (search && String(search).trim().length > 0) {
    where.push("(a.title LIKE ? OR a.body LIKE ?)");
    const like = `%${String(search).trim()}%`;
    params.push(like, like);
  }

  if (category_id) {
    where.push(`
      EXISTS (
        SELECT 1
        FROM announcement_categories ac2
        WHERE ac2.announcement_id = a.id
          AND ac2.category_id = ?
      )
    `);
    params.push(Number(category_id));
  }

  const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

  const announcements = db.prepare(`
    SELECT a.*
    FROM announcements a
    ${whereSql}
    ORDER BY a.last_update DESC
  `).all(...params);

  const stmtCats = db.prepare(`
    SELECT c.id, c.name
    FROM categories c
    JOIN announcement_categories ac ON ac.category_id = c.id
    WHERE ac.announcement_id = ?
    ORDER BY c.name
  `);

  return announcements.map((a) => ({
    ...a,
    categories: stmtCats.all(a.id),
  }));
}

// =======================
// GET BY ID
// =======================
function getById(id) {
  const a = db.prepare(`SELECT * FROM announcements WHERE id = ?`).get(id);
  if (!a) return null;

  const categories = db.prepare(`
    SELECT c.id, c.name
    FROM categories c
    JOIN announcement_categories ac ON ac.category_id = c.id
    WHERE ac.announcement_id = ?
    ORDER BY c.name
  `).all(id);

  return { ...a, categories };
}

// =======================
// CREATE
// =======================
function create(announcement) {
  const result = db.prepare(`INSERT INTO announcements (title, body, user_id, publication_date)VALUES (?, ?, ?, ?)`).run(
    announcement.title,
    announcement.body,
    announcement.user_id,
    announcement.publication_date
  );

  const announcementId = result.lastInsertRowid;

  // categories
  if (announcement.categories && announcement.categories.length > 0) {
    announcement.categories.forEach(name => {
      // create category if not exists
      db.prepare(`INSERT OR IGNORE INTO categories (name)VALUES (?)`).run(name);

      const category = db.prepare(`SELECT id FROM categories WHERE name = ?`).get(name);

      db.prepare(`INSERT INTO announcement_categories (announcement_id, category_id)VALUES (?, ?)`).run(announcementId, category.id);
    });
  }

  return getById(announcementId);
}

// =======================
// UPDATE
// =======================
function update(id, announcement) {
 db.prepare(`
  UPDATE announcements
  SET title = ?, body = ?, publication_date = ?, last_update = datetime('now')
  WHERE id = ?
`).run(announcement.title, announcement.body, announcement.publication_date, id);

// reset categories
db.prepare(`DELETE FROM announcement_categories WHERE announcement_id = ?`).run(id);

if (announcement.categories?.length) {
  const insert = db.prepare(`
    INSERT INTO announcement_categories (announcement_id, category_id)
    VALUES (?, ?)
  `);

  const uniqueCategoryIds = Array.from(
    new Set(announcement.categories.map((c) => c.id))
  );

  uniqueCategoryIds.forEach((categoryId) => {
    insert.run(id, categoryId);
  });
}

return getById(id);
}

// =======================
// DELETE
// =======================
function remove(id) {
  db.prepare(`DELETE FROM announcementsWHERE id = ?`).run(id);
}





module.exports = {
  getAll,
  getById,
  create,
  update,
  remove
};