const sqlite3 = require('sqlite3').verbose();

// Connect to database
const db = new sqlite3.Database('brain.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

// Create tables
db.serialize(() => {
  // Products table
  db.run(`CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    description TEXT,
    stock INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Customers table
  db.run(`CREATE TABLE IF NOT EXISTS customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    zalo TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    telegram_notified_at DATETIME
  )`);

  // Migration: Add telegram_notified_at column if it doesn't exist
  db.run(`ALTER TABLE customers ADD COLUMN telegram_notified_at DATETIME`, (err) => {
    if (err && !err.message.includes('duplicate column name')) {
      console.log('Migration note:', err.message);
    }
  });

  // Orders table
  db.run(`CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id INTEGER,
    product_id INTEGER,
    amount REAL,
    status TEXT DEFAULT 'pending',
    payment_code TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    paid_at DATETIME,
    FOREIGN KEY (customer_id) REFERENCES customers (id),
    FOREIGN KEY (product_id) REFERENCES products (id)
  )`);

  console.log('Tables created successfully.');
});

// Close the database connection
db.close((err) => {
  if (err) {
    console.error('Error closing database:', err.message);
  } else {
    console.log('Database connection closed.');
  }
});