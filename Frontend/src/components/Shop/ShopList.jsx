import React, { useState } from 'react';
import {
  Coins,
  Plus,
  Trash2,
  Gamepad2,
  Coffee,
  UtensilsCrossed,
  Trees,
  BookOpen,
  Sparkles,
  Lock,
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
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '1.75rem',
        borderBottom: '2px solid rgba(244, 63, 94, 0.25)',
        paddingBottom: '1.25rem',
      }}>
        <div>
          <span className="font-arcade" style={{ fontSize: '0.68rem', color: '#f43f5e' }}>
            // REWARD ECONOMY //
          </span>
          <h2 className="font-arcade" style={{ fontSize: '1.45rem', marginTop: '0.35rem' }}>
            COIN REWARD SHOP
          </h2>
          <p style={{ fontSize: '0.88rem', color: '#94a3b8', marginTop: '0.3rem' }}>
            Buy virtual items, badges, and themes with coins earned from quests and streaks.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '0.65rem 1.25rem',
            background: 'linear-gradient(135deg, rgba(244, 63, 94, 0.2) 0%, rgba(159, 18, 57, 0.2) 100%)',
            border: '2px solid #f43f5e',
            borderRadius: '8px',
          }}>
            <Coins size={22} color="#f43f5e" />
            <div>
              <div style={{ fontSize: '0.62rem', color: '#fda4af', textTransform: 'uppercase' }}>COIN BALANCE</div>
              <div className="font-arcade" style={{ fontSize: '1.1rem', color: '#fff' }}>
                {profile.coins}
              </div>
            </div>
          </div>

          <button onClick={() => setIsModalOpen(true)} className="arcade-btn arcade-btn-primary">
            <Plus size={16} /> ADD REWARD
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '1.25rem' }}>
        {prizes.map((prize) => {
          const canAfford = profile.coins >= prize.cost;
          return (
            <div key={prize.id} className="arcade-card" style={{ padding: '1.35rem', border: getTierBorder(prize.tier) }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  display: 'grid',
                  placeItems: 'center',
                }}>
                  {renderIcon(prize.icon)}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span className="font-arcade" style={{ fontSize: '0.58rem', color: '#cbd5e1' }}>
                    {prize.type || 'Item'}
                  </span>
                  <button
                    onClick={() => deletePrize(prize.id)}
                    style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', padding: '3px' }}
                    title="Delete reward"
                    aria-label={`Delete reward ${prize.title}`}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              <h3 style={{ fontSize: '1.02rem', fontWeight: 700, color: '#fff', marginBottom: '0.35rem' }}>{prize.title}</h3>
              <p style={{ fontSize: '0.84rem', color: '#94a3b8', lineHeight: 1.45, marginBottom: '1.25rem' }}>{prize.description}</p>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.85rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Coins size={16} color="#f43f5e" />
                  <span className="font-arcade" style={{ fontSize: '0.88rem', color: '#fda4af' }}>{prize.cost}</span>
                </div>
                <button
                  onClick={(event) => buyPrize(prize, event)}
                  disabled={!canAfford}
                  className={`arcade-btn ${canAfford ? 'arcade-btn-primary' : ''}`}
                  style={{ fontSize: '0.64rem', padding: '0.5rem 0.8rem', opacity: canAfford ? 1 : 0.45, cursor: canAfford ? 'pointer' : 'not-allowed' }}
                  aria-label={canAfford ? `Buy ${prize.title}` : `Cannot buy ${prize.title}, insufficient coins`}
                >
                  {canAfford ? 'BUY' : <><Lock size={12} /> LOCKED</>}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <AddItemModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};
