DROP TABLE IF EXISTS tasks;
CREATE TABLE tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  note TEXT,
  target_date TEXT NOT NULL,
  days_advance INTEGER DEFAULT 7,
  urgency TEXT CHECK(urgency IN ('Urgent', 'Normal')) DEFAULT 'Normal',
  status TEXT CHECK(status IN ('Active', 'Completed')) DEFAULT 'Active',
  last_reminded_at TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);
