require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const https = require('https');
const fs = require('fs');
const { Resend } = require('resend');

// Initialize Resend
let resend;
const resendApiKey = process.env.RESEND_API_KEY;
const fromEmail = process.env.FROM_EMAIL;

if (!resendApiKey) {
  console.error('CRITICAL ERROR: RESEND_API_KEY environment variable is missing. Email features will be disabled.');
} else if (!fromEmail) {
  console.error('CRITICAL ERROR: FROM_EMAIL environment variable is missing. Email features will be disabled.');
} else {
  try {
    resend = new Resend(resendApiKey);
    console.log(`Resend initialized with FROM_EMAIL: ${fromEmail}`);
  } catch (err) {
    console.error('Error initializing Resend:', err.message);
  }
}

// --- TELEGRAM AUTO REPLY (POLLING) ---
let lastUpdateId = 0;

async function sendTelegramReply(chatId, text) {
  const url = `https://api.telegram.org/bot${telegramBotToken}/sendMessage`;
  try {
    const response = await customFetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: text
      })
    });
    const data = await response.json();
    if (data.ok) {
      console.log('[POLLING] reply sent');
    } else {
      console.error('[POLLING] error - failed to send reply:', data.description);
    }
    return data.ok === true;
  } catch (err) {
    console.error('[POLLING] error:', err.message);
    return false;
  }
}

async function pollTelegram() {
  if (!telegramBotToken) return;

  try {
    const url = `https://api.telegram.org/bot${telegramBotToken}/getUpdates?offset=${lastUpdateId + 1}&timeout=5`;
    const response = await customFetch(url);
    const data = await response.json();

    if (data.ok && data.result && data.result.length > 0) {
      for (const update of data.result) {
        // Move lastUpdateId AFTER processing to avoid duplicate processing
        const updateId = update.update_id;

        if (update.message && update.message.text) {
          const chatId = update.message.chat.id;
          const rawText = update.message.text.toLowerCase().trim();
          // Strip trailing punctuation for matching
          const text = rawText.replace(/[?!.,]+$/, '');

          console.log(`[POLLING] received text = "${text}"`);

          // Only respond if chatId matches TELEGRAM_CHAT_ID
          if (telegramChatId && String(chatId) !== String(telegramChatId)) {
            lastUpdateId = updateId;
            continue;
          }

          // Who-are-you triggers
          if (
            text === 'bạn là ai' ||
            text === 'ban la ai' ||
            text === 'who are you'
          ) {
            console.log('[POLLING] matched who-are-you');
            const reply = 'Tôi là VEO3 Notify Bot 🔥 — trợ lý AI đồng hành cùng Duôk trong hệ thống MMO, AI content và automation. Tôi hỗ trợ quản lý khách hàng, nội dung, workflow và các tác vụ tự động hóa.';
            await sendTelegramReply(chatId, reply);
          }
        }

        // Set lastUpdateId AFTER all processing for this update is done
        lastUpdateId = updateId;
      }
    }
  } catch (err) {
    console.error('[POLLING] error:', err.message);
  }
}

function startTelegramPolling() {
  if (!telegramBotToken) return;

  console.log('[POLLING] started');
  setInterval(pollTelegram, 3000);
}
// --- END TELEGRAM AUTO REPLY ---

// Initialize Telegram
const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
const telegramChatId = process.env.TELEGRAM_CHAT_ID;

console.log('[STARTUP] Checking Telegram configuration...');
console.log('[STARTUP] TELEGRAM_BOT_TOKEN:', telegramBotToken ? `SET (${telegramBotToken.substring(0, 10)}...)` : 'NOT SET');
console.log('[STARTUP] TELEGRAM_CHAT_ID:', telegramChatId ? 'SET' : 'NOT SET');

if (!telegramBotToken) {
  console.log('[STARTUP] ⚠️  TELEGRAM_BOT_TOKEN not configured - Telegram notifications disabled');
} else if (!telegramChatId) {
  console.log('[STARTUP] ⚠️  TELEGRAM_CHAT_ID not configured - Telegram notifications disabled');
} else {
  console.log('[STARTUP] ✅ Telegram notification configured and ready');
  startTelegramPolling(); // Start polling for incoming messages
}

