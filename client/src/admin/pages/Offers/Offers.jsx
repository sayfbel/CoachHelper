import React, { useState, useEffect } from 'react';
import { Tag, Plus } from 'lucide-react';
import ConfirmModal from '../../../components/ConfirmModal';
import OfferFormModal from '../../components/OfferFormModal';
import Notification from '../../../components/Notification';

const Offers = () => {
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmModalConfig, setConfirmModalConfig] = useState({ title: '', description: '', onConfirm: () => { } });

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [offerToEdit, setOfferToEdit] = useState(null);
  const [notification, setNotification] = useState({ isVisible: false, message: '', type: 'success' });

  const [offers, setOffers] = useState([]);

  // Fetch offers from database on component mount
  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/offers');
        if (response.ok) {
          const data = await response.json();
          setOffers(data);
        }
      } catch (error) {
        console.error('Failed to fetch offers:', error);
      }
    };
    fetchOffers();
  }, []);

  const showNotification = (message, type = 'success') => {
    setNotification({ isVisible: true, message, type });
  };

  const handleCreateOfferClick = () => {
    setOfferToEdit(null);
    setIsFormModalOpen(true);
  };

  const handleSaveOffer = async (offerData) => {
    if (offerToEdit) {
      try {
        const response = await fetch(`http://localhost:3000/api/offers/${offerToEdit.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(offerData)
        });
        if (response.ok) {
          const result = await response.json();
          setOffers(offers.map(o => o.id === offerToEdit.id ? result.offer : o));
          setIsFormModalOpen(false);
          setOfferToEdit(null);
          showNotification('Offer updated successfully!');
        } else {
          showNotification('Failed to update offer', 'error');
        }
      } catch (error) {
        console.error('Error updating offer:', error);
        showNotification('Error updating offer', 'error');
      }
    } else {
      try {
        const response = await fetch('http://localhost:3000/api/offers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(offerData)
        });

        if (response.ok) {
          const result = await response.json();
          setOffers([...offers, result.offer]);
          setIsFormModalOpen(false);
          showNotification('Offer created successfully!');
        } else {
          showNotification('Failed to save offer', 'error');
        }
      } catch (error) {
        console.error('Error saving offer:', error);
        showNotification('Error saving offer', 'error');
      }
    }
  };

  const handleEditOffer = (offer) => {
    setOfferToEdit(offer);
    setIsFormModalOpen(true);
  };

  const handleDisableOffer = (offer) => {
    setConfirmModalConfig({
      title: 'Delete Offer',
      description: `Are you absolutely sure you want to delete the ${offer.name}? New users will no longer be able to select this tier at checkout.`,
      onConfirm: async () => {
        setIsConfirmModalOpen(false);
        try {
          const response = await fetch(`http://localhost:3000/api/offers/${offer.id}`, {
            method: 'DELETE'
          });
          if (response.ok) {
            setOffers(offers.filter(o => o.id !== offer.id));
            showNotification('Offer deleted successfully!');
          } else {
            showNotification('Failed to delete offer', 'error');
          }
        } catch (error) {
          console.error('Error deleting offer:', error);
          showNotification('Error deleting offer', 'error');
        }
      }
    });
    setIsConfirmModalOpen(true);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div className="responsive-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--accent-primary-faded)', border: '1px solid var(--border-color)', padding: '0.4rem 1rem', borderRadius: '30px', color: 'var(--accent-primary)', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>
            <span>Subscription Plans</span>
          </div>
          <h1 style={{ fontSize: '2.5rem', lineHeight: '1.05', fontFamily: 'var(--font-title)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.03em' }}>
            Manage <span style={{ color: 'var(--accent-primary)' }}>Offers</span>
          </h1>
        </div>
        <button onClick={handleCreateOfferClick} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={16} /> Create Offer
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', width: '100%', padding: '1rem' }}>
        {offers.map((offer) => (
          <div
            key={offer.id}
            className="card text-center relative"
            style={{
              border: offer.is_popular ? '1px solid var(--accent-primary)' : '1px solid var(--border-color)',
              borderTop: `4px solid ${offer.is_popular ? 'var(--accent-primary)' : offer.id === 1 ? 'var(--border-color)' : 'var(--success)'}`,
              transform: offer.is_popular ? 'scale(1.02)' : 'none',
              zIndex: offer.is_popular ? 5 : 1,
              padding: '1rem',
              borderRadius: '24px',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: offer.is_popular ? '0 20px 40px rgba(0,0,0,0.5), 0 0 20px var(--accent-primary-faded)' : 'none'
            }}
          >
            {offer.is_popular && (
              <div style={{ position: 'absolute', top: '-13px', left: '50%', transform: 'translateX(-50%)', background: 'var(--accent-primary)', color: 'var(--bg-primary)', padding: '3px 12px', borderRadius: '10px', fontSize: '0.7rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                MOST POPULAR
              </div>
            )}
            <div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{offer.name}</h3>
              <p style={{ fontSize: '3rem', fontWeight: 900, margin: '1rem 0', fontFamily: 'var(--font-title)', color: 'var(--text-primary)' }}>
                ${offer.price}<span style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: 'normal' }}>/{offer.period}</span>
              </p>
              <p className="text-secondary text-sm mb-8 text-truncate" title={offer.description} style={{ maxWidth: '100%' }}>{offer.description}</p>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button onClick={() => handleEditOffer(offer)} className={offer.is_popular ? "btn btn-primary" : "btn btn-secondary"} style={{ flex: 1, padding: '0.75rem 1rem' }}>Edit</button>
              <button onClick={() => handleDisableOffer(offer)} className="btn btn-danger" style={{ flex: 1 }}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        title={confirmModalConfig.title}
        description={confirmModalConfig.description}
        onConfirm={confirmModalConfig.onConfirm}
        onCancel={() => setIsConfirmModalOpen(false)}
      />

      <OfferFormModal 
        isOpen={isFormModalOpen}
        onClose={() => { setIsFormModalOpen(false); setOfferToEdit(null); }}
        onSubmit={handleSaveOffer}
        offerToEdit={offerToEdit}
      />

      <Notification 
        isVisible={notification.isVisible}
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification({ ...notification, isVisible: false })}
      />
    </div>
  );
};

export default Offers;
