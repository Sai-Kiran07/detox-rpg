import React, { useState } from 'react';
import { 
  Backpack, 
  Shield, 
  Sparkles, 
  Coffee, 
  Gamepad2, 
  UtensilsCrossed, 
  Trees, 
  BookOpen, 
  Cpu, 
  Check, 
  Zap, 
  CheckCircle2, 
  ShoppingBag,
  ExternalLink
} from 'lucide-react';
import { useGame } from '../../context/GameContext.jsx';
import { soundEffects } from '../../services/soundEffects.js';

export const InventoryView = () => {
  const { 
    inventory, 
    profile, 
    toggleEquipItem, 
    useInventoryItem, 
    redeemVoucher,
    gearStatBonuses,
    setActiveTab
  } = useGame();

  const [categoryFilter, setCategoryFilter] = useState('all'); // 'all' | 'gear' | 'buff' | 'treat'

  const renderIcon = (iconName) => {
    const props = { size: 26, strokeWidth: 1.8 };
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

  const filteredItems = inventory.filter((item) => {
    if (categoryFilter === 'all') return true;
    return item.category === categoryFilter;
  });

  const equippedGear = inventory.filter((item) => item.equipped);
  const consumableBuffs = inventory.filter((item) => item.category === 'buff' || item.usable);
  const vouchersCount = inventory.filter((item) => item.category === 'treat' || item.redeemable).length;

  return (
    <div style={{ maxWidth: '980px', margin: '0 auto', paddingBottom: '3rem' }}>
      {/* 1. Header */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '1.75rem',
        borderBottom: '2px solid rgba(6, 182, 212, 0.25)',
        paddingBottom: '1.25rem'
      }}>
        <div>
          <span className="font-arcade" style={{ fontSize: '0.68rem', color: '#06b6d4', letterSpacing: '0.12em' }}>
            // PLAYER 1 VAULT & LOCKER //
          </span>
          <h2 className="font-arcade" style={{
            fontSize: '1.6rem',
            color: '#ffffff',
            marginTop: '0.35rem',
            textShadow: '0 0 12px rgba(6, 182, 212, 0.6)'
          }}>
            ARCADE INVENTORY
          </h2>
          <p style={{ fontSize: '0.88rem', color: '#94a3b8', marginTop: '0.3rem' }}>
            Equip stat-boosting tactical gear, activate consumable power-ups, and redeem real-world treat vouchers.
          </p>
        </div>

        <button
          onClick={() => {
            soundEffects.playClick();
            setActiveTab('shop');
          }}
          className="arcade-btn arcade-btn-primary"
        >
          <ShoppingBag size={16} /> PRIZE COUNTER
        </button>
      </div>

      {/* 2. Equipment & Passive Attunement Rack */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div className="arcade-card" style={{ padding: '1.25rem', border: '1px solid rgba(6, 182, 212, 0.4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
            <Cpu size={20} color="#06b6d4" />
            <h4 className="font-arcade" style={{ color: '#ffffff', fontSize: '0.82rem' }}>
              EQUIPPED GEAR SLOTS ({equippedGear.length} ACTIVE)
            </h4>
          </div>
          <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginBottom: '0.75rem' }}>
            Tactical gear equipped to your avatar dynamically augments your base attribute sheet:
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {Object.entries(gearStatBonuses).filter(([_, val]) => val > 0).length === 0 ? (
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>No gear currently equipped.</span>
            ) : (
              Object.entries(gearStatBonuses)
                .filter(([_, val]) => val > 0)
                .map(([attr, val]) => (
                  <span key={attr} className="font-arcade" style={{
                    fontSize: '0.65rem',
                    color: '#facc15',
                    background: 'rgba(250, 204, 21, 0.15)',
                    border: '1px solid #facc15',
                    padding: '3px 8px',
                    borderRadius: '4px'
                  }}>
                    +{val} {attr} GEAR
                  </span>
                ))
            )}
          </div>
        </div>

        <div className="arcade-card" style={{ padding: '1.25rem', border: '1px solid rgba(244, 63, 94, 0.4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
            <Shield size={20} color="#f43f5e" />
            <h4 className="font-arcade" style={{ color: '#ffffff', fontSize: '0.82rem' }}>
              RESERVE STREAK SHIELDS
            </h4>
          </div>
          <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginBottom: '0.75rem' }}>
            You have <strong style={{ color: '#34d399' }}>{profile.streakShields}</strong> active Streak Shields guarding your streak flame against missed days.
          </p>
          <div className="font-arcade" style={{ fontSize: '0.62rem', color: '#fda4af' }}>
            AUTO-INSURANCE: {profile.streakShields > 0 ? 'ENABLED' : 'UNARMED'}
          </div>
        </div>
      </div>

      {/* 3. Category Filter Tabs */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.85rem',
        marginBottom: '1.5rem'
      }}>
        <div style={{
          display: 'flex',
          gap: '0.35rem',
          background: 'rgba(18, 14, 32, 0.8)',
          padding: '4px',
          borderRadius: '6px',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          {[
            { key: 'all', label: `ALL (${inventory.length})` },
            { key: 'gear', label: `EQUIPABLE GEAR (${inventory.filter(i => i.category === 'gear').length})` },
            { key: 'buff', label: `CONSUMABLES (${inventory.filter(i => i.category === 'buff' || i.usable).length})` },
            { key: 'treat', label: `VOUCHERS (${vouchersCount})` },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                soundEffects.playClick();
                setCategoryFilter(tab.key);
              }}
              className="font-arcade"
              style={{
                background: categoryFilter === tab.key ? '#06b6d4' : 'transparent',
                border: 'none',
                color: categoryFilter === tab.key ? '#04101e' : '#94a3b8',
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

        <span className="font-arcade" style={{ fontSize: '0.62rem', color: '#facc15' }}>
          {inventory.length} ITEMS STORED
        </span>
      </div>

      {/* 4. Inventory Grid */}
      {filteredItems.length === 0 ? (
        <div 
          className="arcade-card"
          style={{
            padding: '3.5rem 2rem',
            textAlign: 'center',
            border: '2px dashed rgba(6, 182, 212, 0.3)'
          }}
        >
          <Backpack size={48} color="#06b6d4" style={{ margin: '0 auto 1rem' }} />
          <h3 className="font-arcade" style={{ fontSize: '1rem', color: '#ffffff', marginBottom: '0.5rem' }}>
            NO ITEMS IN THIS LOCKER CATEGORY
          </h3>
          <p style={{ color: '#94a3b8', fontSize: '0.88rem', maxWidth: '380px', margin: '0 auto 1.5rem' }}>
            Harvest tickets by clearing arcade mission stages, then visit the Prize Counter to claim gear and treats!
          </p>
          <button
            onClick={() => {
              soundEffects.playClick();
              setActiveTab('shop');
            }}
            className="arcade-btn arcade-btn-primary"
          >
            <ShoppingBag size={16} /> VISIT PRIZE COUNTER
          </button>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
          gap: '1.25rem',
        }}>
          {filteredItems.map((item) => {
            const isEquipable = item.category === 'gear' || Boolean(item.statBonus);
            const isUsable = item.category === 'buff' || item.usable;
            const isVoucher = item.category === 'treat' || item.redeemable;

            return (
              <div
                key={item.id}
                className="arcade-card"
                style={{
                  padding: '1.35rem',
                  border: getTierBorder(item.tier),
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  background: item.equipped 
                    ? 'linear-gradient(135deg, rgba(6, 182, 212, 0.12) 0%, rgba(18, 14, 32, 0.95) 100%)'
                    : undefined
                }}
              >
                <div>
                  {/* Top Header: Icon & Tier Tag */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '8px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      {renderIcon(item.icon)}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {item.equipped && (
                        <span className="font-arcade" style={{
                          fontSize: '0.55rem',
                          background: '#06b6d4',
                          color: '#04101e',
                          padding: '3px 6px',
                          borderRadius: '4px',
                          fontWeight: 700
                        }}>
                          EQUIPPED
                        </span>
                      )}

                      {item.redeemed && (
                        <span className="font-arcade" style={{
                          fontSize: '0.55rem',
                          background: 'rgba(16, 185, 129, 0.2)',
                          color: '#34d399',
                          border: '1px solid #10b981',
                          padding: '3px 6px',
                          borderRadius: '4px',
                        }}>
                          REDEEMED
                        </span>
                      )}

                      <span className="font-arcade" style={{
                        fontSize: '0.55rem',
                        color: item.tier === 'Legendary' ? '#facc15' : item.tier === 'Epic' ? '#c084fc' : '#06b6d4',
                        background: 'rgba(255, 255, 255, 0.05)',
                        padding: '3px 6px',
                        borderRadius: '4px',
                      }}>
                        {item.tier || 'COMMON'}
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 style={{
                    fontSize: '1.02rem',
                    fontWeight: 700,
                    color: '#ffffff',
                    marginBottom: '0.35rem',
                    lineHeight: 1.35
                  }}>
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p style={{
                    fontSize: '0.84rem',
                    color: '#94a3b8',
                    lineHeight: 1.45,
                    marginBottom: '0.75rem'
                  }}>
                    {item.description}
                  </p>

                  {/* Stat Bonus Tag if Gear */}
                  {item.statBonus && (
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                      {Object.entries(item.statBonus).map(([attr, val]) => (
                        <span key={attr} className="font-arcade" style={{
                          fontSize: '0.58rem',
                          color: '#facc15',
                          background: 'rgba(250, 204, 21, 0.15)',
                          border: '1px solid rgba(250, 204, 21, 0.4)',
                          padding: '2px 6px',
                          borderRadius: '4px'
                        }}>
                          +{val} {attr} PERK
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Effect Tag if Usable Buff */}
                  {item.effect && (
                    <div style={{ marginBottom: '0.75rem' }}>
                      <span className="font-arcade" style={{
                        fontSize: '0.58rem',
                        color: '#67e8f9',
                        background: 'rgba(6, 182, 212, 0.15)',
                        border: '1px solid rgba(6, 182, 212, 0.4)',
                        padding: '2px 6px',
                        borderRadius: '4px'
                      }}>
                        EFFECT: {item.effect}
                      </span>
                    </div>
                  )}
                </div>

                {/* Bottom Action Row */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '0.85rem',
                  borderTop: '1px solid rgba(255, 255, 255, 0.08)'
                }}>
                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                    {item.acquiredAt || 'Vault item'}
                  </div>

                  {/* Equipable Gear Action */}
                  {isEquipable && (
                    <button
                      onClick={() => toggleEquipItem(item.id)}
                      className={`arcade-btn ${item.equipped ? '' : 'arcade-btn-primary'}`}
                      style={{ fontSize: '0.62rem', padding: '0.45rem 0.85rem' }}
                    >
                      {item.equipped ? 'UNEQUIP' : 'EQUIP GEAR'}
                    </button>
                  )}

                  {/* Usable Consumable Buff Action */}
                  {isUsable && (
                    <button
                      onClick={() => useInventoryItem(item.id)}
                      className="arcade-btn arcade-btn-yellow"
                      style={{ fontSize: '0.62rem', padding: '0.45rem 0.85rem' }}
                    >
                      <Zap size={12} /> USE POWER-UP
                    </button>
                  )}

                  {/* Real-World Voucher Action */}
                  {isVoucher && !item.redeemed && (
                    <button
                      onClick={() => redeemVoucher(item.id)}
                      className="arcade-btn arcade-btn-primary"
                      style={{ fontSize: '0.62rem', padding: '0.45rem 0.85rem' }}
                    >
                      REDEEM TREAT
                    </button>
                  )}

                  {isVoucher && item.redeemed && (
                    <div style={{ fontSize: '0.72rem', color: '#34d399', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Check size={14} /> Enjoyed on {item.redeemedAt || 'Today'}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
