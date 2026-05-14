const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const https = require('https');

const customFetch = global.fetch || ((url, options = {}) => new Promise((resolve, reject) => {
  const parsedUrl = new URL(url);
  const requestOptions = {
    method: options.method || 'GET',
    hostname: parsedUrl.hostname,
    port: parsedUrl.port || 443,
    path: parsedUrl.pathname + parsedUrl.search,
    headers: options.headers || {},
  };

  const req = https.request(requestOptions, (res) => {
    let body = '';
    res.on('data', chunk => body += chunk);
    res.on('end', () => {
      resolve({
        ok: res.statusCode >= 200 && res.statusCode < 300,
        status: res.statusCode,
        json: async () => JSON.parse(body || '{}'),
        text: async () => body,
      });
    });
  });

  req.on('error', reject);
  if (options.body) req.write(options.body);
  req.end();
}));

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
        const paymentCode = 'VEO' + Math.floor(Math.random() * 100000).toString().padStart(5, '0');
        
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

// Check SePay payment status
app.get('/api/check-payment/:paymentCode', async (req, res) => {
  const { paymentCode } = req.params;
  const sepayApiKey = process.env.SEPAY_API_KEY;

  if (!sepayApiKey) {
    return res.status(500).json({ success: false, error: 'SEPAY_API_KEY is not configured' });
  }

  const sepayUrl = 'https://my.sepay.vn/userapi/transactions/list';
  console.log('[check-payment] Calling SePay:', sepayUrl);

  // Helper to extract transaction amount
  const getTransactionAmount = (tx) => {
    return parseFloat(tx.amount_in || tx.amount || tx.transfer_amount || tx.money || tx.total || 0);
  };

  // Helper to extract transaction content
  const getTransactionContent = (tx) => {
    return ((tx.transaction_content || tx.content || tx.description || tx.transfer_content) || '').toString();
  };

  try {
    const response = await customFetch(sepayUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${sepayApiKey}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('[check-payment] SePay status:', response.status);

    const text = await response.text();
    if (!response.ok) {
      console.error('[check-payment] SePay error body:', text);
      return res.status(502).json({ success: false, error: 'SePay API error', detail: text });
    }

    let result;
    try {
      result = JSON.parse(text || '{}');
    } catch (parseError) {
      console.error('[check-payment] JSON parse error:', parseError.message);
      return res.status(502).json({ success: false, error: 'Invalid JSON from SePay', detail: text });
    }

    const transactions = Array.isArray(result.data)
      ? result.data
      : Array.isArray(result.transactions)
        ? result.transactions
        : Array.isArray(result.list)
          ? result.list
          : Array.isArray(result)
            ? result
            : [];

    console.log('[check-payment] Total transactions from SePay:', transactions.length);

    // Normalize paymentCode
    const codeRaw = paymentCode.trim().toUpperCase();
    const codeNormalized = codeRaw.replace(/[^A-Z0-9]/g, '');
    console.log('[check-payment] Normalized paymentCode:', codeNormalized);

    // Check if found by normalized content match
    const foundTransactionByContent = transactions.find(tx => {
      const contentRaw = String(tx.transaction_content || tx.content || tx.description || tx.transfer_content || '').toUpperCase();
      const contentNormalized = contentRaw.replace(/[^A-Z0-9]/g, '');
      const match = contentRaw.includes(codeRaw) || contentNormalized.includes(codeNormalized);
      if (match) {
        console.log('[check-payment] Content match found:', contentRaw);
      }
      return match;
    });

    if (foundTransactionByContent) {
      console.log('[check-payment] Found transaction by normalized content, transaction id:', foundTransactionByContent.id);
      db.run(
        'UPDATE orders SET status = ? WHERE payment_code = ? AND status = ?',
        ['success', paymentCode, 'pending'],
        function (err) {
          if (err) {
            console.error('[check-payment] DB update error:', err.stack || err.message);
            return res.status(500).json({ success: false, error: err.message });
          }
          return res.json({ success: true, paid: true, matchedBy: 'normalized-content', transactionId: foundTransactionByContent.id });
        }
      );
      return;
    }

    console.log('[check-payment] No match found by content');
    return res.json({
      success: true,
      paid: false,
      reason: "paymentCode not found in transaction content"
    });
  } catch (error) {
    console.error('[check-payment] catch error:', error.stack || error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});