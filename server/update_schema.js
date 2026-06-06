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

        // Update orders table
        try {
            await connection.query('ALTER TABLE orders ADD COLUMN rejection_reason TEXT');
            console.log('Added rejection_reason to orders');
        } catch (e) { console.log('rejection_reason may already exist', e.message); }

        await connection.end();
        console.log('Schema update complete.');
    } catch (err) {
        console.error('Error updating schema:', err);
    }
}

updateSchema();
