
// ==========================================
// COACH HISTORY (SEASONS, PLAYERS, MATCHES)
// ==========================================

// Get all seasons for a coach
app.get('/api/seasons', async (req, res) => {
    // Ideally we filter by req.user.id but for MVP we return all or pass coach_id
    const coach_id = req.query.coach_id || 1; // Default to 1 for testing
    try {
        const [rows] = await pool.execute('SELECT * FROM coach_seasons WHERE coach_id = ? ORDER BY created_at DESC', [coach_id]);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching seasons' });
    }
});

// Create a new season
app.post('/api/seasons', async (req, res) => {
    const { club_name, season_year, coach_id } = req.body;
    if (!club_name || !season_year) {
        return res.status(400).json({ message: 'Club name and season year required' });
    }
    const cId = coach_id || 1;
    try {
        const [result] = await pool.execute(
            'INSERT INTO coach_seasons (coach_id, club_name, season_year) VALUES (?, ?, ?)',
            [cId, club_name, season_year]
        );
        res.status(201).json({ id: result.insertId, club_name, season_year, coach_id: cId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error creating season' });
    }
});

// Delete a season
app.delete('/api/seasons/:id', async (req, res) => {
    try {
        await pool.execute('DELETE FROM coach_seasons WHERE id = ?', [req.params.id]);
        res.json({ message: 'Season deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error deleting season' });
    }
});

// Get players for a season
app.get('/api/seasons/:season_id/players', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM season_players WHERE season_id = ?', [req.params.season_id]);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching players' });
    }
});

// Add player to a season
app.post('/api/seasons/:season_id/players', async (req, res) => {
    const { player_name, license_number, jersey_number } = req.body;
    const season_id = req.params.season_id;
    if (!player_name) return res.status(400).json({ message: 'Player name required' });
    try {
        const [result] = await pool.execute(
            'INSERT INTO season_players (season_id, player_name, license_number, jersey_number) VALUES (?, ?, ?, ?)',
            [season_id, player_name, license_number || '', jersey_number || null]
        );
        res.status(201).json({ id: result.insertId, season_id, player_name, license_number, jersey_number });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error adding player' });
    }
});

// Delete a player
app.delete('/api/players/:id', async (req, res) => {
    try {
        await pool.execute('DELETE FROM season_players WHERE id = ?', [req.params.id]);
        res.json({ message: 'Player deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error deleting player' });
    }
});

// Get matches for a season
app.get('/api/seasons/:season_id/matches', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM season_matches WHERE season_id = ? ORDER BY match_date DESC', [req.params.season_id]);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching matches' });
    }
});

// Get single match details with player stats
app.get('/api/matches/:id', async (req, res) => {
    try {
        const [matchRows] = await pool.execute('SELECT * FROM season_matches WHERE id = ?', [req.params.id]);
        if (matchRows.length === 0) return res.status(404).json({ message: 'Match not found' });
        
        const match = matchRows[0];
        // Get stats joined with player info
        const [stats] = await pool.execute(`
            SELECT mps.*, sp.player_name, sp.jersey_number, sp.license_number 
            FROM match_player_stats mps
            JOIN season_players sp ON mps.player_id = sp.id
            WHERE mps.match_id = ?
        `, [req.params.id]);
        
        match.stats = stats;
        res.json(match);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching match' });
    }
});

// Create a new match
app.post('/api/seasons/:season_id/matches', async (req, res) => {
    const { 
        competition, match_name, match_date, location, category, 
        referee_1, referee_2, team_a_name, team_b_name, score_a, score_b 
    } = req.body;
    const season_id = req.params.season_id;
    try {
        const [result] = await pool.execute(
            \`INSERT INTO season_matches (
                season_id, competition, match_name, match_date, location, 
                category, referee_1, referee_2, team_a_name, team_b_name, score_a, score_b
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)\`,
            [
                season_id, competition || '', match_name || '', match_date || null, location || '', 
                category || '', referee_1 || '', referee_2 || '', team_a_name || '', team_b_name || '', 
                score_a || 0, score_b || 0
            ]
        );
        res.status(201).json({ id: result.insertId, season_id, ...req.body });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error creating match' });
    }
});

// Update a match
app.put('/api/matches/:id', async (req, res) => {
    const { 
        competition, match_name, match_date, location, category, 
        referee_1, referee_2, team_a_name, team_b_name, score_a, score_b 
    } = req.body;
    try {
        await pool.execute(
            \`UPDATE season_matches SET 
                competition = ?, match_name = ?, match_date = ?, location = ?, 
                category = ?, referee_1 = ?, referee_2 = ?, team_a_name = ?, team_b_name = ?, 
                score_a = ?, score_b = ?
             WHERE id = ?\`,
            [
                competition, match_name, match_date, location, category, 
                referee_1, referee_2, team_a_name, team_b_name, score_a, score_b, 
                req.params.id
            ]
        );
        res.json({ message: 'Match updated' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error updating match' });
    }
});

// Save match stats (bulk insert/update)
app.post('/api/matches/:id/stats', async (req, res) => {
    const match_id = req.params.id;
    const { stats } = req.body; // Array of { player_id, in_game, points, fouls }
    
    try {
        for (const stat of stats) {
            await pool.execute(\`
                INSERT INTO match_player_stats (match_id, player_id, in_game, points, fouls)
                VALUES (?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE
                in_game = VALUES(in_game), points = VALUES(points), fouls = VALUES(fouls)
            \`, [match_id, stat.player_id, stat.in_game ? 1 : 0, stat.points || 0, stat.fouls || 0]);
        }
        res.json({ message: 'Stats saved successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error saving stats' });
    }
});
