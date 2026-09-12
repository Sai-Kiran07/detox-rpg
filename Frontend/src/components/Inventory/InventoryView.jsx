import React from 'react';
import { Backpack, Sparkles, BookOpen, Coffee, Gamepad2, UtensilsCrossed, Trees, Shield } from 'lucide-react';
import { useGame } from '../../context/GameContext.jsx';

export const InventoryView = () => {
  const { inventory, profile } = useGame();

  const renderIcon = (iconName) => {
    const props = { size: 26, strokeWidth: 1.8 };
    switch (iconName) {
      case 'Coffee': return <Coffee {...props} color="#fbbf24" />;
      case 'Gamepad2': return <Gamepad2 {...props} color="#c084fc" />;
      case 'UtensilsCrossed': return <UtensilsCrossed {...props} color="#f87171" />;
      case 'Trees': return <Trees {...props} color="#34d399" />;
      case 'BookOpen': return <BookOpen {...props} color="#38bdf8" />;
      default: return <Sparkles {...props} color="#fbbf24" />;
    }
  };

  const getRarityClass = (diff) => {
    switch (diff?.toLowerCase()) {
      case 'uncommon': return 'rarity-uncommon';
      case 'rare': return 'rarity-rare';
      case 'epic': return 'rarity-epic';
      case 'legendary': return 'rarity-legendary';
      default: return 'rarity-common';
    }
  };

  return (
    <div style={{ maxWidth: '980px', margin: '0 auto', paddingBottom: '3rem' }}>
      {/* Header */}
      <div style={{
        marginBottom: '1.75rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        paddingBottom: '1.25rem'
      }}>
        <span style={{ fontSize: '0.75rem', color: '#a855f7', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 700 }}>
          Adventurer's Haversack
        </span>
        <h2 className="font-cinzel" style={{
          fontSize: '1.9rem',
          fontWeight: 800,
          letterSpacing: '0.04em',
          color: '#f8fafc',
          lineHeight: 1.2
        }}>
          Grimoire & Vault Artifacts
        </h2>
        <p style={{ fontSize: '0.88rem', color: '#94a3b8', marginTop: '0.2rem' }}>
          All spoils, consumables, and relics claimed across your academic and personal expeditions.
        </p>
      </div>

      {/* Relic Slots Summary */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div className="arcane-card" style={{ padding: '1.25rem', border: '1px solid rgba(168, 85, 247, 0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <Shield size={20} color="#c084fc" />
            <h4 className="font-cinzel" style={{ color: '#e9d5ff', fontWeight: 700, fontSize: '0.95rem' }}>
              Passive Attunement
            </h4>
          </div>
          <p style={{ fontSize: '0.82rem', color: '#cbd5e1', lineHeight: 1.4 }}>
            {profile.name} currently holds <strong style={{ color: '#fde68a' }}>{inventory.length}</strong> arcane relics.
            Every completed tier amplifies your study stamina and daily gold yields.
          </p>
        </div>

        <div className="arcane-card" style={{ padding: '1.25rem', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <Sparkles size={20} color="#fbbf24" />
            <h4 className="font-cinzel" style={{ color: '#fde68a', fontWeight: 700, fontSize: '0.95rem' }}>
              Spellweaver Tier
            </h4>
          </div>
          <p style={{ fontSize: '0.82rem', color: '#cbd5e1', lineHeight: 1.4 }}>
            Rank {profile.level} allows attunement to up to 6 simultaneous blessing slots.
          </p>
        </div>
      </div>

      {/* Inventory Grid */}
      {inventory.length === 0 ? (
        <div 
          className="arcane-card"
          style={{
            padding: '3.5rem 2rem',
            textAlign: 'center',
            border: '1px dashed rgba(168, 85, 247, 0.3)',
            background: 'rgba(11, 14, 24, 0.5)'
          }}
        >
          <Backpack size={48} color="#64748b" style={{ margin: '0 auto 1rem' }} />
          <h3 className="font-cinzel" style={{ fontSize: '1.25rem', color: '#f8fafc', marginBottom: '0.5rem' }}>
            Your Haversack is Empty
          </h3>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', maxWidth: '380px', margin: '0 auto' }}>
            Visit The Armory to claim restorative treats and sacred relics using your quest bounties.
          </p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1.25rem',
        }}>
          {inventory.map((item) => (
            <div
              key={item.id}
              className={`arcane-card ${getRarityClass(item.rarity)}`}
              style={{
                padding: '1.35rem',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '1rem',
              }}
            >
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                {renderIcon(item.icon)}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <h4 className="font-cinzel" style={{ fontSize: '0.98rem', fontWeight: 700, color: '#f8fafc' }}>
                    {item.title}
                  </h4>
                </div>

                <p style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.4, marginBottom: '0.5rem' }}>
                  {item.description}
                </p>

                <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                  Acquired: {item.acquiredAt || 'In possession'}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
