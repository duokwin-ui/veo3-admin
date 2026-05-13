const sqlite3 = require('sqlite3').verbose();

// Connect to database
const db = new sqlite3.Database('brain.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

// Function to get count
function getCount(table) {
  return new Promise((resolve, reject) => {
    db.get(`SELECT COUNT(*) as count FROM ${table}`, (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row.count);
      }
    });
  });
}

// Function to get sample data
function getSample(table, limit = 5) {
  return new Promise((resolve, reject) => {
    db.all(`SELECT * FROM ${table} LIMIT ${limit}`, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

// Report
async function report() {
  try {
    const productCount = await getCount('products');
    console.log(`Số lượng products: ${productCount}`);
    const productSamples = await getSample('products', 5);
    if (productSamples.length > 0) {
      console.log('Dữ liệu mẫu products:');
      productSamples.forEach(product => {
        console.log(`- ID: ${product.id}, Name: ${product.name}, Price: ${product.price}, Stock: ${product.stock}`);
      });
    }

    const customerCount = await getCount('customers');
    console.log(`Số lượng customers: ${customerCount}`);
    const customerSamples = await getSample('customers', 5);
    if (customerSamples.length > 0) {
      console.log('Dữ liệu mẫu customers:');
      customerSamples.forEach(customer => {
        console.log(`- ID: ${customer.id}, Name: ${customer.name}, Phone: ${customer.phone}, Zalo: ${customer.zalo}`);
      });
    }

    const orderCount = await getCount('orders');
    console.log(`Số lượng orders: ${orderCount}`);
    const orderSamples = await getSample('orders', 5);
    if (orderSamples.length > 0) {
      console.log('Dữ liệu mẫu orders:');
      orderSamples.forEach(order => {
        console.log(`- ID: ${order.id}, Customer ID: ${order.customer_id}, Product ID: ${order.product_id}, Amount: ${order.amount}, Status: ${order.status}`);
      });
    }
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    db.close((err) => {
      if (err) {
        console.error('Error closing database:', err.message);
      } else {
        console.log('Database connection closed.');
      }
    });
  }
}

report();