// --- TELEGRAM NOTIFICATION HELPER ---
async function sendTelegramNotification(customerData) {
  // Skip if Telegram not configured
  if (!telegramBotToken || !telegramChatId) {
    console.log('[Telegram] Not configured, skipping notification');
    return { success: false, reason: 'not_configured' };
  }

  const { name, phone, email, zalo } = customerData;

  // Format timestamp
  const now = new Date();
  const timeStr = now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  const dateStr = now.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });

  // Build message with nice formatting
  const message = `🆕 <b>Khách hàng mới!</b>

👤 <b>Tên:</b> ${name || 'N/A'}
📱 <b>Phone:</b> ${phone || 'N/A'}
📧 <b>Email:</b> ${email || 'N/A'}
💬 <b>Zalo:</b> ${zalo || 'N/A'}
⏰ <b>Thời gian:</b> ${timeStr} - ${dateStr}`;

  const url = `https://api.telegram.org/bot${telegramBotToken}/sendMessage`;

  try {
    const response = await customFetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: telegramChatId,
        text: message,
        parse_mode: 'HTML'
      })
    });

    const data = await response.json();

    if (response.ok && data.ok) {
      console.log(`[Telegram] Notification sent successfully for: ${name} (${phone})`);
      return { success: true };
    } else {
      console.error(`[Telegram] API error:`, data.description || data);
      return { success: false, reason: 'api_error', detail: data.description };
    }
  } catch (err) {
    console.error(`[Telegram] Failed to send notification:`, err.message);
    return { success: false, reason: 'network_error', detail: err.message };
  }
}
// --- END TELEGRAM NOTIFICATION HELPER ---

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
app.use('/digital-product', express.static(path.join(__dirname, 'digital-product')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Digital product landing page route
app.get('/ai-content-starter-kit', (req, res) => {
  res.sendFile(path.join(__dirname, 'digital-product', 'index.html'));
});

// Digital product checkout route
app.get('/ai-content-starter-kit/checkout', (req, res) => {
  res.sendFile(path.join(__dirname, 'digital-product', 'checkout.html'));
});

// Digital product thank you route (verify payment before showing download)
app.get('/ai-content-starter-kit/cam-on', (req, res) => {
  res.sendFile(path.join(__dirname, 'digital-product', 'cam-on.html'));
});

// Digital product PDF download route
app.get('/download-ai-kit', (req, res) => {
  const pdfPath = path.join(__dirname, 'digital-product', 'product-assets', 'AI-Content-Automation-Starter-Kit.pdf');
  const fs = require('fs');
  
  if (!fs.existsSync(pdfPath)) {
    console.error('[DOWNLOAD] File not found:', pdfPath);
    return res.status(404).json({ error: 'File not found' });
  }
  
  console.log('[DOWNLOAD] Serving PDF:', pdfPath);
  res.download(pdfPath, 'AI-Content-Automation-Starter-Kit.pdf');
});

// ==========================================
// DIGITAL PRODUCT CHECKOUT API
// ==========================================

// Hardcoded digital product info (no stock management needed)
const DIGITAL_PRODUCT = {
  id: 'digital-ai-kit',
  name: 'AI Content Automation Starter Kit',
  price: 149000,
  description: 'Workflow Content AI Cho Người Mới'
};

// NOTE: Migrations for digital product columns are in the Database section below
// API: Create digital product order
app.post('/api/digital/create', (req, res) => {
  const { name, email } = req.body;
  
  console.log('[DIGITAL] Create order - name:', name, 'email:', email);
  
  if (!name || !email) {
    return res.status(400).json({ error: 'Thiếu thông tin bắt buộc' });
  }
  
  // Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Email không đúng định dạng' });
  }
  
  // Generate payment code
  const paymentCode = 'AIK' + Math.floor(Math.random() * 100000).toString().padStart(5, '0');
  console.log('[DIGITAL] Generated paymentCode:', paymentCode);
  
  // Store order in database
  db.run(
    'INSERT INTO orders (customer_id, product_id, amount, status, payment_code, customer_name, customer_email) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [0, DIGITAL_PRODUCT.id, DIGITAL_PRODUCT.price, 'pending', paymentCode, name, email],
    function(err) {
      if (err) {
        console.error('[DIGITAL] ERROR: Order insert failed:', err.message);
        return res.status(500).json({ error: err.message });
      }
      
      console.log('[DIGITAL] Order created, id:', this.lastID);
      
      res.json({
        success: true,
        orderId: this.lastID,
        paymentCode: paymentCode,
        productName: DIGITAL_PRODUCT.name,
        productPrice: DIGITAL_PRODUCT.price,
        customerName: name,
        customerEmail: email
      });
    }
  );
});

// API: Check digital product payment status
app.get('/api/digital/check/:paymentCode', (req, res) => {
  const { paymentCode } = req.params;
  
  console.log('[DIGITAL] Checking payment for:', paymentCode);
  
  db.get(
    'SELECT status, payment_code, customer_name, customer_email FROM orders WHERE payment_code = ? AND product_id = ?',
    [paymentCode, DIGITAL_PRODUCT.id],
    (err, order) => {
      if (err) {
        console.error('[DIGITAL] ERROR: Query failed:', err.message);
        return res.status(500).json({ error: err.message });
      }
      
      if (!order) {
        console.log('[DIGITAL] Order not found:', paymentCode);
        return res.json({ success: false, paid: false, error: 'Order not found' });
      }
      
      console.log('[DIGITAL] Order status:', order.status);
      res.json({
        success: true,
        paid: order.status === 'success',
        status: order.status,
        paymentCode: order.payment_code
      });
    }
  );
});

// Database
const db = new sqlite3.Database('brain.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    
    // Migration: Add telegram_notified_at column if it doesn't exist
    db.run(`ALTER TABLE customers ADD COLUMN telegram_notified_at DATETIME`, (migrateErr) => {
      if (migrateErr && !migrateErr.message.includes('duplicate column name')) {
        console.log('[Migration] Note:', migrateErr.message);
      } else if (!migrateErr) {
        console.log('[Migration] Added telegram_notified_at column to customers table');
      }
    });

    // Migration: Add customer_name column for digital product orders
    db.run(`ALTER TABLE orders ADD COLUMN customer_name TEXT`, (migrateErr) => {
      if (migrateErr && !migrateErr.message.includes('duplicate column name')) {
        console.log('[Migration] Note:', migrateErr.message);
      } else if (!migrateErr) {
        console.log('[Migration] Added customer_name column to orders table');
      }
    });

    // Migration: Add customer_email column for digital product orders
    db.run(`ALTER TABLE orders ADD COLUMN customer_email TEXT`, (migrateErr) => {
      if (migrateErr && !migrateErr.message.includes('duplicate column name')) {
        console.log('[Migration] Note:', migrateErr.message);
      } else if (!migrateErr) {
        console.log('[Migration] Added customer_email column to orders table');
      }
    });
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

app.get('/success', (req, res) => {
  res.sendFile(path.join(__dirname, 'success.html'));
});

// Test Email Route
app.post('/api/test-email', async (req, res) => {
  const { to, subject, html } = req.body;
  if (!resend) return res.status(500).json({ error: 'Resend not initialized' });
  if (!to) return res.status(400).json({ error: 'Missing destination email (to)' });

  try {
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [to],
      subject: subject || 'Test Email from VEO 3',
      html: html || '<p>This is a test email sent from VEO 3 using Resend.</p>'
    });

    if (error) {
      return res.status(400).json({ error });
    }
    
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- EMAIL SEQUENCE ---
const email1Html = `
<p>Chào anh/chị,</p>
<p>Thật ra, em rất vui vì anh/chị đã quan tâm và đăng ký.</p>
<p>Em là Đội ngũ VEO3.</p>
<p>Em ở đây để giúp anh/chị giải quyết một vấn đề cực kỳ đau đầu: làm video quá chậm.</p>
<p>Anh/chị không cần phải tốn 3 tiếng đồng hồ chỉ cho một video ngắn nữa.</p>
<p>Trong vài ngày tới, em sẽ gửi cho anh/chị những cách thực chiến nhất để làm content nhanh hơn, ra số nhanh hơn.<br>
Không lý thuyết suông.<br>
Chỉ có sự thật và kết quả.</p>
<p>Anh/chị hãy chú ý hộp thư để chờ email tiếp theo của em nhé.</p>
<p>Hẹn gặp lại anh/chị,<br>
Đội ngũ VEO3</p>
`;

const email2Html = `
<p>Chào anh/chị,</p>
<p>Vấn đề không phải là anh/chị thiếu ý tưởng.<br>
Anh/chị thất bại vì mỗi video mất quá nhiều thời gian để làm.</p>
<p>Em thấy rất nhiều người đang kẹt đoạn này. <br>
Cứ cặm cụi ngồi cắt ghép, chỉnh sửa từng khung hình trên điện thoại.</p>
<p>Nhưng thật ra...<br>
Trong lúc anh/chị còn ngồi hì hục edit,<br>
Người khác đã dùng AI để đăng 5–10 video mỗi ngày.</p>
<p>Đơn giản thôi: <br>
Khán giả không quan tâm anh/chị edit mượt thế nào. <br>
Họ quan tâm ai xuất hiện nhiều hơn, cung cấp giá trị đều đặn hơn.</p>
<p>Anh/chị đừng cố làm cho mọi thứ hoàn hảo ngay từ đầu.<br>
Cứ làm trước.<br>
Done trước rồi tối ưu sau.</p>
<p>Cái giá phải trả cho việc quá cầu toàn chính là sự chậm chạp.<br>
Và sự chậm chạp sẽ khiến anh/chị bị đối thủ bỏ xa.</p>
<p>Ngày mai, em sẽ chỉ cho anh/chị cách để giải quyết triệt để vấn đề này. <br>
Cách để anh/chị xuất bản video chỉ trong vài phút.</p>
<p>Đừng bỏ lỡ email ngày mai nhé.</p>
`;

const email3Html = `
<p>Chào anh/chị,</p>
<p>Hôm qua em đã nói về việc tốc độ quan trọng như thế nào.<br>
Nếu không làm bây giờ, anh/chị sẽ tiếp tục dậm chân tại chỗ.<br>
AI không thay thế anh/chị, nhưng người dùng AI sẽ.</p>
<p>Đó là lý do em tạo ra VEO3.</p>
<p>VEO3 là công cụ AI hỗ trợ anh/chị biến ý tưởng thành video hoàn chỉnh chỉ trong vài phút. <br>
Không cần phải là một editor chuyên nghiệp.</p>
<p>Lợi ích thật sự khi anh/chị dùng VEO3:<br>
- Không cần biết edit.<br>
- Không cần học CapCut hay Premiere phức tạp.<br>
- Không cần thuê editor (vừa tốn tiền, vừa chậm deadline lại không đúng ý).</p>
<p>Anh/chị chỉ cần nhập ý tưởng, VEO3 sẽ lo phần nặng nhọc nhất.<br>
Để anh/chị có thể tập trung thời gian vào việc tạo ra doanh thu.</p>
<p>Đã đến lúc anh/chị lấy lại thời gian của mình và scale quy trình làm content.</p>
<p>Bắt đầu dùng VEO3 ngay tại đây:<br>
👉 <a href="http://localhost:3000/thanh-toan">Đăng ký VEO3</a></p>
<p>Hẹn gặp anh/chị ở bên trong,<br>
Đội ngũ VEO3</p>
`;

async function triggerEmailSequence(email) {
  console.log("triggerEmailSequence started");

  if (!resend) {
    console.log('Resend is not initialized, skipping email sequence.');
    return;
  }

  const isTest = email.includes('+test');
  const delay2Days = 2 * 24 * 60 * 60 * 1000;
  const delay3Days = 3 * 24 * 60 * 60 * 1000; // Total 3 days from start
  
  // Lấy email gốc nếu có +test (vd: kha+test@gmail.com -> kha@gmail.com)
  const destinationEmail = isTest ? email.replace(/\+[^@]+/, '') : email;

  const sendEmail = async (subject, html, label) => {
    try {
      console.log(`Sending ${label} to ${destinationEmail}`);
      const { data, error } = await resend.emails.send({
        from: fromEmail,
        to: [destinationEmail],
        subject: subject,
        html: html
      });
      if (error) {
        console.error(`Error sending ${label} to`, email, ':', error);
      } else {
        console.log(`${label} sent to`, email, ':', subject);
      }
    } catch (err) {
      console.error(`Exception sending ${label} to`, email, ':', err.message);
    }
  };

  if (isTest) {
    console.log(`Scheduling sequence for ${email} (Test mode: true)`);
    await sendEmail('Chào anh/chị. Đây là điều anh/chị cần biết.', email1Html, 'Email 1');
    
    setTimeout(() => {
      sendEmail('Sự thật: Anh/chị không thất bại vì thiếu ý tưởng', email2Html, 'Email 2');
    }, 2000);

    setTimeout(() => {
      sendEmail('Đã đến lúc tăng tốc (và đây là vũ khí của anh/chị)', email3Html, 'Email 3');
    }, 5000);
  } else {
    console.log(`Scheduling sequence for ${email} (Test mode: false)`);
    await sendEmail('Chào anh/chị. Đây là điều anh/chị cần biết.', email1Html, 'Email 1');

    setTimeout(() => {
      sendEmail('Sự thật: Anh/chị không thất bại vì thiếu ý tưởng', email2Html, 'Email 2');
    }, delay2Days);

    setTimeout(() => {
      sendEmail('Đã đến lúc tăng tốc (và đây là vũ khí của anh/chị)', email3Html, 'Email 3');
    }, delay3Days);
  }
}
// --- END EMAIL SEQUENCE ---

// --- ORDER CONFIRM EMAIL ---
const orderConfirmHtml = (productName, amount, paymentCode) => `
<p>Chào anh/chị,</p>
<p>Cảm ơn anh/chị đã quan tâm. Đơn hàng của anh/chị đã được tạo thành công.</p>
<p><b>Thông tin đơn hàng:</b><br>
- Sản phẩm: ${productName}<br>
- Mã đơn hàng: ${paymentCode}<br>
- Tổng thanh toán: ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)}</p>
<p><b>Hướng dẫn nhận hàng:</b><br>
Anh/chị vui lòng kiểm tra Zalo hoặc chờ cuộc gọi từ đội ngũ để kích hoạt tài khoản ngay nhé.<br>
Nếu có vấn đề gì, cứ phản hồi trực tiếp qua email này.</p>
<p>Bắt tay vào làm ngay nhé, đừng chần chừ.</p>
<p>Hẹn gặp anh/chị bên trong,<br>
Đội ngũ VEO3</p>
`;

async function triggerOrderConfirmEmail(email, productName, amount, paymentCode) {
  if (!resend) return;

  const isTest = email.includes('+test');
  const destinationEmail = isTest ? email.replace(/\+[^@]+/, '') : email;

  try {
    console.log(`Sending Order Confirm to ${destinationEmail}`);
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [destinationEmail],
      subject: 'Xác nhận đơn hàng VEO3 - Bắt đầu ngay',
      html: orderConfirmHtml(productName, amount, paymentCode)
    });
    if (error) {
      console.error(`Error sending Order Confirm ${destinationEmail}:`, error);
    } else {
      console.log(`Order Confirm sent to ${destinationEmail}`);
    }
  } catch (err) {
    console.error(`Error sending Order Confirm ${destinationEmail}:`, err.message);
  }
}
// --- END ORDER CONFIRM EMAIL ---

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
  const { name, phone, email, zalo } = req.body;
  
  if (!name || !phone) {
    return res.status(400).json({ error: 'Thiếu thông tin bắt buộc' });
  }
  
  // Phone validation: only allow 10-11 digits
  const phoneDigits = phone.replace(/\D/g, '');
  if (phoneDigits.length < 10 || phoneDigits.length > 11) {
    return res.status(400).json({ error: 'Số điện thoại phải có 10-11 chữ số' });
  }
  
  db.run('INSERT INTO customers (name, phone, email, zalo) VALUES (?, ?, ?, ?)',
    [name, phone, email, zalo], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID });
  });
});

