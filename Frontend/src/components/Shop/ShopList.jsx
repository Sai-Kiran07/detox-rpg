import React, { useState } from 'react';
import { 
  Ticket, 
  Plus, 
  Trash2, 
  Gamepad2, 
  Coffee, 
  UtensilsCrossed, 
  Trees, 
  BookOpen, 
  Sparkles,
  Lock
} from 'lucide-react';
import { useGame } from '../../context/GameContext.jsx';
import { AddItemModal } from './AddItemModal.jsx';

export const ShopList = () => {
  const { profile, prizes, buyPrize, deletePrize } = useGame();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const renderIcon = (iconName) => {
    const props = { size: 28, strokeWidth: 1.8 };
    switch (iconName) {
      case 'Coffee': return <Coffee {...props} color="#facc15" />;
      case 'Gamepad2': return <Gamepad2 {...props} color="#f43f5e" />;
      case 'UtensilsCrossed': return <UtensilsCrossed {...props} color="#fb7185" />;
      case 'Trees': return <Trees {...props} color="#34d399" />;
      case 'BookOpen': return <BookOpen {...props} color="#38bdf8" />;
      default: return <Sparkles {...props} color="#facc15" />;
    }
  };

  const getTierBorder = (tier) => {
    switch (tier?.toLowerCase()) {
      case 'legendary': return '2px solid #facc15';
      case 'rare': return '2px solid #f43f5e';
      case 'uncommon': return '2px solid #06b6d4';
      default: return '2px solid rgba(255, 255, 255, 0.15)';
    }
  };

  return (
    <div style={{ maxWidth: '980px', margin: '0 auto', paddingBottom: '3rem' }}>
      {/* 1. Header with Ticket Reservoir */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '1.75rem',
        borderBottom: '2px solid rgba(244, 63, 94, 0.25)',
        paddingBottom: '1.25rem'
      }}>
        <div>
          <span className="font-arcade" style={{ fontSize: '0.68rem', color: '#f43f5e', letterSpacing: '0.12em' }}>
            // REDEMPTION ARCADE DESK //
          </span>
          <h2 className="font-arcade" style={{
            fontSize: '1.6rem',
            color: '#ffffff',
            marginTop: '0.35rem',
            textShadow: '0 0 12px rgba(244, 63, 94, 0.6)'
          }}>
            TICKET PRIZE COUNTER
          </h2>
          <p style={{ fontSize: '0.88rem', color: '#94a3b8', marginTop: '0.3rem' }}>
            Redeem tickets earned from clearing life stages for real-world rewards and recharge passes.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          {/* Ticket Balance Box */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '0.65rem 1.25rem',
            background: 'linear-gradient(135deg, rgba(244, 63, 94, 0.2) 0%, rgba(159, 18, 57, 0.2) 100%)',
            border: '2px solid #f43f5e',
            borderRadius: '8px',
            boxShadow: '0 0 20px rgba(244, 63, 94, 0.3)'
          }}>
            <Ticket size={22} color="#f43f5e" />
            <div>
              <div style={{ fontSize: '0.62rem', color: '#fda4af', textTransform: 'uppercase' }}>TICKETS IN WALLET</div>
              <div className="font-arcade" style={{ fontSize: '1.1rem', color: '#ffffff' }}>
                {profile.tickets} <span style={{ fontSize: '0.75rem', color: '#f43f5e' }}>TIX</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="arcade-btn arcade-btn-primary"
          >
            <Plus size={16} /> STOCK PRIZE
          </button>
        </div>
      </div>

      {/* 2. Prize Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
        gap: '1.25rem'
      }}>
        {prizes.map((prize) => {
          const canAfford = profile.tickets >= prize.cost;

          return (
            <div
              key={prize.id}
              className="arcade-card"
              style={{
                padding: '1.35rem',
                border: getTierBorder(prize.tier),
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                {/* Header Row: Icon & Tier */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    {renderIcon(prize.icon)}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span 
                      className="font-arcade"
                      style={{
                        fontSize: '0.58rem',
                        color: prize.tier === 'Legendary' ? '#facc15' : prize.tier === 'Rare' ? '#f43f5e' : '#06b6d4',
                        background: 'rgba(255, 255, 255, 0.05)',
                        padding: '3px 6px',
                        borderRadius: '4px',
                      }}
                    >
                      {prize.tier ? prize.tier.toUpperCase() : 'COMMON'}
                    </span>

                    <button
                      onClick={() => deletePrize(prize.id)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#64748b',
                        cursor: 'pointer',
                        padding: '3px',
                      }}
                      title="Retire prize from counter"
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#ef4444')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = '#64748b')}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                {/* Title */}
                <h3 style={{
                  fontSize: '1.05rem',
                  fontWeight: 700,
                  color: '#ffffff',
                  marginBottom: '0.35rem',
                  lineHeight: 1.35
                }}>
                  {prize.title}
                </h3>

                {/* Description */}
                <p style={{
                  fontSize: '0.84rem',
                  color: '#94a3b8',
                  lineHeight: 1.45,
                  marginBottom: '1.25rem'
                }}>
                  {prize.description}
                </p>
              </div>

              {/* Price & Claim CTA */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '0.85rem',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Ticket size={16} color="#f43f5e" />
                  <span className="font-arcade" style={{ fontSize: '0.88rem', color: '#fda4af' }}>
                    {prize.cost} <span style={{ fontSize: '0.62rem', color: '#94a3b8' }}>TIX</span>
                  </span>
                </div>

                <button
                  onClick={(e) => buyPrize(prize, e)}
                  disabled={!canAfford}
                  className={`arcade-btn ${canAfford ? 'arcade-btn-primary' : ''}`}
                  style={{
                    fontSize: '0.68rem',
                    padding: '0.5rem 0.9rem',
                    opacity: canAfford ? 1 : 0.45,
                    cursor: canAfford ? 'pointer' : 'not-allowed',
                  }}
                >
                  {canAfford ? 'CLAIM PRIZE' : 'NEED TICKETS'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Modal */}
      <AddItemModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};
