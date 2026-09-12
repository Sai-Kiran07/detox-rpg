import React, { useState } from 'react';
import { X, Ticket, Plus } from 'lucide-react';
import { useGame } from '../../context/GameContext.jsx';

export const AddItemModal = ({ isOpen, onClose }) => {
  const { addPrize } = useGame();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [cost, setCost] = useState(60);
  const [tier, setTier] = useState('Uncommon');
  const [icon, setIcon] = useState('Gamepad2');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    addPrize({
      title,
      description,
      cost: Number(cost),
      tier,
      icon,
    });

    setTitle('');
    setDescription('');
    setCost(60);
    onClose();
  };

  const icons = [
    { key: 'Gamepad2', label: '🎮 Video Game / Gaming Break' },
    { key: 'Coffee', label: '☕ Gourmet Coffee / Boba Tea' },
    { key: 'UtensilsCrossed', label: '🍕 Pizza / Champion Feast' },
    { key: 'Trees', label: '🌲 Nature Walk / Park Stroll' },
    { key: 'BookOpen', label: '📖 Manga / Sci-Fi Novel' },
    { key: 'Sparkles', label: '✨ Custom Real-World Indulgence' },
  ];

  return (
    <div className="arcade-modal-overlay">
      <div 
        className="arcade-card"
        style={{
          maxWidth: '540px',
          width: '100%',
          border: '2px solid var(--neon-magenta)',
          background: '#0e0b1d',
          padding: '2rem',
          boxShadow: '0 0 40px rgba(244, 63, 94, 0.4)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <Ticket size={22} color="#f43f5e" />
            <h2 className="font-arcade" style={{ fontSize: '0.95rem', color: '#ffffff' }}>
              STOCK PRIZE COUNTER
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
            }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Prize Name */}
          <div style={{ marginBottom: '1rem' }}>
            <label className="font-arcade" style={{ display: 'block', fontSize: '0.62rem', color: '#fda4af', marginBottom: '0.4rem' }}>
              PRIZE ITEM NAME *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 1-Hour Retro Cyberpunk Gaming Break"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{
                width: '100%',
                padding: '0.7rem 0.85rem',
                borderRadius: '6px',
                background: '#151128',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#ffffff',
                fontSize: '0.92rem',
                outline: 'none',
              }}
            />
          </div>

          {/* Description */}
          <div style={{ marginBottom: '1rem' }}>
            <label className="font-arcade" style={{ display: 'block', fontSize: '0.62rem', color: '#fda4af', marginBottom: '0.4rem' }}>
              REWARD PERK / DETAILS
            </label>
            <textarea
              rows={2}
              placeholder="What guilt-free leisure does this unlock?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{
                width: '100%',
                padding: '0.65rem 0.85rem',
                borderRadius: '6px',
                background: '#151128',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#ffffff',
                fontSize: '0.88rem',
                outline: 'none',
                resize: 'none',
              }}
            />
          </div>

          {/* Price & Tier */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <label className="font-arcade" style={{ display: 'block', fontSize: '0.62rem', color: '#facc15', marginBottom: '0.4rem' }}>
                TICKET COST *
              </label>
              <input
                type="number"
                min="5"
                max="5000"
                required
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem',
                  borderRadius: '6px',
                  background: '#151128',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#fde047',
                  fontSize: '0.92rem',
                  fontWeight: 700,
                  outline: 'none',
                }}
              />
            </div>

            <div>
              <label className="font-arcade" style={{ display: 'block', fontSize: '0.62rem', color: '#facc15', marginBottom: '0.4rem' }}>
                PRIZE RARITY
              </label>
              <select
                value={tier}
                onChange={(e) => setTier(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem',
                  borderRadius: '6px',
                  background: '#151128',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#ffffff',
                  fontSize: '0.85rem',
                  outline: 'none',
                }}
              >
                <option value="Common">Common (Plastic Toy)</option>
                <option value="Uncommon">Uncommon (Snack/Coffee)</option>
                <option value="Rare">Rare (Gaming Pass)</option>
                <option value="Legendary">Legendary (Grand Banquet)</option>
              </select>
            </div>
          </div>

          {/* Icon */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label className="font-arcade" style={{ display: 'block', fontSize: '0.62rem', color: '#06b6d4', marginBottom: '0.4rem' }}>
              PRIZE ICON
            </label>
            <select
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              style={{
                width: '100%',
                padding: '0.65rem',
                borderRadius: '6px',
                background: '#151128',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#ffffff',
                fontSize: '0.85rem',
                outline: 'none',
              }}
            >
              {icons.map((ic) => (
                <option key={ic.key} value={ic.key}>{ic.label}</option>
              ))}
            </select>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button
              type="button"
              onClick={onClose}
              className="arcade-btn"
              style={{ borderColor: 'rgba(255, 255, 255, 0.2)', color: '#cbd5e1' }}
            >
              CANCEL
            </button>
            <button
              type="submit"
              className="arcade-btn arcade-btn-primary"
            >
              <Plus size={14} /> STOCK PRIZE
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