app.put('/api/customers/:id', (req, res) => {
  const { name, phone, email, zalo } = req.body;
  
  // Phone validation: only allow 10-11 digits (if phone is provided)
  if (phone) {
    const phoneDigits = phone.replace(/\D/g, '');
    if (phoneDigits.length < 10 || phoneDigits.length > 11) {
      return res.status(400).json({ error: 'Số điện thoại phải có 10-11 chữ số' });
    }
  }
  
  db.run('UPDATE customers SET name = ?, phone = ?, email = ?, zalo = ? WHERE id = ?',
    [name, phone, email, zalo, req.params.id], function(err) {
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
  const query = `
    SELECT orders.*, customers.name as customer_name, customers.email as customer_email, products.name as product_name
    FROM orders
    LEFT JOIN customers ON orders.customer_id = customers.id
    LEFT JOIN products ON orders.product_id = products.id
    ORDER BY orders.id DESC
  `;
  db.all(query, (err, rows) => {
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
  db.get('SELECT stock, name FROM products WHERE id = ?', [product_id], (err, product) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!product || product.stock < 1) return res.status(400).json({ error: 'Out of stock' });
    
    // Get customer email
    db.get('SELECT email FROM customers WHERE id = ?', [customer_id], (err, customer) => {
      if (err) return res.status(500).json({ error: err.message });

        // Insert order
      db.run('INSERT INTO orders (customer_id, product_id, amount, status, payment_code) VALUES (?, ?, ?, ?, ?)',
        [customer_id, product_id, amount, status || 'pending', payment_code], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        
        const orderId = this.lastID;

        // Note: Email is sent ONLY on payment success, not on order creation
        res.json({ id: orderId });
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
  
  // Check if this is a status change to 'success' (for email triggering)
  const isStatusChangeToSuccess = status === 'success';
  
  // Get current order info before update if we need to send emails
  if (isStatusChangeToSuccess) {
    db.get(`
      SELECT o.*, c.email, c.name as customer_name, p.name as product_name
      FROM orders o
      LEFT JOIN customers c ON o.customer_id = c.id
      LEFT JOIN products p ON o.product_id = p.id
      WHERE o.id = ?
    `, [req.params.id], async (err, order) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!order) return res.status(404).json({ error: 'Order not found' });
      
      // Check if already success - avoid duplicate emails
      if (order.status === 'success') {
        console.log(`[admin] Skipping email because order already success: ${order.payment_code}`);
        // Still update the status (in case it's being re-confirmed)
        values.push(req.params.id);
        const query = `UPDATE orders SET ${updates.join(', ')} WHERE id = ?`;
        
        db.run(query, values, function(err) {
          if (err) return res.status(500).json({ error: err.message });
          res.json({ changes: this.changes, emailSent: false, alreadySuccess: true });
        });
        return;
      }
      
      // Transitioning from non-success to success - send emails
      console.log(`[admin] Manual admin success triggered for ${order.payment_code}`);
      
      // Update order first
      values.push(req.params.id);
      const query = `UPDATE orders SET ${updates.join(', ')} WHERE id = ?`;
      
      db.run(query, values, async function(err) {
        if (err) return res.status(500).json({ error: err.message });
        
        console.log(`[admin] Order status updated to success: ${order.payment_code}`);
        
        // Decrease stock
        db.run('UPDATE products SET stock = stock - 1 WHERE id = ?', [order.product_id], (err) => {
          if (err) console.error('[admin] Error updating stock:', err.message);
        });
        
        // Send emails on success
        if (order.email) {
          console.log('[admin] Sending confirmation emails to:', order.email);
          await triggerEmailSequence(order.email);
          await triggerOrderConfirmEmail(order.email, order.product_name, order.amount, order.payment_code);
        }
        
        res.json({ changes: this.changes, emailSent: true });
      });
    });
  } else {
    // Regular update without email
    values.push(req.params.id);
    const query = `UPDATE orders SET ${updates.join(', ')} WHERE id = ?`;
    
    db.run(query, values, function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ changes: this.changes });
    });
  }
});

app.delete('/api/orders/:id', (req, res) => {
  db.run('DELETE FROM orders WHERE id = ?', [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ changes: this.changes });
  });
});

