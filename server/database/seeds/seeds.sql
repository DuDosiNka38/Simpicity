-- =========================
-- Seed: Users
-- =========================

INSERT OR IGNORE INTO users ( name, email, password_hash)
VALUES
('Demo User', 'demo@mail.com', 'demo'),
('Demo User_2', 'demo_2@mail.com', 'demo_2');


-- =====================================
-- Seed: Categories
-- =====================================

INSERT OR IGNORE INTO categories (id, name) VALUES
(1, 'General'),
(2, 'Important'),
(3, 'Study'),
(4, 'Backend'),
(5, 'Frontend');


-- =====================================
-- Seed: Announcements
-- =====================================

INSERT OR IGNORE INTO announcements
(id, title, body, publication_date, user_id, last_update)
VALUES
(
  1,
  'Learn Express',
  'Build a basic REST API using Express and SQLite.',
  '01/15/2026 10:00',
  1,
  datetime('now')
),
(
  2,
  'React Table Implementation',
  'Create announcements table using react-table and sorting.',
  '01/18/2026 14:30',
  1,
  datetime('now')
),
(
  3,
  'Project Deadline',
  'Final project must be submitted by the end of the month.',
  '01/20/2026 09:00',
  1,
  datetime('now')
),
(
  4,
  'UI Improvements',
  'Apply Lato font and improve overall layout according to Figma.',
  '01/22/2026 16:15',
  2,
  datetime('now')
),
(
  5,
  'Backend Filtering',
  'Implement category filtering and text search for announcements.',
  '01/25/2026 11:45',
  2,
  datetime('now')
);


-- =====================================
-- Seed: Announcement ↔ Categories
-- =====================================

INSERT OR IGNORE INTO announcement_categories (announcement_id, category_id) VALUES
-- Announcement 1
(1, 3),
(1, 4),

-- Announcement 2
(2, 5),

-- Announcement 3
(3, 2),

-- Announcement 4
(4, 5),
(4, 1),

-- Announcement 5
(5, 4),
(5, 1);