import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserCircle } from 'lucide-react';
import logo from '../assets/hoopchach.png';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const handleNavClick = (sectionId) => {
    if (location.pathname === '/') {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate('/', { state: { scrollTo: sectionId } });
    }
  };

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      background: 'var(--bg-glass)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-color)',
      padding: '0.5rem 0',
      borderTopLeftRadius: 'inherit',
      borderTopRightRadius: 'inherit'
    }}>
      <div className="container flex justify-between items-center" style={{ padding: '0.5rem 2.5rem' }}>
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '0.6rem' }}>
              {/* Trend Arrow */}
              <path d="M15 48 L35 22 L55 42 L85 12" stroke="var(--accent-primary)" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M60 12 L85 12 L85 37" stroke="var(--accent-primary)" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
              {/* Hoop Rim */}
              <path d="M10 58 L90 58" stroke="var(--accent-primary)" strokeWidth="8" strokeLinecap="round" />
              {/* Net */}
              <path d="M20 58 L35 95 M40 58 L50 95 M60 58 L50 95 M80 58 L65 95" stroke="var(--accent-primary)" strokeWidth="5" strokeLinecap="round" />
              <path d="M27 76 L73 76" stroke="var(--accent-primary)" strokeWidth="5" strokeLinecap="round" />
            </svg>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <span style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em', fontFamily: 'var(--font-title)', fontSize: '1.45rem', fontWeight: 900, lineHeight: '1' }}>
                HOOPCOACH
              </span>
              <span style={{ color: 'var(--text-primary)', fontSize: '0.55rem', letterSpacing: '0.02em', fontWeight: 600, marginTop: '2px' }}>
                Analytics. Performance. Success.
              </span>
            </div>
          </div>
        </Link>

        {/* Nav Links */}
        <div className="flex gap-8 items-center text-sm font-semibold">
          <Link to="/" style={{ color: 'var(--text-secondary)', transition: 'var(--transition)' }} onMouseEnter={(e) => e.target.style.color = 'var(--accent-primary)'} onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}>Home</Link>
          <button onClick={() => handleNavClick('features')} style={{ color: 'var(--text-secondary)', transition: 'var(--transition)', background: 'none', border: 'none', padding: 0, fontSize: 'inherit', fontFamily: 'inherit', cursor: 'pointer', fontWeight: 'inherit' }} onMouseEnter={(e) => e.target.style.color = 'var(--accent-primary)'} onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}>Features</button>
          <button onClick={() => handleNavClick('benefits')} style={{ color: 'var(--text-secondary)', transition: 'var(--transition)', background: 'none', border: 'none', padding: 0, fontSize: 'inherit', fontFamily: 'inherit', cursor: 'pointer', fontWeight: 'inherit' }} onMouseEnter={(e) => e.target.style.color = 'var(--accent-primary)'} onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}>Analytics</button>
          <button onClick={() => handleNavClick('pricing')} style={{ color: 'var(--text-secondary)', transition: 'var(--transition)', background: 'none', border: 'none', padding: 0, fontSize: 'inherit', fontFamily: 'inherit', cursor: 'pointer', fontWeight: 'inherit' }} onMouseEnter={(e) => e.target.style.color = 'var(--accent-primary)'} onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}>Pricing</button>
          <button onClick={() => handleNavClick('contact')} style={{ color: 'var(--text-secondary)', transition: 'var(--transition)', background: 'none', border: 'none', padding: 0, fontSize: 'inherit', fontFamily: 'inherit', cursor: 'pointer', fontWeight: 'inherit' }} onMouseEnter={(e) => e.target.style.color = 'var(--accent-primary)'} onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}>Contact</button>
        </div>

        {/* CTA Buttons or Profile */}
        <div className="flex gap-4 items-center">
          {user ? (
            <Link to={user.role === 'admin' ? '/admin' : '/user'} style={{ display: 'flex', alignItems: 'center', borderRadius: '30px', border: '1px solid var(--border-color)', color: 'var(--text-primary)', transition: 'var(--transition)', width: '40px', height: '40px', justifyContent: 'center' }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent-primary)'; e.currentTarget.style.background = 'rgba(204, 255, 0, 0.05)' }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.background = 'transparent' }}>
              <UserCircle size={20} color="var(--accent-primary)" />
            </Link>
          ) : (
            <Link to="/login" className="btn btn-secondary">Login</Link>
          )}
          <Link to="/checkout" className="btn btn-primary">Get Started</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
