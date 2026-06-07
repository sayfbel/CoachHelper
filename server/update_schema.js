const mysql = require('mysql2/promise');

async function updateSchema() {
    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'coachhelper'
        });

        console.log('Connected to MySQL server. Database "coachhelper"');

        // Update users table
        try {
            await connection.query('ALTER TABLE users ADD COLUMN is_email_verified TINYINT(1) DEFAULT 0');
            console.log('Added is_email_verified to users');
        } catch (e) { console.log('is_email_verified may already exist', e.message); }

        try {
            await connection.query('ALTER TABLE users ADD COLUMN verification_token VARCHAR(255)');
            console.log('Added verification_token to users');
        } catch (e) { console.log('verification_token may already exist', e.message); }

        try {
            await connection.query('ALTER TABLE users ADD COLUMN plan_end_date DATETIME');
            console.log('Added plan_end_date to users');
        } catch (e) { console.log('plan_end_date may already exist', e.message); }

        try {
            await connection.query('ALTER TABLE users ADD COLUMN plan_start_date DATETIME');
            console.log('Added plan_start_date to users');
        } catch (e) { console.log('plan_start_date may already exist', e.message); }

        try {
            await connection.query('ALTER TABLE users ADD COLUMN city VARCHAR(255)');
            console.log('Added city to users');
        } catch (e) { console.log('city may already exist', e.message); }

        // Update orders table
        try {
            await connection.query('ALTER TABLE orders ADD COLUMN rejection_reason TEXT');
            console.log('Added rejection_reason to orders');
        } catch (e) { console.log('rejection_reason may already exist', e.message); }

        try {
            await connection.query('ALTER TABLE orders ADD COLUMN payment_method VARCHAR(50)');
            console.log('Added payment_method to orders');
        } catch (e) { console.log('payment_method may already exist', e.message); }

        try {
            await connection.query('ALTER TABLE orders ADD COLUMN receipt_image VARCHAR(255)');
            console.log('Added receipt_image to orders');
        } catch (e) { console.log('receipt_image may already exist', e.message); }

        try {
            await connection.query(`
                CREATE TABLE IF NOT EXISTS payment_methods (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    rib VARCHAR(255) NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            `);
            console.log('Table "payment_methods" created or already exists.');
        } catch (e) { console.error('Error creating payment_methods table', e.message); }

        await connection.end();
        console.log('Schema update complete.');
    } catch (err) {
        console.error('Error updating schema:', err);
    }
}

updateSchema();
