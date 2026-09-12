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
  Lock,
  Cpu,
  Shield,
  Zap,
  Backpack,
  Percent
} from 'lucide-react';
import { useGame } from '../../context/GameContext.jsx';
import { AddItemModal } from './AddItemModal.jsx';
import { soundEffects } from '../../services/soundEffects.js';

export const ShopList = () => {
  const { profile, prizes, buyPrize, deletePrize, chaDiscountPercent, setActiveTab } = useGame();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('all'); // 'all' | 'buff' | 'gear' | 'treat'

  const renderIcon = (iconName) => {
    const props = { size: 28, strokeWidth: 1.8 };
    switch (iconName) {
      case 'Coffee': return <Coffee {...props} color="#facc15" />;
      case 'Gamepad2': return <Gamepad2 {...props} color="#f43f5e" />;
      case 'UtensilsCrossed': return <UtensilsCrossed {...props} color="#fb7185" />;
      case 'Trees': return <Trees {...props} color="#34d399" />;
      case 'BookOpen': return <BookOpen {...props} color="#38bdf8" />;
      case 'Cpu': return <Cpu {...props} color="#06b6d4" />;
      case 'Shield': return <Shield {...props} color="#34d399" />;
      default: return <Sparkles {...props} color="#facc15" />;
    }
  };

  const getTierBorder = (tier) => {
    switch (tier?.toLowerCase()) {
      case 'legendary': return '2px solid #facc15';
      case 'epic': return '2px solid #a855f7';
      case 'rare': return '2px solid #f43f5e';
      case 'uncommon': return '2px solid #06b6d4';
      default: return '2px solid rgba(255, 255, 255, 0.15)';
    }
  };

  const filteredPrizes = prizes.filter((p) => {
    if (categoryFilter === 'all') return true;
    return p.category === categoryFilter;
  });

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
            Redeem tickets earned from clearing life stages for stat gear, streak shields, and real-world treats.
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

      {/* 2. Charisma Perk Banner & Quick Inventory Link */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        padding: '0.85rem 1.25rem',
        borderRadius: '8px',
        background: 'rgba(168, 85, 247, 0.1)',
        border: '1px solid rgba(168, 85, 247, 0.3)',
        marginBottom: '1.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Percent size={18} color="#c084fc" />
          <span style={{ fontSize: '0.85rem', color: '#e9d5ff' }}>
            <strong className="font-arcade" style={{ fontSize: '0.75rem', color: '#facc15' }}>CHA HAGGLE PERK:</strong>{' '}
            Your {profile.attributes.CHA || 10} Charisma grants a{' '}
            <strong style={{ color: '#34d399' }}>{chaDiscountPercent}% discount</strong> on all Prize Counter items!
          </span>
        </div>

        <button
          onClick={() => {
            soundEffects.playClick();
            setActiveTab('inventory');
          }}
          className="arcade-btn"
          style={{ fontSize: '0.62rem', padding: '0.4rem 0.85rem' }}
        >
          <Backpack size={13} /> VIEW MY INVENTORY LOCKER
        </button>
      </div>

      {/* 3. Category Filter Tabs */}
      <div style={{
        display: 'flex',
        gap: '0.35rem',
        background: 'rgba(18, 14, 32, 0.8)',
        padding: '4px',
        borderRadius: '6px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        marginBottom: '1.5rem',
        width: 'fit-content'
      }}>
        {[
          { key: 'all', label: 'ALL PRIZES' },
          { key: 'buff', label: 'POWER-UPS & BUFFS' },
          { key: 'gear', label: 'TACTICAL GEAR' },
          { key: 'treat', label: 'TREAT VOUCHERS' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              soundEffects.playClick();
              setCategoryFilter(tab.key);
            }}
            className="font-arcade"
            style={{
              background: categoryFilter === tab.key ? '#f43f5e' : 'transparent',
              border: 'none',
              color: categoryFilter === tab.key ? '#ffffff' : '#94a3b8',
              padding: '0.45rem 0.75rem',
              borderRadius: '4px',
              fontSize: '0.62rem',
              cursor: 'pointer',
              fontWeight: 700
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 4. Prize Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
        gap: '1.25rem'
      }}>
        {filteredPrizes.map((prize) => {
          const finalCost = Math.max(1, Math.round(prize.cost * (1 - chaDiscountPercent / 100)));
          const canAfford = profile.tickets >= finalCost;

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
                        color: prize.tier === 'Legendary' ? '#facc15' : prize.tier === 'Epic' ? '#c084fc' : prize.tier === 'Rare' ? '#f43f5e' : '#06b6d4',
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
                  marginBottom: '0.75rem'
                }}>
                  {prize.description}
                </p>

                {/* Stat Bonus Tag if Gear */}
                {prize.statBonus && (
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                    {Object.entries(prize.statBonus).map(([attr, val]) => (
                      <span key={attr} className="font-arcade" style={{
                        fontSize: '0.58rem',
                        color: '#facc15',
                        background: 'rgba(250, 204, 21, 0.15)',
                        border: '1px solid rgba(250, 204, 21, 0.4)',
                        padding: '2px 6px',
                        borderRadius: '4px'
                      }}>
                        +{val} {attr} GEAR
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Price & Claim CTA */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '0.85rem',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Ticket size={16} color="#f43f5e" />
                  <div>
                    {chaDiscountPercent > 0 && prize.cost !== finalCost && (
                      <span style={{
                        fontSize: '0.72rem',
                        color: '#64748b',
                        textDecoration: 'line-through',
                        marginRight: '4px'
                      }}>
                        {prize.cost}
                      </span>
                    )}
                    <span className="font-arcade" style={{ fontSize: '0.88rem', color: '#fda4af' }}>
                      {finalCost} <span style={{ fontSize: '0.62rem', color: '#94a3b8' }}>TIX</span>
                    </span>
                  </div>
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
