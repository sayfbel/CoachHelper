const mysql = require('mysql2/promise');

async function setupDatabase() {
    try {
        // Connect to MySQL server (without specifying database)
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: ''
        });

        console.log('Connected to MySQL server.');

        // Create database if it doesn't exist
        await connection.query('CREATE DATABASE IF NOT EXISTS coachhelper');
        console.log('Database "coachhelper" created or already exists.');

        // Use the database
        await connection.query('USE coachhelper');

        // Create users table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                phone VARCHAR(50),
                club_name VARCHAR(255),
                plan VARCHAR(50),
                payment_method VARCHAR(50),
                role VARCHAR(50) DEFAULT 'user',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Table "users" created or already exists.');

        // Create offers table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS offers (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                price DECIMAL(10, 2) NOT NULL,
                period VARCHAR(50) NOT NULL,
                description TEXT,
                is_popular TINYINT(1) DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Table "offers" created or already exists.');

        // Optionally, insert some initial dummy offers if table is empty
        const [rows] = await connection.query('SELECT COUNT(*) as count FROM offers');
        if (rows[0].count === 0) {
            await connection.query(`
                INSERT INTO offers (name, price, period, description, is_popular) VALUES 
                ('Basic Plan', 29.99, 'Monthly', 'Access to basic features.', 0),
                ('Pro Plan', 49.99, 'Monthly', 'Access to all features + priority support.', 1),
                ('Yearly Premium', 499.99, 'Yearly', 'Best value for long-term users.', 0)
            `);
            console.log('Inserted default offers.');
        }

        await connection.end();
        console.log('Database setup complete.');
    } catch (err) {
        console.error('Error setting up database:', err);
    }
}

setupDatabase();
