import React, { useState, useEffect } from 'react';
import { Plus, Trophy, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ConfirmModal from '../../../components/ConfirmModal';

const Seasons = () => {
  const [seasons, setSeasons] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ club_name: '', season_year: '' });
  const navigate = useNavigate();

  useEffect(() => {
    fetchSeasons();
  }, []);

  const fetchSeasons = async () => {
    try {
      const res = await fetch('/api/seasons?coach_id=1'); // Default coach 1 for now
      const data = await res.json();
      if (Array.isArray(data)) {
        setSeasons(data);
      }
    } catch (err) {
      console.error('Error fetching seasons:', err);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/seasons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, coach_id: 1 })
      });
      if (res.ok) {
        setIsModalOpen(false);
        setFormData({ club_name: '', season_year: '' });
        fetchSeasons();
      }
    } catch (err) {
      console.error('Error creating season:', err);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <span style={{ background: 'rgba(204, 255, 0, 0.1)', color: 'var(--accent-primary)', padding: '6px 16px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem', display: 'inline-block' }}>TEAM HISTORY</span>
          <h1 style={{ fontSize: '3.5rem', fontFamily: 'var(--font-title)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.03em', color: 'var(--text-primary)', lineHeight: 1 }}>
            MY <span style={{ color: 'var(--accent-primary)' }}>SEASONS</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginTop: '0.5rem', maxWidth: '600px' }}>
            Manage your historical teams, rosters, and match records.
          </p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
          <Plus size={20} /> Add Season
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
        {seasons.map((season) => (
          <div 
            key={season.id} 
            className="card"
            style={{ padding: '2rem', cursor: 'pointer', transition: 'all 0.3s ease', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}
            onClick={() => navigate(`/user/seasons/${season.id}`)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.borderColor = 'var(--accent-primary)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(204,255,0,0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.borderColor = 'var(--border-color)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(204,255,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
              <Trophy size={40} color="var(--accent-primary)" />
            </div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 900, fontFamily: 'var(--font-title)', color: 'var(--text-primary)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              {season.club_name}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
              <Calendar size={18} />
              <span>Season {season.season_year}</span>
            </div>
          </div>
        ))}

        {seasons.length === 0 && (
          <div style={{ gridColumn: '1 / -1', padding: '4rem', textAlign: 'center', background: 'var(--bg-secondary)', borderRadius: '24px', border: '1px dashed var(--border-color)' }}>
            <Trophy size={48} color="var(--text-secondary)" style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
            <h3 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>No Seasons Found</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Click "Add Season" to start building your coaching history.</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(5px)' }}>
          <div className="card" style={{ padding: '2.5rem', width: '100%', maxWidth: '500px' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 900, fontFamily: 'var(--font-title)', color: 'var(--text-primary)', textTransform: 'uppercase', marginBottom: '2rem' }}>
              Create New <span style={{ color: 'var(--accent-primary)' }}>Season</span>
            </h2>
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, marginBottom: '0.5rem' }}>Club / Team Name</label>
                <input 
                  type="text" 
                  className="input-field" 
                  required 
                  placeholder="e.g., City Tigers" 
                  value={formData.club_name}
                  onChange={(e) => setFormData({...formData, club_name: e.target.value})}
                />
              </div>
              <div>
                <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, marginBottom: '0.5rem' }}>Season Year</label>
                <input 
                  type="text" 
                  className="input-field" 
                  required 
                  placeholder="e.g., 2025/2026" 
                  value={formData.season_year}
                  onChange={(e) => setFormData({...formData, season_year: e.target.value})}
                />
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Save Season</button>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary" style={{ flex: 1 }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Seasons;
