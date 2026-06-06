require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const nodemailer = require('nodemailer');
const { OAuth2Client } = require('google-auth-library');

const app = express();
const PORT = process.env.PORT || 3000;

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

app.use(cors());
app.use(express.json());

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
            if (!user.is_email_verified) {
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
    const { name, email, password, phone, clubName, plan, paymentMethod } = req.body;
    
    if (!email || !password || !name) {
        return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    try {
        const token = Math.floor(100000 + Math.random() * 900000).toString();

        const [result] = await pool.execute(
            'INSERT INTO users (name, email, password, phone, club_name, plan, payment_method, role, is_email_verified, verification_token) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, ?)',
            [name, email, password, phone, clubName, plan, paymentMethod, 'user', token]
        );

        let amount = 0;
        if (plan === 'weekly') amount = 9.00;
        else if (plan === 'monthly') amount = 29.00;
        else if (plan === 'yearly') amount = 290.00;

        await pool.execute(
            'INSERT INTO orders (user_id, customer_email, plan, amount, status) VALUES (?, ?, ?, ?, ?)',
            [result.insertId, email, plan, amount, 'Pending']
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
    if (!email || !token) return res.status(400).json({ message: 'Email and Token are required' });

    try {
        const [rows] = await pool.execute('SELECT id FROM users WHERE email = ? AND verification_token = ?', [email, token]);
        if (rows.length === 0) {
            return res.status(400).json({ message: 'Invalid or expired verification code' });
        }

        await pool.execute('UPDATE users SET is_email_verified = 1, verification_token = NULL WHERE id = ?', [rows[0].id]);
        res.json({ message: 'Email verified successfully! You can now log in.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
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
        res.json({ message: 'Order status updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error while updating order status' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
