import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Users, FileText, ArrowLeft, Plus, Trash2, Edit } from 'lucide-react';

const SeasonDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('roster'); // 'roster' | 'matches'
  
  const [season, setSeason] = useState(null);
  const [players, setPlayers] = useState([]);
  const [matches, setMatches] = useState([]);

  const [isPlayerModalOpen, setIsPlayerModalOpen] = useState(false);
  const [playerForm, setPlayerForm] = useState({ player_name: '', license_number: '', jersey_number: '' });

  useEffect(() => {
    fetchSeasonData();
    fetchPlayers();
    fetchMatches();
  }, [id]);

  const fetchSeasonData = async () => {
    // In a real app we'd have a GET /api/seasons/:id endpoint, 
    // for now we filter the array
    try {
      const res = await fetch(`/api/seasons?coach_id=1`);
      const data = await res.json();
      const current = data.find(s => s.id === parseInt(id));
      setSeason(current);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPlayers = async () => {
    try {
      const res = await fetch(`/api/seasons/${id}/players`);
      setPlayers(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMatches = async () => {
    try {
      const res = await fetch(`/api/seasons/${id}/matches`);
      setMatches(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddPlayer = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/seasons/${id}/players`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(playerForm)
      });
      if (res.ok) {
        setIsPlayerModalOpen(false);
        setPlayerForm({ player_name: '', license_number: '', jersey_number: '' });
        fetchPlayers();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeletePlayer = async (playerId) => {
    if(!window.confirm("Are you sure you want to remove this player?")) return;
    try {
      const res = await fetch(`/api/players/${playerId}`, { method: 'DELETE' });
      if (res.ok) fetchPlayers();
    } catch (err) {
      console.error(err);
    }
  };

  if (!season) return <div style={{ padding: '2rem', color: 'var(--text-primary)' }}>Loading...</div>;

  return (
    <div style={{ padding: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <button onClick={() => navigate('/user/seasons')} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ArrowLeft size={20} /> Back to Seasons
        </button>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '3rem', fontFamily: 'var(--font-title)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.03em', color: 'var(--text-primary)', lineHeight: 1 }}>
          {season.club_name} <span style={{ color: 'var(--accent-primary)' }}>{season.season_year}</span>
        </h1>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
        <button 
          onClick={() => setActiveTab('roster')}
          style={{ 
            background: activeTab === 'roster' ? 'var(--accent-primary)' : 'transparent',
            color: activeTab === 'roster' ? 'var(--bg-primary)' : 'var(--text-primary)',
            padding: '0.75rem 1.5rem', borderRadius: '12px', border: 'none', fontWeight: 700,
            display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', transition: 'all 0.2s'
          }}
        >
          <Users size={18} /> Roster
        </button>
        <button 
          onClick={() => setActiveTab('matches')}
          style={{ 
            background: activeTab === 'matches' ? 'var(--accent-primary)' : 'transparent',
            color: activeTab === 'matches' ? 'var(--bg-primary)' : 'var(--text-primary)',
            padding: '0.75rem 1.5rem', borderRadius: '12px', border: 'none', fontWeight: 700,
            display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', transition: 'all 0.2s'
          }}
        >
          <FileText size={18} /> Matches
        </button>
      </div>

      {/* Roster Tab */}
      {activeTab === 'roster' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', fontWeight: 700 }}>Team Roster</h2>
            <button onClick={() => setIsPlayerModalOpen(true)} className="btn btn-primary" style={{ padding: '0.75rem 1.5rem' }}>
              <Plus size={18} /> Add Player
            </button>
          </div>

          <div className="card" style={{ padding: '1.5rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '24px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left', color: 'var(--text-secondary)' }}>
                  <th style={{ padding: '1rem', fontWeight: 600 }}>N°</th>
                  <th style={{ padding: '1rem', fontWeight: 600 }}>License N°</th>
                  <th style={{ padding: '1rem', fontWeight: 600 }}>Player Name</th>
                  <th style={{ padding: '1rem', fontWeight: 600, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {players.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No players added to this roster yet.</td>
                  </tr>
                ) : (
                  players.map(player => (
                    <tr key={player.id} style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-primary)' }}>
                      <td style={{ padding: '1rem', fontWeight: 800, color: 'var(--accent-primary)' }}>{player.jersey_number || '-'}</td>
                      <td style={{ padding: '1rem' }}>{player.license_number || '-'}</td>
                      <td style={{ padding: '1rem', fontWeight: 600 }}>{player.player_name}</td>
                      <td style={{ padding: '1rem', textAlign: 'right' }}>
                        <button onClick={() => handleDeletePlayer(player.id)} style={{ background: 'transparent', border: 'none', color: 'var(--danger)', cursor: 'pointer' }}>
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Matches Tab */}
      {activeTab === 'matches' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', fontWeight: 700 }}>Matches</h2>
            <button onClick={() => navigate(`/user/seasons/${id}/match/new`)} className="btn btn-primary" style={{ padding: '0.75rem 1.5rem' }}>
              <Plus size={18} /> Add Match
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {matches.length === 0 ? (
              <div className="card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)', background: 'var(--bg-secondary)' }}>
                No matches recorded for this season. Click "Add Match" to fill out a scoresheet.
              </div>
            ) : (
              matches.map(match => (
                <div key={match.id} className="card" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
                  <div>
                    <div style={{ color: 'var(--accent-primary)', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.25rem' }}>{match.competition || 'Friendly'}</div>
                    <div style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                      {match.team_a_name || 'Team A'} <span style={{ color: 'var(--text-secondary)' }}>vs</span> {match.team_b_name || 'Team B'}
                    </div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', display: 'flex', gap: '1rem' }}>
                      <span>{new Date(match.match_date).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{match.location || 'Unknown Location'}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                    <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-primary)', fontFamily: 'var(--font-title)' }}>
                      {match.score_a} - {match.score_b}
                    </div>
                    <button onClick={() => navigate(`/user/seasons/${id}/match/${match.id}`)} className="btn btn-secondary" style={{ padding: '0.75rem 1rem' }}>
                      <Edit size={16} style={{ marginRight: '0.5rem' }}/> Edit Scoresheet
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Add Player Modal */}
      {isPlayerModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(5px)' }}>
          <div className="card" style={{ padding: '2.5rem', width: '100%', maxWidth: '500px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, fontFamily: 'var(--font-title)', color: 'var(--text-primary)', textTransform: 'uppercase', marginBottom: '2rem' }}>
              Add Player to Roster
            </h2>
            <form onSubmit={handleAddPlayer} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 600, marginBottom: '0.5rem' }}>Player Name</label>
                <input type="text" className="input-field" required value={playerForm.player_name} onChange={(e) => setPlayerForm({...playerForm, player_name: e.target.value})} />
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 600, marginBottom: '0.5rem' }}>Jersey N°</label>
                  <input type="number" className="input-field" value={playerForm.jersey_number} onChange={(e) => setPlayerForm({...playerForm, jersey_number: e.target.value})} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 600, marginBottom: '0.5rem' }}>License N°</label>
                  <input type="text" className="input-field" value={playerForm.license_number} onChange={(e) => setPlayerForm({...playerForm, license_number: e.target.value})} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Add Player</button>
                <button type="button" onClick={() => setIsPlayerModalOpen(false)} className="btn btn-secondary" style={{ flex: 1 }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeasonDetail;
