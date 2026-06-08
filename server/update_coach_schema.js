const mysql = require('mysql2/promise');

async function updateSchema() {
    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'coachhelper'
        });

        console.log('Connected to coachhelper database.');

        await connection.query(`
            CREATE TABLE IF NOT EXISTS coach_seasons (
                id INT AUTO_INCREMENT PRIMARY KEY,
                coach_id INT NOT NULL,
                club_name VARCHAR(255) NOT NULL,
                season_year VARCHAR(50) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (coach_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);
        console.log('Table "coach_seasons" created or already exists.');

        await connection.query(`
            CREATE TABLE IF NOT EXISTS season_players (
                id INT AUTO_INCREMENT PRIMARY KEY,
                season_id INT NOT NULL,
                license_number VARCHAR(100),
                player_name VARCHAR(255) NOT NULL,
                jersey_number INT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (season_id) REFERENCES coach_seasons(id) ON DELETE CASCADE
            )
        `);
        console.log('Table "season_players" created or already exists.');

        await connection.query(`
            CREATE TABLE IF NOT EXISTS season_matches (
                id INT AUTO_INCREMENT PRIMARY KEY,
                season_id INT NOT NULL,
                competition VARCHAR(255),
                match_name VARCHAR(255),
                match_date DATE,
                location VARCHAR(255),
                category VARCHAR(100),
                referee_1 VARCHAR(100),
                referee_2 VARCHAR(100),
                team_a_name VARCHAR(255),
                team_b_name VARCHAR(255),
                score_a INT DEFAULT 0,
                score_b INT DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (season_id) REFERENCES coach_seasons(id) ON DELETE CASCADE
            )
        `);
        console.log('Table "season_matches" created or already exists.');

        await connection.query(`
            CREATE TABLE IF NOT EXISTS match_player_stats (
                id INT AUTO_INCREMENT PRIMARY KEY,
                match_id INT NOT NULL,
                player_id INT NOT NULL,
                in_game BOOLEAN DEFAULT false,
                points INT DEFAULT 0,
                fouls INT DEFAULT 0,
                FOREIGN KEY (match_id) REFERENCES season_matches(id) ON DELETE CASCADE,
                FOREIGN KEY (player_id) REFERENCES season_players(id) ON DELETE CASCADE,
                UNIQUE KEY unique_match_player (match_id, player_id)
            )
        `);
        console.log('Table "match_player_stats" created or already exists.');

        await connection.end();
        console.log('Schema update complete.');
    } catch (err) {
        console.error('Error updating schema:', err);
    }
}

updateSchema();