// Thanh toán
app.post('/api/thanh-toan/create', (req, res) => {
  const { name, phone, email, zalo, product_id } = req.body;
  
  console.log('[CUSTOMER] Route called - /api/thanh-toan/create');
  console.log('[CUSTOMER] Received data:', { name, phone, email, zalo, product_id });
  
  if (!name || !phone || !email || !product_id) {
    console.log('[CUSTOMER] ERROR: Missing required fields');
    return res.status(400).json({ error: 'Thiếu thông tin bắt buộc' });
  }

  // Phone validation: only allow 10-11 digits
  const phoneDigits = phone.replace(/\D/g, '');
  if (phoneDigits.length < 10 || phoneDigits.length > 11) {
    console.log('[CUSTOMER] ERROR: Invalid phone number');
    return res.status(400).json({ error: 'Số điện thoại phải có 10-11 chữ số' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    console.log('[CUSTOMER] ERROR: Invalid email format');
    return res.status(400).json({ error: 'Email không đúng định dạng' });
  }
  
  // Get product info
  db.get('SELECT * FROM products WHERE id = ?', [product_id], (err, product) => {
    if (err) {
      console.error('[CUSTOMER] ERROR: Product query failed:', err.message);
      return res.status(500).json({ error: err.message });
    }
    if (!product) {
      console.log('[CUSTOMER] ERROR: Product not found');
      return res.status(404).json({ error: 'Sản phẩm không tồn tại' });
    }
    if (product.stock < 1) {
      console.log('[CUSTOMER] ERROR: Out of stock');
      return res.status(400).json({ error: 'Hết hàng' });
    }
    
    console.log('[CUSTOMER] Product found:', product.name);
    
    // Check if customer exists by phone
    db.get('SELECT id, telegram_notified_at FROM customers WHERE phone = ?', [phone], (err, customer) => {
      if (err) {
        console.error('[CUSTOMER] ERROR: Customer check failed:', err.message);
        return res.status(500).json({ error: err.message });
      }
      
      console.log('[CUSTOMER] Customer check result:', customer ? `EXISTS (id=${customer.id})` : 'NEW CUSTOMER');
      
      const processOrder = (customerId) => {
        console.log('[CUSTOMER] Processing order for customerId:', customerId);
        
        // Generate payment code
        const paymentCode = 'VEO' + Math.floor(Math.random() * 100000).toString().padStart(5, '0');
        console.log('[CUSTOMER] Generated paymentCode:', paymentCode);
        
        // Create order
        db.run('INSERT INTO orders (customer_id, product_id, amount, status, payment_code) VALUES (?, ?, ?, ?, ?)',
          [customerId, product_id, product.price, 'pending', paymentCode], function(err) {
          if (err) {
            console.error('[CUSTOMER] ERROR: Order insert failed:', err.message);
            return res.status(500).json({ error: err.message });
          }
          
          console.log('[CUSTOMER] Order created successfully, id:', this.lastID);
          
          // Decrease stock
          db.run('UPDATE products SET stock = stock - 1 WHERE id = ?', [product_id], function(err) {
            if (err) console.error('[CUSTOMER] ERROR: Stock update failed:', err.message);
          });

          console.log('[CUSTOMER] === ORDER COMPLETE, SENDING RESPONSE ===');
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
      };
      
      if (customer) {
        // Customer exists - update info
        console.log('[CUSTOMER] Existing customer - updating info');
        db.run('UPDATE customers SET name = ?, email = ?, zalo = ? WHERE id = ?',
          [name, email, zalo, customer.id], (err) => {
          if (err) {
            console.error('[CUSTOMER] ERROR: Customer update failed:', err.message);
            return res.status(500).json({ error: err.message });
          }
          console.log('[CUSTOMER] Customer info updated');
          processOrder(customer.id);
        });
      } else {
        // New customer - INSERT FIRST, then send Telegram async
        console.log('[CUSTOMER] NEW CUSTOMER - Inserting into database');
        
        db.run('INSERT INTO customers (name, phone, email, zalo) VALUES (?, ?, ?, ?)',
          [name, phone, email, zalo], function(err) {
          if (err) {
            console.error('[CUSTOMER] ERROR: Customer insert failed:', err.message);
            return res.status(500).json({ error: err.message });
          }
          
          const newCustomerId = this.lastID;
          console.log('[CUSTOMER] ✅ INSERT SUCCESS, customer id:', newCustomerId);
          
          // Fire-and-forget Telegram notification (don't await, don't block)
          // Use setTimeout to ensure it runs after response is sent
          setTimeout(() => {
            console.log('[TELEGRAM] Attempting to send notification for:', name, phone);
            
            // Check if already notified (double-check)
            db.get('SELECT telegram_notified_at FROM customers WHERE id = ?', [newCustomerId], (err, row) => {
              if (err) {
                console.error('[TELEGRAM] ERROR: Could not check notified status:', err.message);
                return;
              }
              
              if (row && row.telegram_notified_at) {
                console.log('[TELEGRAM] SKIPPED: Customer already notified');
                return;
              }
              
              // Send Telegram
              sendTelegramNotification({ name, phone, email, zalo })
                .then((result) => {
                  if (result.success) {
                    console.log('[TELEGRAM] ✅ SUCCESS for:', name, phone);
                    // Mark as notified
                    db.run('UPDATE customers SET telegram_notified_at = CURRENT_TIMESTAMP WHERE id = ?', [newCustomerId], (err) => {
                      if (err) console.error('[TELEGRAM] ERROR: Could not mark as notified:', err.message);
                    });
                  } else {
                    console.log('[TELEGRAM] ❌ ERROR: Failed to send, result:', result);
                  }
                })
                .catch((err) => {
                  console.error('[TELEGRAM] ❌ EXCEPTION:', err.message);
                });
            });
          }, 100);
          
          // Continue with order creation immediately (don't wait for Telegram)
          processOrder(newCustomerId);
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

    // Check if order already has success status (admin manual success)
    db.get(`
      SELECT o.*, c.email, c.name as customer_name, p.name as product_name
      FROM orders o
      LEFT JOIN customers c ON o.customer_id = c.id
      LEFT JOIN products p ON o.product_id = p.id
      WHERE UPPER(o.payment_code) = UPPER(?)
    `, [paymentCode], (err, existingOrder) => {
      if (err) {
        console.error('[check-payment] DB query error:', err.message);
        return res.status(500).json({ success: false, error: err.message });
      }
      
      // If order exists and is already success, return success (no duplicate emails)
      if (existingOrder && existingOrder.status === 'success') {
        console.log('[check-payment] Order already marked as success:', paymentCode);
        return res.json({ success: true, paid: true, alreadySuccess: true });
      }
      
      // Order doesn't exist or is pending, check SePay for transaction
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
        
        // First get order info for email (use UPPER() for case-insensitive match)
        db.get(`
          SELECT o.*, c.email, c.name as customer_name, p.name as product_name
          FROM orders o
          LEFT JOIN customers c ON o.customer_id = c.id
          LEFT JOIN products p ON o.product_id = p.id
          WHERE UPPER(o.payment_code) = UPPER(?) AND o.status = 'pending'
        `, [paymentCode], async (err, order) => {
          if (err) {
            console.error('[check-payment] DB query error:', err.message);
            return res.status(500).json({ success: false, error: err.message });
          }
          
          if (!order) {
            console.log('[check-payment] Order not found or already processed');
            return res.json({ success: true, paid: false, reason: 'Order not found or already processed' });
          }
          
          // Update order status to success
          db.run(
            'UPDATE orders SET status = ? WHERE id = ?',
            ['success', order.id],
            async function (err) {
              if (err) {
                console.error('[check-payment] DB update error:', err.message);
                return res.status(500).json({ success: false, error: err.message });
              }
              
              console.log(`[check-payment] Order status updated to success: ${order.payment_code}`);
              
              // Decrease stock
              db.run('UPDATE products SET stock = stock - 1 WHERE id = ?', [order.product_id], (err) => {
                if (err) console.error('[check-payment] Error updating stock:', err.message);
              });
              
              // Send emails on payment success
              if (order.email) {
                console.log('[check-payment] Sending confirmation emails to:', order.email);
                await triggerEmailSequence(order.email);
                await triggerOrderConfirmEmail(order.email, order.product_name, order.amount, paymentCode);
              }
              
              return res.json({ success: true, paid: true, matchedBy: 'normalized-content', transactionId: foundTransactionByContent.id });
            }
          );
        });
        return;
      }

      console.log('[check-payment] No match found by content');
      return res.json({
        success: true,
        paid: false,
        reason: "paymentCode not found in transaction content"
      });
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