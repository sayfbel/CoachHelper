import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Notification from '../../../components/Notification';
import { PlayCircle, Users, BarChart2, Activity, Shield, Monitor, ArrowRight, Mail, Phone, MapPin, Send } from 'lucide-react';

import heroImage from '../../../assets/hero_dashboard.png';
import deviceImage from '../../../assets/device_showcase.png';
import logo from '../../../assets/hoopchach.png';

const Welcome = () => {
  const location = useLocation();

  const [offersData, setOffersData] = useState([]);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState({ isVisible: false, message: '', type: 'success' });

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch('http://localhost:3000/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        setNotification({ isVisible: true, message: 'Message sent successfully!', type: 'success' });
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setNotification({ isVisible: true, message: 'Failed to send message. Please try again.', type: 'error' });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setNotification({ isVisible: true, message: 'Error sending message. Please check your connection.', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/offers');
        if (response.ok) {
          const data = await response.json();
          setOffersData(data);
        }
      } catch (error) {
        console.error('Failed to fetch offers:', error);
      }
    };
    fetchOffers();
  }, []);

  useEffect(() => {
    if (location.state?.scrollTo) {
      setTimeout(() => {
        const element = document.getElementById(location.state.scrollTo);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [location]);

  return (
    <div className="flex flex-col animate-fade-in" style={{ backgroundColor: 'var(--bg-app)' }}>
      
      <Notification 
        isVisible={notification.isVisible} 
        message={notification.message} 
        type={notification.type} 
        onClose={() => setNotification(prev => ({ ...prev, isVisible: false }))} 
      />

      {/* 1. Hero Section: Asymmetric 2-column */}
      <section className="container flex flex-col lg:flex-row items-center justify-between gap-12" style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', padding: '6.5rem 2.5rem 8rem 2.5rem', minHeight: '75vh' }}>
        <div style={{ flex: '1', minWidth: '320px', maxWidth: '560px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(204, 255, 0, 0.08)', border: '1px solid rgba(204, 255, 0, 0.2)', padding: '0.4rem 1rem', borderRadius: '30px', color: 'var(--accent-primary)', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.5rem' }}>
            <span>BasketBall Analytics V2.0</span>
          </div>
          <h1 style={{ fontSize: '3.75rem', lineHeight: '1.05', fontFamily: 'var(--font-title)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.03em', marginBottom: '1.5rem' }}>
            Transform Basketball Coaching Into <span style={{ color: 'var(--accent-primary)' }}>Data-Driven</span> Success
          </h1>
          <p className="text-lg text-secondary mb-8" style={{ lineHeight: '1.6', fontSize: '1.125rem' }}>
            Track player progress, log match events in real-time, generate automated season metrics, and dominate leagues with intelligent basketball planning tools.
          </p>
          <div className="flex gap-4">
            <Link to="/checkout?plan=monthly" className="btn btn-primary">
              Start Free Trial <ArrowRight size={16} />
            </Link>
            <a href="#features" className="btn btn-secondary">
              Explore Console
            </a>
          </div>
        </div>
        
        <div style={{ flex: '1.1', minWidth: '320px', position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {/* Radial gradient background accent behind mockup */}
          <div style={{ position: 'absolute', width: '380px', height: '380px', background: 'radial-gradient(circle, rgba(204, 255, 0, 0.09) 0%, transparent 70%)', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', pointerEvents: 'none', zIndex: 1 }} />
          
          {/* 3D Rotated Dashboard Preview Card */}
          <div style={{ 
            width: '100%', 
            maxWidth: '580px',
            borderRadius: '24px', 
            padding: '8px', 
            background: '#121212', 
            border: '1px solid rgba(255,255,255,0.06)',
            boxShadow: 'var(--shadow-lg), 0 0 40px rgba(204, 255, 0, 0.04)',
            position: 'relative',
            zIndex: 2,
            transform: 'perspective(1000px) rotateY(-8deg) rotateX(6deg)',
            transition: 'transform 0.5s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'perspective(1000px) rotateY(-8deg) rotateX(6deg)'}
          >
            <img src={heroImage} alt="Dashboard Preview" style={{ width: '100%', height: 'auto', borderRadius: '16px', display: 'block' }} />
          </div>
        </div>
      </section>

      {/* 2. Overlapping Statistics Bar */}
      <div className="container" style={{ position: 'relative', zIndex: 10 }}>
        <div className="stat-overlap-bar">
          <div className="card flex items-center gap-4" style={{ flex: 1, minWidth: '220px', padding: '1.25rem 2rem', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: '1.875rem', fontFamily: 'var(--font-title)', fontWeight: 900, color: 'var(--text-primary)' }}>1,000+</p>
              <p className="text-sm text-secondary">Matches Tracked</p>
            </div>
            <BarChart2 size={28} color="var(--accent-primary)" />
          </div>
          
          <div className="card flex items-center gap-4" style={{ flex: 1, minWidth: '220px', padding: '1.25rem 2rem', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: '1.875rem', fontFamily: 'var(--font-title)', fontWeight: 900, color: 'var(--text-primary)' }}>500+</p>
              <p className="text-sm text-secondary">Coaches Onboard</p>
            </div>
            <Activity size={28} color="var(--accent-secondary)" />
          </div>
          
          <div className="card flex items-center gap-4" style={{ flex: 1, minWidth: '220px', padding: '1.25rem 2rem', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: '1.875rem', fontFamily: 'var(--font-title)', fontWeight: 900, color: 'var(--text-primary)' }}>10,000+</p>
              <p className="text-sm text-secondary">Player Records</p>
            </div>
            <Users size={28} color="var(--success)" />
          </div>
          
          <div className="card flex items-center gap-4" style={{ flex: 1, minWidth: '220px', padding: '1.25rem 2rem', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: '1.875rem', fontFamily: 'var(--font-title)', fontWeight: 900, color: 'var(--text-primary)' }}>95%</p>
              <p className="text-sm text-secondary">Satisfaction Rate</p>
            </div>
            <Shield size={28} color="var(--accent-secondary)" />
          </div>
        </div>
      </div>

      {/* 3. Bento Grid Features Section */}
      <section id="features" className="container py-section" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '5rem' }}>
        <div className="text-center mb-16">
          <div style={{ color: 'var(--accent-primary)', fontSize: '0.8rem', fontFamily: 'var(--font-title)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>
            Premium Features
          </div>
          <h2 className="text-4xl font-bold mb-4" style={{ fontSize: '2.5rem', letterSpacing: '-0.02em' }}>Intelligence Platform</h2>
          <p className="text-secondary max-w-[600px]" style={{ margin: '0 auto' }}>
            Designed exclusively for basketball coaching. We integrate visual performance trackers with live game data streams.
          </p>
        </div>

        <div className="bento-grid">
          {/* Team Management Card - Span 2 columns */}
          <div className="bento-card span-col-2">
            <div>
              <div style={{ background: 'rgba(204, 255, 0, 0.08)', padding: '0.75rem', borderRadius: '12px', display: 'inline-block', marginBottom: '1.5rem', color: 'var(--accent-primary)' }}>
                <Users size={26} />
              </div>
              <h3 className="text-2xl font-bold mb-3" style={{ fontSize: '1.5rem' }}>Team Management</h3>
              <p className="text-secondary" style={{ fontSize: '0.925rem', lineHeight: '1.6' }}>
                Organize player lists, compile roster statistics, classify starting lineups, and manage assistant coaching tasks. Track player availability and detail roles from a unified panel.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '2rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.75rem', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.05)', padding: '5px 12px', borderRadius: '30px', color: '#ccc' }}>Roster Tracking</span>
              <span style={{ fontSize: '0.75rem', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.05)', padding: '5px 12px', borderRadius: '30px', color: '#ccc' }}>Position Mapping</span>
              <span style={{ fontSize: '0.75rem', background: 'rgba(204, 255, 0, 0.08)', border: '1px solid rgba(204, 255, 0, 0.15)', padding: '5px 12px', borderRadius: '30px', color: 'var(--accent-primary)' }}>Bench Stats</span>
            </div>
          </div>

          {/* Player Analytics Card - Span 1 col, Span 2 rows */}
          <div className="bento-card span-row-2">
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ background: 'rgba(255, 255, 255, 0.08)', padding: '0.75rem', borderRadius: '12px', display: 'inline-block', marginBottom: '1.5rem', color: 'var(--accent-secondary)' }}>
                  <BarChart2 size={26} />
                </div>
                <h3 className="text-2xl font-bold mb-3" style={{ fontSize: '1.5rem' }}>Player Analytics</h3>
                <p className="text-secondary" style={{ fontSize: '0.925rem', lineHeight: '1.6' }}>
                  Visualize statistical updates per match, review scoring efficiency charts, and compile season benchmarks automatically. Follow real-time feedback points.
                </p>
              </div>
              
              {/* Nested visual graphic representing player stats */}
              <div style={{ 
                background: '#1a1a1a', 
                borderRadius: '16px', 
                padding: '1.25rem', 
                marginTop: '2rem',
                border: '1px solid rgba(255,255,255,0.03)'
              }}>
                <p style={{ fontSize: '0.75rem', color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', fontWeight: 600 }}>Active Season Win Rate</p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '2.25rem', fontWeight: 950, color: 'var(--accent-primary)', fontFamily: 'var(--font-title)' }}>84%</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--success)', fontWeight: 600 }}>+12% vs last year</span>
                </div>
                {/* Visual bar graph representation */}
                <div style={{ height: '6px', width: '100%', background: '#262626', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: '84%', background: 'var(--accent-primary)', borderRadius: '3px' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Match Statistics Card - Span 1 col */}
          <div className="bento-card">
            <div>
              <div style={{ background: 'rgba(204, 255, 0, 0.08)', padding: '0.65rem', borderRadius: '10px', display: 'inline-block', marginBottom: '1.25rem', color: 'var(--accent-primary)' }}>
                <Activity size={22} />
              </div>
              <h3 className="text-xl font-bold mb-2" style={{ fontSize: '1.25rem' }}>Match Statistics</h3>
              <p className="text-secondary" style={{ fontSize: '0.875rem', lineHeight: '1.5' }}>
                Log shooting attempts, assists, blocks, steals, rebounds, and turnovers directly from the bench.
              </p>
            </div>
          </div>

          {/* Season Archives Card - Span 1 col */}
          <div className="bento-card">
            <div>
              <div style={{ background: 'rgba(255, 255, 255, 0.08)', padding: '0.65rem', borderRadius: '10px', display: 'inline-block', marginBottom: '1.25rem', color: 'var(--accent-secondary)' }}>
                <Shield size={22} />
              </div>
              <h3 className="text-xl font-bold mb-2" style={{ fontSize: '1.25rem' }}>Season Archives</h3>
              <p className="text-secondary" style={{ fontSize: '0.875rem', lineHeight: '1.5' }}>
                Archive history records across league seasons. Review how player stats progress year over year.
              </p>
            </div>
          </div>

          {/* Live Game Dashboard Card - Span 2 columns */}
          <div className="bento-card span-col-2" style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'center' }}>
            <div style={{ flex: '1.2', minWidth: '240px' }}>
              <div style={{ background: 'rgba(204, 255, 0, 0.08)', padding: '0.75rem', borderRadius: '12px', display: 'inline-block', marginBottom: '1.5rem', color: 'var(--accent-primary)' }}>
                <Monitor size={26} />
              </div>
              <h3 className="text-2xl font-bold mb-3" style={{ fontSize: '1.5rem' }}>Live Console</h3>
              <p className="text-secondary" style={{ fontSize: '0.925rem', lineHeight: '1.6' }}>
                Utilize our optimized scoreboard console to record plays in real time. Use keystroke shortcuts to register points, timeouts, and fouls instantly.
              </p>
            </div>
            
            {/* Embedded interactive scoreboard card graphic */}
            <div style={{ 
              flex: '0.8', 
              minWidth: '200px',
              background: 'linear-gradient(135deg, #181818 0%, #1e1e1e 100%)',
              border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: '16px',
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.6rem',
              fontFamily: 'monospace'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#666', fontSize: '0.7rem', fontWeight: 'bold' }}>
                <span>LEAGUE FINAL</span>
                <span style={{ color: 'var(--danger)', animation: 'pulse 1.5s infinite' }}>● LIVE</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '1.3rem', fontWeight: 900, color: 'white' }}>
                <span style={{ fontFamily: 'var(--font-title)' }}>TIGERS</span>
                <span style={{ color: 'var(--accent-primary)', fontSize: '1.5rem' }}>87</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '1.3rem', fontWeight: 900, color: 'white' }}>
                <span style={{ fontFamily: 'var(--font-title)' }}>HORNETS</span>
                <span style={{ fontSize: '1.5rem' }}>84</span>
              </div>
              <div style={{ fontSize: '0.7rem', color: '#888', borderTop: '1px solid #2a2a2a', paddingTop: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
                <span>Q4 - PERIOD 4</span>
                <span>00:14.2</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Flexible Pricing Section */}
      <section id="pricing" className="container py-section" style={{ borderTop: '1px solid var(--border-color)' }}>
        <div className="text-center mb-16">
          <div style={{ color: 'var(--accent-primary)', fontSize: '0.8rem', fontFamily: 'var(--font-title)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>
            Flexible Rates
          </div>
          <h2 className="text-4xl font-bold mb-4" style={{ fontSize: '2.5rem', letterSpacing: '-0.02em' }}>Available Plans</h2>
          <p className="text-secondary max-w-[500px]" style={{ margin: '0 auto' }}>
            Select the perfect package to activate your HoopCoach console. Standard and annual savings options.
          </p>
        </div>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '2rem' }}>
          {offersData.map((offer) => (
            <div 
              key={offer.id} 
              className="card text-center relative" 
              style={{ 
                width: '100%', 
                maxWidth: '320px', 
                borderTop: `4px solid ${offer.is_popular ? 'var(--accent-primary)' : offer.id === 1 ? 'var(--border-color)' : 'var(--success)'}`, 
                transform: offer.is_popular ? 'scale(1.05)' : 'none', 
                zIndex: offer.is_popular ? 5 : 1, 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'space-between', 
                boxShadow: offer.is_popular ? '0 20px 40px rgba(0,0,0,0.5), 0 0 20px rgba(204,255,0,0.05)' : 'none' 
              }}
            >
              {offer.is_popular && (
                <div style={{ position: 'absolute', top: '-13px', left: '50%', transform: 'translateX(-50%)', background: 'var(--accent-primary)', color: 'black', padding: '3px 12px', borderRadius: '10px', fontSize: '0.7rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  MOST POPULAR
                </div>
              )}
              <div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{offer.name}</h3>
                <p style={{ fontSize: '3rem', fontWeight: 900, margin: '1rem 0', fontFamily: 'var(--font-title)', color: 'white' }}>
                  ${offer.price}<span style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: 'normal' }}>/{offer.period}</span>
                </p>
                <p className="text-secondary text-sm mb-8">{offer.description}</p>
              </div>
              <Link to={`/checkout?plan=${offer.period}`} className={offer.is_popular ? "btn btn-primary w-full" : "btn btn-secondary w-full"} style={{ padding: '0.75rem 1.5rem' }}>
                Select {offer.name.split(' ')[0]}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Inspiring Benefits Section */}
      <section id="benefits" className="container py-section" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '5rem' }}>
        <div className="text-center mb-16">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(204, 255, 0, 0.08)', border: '1px solid rgba(204, 255, 0, 0.2)', padding: '0.4rem 1rem', borderRadius: '30px', color: 'var(--accent-primary)', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>
            <span>Explore what's included</span>
          </div>
          <h2 className="text-4xl font-bold mb-4" style={{ fontSize: '2.5rem', letterSpacing: '-0.02em', textTransform: 'none' }}>Inspiring benefits await you</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', width: '100%' }}>
          
          {/* Column 1 */}
          <div className="flex flex-col gap-6" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Card 1: Maximum Creativity (bright neon green card) */}
            <div className="bento-card" style={{ background: 'var(--accent-primary)', color: 'black', minHeight: '220px', padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', border: 'none' }}>
              <div style={{ flex: 1 }} />
              <div>
                <h3 style={{ color: 'black', fontFamily: 'var(--font-title)', fontSize: '1.75rem', textTransform: 'none', letterSpacing: '-0.02em', fontWeight: 900, marginBottom: '0.5rem', lineHeight: '1.1' }}>Maximum creativity</h3>
                <p style={{ color: 'rgba(0, 0, 0, 0.75)', fontSize: '0.9rem', lineHeight: '1.4', fontWeight: 500 }}>
                  Engage audience with your unique style.
                </p>
              </div>
            </div>

            {/* Card 2: Design Iterations (wave chart card) */}
            <div className="bento-card" style={{ minHeight: '320px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '2rem' }}>
              <div style={{ width: '100%', position: 'relative', overflow: 'hidden' }}>
                <svg viewBox="0 0 300 120" style={{ width: '100%', height: 'auto', display: 'block' }}>
                  <defs>
                    <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--accent-primary)" stopOpacity="0.15" />
                      <stop offset="100%" stopColor="var(--accent-primary)" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <line x1="0" y1="20" x2="300" y2="20" stroke="rgba(255,255,255,0.015)" strokeWidth="1" />
                  <line x1="0" y1="50" x2="300" y2="50" stroke="rgba(255,255,255,0.015)" strokeWidth="1" />
                  <line x1="0" y1="80" x2="300" y2="80" stroke="rgba(255,255,255,0.015)" strokeWidth="1" />
                  <path d="M 0 100 Q 60 95 100 80 T 200 48 T 260 25 L 260 120 L 0 120 Z" fill="url(#chartGrad)" />
                  <path d="M 0 100 Q 60 95 100 80 T 200 48 T 260 25" fill="none" stroke="var(--accent-primary)" strokeWidth="3.5" strokeLinecap="round" />
                  <circle cx="260" cy="25" r="5" fill="var(--accent-primary)" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2" style={{ textTransform: 'none', letterSpacing: 'normal' }}>Design iterations</h3>
                <p className="text-secondary text-sm" style={{ lineHeight: '1.5' }}>
                  Get as many design tweaks as you'd like.
                </p>
              </div>
            </div>
          </div>

          {/* Column 2 */}
          <div className="flex flex-col gap-6" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Card 3: Invite people */}
            <div className="bento-card" style={{ minHeight: '160px', padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#444', border: '2.5px solid #a855f7', overflow: 'hidden', zIndex: 3 }}>
                  <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=60" alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#555', border: '2.5px solid #00d4ff', overflow: 'hidden', zIndex: 2, marginLeft: '-10px' }}>
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=60" alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#666', border: '2.5px solid #ff00ea', overflow: 'hidden', zIndex: 1, marginLeft: '-10px' }}>
                  <img src="https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=80&auto=format&fit=crop&q=60" alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ background: 'var(--accent-primary)', color: 'black', padding: '2px 9px', borderRadius: '10px', fontSize: '0.65rem', fontWeight: 'bold', marginLeft: '12px', fontFamily: 'var(--font-title)', boxShadow: '0 0 10px rgba(204,255,0,0.2)' }}>Elijah</div>
              </div>
              <h3 className="text-xl font-bold" style={{ textTransform: 'none', letterSpacing: 'normal' }}>Invite people</h3>
            </div>

            {/* Card 4: Fast iterations */}
            <div className="bento-card" style={{ minHeight: '160px', padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div style={{ position: 'relative', height: '42px', width: '100%' }}>
                <div style={{ position: 'absolute', background: '#1c1c1c', border: '1px solid rgba(255,255,255,0.03)', borderRadius: '8px', padding: '5px 12px', display: 'flex', alignItems: 'center', gap: '0.4rem', top: 0, left: 0, right: '30px', zIndex: 1 }}>
                  <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#666' }} />
                  <span style={{ fontSize: '0.65rem', color: '#666', fontWeight: 'bold' }}>REVIEWED</span>
                </div>
                <div style={{ position: 'absolute', background: '#1c1c1c', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '5px 12px', display: 'flex', alignItems: 'center', gap: '0.4rem', bottom: 0, left: '20px', right: 0, zIndex: 2 }}>
                  <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--accent-primary)' }} />
                  <span style={{ fontSize: '0.65rem', color: 'white', fontWeight: 'bold' }}>LATEST DESIGN</span>
                  <span style={{ fontSize: '0.6rem', color: '#555', marginLeft: 'auto' }}>Today, 11:50</span>
                </div>
              </div>
              <h3 className="text-xl font-bold" style={{ textTransform: 'none', letterSpacing: 'normal' }}>Fast iterations</h3>
            </div>

            {/* Card 5: Custom support */}
            <div className="bento-card" style={{ minHeight: '160px', padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#444', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&auto=format&fit=crop&q=60" alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ background: '#1c1c1c', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '12px 12px 12px 0', padding: '6px 12px' }}>
                  <p style={{ fontSize: '0.65rem', color: '#666', fontWeight: 'bold', marginBottom: '2px' }}>Trina says:</p>
                  <p style={{ fontSize: '0.7rem', color: '#ddd' }}>Hey there! How can I help you?</p>
                </div>
              </div>
              <h3 className="text-xl font-bold" style={{ textTransform: 'none', letterSpacing: 'normal' }}>Custom support</h3>
            </div>
          </div>

          {/* Column 3 */}
          <div className="flex flex-col gap-6" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Card 6: Track progress */}
            <div className="bento-card" style={{ minHeight: '220px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: '55px', paddingLeft: '0.25rem' }}>
                <div style={{ height: '30%', width: '10px', background: 'rgba(204,255,0,0.15)', borderRadius: '3px' }} />
                <div style={{ height: '45%', width: '10px', background: 'rgba(204,255,0,0.25)', borderRadius: '3px' }} />
                <div style={{ height: '35%', width: '10px', background: 'rgba(204,255,0,0.15)', borderRadius: '3px' }} />
                <div style={{ height: '60%', width: '10px', background: 'rgba(204,255,0,0.45)', borderRadius: '3px' }} />
                <div style={{ height: '50%', width: '10px', background: 'rgba(204,255,0,0.35)', borderRadius: '3px' }} />
                <div style={{ height: '80%', width: '10px', background: 'var(--accent-primary)', borderRadius: '3px' }} />
                <div style={{ height: '70%', width: '10px', background: 'rgba(204,255,0,0.7)', borderRadius: '3px' }} />
                <div style={{ height: '90%', width: '10px', background: 'var(--accent-primary)', borderRadius: '3px', boxShadow: '0 0 8px rgba(204,255,0,0.3)' }} />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2" style={{ textTransform: 'none', letterSpacing: 'normal' }}>Track progress</h3>
                <p className="text-secondary text-sm" style={{ lineHeight: '1.5' }}>
                  Blazing fast delivery timing, no fuzz.
                </p>
              </div>
            </div>

            {/* Card 7: 100% Integrated */}
            <div className="bento-card" style={{ minHeight: '320px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '2rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.85rem', width: '100%', maxWidth: '180px', margin: '0.5rem 0' }}>
                {/* Integration Badges */}
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#1c1c1c', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ff4b4b' }}><span style={{ fontWeight: 'bold', fontSize: '0.8rem' }}>Fi</span></div>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#1c1c1c', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00d4ff' }}><span style={{ fontWeight: 'bold', fontSize: '0.8rem' }}>No</span></div>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#1c1c1c', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#44ff44' }}><span style={{ fontWeight: 'bold', fontSize: '0.8rem' }}>Sl</span></div>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#1c1c1c', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}><span style={{ fontWeight: 'bold', fontSize: '0.8rem' }}>X</span></div>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#1c1c1c', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ff9000' }}><span style={{ fontWeight: 'bold', fontSize: '0.8rem' }}>Za</span></div>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#1c1c1c', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#5865f2' }}><span style={{ fontWeight: 'bold', fontSize: '0.8rem' }}>Di</span></div>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2" style={{ textTransform: 'none', letterSpacing: 'normal' }}>100% Integrated</h3>
                <p className="text-secondary text-sm" style={{ lineHeight: '1.5' }}>
                  Seamlessly connect all your existing apps.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 6. Contact Us Section */}
      <section id="contact" className="container py-section" style={{ borderTop: '1px solid var(--border-color)' }}>
        <div className="split-layout">
          {/* Left Column: Contact info details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', maxWidth: '480px' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(204, 255, 0, 0.08)', border: '1px solid rgba(204, 255, 0, 0.2)', padding: '0.4rem 1rem', borderRadius: '30px', color: 'var(--accent-primary)', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.5rem' }}>
                <span>Connect with us</span>
              </div>
              <h2 className="text-4xl font-bold mb-4" style={{ letterSpacing: '-0.02em', fontSize: '2.5rem' }}>Let's work together</h2>
              <p className="text-secondary" style={{ lineHeight: '1.6', fontSize: '0.95rem' }}>
                Have questions about custom club licensing, database integration, or training setups? Contact our team and we'll reply within 24 hours.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                <div style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.05)', color: 'var(--accent-primary)', padding: '0.75rem', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Mail size={20} />
                </div>
                <div>
                  <p style={{ fontSize: '0.75rem', color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 'bold', marginBottom: '2px' }}>Email Support</p>
                  <a href="mailto:support@hoopcoach.com" style={{ fontSize: '0.95rem', fontWeight: 'bold', color: 'white' }}>support@hoopcoach.com</a>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                <div style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.05)', color: 'var(--accent-primary)', padding: '0.75rem', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Phone size={20} />
                </div>
                <div>
                  <p style={{ fontSize: '0.75rem', color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 'bold', marginBottom: '2px' }}>Phone Support</p>
                  <a href="tel:+1234567890" style={{ fontSize: '0.95rem', fontWeight: 'bold', color: 'white' }}>+1 (234) 567-890</a>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                <div style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.05)', color: 'var(--accent-primary)', padding: '0.75rem', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <MapPin size={20} />
                </div>
                <div>
                  <p style={{ fontSize: '0.75rem', color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 'bold', marginBottom: '2px' }}>Headquarters</p>
                  <p style={{ fontSize: '0.95rem', fontWeight: 'bold', color: 'white' }}>Detroit, Michigan, US</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact form card */}
          <div className="card" style={{ padding: '2.5rem' }}>
            <form className="flex flex-col gap-4" onSubmit={handleContactSubmit}>
              <div className="flex flex-col md:flex-row gap-4" style={{ display: 'flex', width: '100%', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label className="block text-sm font-semibold text-secondary mb-1.5" style={{ textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>Full Name</label>
                  <input type="text" className="input-field" placeholder="Coach Carter" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                </div>
                <div style={{ flex: 1 }}>
                  <label className="block text-sm font-semibold text-secondary mb-1.5" style={{ textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>Email Address</label>
                  <input type="email" className="input-field" placeholder="carter@richmond.edu" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-secondary mb-1.5" style={{ textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>Subject</label>
                <input type="text" className="input-field" placeholder="Inquiry about custom plan setups" required value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})} />
              </div>

              <div>
                <label className="block text-sm font-semibold text-secondary mb-1.5" style={{ textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>Message</label>
                <textarea className="input-field" rows="4" placeholder="Write your message here..." style={{ resize: 'none', fontFamily: 'var(--font-body)' }} required value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})}></textarea>
              </div>

              <button type="submit" className="btn btn-primary mt-4 w-full" style={{ padding: '0.95rem 1.5rem', cursor: isSubmitting ? 'not-allowed' : 'pointer', opacity: isSubmitting ? 0.7 : 1 }} disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : 'Send Message'} <Send size={14} style={{ marginLeft: '4px' }} />
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer Branding Section */}
      <footer style={{ borderTop: '1px solid var(--border-color)', background: '#090909', padding: '4.5rem 2.5rem 2.5rem 2.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem', paddingBottom: '3.5rem', maxWidth: '1200px', margin: '0 auto' }}>
          {/* Logo & Description */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <Link to="/" className="text-xl font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em', fontFamily: 'var(--font-title)' }}>
              <img src={logo} alt="HoopCoach Logo" style={{ height: '34px', borderRadius: '6px' }} />
              HOOPCOACH
            </Link>
            <p className="text-secondary text-sm" style={{ lineHeight: '1.6' }}>
              The basketball intelligence platform built for modern head coaches, roster analysis, and live bench stat logging.
            </p>
          </div>

          {/* Quick links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <h4 style={{ fontSize: '0.8rem', color: '#888', letterSpacing: '0.05em', marginBottom: '0.25rem', fontFamily: 'var(--font-title)', textTransform: 'uppercase' }}>Navigation</h4>
            <Link to="/" className="text-sm text-secondary hover:text-accent-primary" style={{ transition: 'var(--transition)' }}>Home</Link>
            <a href="#features" className="text-sm text-secondary hover:text-accent-primary" style={{ transition: 'var(--transition)' }}>Features</a>
            <a href="#benefits" className="text-sm text-secondary hover:text-accent-primary" style={{ transition: 'var(--transition)' }}>Benefits</a>
            <a href="#pricing" className="text-sm text-secondary hover:text-accent-primary" style={{ transition: 'var(--transition)' }}>Pricing</a>
          </div>

          {/* Platform */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <h4 style={{ fontSize: '0.8rem', color: '#888', letterSpacing: '0.05em', marginBottom: '0.25rem', fontFamily: 'var(--font-title)', textTransform: 'uppercase' }}>Dashboard</h4>
            <Link to="/login" className="text-sm text-secondary hover:text-accent-primary" style={{ transition: 'var(--transition)' }}>Coach Login</Link>
            <Link to="/checkout" className="text-sm text-secondary hover:text-accent-primary" style={{ transition: 'var(--transition)' }}>Create Hub</Link>
            <Link to="/login" className="text-sm text-secondary hover:text-accent-primary" style={{ transition: 'var(--transition)' }}>Admin Console</Link>
          </div>

          {/* Contact Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <h4 style={{ fontSize: '0.8rem', color: '#888', letterSpacing: '0.05em', marginBottom: '0.25rem', fontFamily: 'var(--font-title)', textTransform: 'uppercase' }}>Support</h4>
            <p className="text-sm text-secondary">support@hoopcoach.com</p>
            <p className="text-sm text-secondary">+1 (234) 567-890</p>
            <p className="text-sm text-secondary">Mon - Fri: 9AM - 6PM EST</p>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', maxWidth: '1200px', margin: '0 auto' }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            &copy; {new Date().getFullYear()} HoopCoach. All rights reserved. Built for basketball coaches who track success.
          </p>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <a href="#privacy" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', transition: 'var(--transition)' }} onMouseEnter={(e) => e.target.style.color = 'white'} onMouseLeave={(e) => e.target.style.color = 'var(--text-muted)'}>Privacy Policy</a>
            <a href="#terms" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', transition: 'var(--transition)' }} onMouseEnter={(e) => e.target.style.color = 'white'} onMouseLeave={(e) => e.target.style.color = 'var(--text-muted)'}>Terms of Service</a>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Welcome;
