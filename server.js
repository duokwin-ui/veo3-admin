const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = 3000;

// Middleware
app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database
const db = new sqlite3.Database('brain.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

app.get('/thanh-toan', (req, res) => {
  res.sendFile(path.join(__dirname, 'thanh-toan.html'));
});

// API Routes
// Products
app.get('/api/products', (req, res) => {
  db.all('SELECT * FROM products', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.get('/api/products/:id', (req, res) => {
  db.get('SELECT * FROM products WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(row);
  });
});

app.post('/api/products', (req, res) => {
  const { name, price, description, stock } = req.body;
  db.run('INSERT INTO products (name, price, description, stock) VALUES (?, ?, ?, ?)',
    [name, price, description, stock], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID });
  });
});

app.put('/api/products/:id', (req, res) => {
  const { name, price, description, stock } = req.body;
  db.run('UPDATE products SET name = ?, price = ?, description = ?, stock = ? WHERE id = ?',
    [name, price, description, stock, req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ changes: this.changes });
  });
});

app.delete('/api/products/:id', (req, res) => {
  db.run('DELETE FROM products WHERE id = ?', [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ changes: this.changes });
  });
});

// Customers
app.get('/api/customers', (req, res) => {
  db.all('SELECT * FROM customers', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.get('/api/customers/:id', (req, res) => {
  db.get('SELECT * FROM customers WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(row);
  });
});

app.post('/api/customers', (req, res) => {
  const { name, phone, zalo } = req.body;
  db.run('INSERT INTO customers (name, phone, zalo) VALUES (?, ?, ?)',
    [name, phone, zalo], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID });
  });
});

app.put('/api/customers/:id', (req, res) => {
  const { name, phone, zalo } = req.body;
  db.run('UPDATE customers SET name = ?, phone = ?, zalo = ? WHERE id = ?',
    [name, phone, zalo, req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ changes: this.changes });
  });
});

app.delete('/api/customers/:id', (req, res) => {
  db.run('DELETE FROM customers WHERE id = ?', [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ changes: this.changes });
  });
});

// Orders
app.get('/api/orders', (req, res) => {
  db.all('SELECT * FROM orders', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.get('/api/orders/:id', (req, res) => {
  db.get('SELECT * FROM orders WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(row);
  });
});

app.post('/api/orders', (req, res) => {
  const { customer_id, product_id, amount, status, payment_code } = req.body;
  
  // Check stock
  db.get('SELECT stock FROM products WHERE id = ?', [product_id], (err, product) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!product || product.stock < 1) return res.status(400).json({ error: 'Out of stock' });
    
    // Insert order
    db.run('INSERT INTO orders (customer_id, product_id, amount, status, payment_code) VALUES (?, ?, ?, ?, ?)',
      [customer_id, product_id, amount, status || 'pending', payment_code], function(err) {
      if (err) return res.status(500).json({ error: err.message });
      
      // Decrease stock
      db.run('UPDATE products SET stock = stock - 1 WHERE id = ?', [product_id], function(err) {
        if (err) console.error('Error updating stock:', err.message);
        res.json({ id: this.lastID });
      });
    });
  });
});

app.put('/api/orders/:id', (req, res) => {
  const { customer_id, product_id, amount, status, payment_code } = req.body;
  
  // Build dynamic update based on provided fields
  const updates = [];
  const values = [];
  
  if (customer_id !== undefined) { updates.push('customer_id = ?'); values.push(customer_id); }
  if (product_id !== undefined) { updates.push('product_id = ?'); values.push(product_id); }
  if (amount !== undefined) { updates.push('amount = ?'); values.push(amount); }
  if (status !== undefined) { updates.push('status = ?'); values.push(status); }
  if (payment_code !== undefined) { updates.push('payment_code = ?'); values.push(payment_code); }
  
  if (updates.length === 0) {
    return res.status(400).json({ error: 'No fields to update' });
  }
  
  values.push(req.params.id);
  const query = `UPDATE orders SET ${updates.join(', ')} WHERE id = ?`;
  
  db.run(query, values, function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ changes: this.changes });
  });
});

app.delete('/api/orders/:id', (req, res) => {
  db.run('DELETE FROM orders WHERE id = ?', [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ changes: this.changes });
  });
});

// Thanh toán
app.post('/api/thanh-toan/create', (req, res) => {
  const { name, phone, zalo, product_id } = req.body;
  
  if (!name || !phone || !product_id) {
    return res.status(400).json({ error: 'Thiếu thông tin bắt buộc' });
  }
  
  // Get product info
  db.get('SELECT * FROM products WHERE id = ?', [product_id], (err, product) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!product) return res.status(404).json({ error: 'Sản phẩm không tồn tại' });
    if (product.stock < 1) return res.status(400).json({ error: 'Hết hàng' });
    
    // Check if customer exists by phone
    db.get('SELECT id FROM customers WHERE phone = ?', [phone], (err, customer) => {
      if (err) return res.status(500).json({ error: err.message });
      
      const processOrder = (customerId) => {
        // Generate payment code
        const paymentCode = 'VEO3-' + Math.floor(Math.random() * 100000).toString().padStart(5, '0');
        
        // Create order
        db.run('INSERT INTO orders (customer_id, product_id, amount, status, payment_code) VALUES (?, ?, ?, ?, ?)',
          [customerId, product_id, product.price, 'pending', paymentCode], function(err) {
          if (err) return res.status(500).json({ error: err.message });
          
          // Decrease stock
          db.run('UPDATE products SET stock = stock - 1 WHERE id = ?', [product_id], function(err) {
            if (err) console.error('Error updating stock:', err.message);
            
            res.json({
              orderId: this.lastID,
              customerId: customerId,
              paymentCode: paymentCode,
              productName: product.name,
              productPrice: product.price,
              customerName: name,
              customerPhone: phone,
              customerZalo: zalo
            });
          });
        });
      };
      
      if (customer) {
        // Update customer if needed
        db.run('UPDATE customers SET name = ?, zalo = ? WHERE id = ?',
          [name, zalo, customer.id], (err) => {
          processOrder(customer.id);
        });
      } else {
        // Create new customer
        db.run('INSERT INTO customers (name, phone, zalo) VALUES (?, ?, ?)',
          [name, phone, zalo], function(err) {
          if (err) return res.status(500).json({ error: err.message });
          processOrder(this.lastID);
        });
      }
    });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});