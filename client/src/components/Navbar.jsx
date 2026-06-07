import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserCircle } from 'lucide-react';
import Logo from './Logo';

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
            <Logo style={{ marginRight: '0.6rem' }} />
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
