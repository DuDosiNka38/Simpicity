const Database = require("better-sqlite3");
const path = require("path");
const fileSystem = require("fs");

const dbPath = path.join(__dirname, "data/app.db");

fileSystem.mkdirSync(path.dirname(dbPath), { recursive: true });

const db = new Database(dbPath);

db.pragma("foreign_keys = ON");

const schemasDir = path.join(__dirname, "schemas");

if (fileSystem.existsSync(schemasDir)) {
  const files = fileSystem.readdirSync(schemasDir).filter((f) => f.endsWith(".sql")).sort();

  for (const file of files) {
    const sql = fileSystem.readFileSync(path.join(schemasDir, file), "utf8");
    db.exec(sql);
    console.log(`Schema applied: ${file}`);
  }
}


const seedsDir = path.join(__dirname, "seeds");

if (fileSystem.existsSync(seedsDir)) {
  const files = fileSystem.readdirSync(seedsDir).filter((f) => f.endsWith(".sql")).sort();

  for (const file of files) {
    const sql = fileSystem.readFileSync(path.join(seedsDir, file), "utf8");
    db.exec(sql);
    console.log(`Seed applied: ${file}`);
  }
}


module.exports = db;