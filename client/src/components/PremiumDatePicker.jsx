import React, { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';

const PremiumDatePicker = ({ value, onChange, placeholder = 'Select Date' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const [currentMonth, setCurrentMonth] = useState(value ? new Date(value) : new Date());

  const [viewMode, setViewMode] = useState('days'); // 'days' or 'months'

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
        setViewMode('days');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();

  const handlePrev = () => {
    if (viewMode === 'days') {
      setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    } else if (viewMode === 'months') {
      setCurrentMonth(new Date(currentMonth.getFullYear() - 1, currentMonth.getMonth(), 1));
    } else if (viewMode === 'years') {
      setCurrentMonth(new Date(currentMonth.getFullYear() - 12, currentMonth.getMonth(), 1));
    }
  };

  const handleNext = () => {
    if (viewMode === 'days') {
      setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    } else if (viewMode === 'months') {
      setCurrentMonth(new Date(currentMonth.getFullYear() + 1, currentMonth.getMonth(), 1));
    } else if (viewMode === 'years') {
      setCurrentMonth(new Date(currentMonth.getFullYear() + 12, currentMonth.getMonth(), 1));
    }
  };

  const handleDateClick = (day) => {
    const selectedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    // Format as YYYY-MM-DD
    const formattedDate = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;
    onChange(formattedDate);
    setIsOpen(false);
    setViewMode('days');
  };

  const selectedDateObj = value ? new Date(value) : null;
  const isSameDay = (day) => {
    if (!selectedDateObj) return false;
    return (
      selectedDateObj.getDate() === day &&
      selectedDateObj.getMonth() === currentMonth.getMonth() &&
      selectedDateObj.getFullYear() === currentMonth.getFullYear()
    );
  };

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const renderDays = () => {
    const days = [];
    
    // Empty slots for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} style={{ width: '32px', height: '32px' }} />);
    }

    // Actual days
    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected = isSameDay(day);
      days.push(
        <button
          key={day}
          onClick={() => handleDateClick(day)}
          style={{
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '8px',
            border: 'none',
            background: isSelected ? 'var(--accent-primary)' : 'transparent',
            color: isSelected ? 'black' : 'white',
            fontWeight: isSelected ? 'bold' : 'normal',
            cursor: 'pointer',
            fontSize: '0.85rem',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            if (!isSelected) {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isSelected) {
              e.currentTarget.style.background = 'transparent';
            }
          }}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => {
          setIsOpen(!isOpen);
          if (isOpen) setViewMode('days');
        }}
        className="input-field"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          background: isOpen ? '#161616' : '#121212',
          borderColor: isOpen ? 'var(--accent-primary)' : 'var(--border-color)',
          boxShadow: isOpen ? '0 0 0 1px var(--accent-primary), 0 0 15px rgba(204, 255, 0, 0.05)' : 'none',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ color: value ? 'white' : '#a1a1aa' }}>
            {value ? new Date(value).toLocaleDateString() : placeholder}
          </span>
        </div>
        <CalendarIcon size={16} color={value ? 'var(--accent-primary)' : '#a1a1aa'} />
      </button>

      {/* Popover Calendar */}
      {isOpen && (
        <div
          className="animate-fade-in"
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            left: 0,
            width: '280px',
            background: 'rgba(24, 24, 27, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
            padding: '1.25rem',
            zIndex: 50,
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <button onClick={handlePrev} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.2rem', borderRadius: '6px' }} onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.1)'} onMouseLeave={e => e.currentTarget.style.background='transparent'}>
              <ChevronLeft size={18} />
            </button>
            <span 
              style={{ color: 'white', fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer', padding: '0.3rem 0.6rem', borderRadius: '6px', transition: 'background 0.2s' }}
              onClick={() => {
                if (viewMode === 'days') setViewMode('months');
                else if (viewMode === 'months') setViewMode('years');
                else setViewMode('days');
              }}
              onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.05)'}
              onMouseLeave={e => e.currentTarget.style.background='transparent'}
            >
              {viewMode === 'days' ? `${monthNames[currentMonth.getMonth()]} ${currentMonth.getFullYear()}` : 
               viewMode === 'months' ? currentMonth.getFullYear() :
               `${currentMonth.getFullYear() - 5} - ${currentMonth.getFullYear() + 6}`}
            </span>
            <button onClick={handleNext} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.2rem', borderRadius: '6px' }} onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.1)'} onMouseLeave={e => e.currentTarget.style.background='transparent'}>
              <ChevronRight size={18} />
            </button>
          </div>

          {viewMode === 'years' ? (
            <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', padding: '0.5rem 0' }}>
              {Array.from({ length: 12 }).map((_, i) => {
                const year = currentMonth.getFullYear() - 5 + i;
                const isSelected = currentMonth.getFullYear() === year;
                return (
                  <button
                    key={year}
                    onClick={() => {
                      setCurrentMonth(new Date(year, currentMonth.getMonth(), 1));
                      setViewMode('months');
                    }}
                    style={{
                      padding: '0.75rem 0.5rem',
                      background: isSelected ? 'var(--accent-primary)' : 'transparent',
                      color: isSelected ? 'black' : 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '0.85rem',
                      fontWeight: isSelected ? 'bold' : 'normal',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    {year}
                  </button>
                );
              })}
            </div>
          ) : viewMode === 'months' ? (
            <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', padding: '0.5rem 0' }}>
              {monthNames.map((month, index) => {
                const isSelected = currentMonth.getMonth() === index;
                return (
                  <button
                    key={month}
                    onClick={() => {
                      setCurrentMonth(new Date(currentMonth.getFullYear(), index, 1));
                      setViewMode('days');
                    }}
                    style={{
                      padding: '0.75rem 0.5rem',
                      background: isSelected ? 'var(--accent-primary)' : 'transparent',
                      color: isSelected ? 'black' : 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '0.85rem',
                      fontWeight: isSelected ? 'bold' : 'normal',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    {month.substring(0, 3)}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="animate-fade-in">
              {/* Days of Week */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '0.5rem' }}>
                {daysOfWeek.map(day => (
                  <div key={day} style={{ textAlign: 'center', color: '#a1a1aa', fontSize: '0.75rem', fontWeight: 600 }}>
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
                {renderDays()}
              </div>
            </div>
          )}
          
          {/* Clear Button */}
          {value && (
             <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center' }}>
                <button 
                  onClick={() => { onChange(''); setIsOpen(false); }}
                  style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer', width: '100%', transition: 'background 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.background='rgba(239, 68, 68, 0.2)'}
                  onMouseLeave={e => e.currentTarget.style.background='rgba(239, 68, 68, 0.1)'}
                >
                  Clear Date
                </button>
             </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PremiumDatePicker;
