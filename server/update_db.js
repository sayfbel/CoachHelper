const mysql = require('mysql2/promise');

async function updateDatabase() {
    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'coachhelper'
        });

        console.log('Connected to MySQL server. Database "coachhelper"');

        // Create orders table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS orders (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT,
                customer_email VARCHAR(255) NOT NULL,
                plan VARCHAR(255) NOT NULL,
                amount DECIMAL(10, 2) NOT NULL,
                status VARCHAR(50) DEFAULT 'Pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Table "orders" created or already exists.');

        await connection.end();
        console.log('Database update complete.');
    } catch (err) {
        console.error('Error updating database:', err);
    }
}

updateDatabase();
