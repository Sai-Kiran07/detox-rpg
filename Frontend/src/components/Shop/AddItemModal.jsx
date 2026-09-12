import React, { useEffect, useState } from 'react';
import { X, Coins, Plus } from 'lucide-react';
import { useGame } from '../../context/GameContext.jsx';

export const AddItemModal = ({ isOpen, onClose }) => {
  const { addPrize } = useGame();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [cost, setCost] = useState(60);
  const [tier, setTier] = useState('Uncommon');
  const [type, setType] = useState('Item');
  const [icon, setIcon] = useState('Gamepad2');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return undefined;
    const onEscape = (event) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onEscape);
    return () => window.removeEventListener('keydown', onEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (event) => {
    event.preventDefault();
    setError('');
    if (!title.trim()) {
      setError('Reward name is required.');
      return;
    }

    addPrize({
      title: title.trim(),
      description,
      cost: Number(cost),
      tier,
      type,
      icon,
    });

    setTitle('');
    setDescription('');
    setCost(60);
    onClose();
  };

  return (
    <div className="arcade-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="reward-modal-title">
      <div className="arcade-card" style={containerStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Coins size={22} color="#f43f5e" />
            <h2 id="reward-modal-title" className="font-arcade" style={{ fontSize: '0.9rem' }}>CREATE REWARD</h2>
          </div>
          <button onClick={onClose} style={closeBtnStyle} aria-label="Close reward modal">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <label htmlFor="reward-title" className="font-arcade" style={labelStyle}>REWARD NAME *</label>
          <input id="reward-title" type="text" value={title} onChange={(event) => setTitle(event.target.value)} style={inputStyle} />

          <label htmlFor="reward-description" className="font-arcade" style={labelStyle}>DESCRIPTION</label>
          <textarea id="reward-description" rows={2} value={description} onChange={(event) => setDescription(event.target.value)} style={{ ...inputStyle, resize: 'none' }} />

          <div className="form-grid-2">
            <div>
              <label htmlFor="reward-cost" className="font-arcade" style={labelStyle}>COIN COST</label>
              <input id="reward-cost" type="number" min="5" max="5000" value={cost} onChange={(event) => setCost(event.target.value)} style={inputStyle} />
            </div>
            <div>
              <label htmlFor="reward-tier" className="font-arcade" style={labelStyle}>RARITY</label>
              <select id="reward-tier" value={tier} onChange={(event) => setTier(event.target.value)} style={inputStyle}>
                <option value="Common">Common</option>
                <option value="Uncommon">Uncommon</option>
                <option value="Rare">Rare</option>
                <option value="Legendary">Legendary</option>
              </select>
            </div>
          </div>

          <div className="form-grid-2">
            <div>
              <label htmlFor="reward-type" className="font-arcade" style={labelStyle}>TYPE</label>
              <select id="reward-type" value={type} onChange={(event) => setType(event.target.value)} style={inputStyle}>
                <option value="Item">Virtual Item</option>
                <option value="Badge">Badge</option>
                <option value="Theme">Theme</option>
              </select>
            </div>
            <div>
              <label htmlFor="reward-icon" className="font-arcade" style={labelStyle}>ICON</label>
              <select id="reward-icon" value={icon} onChange={(event) => setIcon(event.target.value)} style={inputStyle}>
                <option value="Gamepad2">Gamepad</option>
                <option value="Coffee">Coffee</option>
                <option value="UtensilsCrossed">Food</option>
                <option value="Trees">Nature</option>
                <option value="BookOpen">Book</option>
                <option value="Sparkles">Sparkles</option>
              </select>
            </div>
          </div>

          {error && <p role="alert" style={{ color: '#fda4af', marginTop: '0.75rem' }}>{error}</p>}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
            <button type="button" onClick={onClose} className="arcade-btn" style={{ borderColor: 'rgba(255,255,255,0.2)', color: '#cbd5e1' }}>
              CANCEL
            </button>
            <button type="submit" className="arcade-btn arcade-btn-primary">
              <Plus size={14} /> SAVE REWARD
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const containerStyle = {
  maxWidth: '560px',
  width: '100%',
  border: '2px solid var(--neon-magenta)',
  background: '#0e0b1d',
  padding: '1.6rem',
  boxShadow: '0 0 40px rgba(244, 63, 94, 0.4)',
};

const closeBtnStyle = {
  background: 'transparent',
  border: 'none',
  color: '#94a3b8',
  cursor: 'pointer',
};

const labelStyle = {
  display: 'block',
  fontSize: '0.62rem',
  color: '#fda4af',
  marginBottom: '0.35rem',
  marginTop: '0.75rem',
};

const inputStyle = {
  width: '100%',
  padding: '0.65rem',
  borderRadius: '6px',
  background: '#151128',
  border: '1px solid rgba(255, 255, 255, 0.15)',
  color: '#fff',
  fontSize: '0.88rem',
};
