require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const nodemailer = require('nodemailer');
const { OAuth2Client } = require('google-auth-library');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Setup Multer for receipt uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Create connection pool for MySQL
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: 'coachhelper',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Configure Nodemailer
const transporter = nodemailer.createTransport({
    service: process.env.SMTP_SERVICE || 'gmail',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        const [rows] = await pool.execute(
            'SELECT id, email, role, is_email_verified FROM users WHERE email = ? AND password = ?',
            [email, password]
        );

        if (rows.length > 0) {
            const user = rows[0];
            if (!user.is_email_verified && user.role !== 'admin') {
                return res.status(401).json({ message: 'Please verify your email address before logging in.' });
            }

            // Fetch the user's latest order status
            const [orderRows] = await pool.execute(
                'SELECT status, plan, rejection_reason FROM orders WHERE user_id = ? ORDER BY created_at DESC LIMIT 1',
                [user.id]
            );

            res.json({ 
                message: 'Login successful', 
                user, 
                order: orderRows.length > 0 ? orderRows[0] : null 
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (err) {
        console.error(err);
        // Special error if database or table doesn't exist
        if (err.code === 'ER_BAD_DB_ERROR') {
             res.status(500).json({ message: 'Database "coachhelper" not found. Please create it in phpMyAdmin and run database.sql' });
        } else if (err.code === 'ER_NO_SUCH_TABLE') {
             res.status(500).json({ message: 'Table "users" not found. Please run database.sql in phpMyAdmin' });
        } else {
             res.status(500).json({ message: 'Internal server error. Is XAMPP MySQL running?' });
        }
    }
});

// Google Auth endpoint
app.post('/api/auth/google', async (req, res) => {
    const { credential } = req.body;
    if (!credential) return res.status(400).json({ message: 'Google credential required' });

    try {
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const email = payload.email;

        const [users] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(404).json({ message: 'Account not found. Please register via the Checkout page first.' });
        }

        const user = users[0];
        
        // Fetch the user's latest order status
        const [orderRows] = await pool.execute(
            'SELECT status, plan, rejection_reason FROM orders WHERE user_id = ? ORDER BY created_at DESC LIMIT 1',
            [user.id]
        );

        res.json({ 
            message: 'Login successful', 
            user, 
            order: orderRows.length > 0 ? orderRows[0] : null 
        });
    } catch (error) {
        console.error('Error verifying Google token:', error);
        res.status(401).json({ message: 'Invalid Google token' });
    }
});

// Register endpoint
app.post('/api/register', async (req, res) => {
    const { name, email, password, phone, clubName, city, plan, paymentMethod } = req.body;
    
    if (!email || !password || !name) {
        return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    try {
        const token = Math.floor(100000 + Math.random() * 900000).toString();

        const [result] = await pool.execute(
            'INSERT INTO users (name, email, password, phone, club_name, city, plan, payment_method, role, is_email_verified, verification_token) VALUES (?, ?, ?, ?, ?, ?, NULL, NULL, ?, 0, ?)',
            [name, email, password, phone, clubName, city, 'user', token]
        );

        let amount = 0;
        const [offerRows] = await pool.execute('SELECT price FROM offers WHERE name = ?', [plan]);
        if (offerRows.length > 0) {
            amount = offerRows[0].price;
        }

        await pool.execute(
            'INSERT INTO orders (user_id, customer_email, plan, payment_method, amount, status) VALUES (?, ?, ?, ?, ?, ?)',
            [result.insertId, email, plan, paymentMethod, amount, 'Pending']
        );

        // Send validation email
        const mailOptions = {
            from: process.env.SMTP_USER,
            to: email,
            subject: 'Your 6-Digit Verification Code',
            html: `
                <h1>Welcome to CoachHelper!</h1>
                <p>Please enter the following 6-digit code to verify your email address:</p>
                <h2 style="font-size: 2rem; letter-spacing: 0.2rem; color: #ccff00; background: #18181b; padding: 1rem; display: inline-block; border-radius: 8px;">${token}</h2>
                <p>If you did not request this, please ignore this email.</p>
            `
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) console.error('Error sending email:', error);
            else console.log('Email sent:', info.response);
        });

        res.json({ message: 'Registration successful. Please check your email to verify your account.', userId: result.insertId });
    } catch (err) {
        console.error(err);
        if (err.code === 'ER_DUP_ENTRY') {
             res.status(400).json({ message: 'Email is already registered' });
        } else {
             res.status(500).json({ message: 'Internal server error' });
        }
    }
});

// Verify email endpoint
app.post('/api/verify-email', async (req, res) => {
    const { email, token } = req.body;
    try {
        const [rows] = await pool.execute('SELECT id FROM users WHERE email = ? AND verification_token = ?', [email, token]);
        if (rows.length > 0) {
            await pool.execute('UPDATE users SET is_email_verified = 1, verification_token = NULL WHERE email = ?', [email]);
            
            // Also get the pending order ID to pass back to the client for uploading receipt
            const [orderRows] = await pool.execute('SELECT id FROM orders WHERE customer_email = ? ORDER BY created_at DESC LIMIT 1', [email]);
            
            res.json({ message: 'Email verified successfully', orderId: orderRows.length > 0 ? orderRows[0].id : null });
        } else {
            res.status(400).json({ message: 'Invalid token' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Upload Receipt endpoint
app.post('/api/upload-receipt', upload.single('receipt'), async (req, res) => {
    const { orderId } = req.body;
    if (!req.file || !orderId) {
        return res.status(400).json({ message: 'Receipt image and orderId are required' });
    }

    const receiptUrl = `/uploads/${req.file.filename}`;

    try {
        await pool.execute('UPDATE orders SET receipt_image = ? WHERE id = ?', [receiptUrl, orderId]);
        res.json({ message: 'Receipt uploaded successfully', receiptUrl });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to upload receipt' });
    }
});

// Get all offers
app.get('/api/offers', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM offers ORDER BY price ASC');
        // Convert the tinyint is_popular back to boolean for the frontend
        const formattedRows = rows.map(row => ({
            ...row,
            is_popular: row.is_popular === 1
        }));
        res.json(formattedRows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error while fetching offers' });
    }
});

// Create a new offer
app.post('/api/offers', async (req, res) => {
    const { name, price, period, description, is_popular } = req.body;
    
    if (!name || !price || !period) {
        return res.status(400).json({ message: 'Name, price, and period are required' });
    }

    try {
        const [result] = await pool.execute(
            'INSERT INTO offers (name, price, period, description, is_popular) VALUES (?, ?, ?, ?, ?)',
            [name, price, period, description || '', is_popular ? 1 : 0]
        );
        res.json({ 
            message: 'Offer created successfully', 
            offer: { id: result.insertId, name, price, period, description, is_popular } 
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error while creating offer' });
    }
});

// Update an existing offer
app.put('/api/offers/:id', async (req, res) => {
    const { id } = req.params;
    const { name, price, period, description, is_popular } = req.body;
    try {
        const [result] = await pool.execute(
            'UPDATE offers SET name = ?, price = ?, period = ?, description = ?, is_popular = ? WHERE id = ?',
            [name, price, period, description || '', is_popular ? 1 : 0, id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Offer not found' });
        }
        res.json({ message: 'Offer updated successfully', offer: { id: parseInt(id), name, price, period, description, is_popular } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error while updating offer' });
    }
});

// Delete an offer
app.delete('/api/offers/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await pool.execute('DELETE FROM offers WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Offer not found' });
        }
        res.json({ message: 'Offer deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error while deleting offer' });
    }
});

// Get all messages
app.get('/api/messages', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM messages ORDER BY created_at DESC');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error while fetching messages' });
    }
});

// Create a new message
app.post('/api/messages', async (req, res) => {
    const { name, email, subject, message } = req.body;
    
    if (!name || !email || !message) {
        return res.status(400).json({ message: 'Name, email, and message are required' });
    }

    try {
        const [result] = await pool.execute(
            'INSERT INTO messages (name, email, subject, message) VALUES (?, ?, ?, ?)',
            [name, email, subject || 'No Subject', message]
        );
        res.json({ message: 'Message sent successfully', messageId: result.insertId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error while saving message' });
    }
});

// Get all orders
app.get('/api/orders', async (req, res) => {
    try {
        const [rows] = await pool.execute(`
            SELECT orders.*, users.name as customer_name 
            FROM orders 
            LEFT JOIN users ON orders.user_id = users.id 
            WHERE users.is_email_verified = 1
            ORDER BY orders.created_at DESC
        `);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error while fetching orders' });
    }
});

// Update order status
app.put('/api/orders/:id/status', async (req, res) => {
    const { status, reason } = req.body;
    const { id } = req.params;
    if (!['Pending', 'Confirmed', 'Rejected'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
    }
    try {
        if (status === 'Rejected' && reason) {
            await pool.execute('UPDATE orders SET status = ?, rejection_reason = ? WHERE id = ?', [status, reason, id]);
        } else {
            await pool.execute('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
        }

        const [orderRows] = await pool.execute('SELECT user_id, plan, payment_method FROM orders WHERE id = ?', [id]);
        if (orderRows.length > 0) {
            const order = orderRows[0];
            
            if (status === 'Confirmed') {
                const [offerRows] = await pool.execute('SELECT period FROM offers WHERE name = ?', [order.plan]);
                let period = offerRows.length > 0 ? offerRows[0].period.toLowerCase() : '';
                let daysToAdd = 0;
                if (period === 'weekly') daysToAdd = 7;
                else if (period === 'monthly') daysToAdd = 30;
                else if (period === 'yearly') daysToAdd = 365;

                if (daysToAdd > 0) {
                    const startDate = new Date();
                    const planEndDate = new Date(startDate);
                    planEndDate.setDate(planEndDate.getDate() + daysToAdd);
                    
                    const formattedStart = startDate.toISOString().slice(0, 19).replace('T', ' ');
                    const formattedEnd = planEndDate.toISOString().slice(0, 19).replace('T', ' ');

                    await pool.execute(
                        'UPDATE users SET plan = ?, payment_method = ?, plan_start_date = ?, plan_end_date = ? WHERE id = ?',
                        [order.plan, order.payment_method, formattedStart, formattedEnd, order.user_id]
                    );
                }
            } else if (status === 'Pending') {
                await pool.execute(
                    'UPDATE users SET plan_end_date = NULL WHERE id = ?',
                    [order.user_id]
                );
            } else if (status === 'Rejected' && reason) {
                // Send email to user
                const mailOptions = {
                    from: process.env.SMTP_USER,
                    to: order.customer_email,
                    subject: 'Update on Your HoopCoach Registration',
                    html: `
                        <h1>Registration Update</h1>
                        <p>We are sorry, but your payment could not be verified.</p>
                        <p><strong>Reason:</strong> ${reason}</p>
                        <p>Your pending account has been removed. Please try registering again with a valid payment receipt.</p>
                    `
                };
                transporter.sendMail(mailOptions, (error) => {
                    if (error) console.error('Error sending rejection email:', error);
                });

                // Delete the user (this will also cascade or we should manually delete orders if no cascade)
                await pool.execute('DELETE FROM orders WHERE user_id = ?', [order.user_id]);
                await pool.execute('DELETE FROM users WHERE id = ?', [order.user_id]);
            }
        }
        res.json({ message: 'Order status updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error while updating order status' });
    }
});

// Get user's latest order status
app.get('/api/users/:id/order-status', async (req, res) => {
    try {
        const [rows] = await pool.execute(
            'SELECT status, plan, rejection_reason FROM orders WHERE user_id = ? ORDER BY created_at DESC LIMIT 1',
            [req.params.id]
        );
        if (rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.status(404).json({ message: 'No orders found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error while fetching order status' });
    }
});

// Get all users
app.get('/api/users', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT id, name, email, phone, club_name, plan, payment_method, role, is_email_verified, plan_start_date, plan_end_date FROM users');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error while fetching users' });
    }
});

// Get user profile including plan info
app.get('/api/users/:id/profile', async (req, res) => {
    try {
        const [rows] = await pool.execute(
            'SELECT id, name, email, phone, club_name, plan, payment_method, role, is_email_verified, plan_start_date, plan_end_date FROM users WHERE id = ?',
            [req.params.id]
        );
        if (rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error while fetching user profile' });
    }
});

// Delete user
app.delete('/api/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.execute('DELETE FROM orders WHERE user_id = ?', [id]);
        const [result] = await pool.execute('DELETE FROM users WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error while deleting user' });
    }
});

// End offer
app.put('/api/users/:id/end-offer', async (req, res) => {
    const { id } = req.params;
    try {
        // Set plan_end_date to current time
        const formattedDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
        const [result] = await pool.execute(
            'UPDATE users SET plan_end_date = ? WHERE id = ?',
            [formattedDate, id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'Offer ended successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error while ending offer' });
    }
});

// Restart offer
app.put('/api/users/:id/restart-offer', async (req, res) => {
    const { id } = req.params;
    try {
        const [userRows] = await pool.execute('SELECT plan FROM users WHERE id = ?', [id]);
        if (userRows.length === 0) return res.status(404).json({ message: 'User not found' });
        
        let plan = userRows[0].plan;
        if (!plan) return res.status(400).json({ message: 'User has no active plan to restart' });

        let daysToAdd = 30; // Default monthly
        if (plan.toLowerCase() === 'weekly') daysToAdd = 7;
        else if (plan.toLowerCase() === 'yearly') daysToAdd = 365;

        const startDate = new Date();
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + daysToAdd);

        const formattedStart = startDate.toISOString().slice(0, 19).replace('T', ' ');
        const formattedEnd = endDate.toISOString().slice(0, 19).replace('T', ' ');

        await pool.execute(
            'UPDATE users SET plan_start_date = ?, plan_end_date = ? WHERE id = ?',
            [formattedStart, formattedEnd, id]
        );
        res.json({ message: 'Offer restarted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error while restarting offer' });
    }
});

// Add offer to user
app.put('/api/users/:id/add-offer', async (req, res) => {
    const { id } = req.params;
    const { plan_name, period } = req.body;
    
    if (!plan_name || !period) {
        return res.status(400).json({ message: 'Plan name and period are required' });
    }

    try {
        let daysToAdd = 30;
        if (period.toLowerCase() === 'weekly') daysToAdd = 7;
        else if (period.toLowerCase() === 'yearly') daysToAdd = 365;

        const startDate = new Date();
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + daysToAdd);

        const formattedStart = startDate.toISOString().slice(0, 19).replace('T', ' ');
        const formattedEnd = endDate.toISOString().slice(0, 19).replace('T', ' ');

        const [result] = await pool.execute(
            'UPDATE users SET plan = ?, plan_start_date = ?, plan_end_date = ? WHERE id = ?',
            [plan_name, formattedStart, formattedEnd, id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'Offer added successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error while adding offer' });
    }
});
// Payment Methods API
app.get('/api/payment-methods', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM payment_methods ORDER BY created_at DESC');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error while fetching payment methods' });
    }
});

app.post('/api/payment-methods', async (req, res) => {
    const { name, rib } = req.body;
    if (!name || !rib) {
        return res.status(400).json({ message: 'Name and RIB are required' });
    }
    try {
        const [result] = await pool.execute(
            'INSERT INTO payment_methods (name, rib) VALUES (?, ?)',
            [name, rib]
        );
        res.status(201).json({ id: result.insertId, name, rib });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error while creating payment method' });
    }
});

app.delete('/api/payment-methods/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.execute('DELETE FROM payment_methods WHERE id = ?', [id]);
        res.json({ message: 'Payment method deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error while deleting payment method' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
