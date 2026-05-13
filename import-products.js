const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

// Connect to database
const db = new sqlite3.Database('brain.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

// Function to parse price from Vietnamese display
function parsePrice(priceDisplay) {
  const match = priceDisplay.match(/(\d+(?:\.\d+)?)\s*Triệu/);
  if (match) {
    return parseFloat(match[1]) * 1000000;
  }
  return 0;
}

// Import products
const productsDir = path.join(__dirname, 'data', 'products');
const productFiles = ['standard.json', 'pro.json', 'advanced.json'];

db.serialize(() => {
  productFiles.forEach(file => {
    const filePath = path.join(productsDir, file);
    if (fs.existsSync(filePath)) {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      const price = parsePrice(data.price_display_vn || '0 Triệu');
      const description = data.headline || data.features ? data.features.join(', ') : '';

      db.run(`INSERT OR IGNORE INTO products (name, price, description, stock) VALUES (?, ?, ?, ?)`,
        [data.name, price, description, 100], // stock default 100
        function(err) {
          if (err) {
            console.error('Error inserting product:', err.message);
          } else {
            console.log(`Inserted product: ${data.name}`);
          }
        });
    }
  });
});

// Close the database connection
db.close((err) => {
  if (err) {
    console.error('Error closing database:', err.message);
  } else {
    console.log('Database connection closed.');
  }
});