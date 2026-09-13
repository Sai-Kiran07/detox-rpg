import React, { useState } from 'react';
import { 
  History, 
  Trophy, 
  Award, 
  CheckCircle, 
  Ticket, 
  Zap, 
  Flame, 
  Cpu, 
  Shield, 
  Sparkles, 
  BarChart2, 
  Filter,
  Clock,
  ArrowUpRight
} from 'lucide-react';
import { useGame, calculateXpRequired, getRankTier } from '../../context/GameContext.jsx';
import { soundEffects } from '../../services/soundEffects.js';

export const HistoryView = () => {
  const { historyLog, profile, missions, inventory, getComboMultiplier } = useGame();
  const [activeSubTab, setActiveSubTab] = useState('log'); // 'log' | 'analytics' | 'achievements'
  const [filterType, setFilterType] = useState('all'); // 'all' | 'stage_clear' | 'prize_claimed' | 'daily_checkin'

  const tierInfo = getRankTier(profile.level);
  const combo = getComboMultiplier(profile.streak);

  // Filtered log
  const filteredLog = historyLog.filter((entry) => {
    if (filterType === 'all') return true;
    return entry.type === filterType;
  });

  // Calculate Aggregates
  const totalStagesCleared = historyLog.filter((h) => h.type === 'stage_clear').length;
  const totalXpLogged = historyLog.reduce((acc, h) => acc + (h.xpEarned || 0), 0);
  const totalTicketsSpent = historyLog.reduce((acc, h) => acc + (h.ticketsSpent || 0), 0);
  const totalPrizesClaimed = historyLog.filter((h) => h.type === 'prize_claimed').length;

  // Category breakdown
  const categoryCounts = missions.reduce((acc, m) => {
    const cat = m.category || 'General';
    acc[cat] = (acc[cat] || 0) + (m.completed ? 1 : 0);
    return acc;
  }, {});

  // Attribute focus breakdown
  const attributeColors = {
    INT: '#06b6d4',
    STR: '#f43f5e',
    AGI: '#facc15',
    END: '#10b981',
    CHA: '#a855f7',
  };

  // Achievements definitions
  const achievements = [
    {
      id: 'ach-1',
      title: 'First Coin In',
      description: 'Clear your very first arcade life stage.',
      icon: '🎮',
      unlocked: totalStagesCleared >= 1 || missions.some((m) => m.completed),
      progress: Math.min(1, totalStagesCleared >= 1 ? 1 : 0),
      total: 1,
      reward: '50 PTS'
    },
    {
      id: 'ach-2',
      title: 'Combo Striker',
      description: 'Reach an active streak of at least 5 consecutive days.',
      icon: '🔥',
      unlocked: profile.streak >= 5,
      progress: Math.min(5, profile.streak),
      total: 5,
      reward: '100 PTS'
    },
    {
      id: 'ach-3',
      title: 'Vault Hoarder',
      description: 'Acquire at least 3 items or relics in your inventory.',
      icon: '🎒',
      unlocked: inventory.length >= 3,
      progress: Math.min(3, inventory.length),
      total: 3,
      reward: '80 PTS'
    },
    {
      id: 'ach-4',
      title: 'Arcade Champion',
      description: 'Reach Level 5 or higher on the non-linear XP curve.',
      icon: '🏆',
      unlocked: profile.level >= 5,
      progress: Math.min(5, profile.level),
      total: 5,
      reward: '150 PTS'
    },
    {
      id: 'ach-5',
      title: 'Big Spender',
      description: 'Redeem prizes worth 100 or more total arcade tickets.',
      icon: '🎟️',
      unlocked: totalTicketsSpent >= 100,
      progress: Math.min(100, totalTicketsSpent),
      total: 100,
      reward: '200 PTS'
    },
    {
      id: 'ach-6',
      title: 'Master Attuned',
      description: 'Equip any tactical gear with passive attribute perks.',
      icon: '⚡',
      unlocked: inventory.some((i) => i.equipped),
      progress: inventory.some((i) => i.equipped) ? 1 : 0,
      total: 1,
      reward: '120 PTS'
    }
  ];

  const handleSubTab = (tab) => {
    soundEffects.playClick();
    setActiveSubTab(tab);
  };

  const getEntryBadge = (type) => {
    switch (type) {
      case 'stage_clear':
        return { label: 'STAGE CLEAR', color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)', border: '#10b981' };
      case 'prize_claimed':
        return { label: 'PRIZE CLAIMED', color: '#f43f5e', bg: 'rgba(244, 63, 94, 0.15)', border: '#f43f5e' };
      case 'daily_checkin':
        return { label: 'DAILY CHECK-IN', color: '#facc15', bg: 'rgba(250, 204, 21, 0.15)', border: '#facc15' };
      case 'level_up':
        return { label: 'LEVEL UP', color: '#06b6d4', bg: 'rgba(6, 182, 212, 0.15)', border: '#06b6d4' };
      default:
        return { label: 'SYSTEM', color: '#94a3b8', bg: 'rgba(255, 255, 255, 0.05)', border: 'rgba(255, 255, 255, 0.1)' };
    }
  };

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
            // CABINET AUDIT TRAIL //
          </span>
          <h2 className="font-arcade" style={{
            fontSize: '1.6rem',
            color: '#ffffff',
            marginTop: '0.35rem',
            textShadow: '0 0 12px rgba(6, 182, 212, 0.6)'
          }}>
            HISTORY & PROGRESS TRACKING
          </h2>
          <p style={{ fontSize: '0.88rem', color: '#94a3b8', marginTop: '0.3rem' }}>
            Chronological audit log of cleared missions, ticket expenditures, attribute gains, and achievement trophies.
          </p>
        </div>

        {/* View Toggle Tabs */}
        <div style={{
          display: 'flex',
          gap: '0.35rem',
          background: 'rgba(18, 14, 32, 0.8)',
          padding: '4px',
          borderRadius: '6px',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <button
            onClick={() => handleSubTab('log')}
            className="font-arcade"
            style={{
              background: activeSubTab === 'log' ? '#06b6d4' : 'transparent',
              border: 'none',
              color: activeSubTab === 'log' ? '#04101e' : '#94a3b8',
              padding: '0.5rem 0.85rem',
              borderRadius: '4px',
              fontSize: '0.62rem',
              cursor: 'pointer',
              fontWeight: 700
            }}
          >
            ACTIVITY LOG
          </button>
          <button
            onClick={() => handleSubTab('analytics')}
            className="font-arcade"
            style={{
              background: activeSubTab === 'analytics' ? '#06b6d4' : 'transparent',
              border: 'none',
              color: activeSubTab === 'analytics' ? '#04101e' : '#94a3b8',
              padding: '0.5rem 0.85rem',
              borderRadius: '4px',
              fontSize: '0.62rem',
              cursor: 'pointer',
              fontWeight: 700
            }}
          >
            PROGRESS ANALYTICS
          </button>
          <button
            onClick={() => handleSubTab('achievements')}
            className="font-arcade"
            style={{
              background: activeSubTab === 'achievements' ? '#06b6d4' : 'transparent',
              border: 'none',
              color: activeSubTab === 'achievements' ? '#04101e' : '#94a3b8',
              padding: '0.5rem 0.85rem',
              borderRadius: '4px',
              fontSize: '0.62rem',
              cursor: 'pointer',
              fontWeight: 700
            }}
          >
            TROPHIES ({achievements.filter(a => a.unlocked).length}/{achievements.length})
          </button>
        </div>
      </div>

      {/* 2. Tactical Metrics Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div className="arcade-card" style={{ padding: '1.25rem', borderLeft: '4px solid #10b981' }}>
          <div style={{ fontSize: '0.68rem', color: '#94a3b8', textTransform: 'uppercase' }}>Lifetime Clears</div>
          <div className="font-arcade" style={{ fontSize: '1.4rem', color: '#34d399', marginTop: '4px' }}>
            {totalStagesCleared} STAGES
          </div>
          <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '4px' }}>
            Recorded in machine memory
          </div>
        </div>

        <div className="arcade-card" style={{ padding: '1.25rem', borderLeft: '4px solid #06b6d4' }}>
          <div style={{ fontSize: '0.68rem', color: '#94a3b8', textTransform: 'uppercase' }}>XP Harvested</div>
          <div className="font-arcade" style={{ fontSize: '1.4rem', color: '#67e8f9', marginTop: '4px' }}>
            +{totalXpLogged + profile.xp} XP
          </div>
          <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '4px' }}>
            Current Rank: {tierInfo.name}
          </div>
        </div>

        <div className="arcade-card" style={{ padding: '1.25rem', borderLeft: '4px solid #f43f5e' }}>
          <div style={{ fontSize: '0.68rem', color: '#94a3b8', textTransform: 'uppercase' }}>Tickets Redeemed</div>
          <div className="font-arcade" style={{ fontSize: '1.4rem', color: '#fda4af', marginTop: '4px' }}>
            {totalTicketsSpent} TIX
          </div>
          <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '4px' }}>
            {totalPrizesClaimed} prizes claimed
          </div>
        </div>

        <div className="arcade-card" style={{ padding: '1.25rem', borderLeft: '4px solid #facc15' }}>
          <div style={{ fontSize: '0.68rem', color: '#94a3b8', textTransform: 'uppercase' }}>Active Streak</div>
          <div className="font-arcade" style={{ fontSize: '1.4rem', color: '#facc15', marginTop: '4px' }}>
            {profile.streak} DAYS
          </div>
          <div className="font-arcade" style={{ fontSize: '0.6rem', color: combo.color, marginTop: '4px' }}>
            🔥 {combo.label}
          </div>
        </div>
      </div>

      {/* 3. TAB CONTENT */}

      {/* 3A. ACTIVITY LOG */}
      {activeSubTab === 'log' && (
        <div>
          {/* Filters Bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem',
            marginBottom: '1.25rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Filter size={15} color="#06b6d4" />
              <span className="font-arcade" style={{ fontSize: '0.62rem', color: '#94a3b8' }}>
                FILTER TRAIL:
              </span>
            </div>

            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              {[
                { key: 'all', label: 'ALL EVENTS' },
                { key: 'stage_clear', label: 'STAGES CLEARED' },
                { key: 'prize_claimed', label: 'PRIZES CLAIMED' },
                { key: 'daily_checkin', label: 'CHECK-INS' },
              ].map((f) => (
                <button
                  key={f.key}
                  onClick={() => setFilterType(f.key)}
                  className="font-arcade"
                  style={{
                    fontSize: '0.58rem',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    border: filterType === f.key ? '1px solid #06b6d4' : '1px solid rgba(255, 255, 255, 0.1)',
                    background: filterType === f.key ? 'rgba(6, 182, 212, 0.2)' : 'rgba(0, 0, 0, 0.3)',
                    color: filterType === f.key ? '#67e8f9' : '#94a3b8'
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Timeline Feed */}
          {filteredLog.length === 0 ? (
            <div className="arcade-card" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
              <History size={40} color="#64748b" style={{ margin: '0 auto 1rem' }} />
              <h3 className="font-arcade" style={{ fontSize: '0.95rem', color: '#ffffff', marginBottom: '0.5rem' }}>
                NO AUDIT RECORDS FOUND
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                Complete stages, claim daily check-ins, or redeem prizes to build your career history.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {filteredLog.map((entry) => {
                const badge = getEntryBadge(entry.type);
                const dateFormatted = new Date(entry.timestamp).toLocaleString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                });

                return (
                  <div
                    key={entry.id}
                    className="arcade-card"
                    style={{
                      padding: '1.15rem 1.35rem',
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '1rem',
                      borderLeft: `4px solid ${badge.border}`
                    }}
                  >
                    <div style={{ flex: 1, minWidth: '240px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.4rem' }}>
                        <span className="font-arcade" style={{
                          fontSize: '0.55rem',
                          color: badge.color,
                          background: badge.bg,
                          padding: '2px 6px',
                          borderRadius: '4px',
                          border: `1px solid ${badge.border}`
                        }}>
                          {badge.label}
                        </span>

                        {entry.category && (
                          <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                            // {entry.category}
                          </span>
                        )}

                        <span style={{ fontSize: '0.72rem', color: '#64748b', marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={11} /> {dateFormatted}
                        </span>
                      </div>

                      <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.25rem' }}>
                        {entry.title}
                      </h4>

                      <p style={{ fontSize: '0.84rem', color: '#94a3b8', lineHeight: 1.4 }}>
                        {entry.details}
                      </p>
                    </div>

                    {/* Rewards Granted in this Log */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', alignSelf: 'center' }}>
                      {entry.xpEarned && (
                        <span className="font-arcade" style={{
                          fontSize: '0.62rem',
                          color: '#06b6d4',
                          background: 'rgba(6, 182, 212, 0.12)',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          border: '1px solid rgba(6, 182, 212, 0.3)'
                        }}>
                          +{entry.xpEarned} XP
                        </span>
                      )}

                      {entry.ticketsEarned && (
                        <span className="font-arcade" style={{
                          fontSize: '0.62rem',
                          color: '#f43f5e',
                          background: 'rgba(244, 63, 94, 0.12)',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          border: '1px solid rgba(244, 63, 94, 0.3)'
                        }}>
                          +{entry.ticketsEarned} TIX
                        </span>
                      )}

                      {entry.ticketsSpent && (
                        <span className="font-arcade" style={{
                          fontSize: '0.62rem',
                          color: '#fda4af',
                          background: 'rgba(244, 63, 94, 0.2)',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          border: '1px solid #f43f5e'
                        }}>
                          -{entry.ticketsSpent} TIX
                        </span>
                      )}

                      {entry.attributeGained && (
                        <span className="font-arcade" style={{
                          fontSize: '0.62rem',
                          color: '#facc15',
                          background: 'rgba(250, 204, 21, 0.12)',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          border: '1px solid rgba(250, 204, 21, 0.3)'
                        }}>
                          {entry.attributeGained}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 3B. PROGRESS ANALYTICS */}
      {activeSubTab === 'analytics' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Attribute Mastery Distribution */}
          <div className="arcade-card" style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
              <BarChart2 size={20} color="#06b6d4" />
              <h3 className="font-arcade" style={{ fontSize: '0.95rem', color: '#ffffff' }}>
                ATTRIBUTE MASTERY BREAKDOWN
              </h3>
            </div>
            <p style={{ fontSize: '0.84rem', color: '#94a3b8', marginBottom: '1.5rem' }}>
              Relative focus distribution across your 5 core Life RPG disciplines.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {Object.entries(profile.attributes).map(([attr, val]) => {
                const color = attributeColors[attr] || '#06b6d4';
                const percent = Math.min(100, Math.round((val / 25) * 100));

                return (
                  <div key={attr}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '4px' }}>
                      <span className="font-arcade" style={{ color, fontSize: '0.72rem' }}>
                        {attr} — {val} PTS
                      </span>
                      <span className="font-mono" style={{ color: '#94a3b8', fontSize: '0.75rem' }}>
                        {percent}% OF TIER CAP
                      </span>
                    </div>
                    <div style={{
                      height: '10px',
                      background: 'rgba(255, 255, 255, 0.08)',
                      borderRadius: '5px',
                      overflow: 'hidden',
                      border: `1px solid ${color}40`
                    }}>
                      <div style={{
                        height: '100%',
                        width: `${percent}%`,
                        background: color,
                        boxShadow: `0 0 10px ${color}`,
                        transition: 'width 0.4s ease'
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Missions By Category */}
          <div className="arcade-card" style={{ padding: '1.75rem' }}>
            <h3 className="font-arcade" style={{ fontSize: '0.95rem', color: '#ffffff', marginBottom: '1rem' }}>
              CLEARED STAGES BY DOMAIN
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: '1rem'
            }}>
              {Object.entries(categoryCounts).map(([cat, count]) => (
                <div key={cat} style={{
                  padding: '1rem',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)'
                }}>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase' }}>{cat}</div>
                  <div className="font-arcade" style={{ fontSize: '1.2rem', color: '#facc15', marginTop: '4px' }}>
                    {count} CLEARED
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3C. ACHIEVEMENTS & TROPHIES */}
      {activeSubTab === 'achievements' && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1.25rem'
        }}>
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className="arcade-card"
              style={{
                padding: '1.35rem',
                border: ach.unlocked ? '2px solid #facc15' : '1px solid rgba(255, 255, 255, 0.1)',
                background: ach.unlocked ? 'rgba(26, 20, 42, 0.95)' : 'rgba(12, 10, 22, 0.7)',
                opacity: ach.unlocked ? 1 : 0.65
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                <span style={{ fontSize: '2rem' }}>{ach.icon}</span>
                <span className="font-arcade" style={{
                  fontSize: '0.58rem',
                  padding: '3px 8px',
                  borderRadius: '4px',
                  background: ach.unlocked ? 'rgba(250, 204, 21, 0.2)' : 'rgba(255, 255, 255, 0.06)',
                  color: ach.unlocked ? '#facc15' : '#64748b',
                  border: ach.unlocked ? '1px solid #facc15' : '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  {ach.unlocked ? 'UNLOCKED' : 'LOCKED'}
                </span>
              </div>

              <h4 style={{ fontSize: '1.02rem', fontWeight: 700, color: ach.unlocked ? '#ffffff' : '#cbd5e1', marginBottom: '0.35rem' }}>
                {ach.title}
              </h4>

              <p style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.45, marginBottom: '1rem' }}>
                {ach.description}
              </p>

              {/* Progress */}
              <div style={{ marginTop: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', marginBottom: '3px' }}>
                  <span style={{ color: '#94a3b8' }}>Progress:</span>
                  <span className="font-arcade" style={{ color: ach.unlocked ? '#34d399' : '#67e8f9', fontSize: '0.62rem' }}>
                    {ach.progress} / {ach.total}
                  </span>
                </div>
                <div style={{
                  height: '6px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  borderRadius: '3px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    height: '100%',
                    width: `${Math.min(100, Math.round((ach.progress / ach.total) * 100))}%`,
                    background: ach.unlocked ? '#facc15' : '#06b6d4',
                    boxShadow: ach.unlocked ? '0 0 8px #facc15' : 'none'
                  }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
