import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';

const MatchScoresheetForm = () => {
  const { season_id, match_id } = useParams();
  const navigate = useNavigate();
  const isNew = match_id === 'new';

  const [players, setPlayers] = useState([]);
  
  const [matchData, setMatchData] = useState({
    competition: '',
    match_name: '',
    match_date: new Date().toISOString().split('T')[0],
    location: '',
    category: '',
    referee_1: '',
    referee_2: '',
    team_a_name: '',
    team_b_name: '',
    score_a: 0,
    score_b: 0
  });

  // State to hold individual player stats: array of { player_id, in_game, points, fouls }
  const [stats, setStats] = useState([]);

  useEffect(() => {
    fetchPlayers();
    if (!isNew) {
      fetchMatchData();
    }
  }, [season_id, match_id]);

  const fetchPlayers = async () => {
    try {
      const res = await fetch(`/api/seasons/${season_id}/players`);
      const data = await res.json();
      setPlayers(data);
      
      // Initialize stats if it's a new match
      if (isNew) {
        setStats(data.map(p => ({
          player_id: p.id,
          in_game: false,
          points: 0,
          fouls: 0
        })));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMatchData = async () => {
    try {
      const res = await fetch(`/api/matches/${match_id}`);
      const data = await res.json();
      
      // format date for input
      if (data.match_date) {
        data.match_date = data.match_date.split('T')[0];
      }
      
      setMatchData({
        competition: data.competition || '',
        match_name: data.match_name || '',
        match_date: data.match_date || '',
        location: data.location || '',
        category: data.category || '',
        referee_1: data.referee_1 || '',
        referee_2: data.referee_2 || '',
        team_a_name: data.team_a_name || '',
        team_b_name: data.team_b_name || '',
        score_a: data.score_a || 0,
        score_b: data.score_b || 0
      });

      // Merge fetched stats with all players (in case new players were added to roster later)
      if (data.stats) {
        const fetchedStatsMap = {};
        data.stats.forEach(s => fetchedStatsMap[s.player_id] = s);
        
        const mergedStats = players.map(p => ({
          player_id: p.id,
          in_game: fetchedStatsMap[p.id] ? fetchedStatsMap[p.id].in_game : false,
          points: fetchedStatsMap[p.id] ? fetchedStatsMap[p.id].points : 0,
          fouls: fetchedStatsMap[p.id] ? fetchedStatsMap[p.id].fouls : 0
        }));
        setStats(mergedStats.length > 0 ? mergedStats : data.stats);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Safe merge logic if players load after match data
  useEffect(() => {
    if (!isNew && players.length > 0 && stats.length > 0 && stats.length < players.length) {
      const statMap = {};
      stats.forEach(s => statMap[s.player_id] = s);
      setStats(players.map(p => ({
        player_id: p.id,
        in_game: statMap[p.id] ? statMap[p.id].in_game : false,
        points: statMap[p.id] ? statMap[p.id].points : 0,
        fouls: statMap[p.id] ? statMap[p.id].fouls : 0
      })));
    }
  }, [players]);

  const handleMatchDataChange = (e) => {
    setMatchData({ ...matchData, [e.target.name]: e.target.value });
  };

  const handleStatChange = (playerId, field, value) => {
    setStats(stats.map(s => {
      if (s.player_id === playerId) {
        return { ...s, [field]: value };
      }
      return s;
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      let mId = match_id;
      
      // 1. Save match details
      if (isNew) {
        const res = await fetch(`/api/seasons/${season_id}/matches`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(matchData)
        });
        const data = await res.json();
        mId = data.id;
      } else {
        await fetch(`/api/matches/${match_id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(matchData)
        });
      }

      // 2. Save stats
      await fetch(`/api/matches/${mId}/stats`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stats })
      });

      navigate(`/user/seasons/${season_id}`);
    } catch (err) {
      console.error('Error saving scoresheet:', err);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <button onClick={() => navigate(`/user/seasons/${season_id}`)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ArrowLeft size={20} /> Back
        </button>
        <button onClick={handleSave} className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Save size={18} /> Save Scoresheet
        </button>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-title)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.03em', color: 'var(--text-primary)', lineHeight: 1 }}>
          OFFICIAL <span style={{ color: 'var(--accent-primary)' }}>SCORESHEET</span>
        </h1>
      </div>

      <div className="card" style={{ padding: '2rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '24px', border: '1px solid var(--border-color)', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.2rem', color: 'var(--accent-primary)', textTransform: 'uppercase', fontWeight: 800, marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>Match Details</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 600, marginBottom: '0.5rem' }}>Competition</label>
            <input type="text" className="input-field" name="competition" value={matchData.competition} onChange={handleMatchDataChange} placeholder="e.g., Regional League" />
          </div>
          <div>
            <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 600, marginBottom: '0.5rem' }}>Match Name</label>
            <input type="text" className="input-field" name="match_name" value={matchData.match_name} onChange={handleMatchDataChange} placeholder="e.g., Finale, Match 5" />
          </div>
          <div>
            <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 600, marginBottom: '0.5rem' }}>Date</label>
            <input type="date" className="input-field" name="match_date" value={matchData.match_date} onChange={handleMatchDataChange} />
          </div>
          <div>
            <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 600, marginBottom: '0.5rem' }}>Location</label>
            <input type="text" className="input-field" name="location" value={matchData.location} onChange={handleMatchDataChange} placeholder="e.g., Central Arena" />
          </div>
          <div>
            <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 600, marginBottom: '0.5rem' }}>Category</label>
            <input type="text" className="input-field" name="category" value={matchData.category} onChange={handleMatchDataChange} placeholder="e.g., U18 Boys" />
          </div>
          <div>
            <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 600, marginBottom: '0.5rem' }}>Referees</label>
            <input type="text" className="input-field" name="referee_1" value={matchData.referee_1} onChange={handleMatchDataChange} placeholder="Main Referee" style={{ marginBottom: '0.5rem' }}/>
            <input type="text" className="input-field" name="referee_2" value={matchData.referee_2} onChange={handleMatchDataChange} placeholder="Assistant" />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '2rem', background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '16px' }}>
          <div>
            <label style={{ display: 'block', color: 'var(--accent-primary)', fontSize: '0.9rem', textTransform: 'uppercase', fontWeight: 800, marginBottom: '0.5rem' }}>Team A Name</label>
            <input type="text" className="input-field" name="team_a_name" value={matchData.team_a_name} onChange={handleMatchDataChange} placeholder="Home Team" style={{ fontSize: '1.2rem', fontWeight: 'bold' }} />
            <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 600, marginTop: '1rem', marginBottom: '0.5rem' }}>Final Score A</label>
            <input type="number" className="input-field" name="score_a" value={matchData.score_a} onChange={handleMatchDataChange} style={{ fontSize: '2rem', fontWeight: 900, textAlign: 'center', fontFamily: 'var(--font-title)' }} />
          </div>
          <div>
            <label style={{ display: 'block', color: 'var(--accent-primary)', fontSize: '0.9rem', textTransform: 'uppercase', fontWeight: 800, marginBottom: '0.5rem' }}>Team B Name</label>
            <input type="text" className="input-field" name="team_b_name" value={matchData.team_b_name} onChange={handleMatchDataChange} placeholder="Away Team" style={{ fontSize: '1.2rem', fontWeight: 'bold' }} />
            <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 600, marginTop: '1rem', marginBottom: '0.5rem' }}>Final Score B</label>
            <input type="number" className="input-field" name="score_b" value={matchData.score_b} onChange={handleMatchDataChange} style={{ fontSize: '2rem', fontWeight: 900, textAlign: 'center', fontFamily: 'var(--font-title)' }} />
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: '2rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '24px', border: '1px solid var(--border-color)' }}>
        <h2 style={{ fontSize: '1.2rem', color: 'var(--accent-primary)', textTransform: 'uppercase', fontWeight: 800, marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>Player Statistics</h2>
        
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border-color)', textAlign: 'left', color: 'var(--text-secondary)' }}>
              <th style={{ padding: '1rem', fontWeight: 600 }}>N°</th>
              <th style={{ padding: '1rem', fontWeight: 600 }}>Player Name</th>
              <th style={{ padding: '1rem', fontWeight: 600, textAlign: 'center' }}>En Jeu</th>
              <th style={{ padding: '1rem', fontWeight: 600, textAlign: 'center' }}>Points</th>
              <th style={{ padding: '1rem', fontWeight: 600, textAlign: 'center' }}>Fouls (0-5)</th>
            </tr>
          </thead>
          <tbody>
            {players.map(player => {
              const stat = stats.find(s => s.player_id === player.id) || { in_game: false, points: 0, fouls: 0 };
              return (
                <tr key={player.id} style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-primary)', background: stat.in_game ? 'rgba(204,255,0,0.03)' : 'transparent' }}>
                  <td style={{ padding: '1rem', fontWeight: 800, color: 'var(--accent-primary)' }}>{player.jersey_number || '-'}</td>
                  <td style={{ padding: '1rem', fontWeight: 600 }}>{player.player_name}</td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    <input 
                      type="checkbox" 
                      checked={stat.in_game} 
                      onChange={(e) => handleStatChange(player.id, 'in_game', e.target.checked)} 
                      style={{ transform: 'scale(1.5)', cursor: 'pointer', accentColor: 'var(--accent-primary)' }}
                    />
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    <input 
                      type="number" 
                      className="input-field" 
                      style={{ width: '80px', textAlign: 'center', display: 'inline-block' }}
                      value={stat.points} 
                      onChange={(e) => handleStatChange(player.id, 'points', parseInt(e.target.value) || 0)} 
                    />
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    <select 
                      className="input-field" 
                      style={{ width: '80px', textAlign: 'center', display: 'inline-block', appearance: 'none' }}
                      value={stat.fouls} 
                      onChange={(e) => handleStatChange(player.id, 'fouls', parseInt(e.target.value) || 0)} 
                    >
                      {[0, 1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </td>
                </tr>
              );
            })}
            {players.length === 0 && (
              <tr>
                <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No players found in this season's roster. Add players first.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
    </div>
  );
};

export default MatchScoresheetForm;
