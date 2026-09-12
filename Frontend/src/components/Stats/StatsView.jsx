import React from 'react';
import { 
  Trophy, 
  Flame, 
  Zap, 
  Award, 
  Cpu, 
  CheckCircle, 
  ShieldAlert, 
  User,
  Shield,
  Calendar,
  Sparkles,
  Plus,
  Percent,
  Check,
  Star
} from 'lucide-react';
import { useGame, calculateXpRequired, getRankTier } from '../../context/GameContext.jsx';
import { soundEffects } from '../../services/soundEffects.js';

export const StatsView = () => {
  const { 
    profile, 
    missions, 
    inventory, 
    getComboMultiplier,
    effectiveAttributes,
    gearStatBonuses,
    intXpMultiplier,
    chaDiscountPercent,
    strScoreMultiplier,
    allocateSkillPoint,
    claimDailyCheckIn
  } = useGame();

  const clearedMissions = missions.filter((m) => m.completed);
  const combo = getComboMultiplier(profile.streak);
  const currentLevelXpNeeded = calculateXpRequired(profile.level);
  const tierInfo = getRankTier(profile.level);

  const todayStr = new Date().toDateString();
  const isCheckedInToday = profile.lastCheckInDate === todayStr;

  // Next level projections
  const nextLevels = [1, 2, 3, 4, 5].map((lvlOffset) => {
    const targetLevel = profile.level + lvlOffset;
    return {
      level: targetLevel,
      xpNeeded: calculateXpRequired(targetLevel),
      tier: getRankTier(targetLevel),
    };
  });

  const attributes = [
    { 
      key: 'INT', 
      name: 'Intellect', 
      base: profile.attributes.INT || 10,
      gear: gearStatBonuses.INT || 0,
      total: effectiveAttributes.INT || 10,
      color: '#06b6d4', 
      effect: `+${Math.round((intXpMultiplier - 1) * 100)}% Renown XP Harvest`,
      desc: 'Coding, dynamic programming, CS lab trials' 
    },
    { 
      key: 'STR', 
      name: 'Strength', 
      base: profile.attributes.STR || 10,
      gear: gearStatBonuses.STR || 0,
      total: effectiveAttributes.STR || 10,
      color: '#f43f5e', 
      effect: `+${Math.round((strScoreMultiplier - 1) * 100)}% High Score Amplifier`,
      desc: 'Heavy resistance training & iron conditioning' 
    },
    { 
      key: 'AGI', 
      name: 'Agility', 
      base: profile.attributes.AGI || 10,
      gear: gearStatBonuses.AGI || 0,
      total: effectiveAttributes.AGI || 10,
      color: '#facc15', 
      effect: effectiveAttributes.AGI >= 12 ? '+0.10x Combo Booster Active' : 'Unlocks +0.10x combo at 12 AGI',
      desc: 'Quick chores, tidying, rapid turnaround' 
    },
    { 
      key: 'END', 
      name: 'Endurance', 
      base: profile.attributes.END || 10,
      gear: gearStatBonuses.END || 0,
      total: effectiveAttributes.END || 10,
      color: '#10b981', 
      effect: `${100 + (effectiveAttributes.END || 10) * 5} Max Energy Pool`,
      desc: '50-min Pomodoro sprints & daily consistency' 
    },
    { 
      key: 'CHA', 
      name: 'Charisma', 
      base: profile.attributes.CHA || 10,
      gear: gearStatBonuses.CHA || 0,
      total: effectiveAttributes.CHA || 10,
      color: '#a855f7', 
      effect: `-${chaDiscountPercent}% Haggle Discount at Prize Desk`,
      desc: 'Hackathon pitch decks, syncs, networking' 
    },
  ];

  // High score leaderboard simulated entries
  const leaderboard = [
    { rank: '1ST', name: 'CYBER-ACE', score: '18,450 PTS', badge: '🥇' },
    { rank: '2ND', name: profile.name, score: `${profile.score.toLocaleString()} PTS`, badge: '🥈', isUser: true },
    { rank: '3RD', name: 'PIXEL-MONK', score: '3,890 PTS', badge: '🥉' },
    { rank: '4TH', name: 'GLITCH-FOX', score: '2,410 PTS', badge: '🎖️' },
  ];

  // 7-day streak week dots simulation
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const todayDayIdx = (new Date().getDay() + 6) % 7; // Monday = 0

  return (
    <div style={{ maxWidth: '980px', margin: '0 auto', paddingBottom: '3rem' }}>
      {/* 1. Header */}
      <div style={{
        marginBottom: '1.75rem',
        borderBottom: '2px solid rgba(6, 182, 212, 0.25)',
        paddingBottom: '1.25rem'
      }}>
        <span className="font-arcade" style={{ fontSize: '0.68rem', color: '#06b6d4', letterSpacing: '0.12em' }}>
          // PLAYER 1 STATUS //
        </span>
        <h2 className="font-arcade" style={{
          fontSize: '1.6rem',
          color: '#ffffff',
          marginTop: '0.35rem',
          textShadow: '0 0 12px rgba(6, 182, 212, 0.6)'
        }}>
          CHARACTER SHEET & ATTRIBUTES
        </h2>
        <p style={{ fontSize: '0.88rem', color: '#94a3b8', marginTop: '0.3rem' }}>
          Real-time metrics tracking your 5 core Life RPG attributes, unallocated skill points, streak calendar, and leaderboard.
        </p>
      </div>

      {/* 2. Top Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div className="arcade-card" style={{ padding: '1.25rem', borderTop: `4px solid ${tierInfo.color}` }}>
          <div style={{ fontSize: '0.68rem', color: '#94a3b8', textTransform: 'uppercase' }}>Current Rank & Tier</div>
          <div className="font-arcade" style={{ fontSize: '1.4rem', color: '#ffffff', marginTop: '4px' }}>
            LVL {profile.level} {tierInfo.badge}
          </div>
          <div className="font-arcade" style={{ fontSize: '0.6rem', color: tierInfo.color, marginTop: '4px' }}>
            {tierInfo.name}
          </div>
        </div>

        <div className="arcade-card" style={{ padding: '1.25rem', borderTop: '4px solid #facc15' }}>
          <div style={{ fontSize: '0.68rem', color: '#94a3b8', textTransform: 'uppercase' }}>High Score</div>
          <div className="font-arcade" style={{ fontSize: '1.4rem', color: '#facc15', marginTop: '4px' }}>
            {profile.score.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '4px' }}>
            Rank 2nd in Cabinet
          </div>
        </div>

        <div className="arcade-card" style={{ padding: '1.25rem', borderTop: '4px solid #f43f5e' }}>
          <div style={{ fontSize: '0.68rem', color: '#94a3b8', textTransform: 'uppercase' }}>Active Streak Flame</div>
          <div className="font-arcade" style={{ fontSize: '1.4rem', color: '#fda4af', marginTop: '4px' }}>
            {profile.streak} DAYS
          </div>
          <div className="font-arcade" style={{ fontSize: '0.58rem', color: combo.color, marginTop: '4px' }}>
            🔥 {combo.label}
          </div>
        </div>

        <div className="arcade-card" style={{ padding: '1.25rem', borderTop: '4px solid #10b981' }}>
          <div style={{ fontSize: '0.68rem', color: '#94a3b8', textTransform: 'uppercase' }}>Stages Cleared</div>
          <div className="font-arcade" style={{ fontSize: '1.4rem', color: '#34d399', marginTop: '4px' }}>
            {clearedMissions.length} / {missions.length}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '4px' }}>
            {inventory.length} Vault Artifacts
          </div>
        </div>
      </div>

      {/* 3. STREAK SYSTEM & DAILY CHECK-IN CONSOLE */}
      <div className="arcade-card" style={{
        padding: '1.75rem',
        marginBottom: '2rem',
        border: '2px solid rgba(244, 63, 94, 0.4)',
        background: 'linear-gradient(135deg, rgba(28, 14, 32, 0.95) 0%, rgba(18, 14, 32, 0.95) 100%)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '8px',
              background: 'rgba(244, 63, 94, 0.2)',
              border: '1px solid #f43f5e',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#f43f5e'
            }}>
              <Flame size={24} />
            </div>
            <div>
              <h3 className="font-arcade" style={{ fontSize: '0.95rem', color: '#ffffff' }}>
                DAILY STREAK & CHECK-IN CALENDAR
              </h3>
              <p style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
                Log in daily to advance your streak, multiply high scores, and dispense tickets.
              </p>
            </div>
          </div>

          {/* Daily Check-in Button */}
          <button
            onClick={claimDailyCheckIn}
            disabled={isCheckedInToday}
            className={`arcade-btn ${!isCheckedInToday ? 'arcade-btn-primary' : ''}`}
            style={{
              fontSize: '0.72rem',
              padding: '0.65rem 1.25rem',
              opacity: isCheckedInToday ? 0.6 : 1,
              cursor: isCheckedInToday ? 'default' : 'pointer'
            }}
          >
            {isCheckedInToday ? '✓ CHECKED IN TODAY' : 'CLAIM DAILY CHECK-IN'}
          </button>
        </div>

        {/* 7-Day Dots Rhythm */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '0.5rem',
          padding: '1rem',
          background: 'rgba(0, 0, 0, 0.4)',
          borderRadius: '8px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          marginBottom: '1rem'
        }}>
          {daysOfWeek.map((day, idx) => {
            const isPast = idx < todayDayIdx;
            const isToday = idx === todayDayIdx;
            const isCompleted = isPast || (isToday && isCheckedInToday);

            return (
              <div key={day} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.65rem', color: isToday ? '#facc15' : '#94a3b8', marginBottom: '6px', fontWeight: 600 }}>
                  {day}
                </div>
                <div style={{
                  width: '32px',
                  height: '32px',
                  margin: '0 auto',
                  borderRadius: '6px',
                  background: isCompleted ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                  border: isCompleted ? '2px solid #10b981' : isToday ? '2px solid #facc15' : '1px solid rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: isCompleted ? '#34d399' : '#64748b'
                }}>
                  {isCompleted ? <Check size={16} strokeWidth={3} /> : <span style={{ fontSize: '0.65rem' }}>{idx + 1}</span>}
                </div>
              </div>
            );
          })}
        </div>

        {/* Insurance Status */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', fontSize: '0.8rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#34d399' }}>
            <Shield size={16} />
            <span>Streak Freeze Insurance: <strong>{profile.streakShields} Shields Loaded</strong> (Available in Prize Counter)</span>
          </div>

          <span className="font-arcade" style={{ fontSize: '0.62rem', color: combo.color }}>
            CURRENT MULTIPLIER: {combo.label}
          </span>
        </div>
      </div>

      {/* 4. UNSPENT SKILL POINTS ALLOCATION BANNER */}
      {profile.unspentSkillPoints > 0 && (
        <div style={{
          padding: '1.15rem 1.5rem',
          borderRadius: '8px',
          background: 'linear-gradient(90deg, rgba(250, 204, 21, 0.2) 0%, rgba(244, 63, 94, 0.15) 100%)',
          border: '2px solid #facc15',
          boxShadow: '0 0 25px rgba(250, 204, 21, 0.3)',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Zap size={24} color="#facc15" />
            <div>
              <h4 className="font-arcade" style={{ fontSize: '0.88rem', color: '#fef08a' }}>
                +{profile.unspentSkillPoints} SKILL POINTS READY TO ALLOCATE!
              </h4>
              <p style={{ fontSize: '0.82rem', color: '#cbd5e1', marginTop: '2px' }}>
                Earned from leveling up. Click the <strong>[+] UPGRADE</strong> buttons below to boost your attributes.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 5. THE 5 ATTRIBUTES MATRIX & UPGRADE BUTTONS */}
      <div className="arcade-card" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <h3 className="font-arcade" style={{ fontSize: '1.05rem', color: '#ffffff' }}>
              ATTRIBUTE MATRIX & GAMEPLAY MODIFIERS
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '2px' }}>
              Total attribute score combines your trained base points + active equipped gear bonuses.
            </p>
          </div>

          <div className="font-arcade" style={{ fontSize: '0.62rem', color: '#06b6d4' }}>
            TIER MAXIMUM: 30 PTS
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {attributes.map((attr) => {
            const percent = Math.min(100, Math.round((attr.total / 30) * 100));

            return (
              <div key={attr.key} style={{
                background: 'rgba(255, 255, 255, 0.02)',
                padding: '1rem',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.06)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="font-arcade" style={{ fontSize: '0.82rem', color: attr.color }}>
                        {attr.key}
                      </span>
                      <span style={{ fontWeight: 700, color: '#f1f5f9', fontSize: '0.95rem' }}>
                        {attr.name}
                      </span>
                      <span className="font-arcade" style={{
                        fontSize: '0.62rem',
                        color: attr.gear > 0 ? '#facc15' : '#67e8f9',
                        background: 'rgba(255, 255, 255, 0.05)',
                        padding: '2px 6px',
                        borderRadius: '4px'
                      }}>
                        {attr.base} Base {attr.gear > 0 && `(+${attr.gear} Gear)`} = {attr.total} PTS
                      </span>
                    </div>

                    <div style={{ fontSize: '0.78rem', color: '#34d399', marginTop: '3px', fontWeight: 600 }}>
                      ⚡ ACTIVE PERK: {attr.effect}
                    </div>
                  </div>

                  {/* Allocate Point Button */}
                  {profile.unspentSkillPoints > 0 && (
                    <button
                      onClick={() => allocateSkillPoint(attr.key)}
                      className="arcade-btn arcade-btn-yellow"
                      style={{ fontSize: '0.62rem', padding: '0.45rem 0.85rem' }}
                      title={`Upgrade ${attr.name} (+1)`}
                    >
                      <Plus size={12} /> UPGRADE ({attr.key})
                    </button>
                  )}
                </div>

                <div style={{
                  height: '8px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  border: `1px solid ${attr.color}40`,
                  marginTop: '0.5rem'
                }}>
                  <div style={{
                    height: '100%',
                    width: `${percent}%`,
                    background: attr.color,
                    boxShadow: `0 0 10px ${attr.color}`,
                    transition: 'width 0.4s ease'
                  }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6. Non-linear Leveling Curve Simulator & Leaderboard */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '1.5rem'
      }}>
        {/* Leveling Curve Projections */}
        <div className="arcade-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
            <Cpu size={20} color="#06b6d4" />
            <h3 className="font-arcade" style={{ fontSize: '0.88rem', color: '#ffffff' }}>
              NON-LINEAR XP ROADMAP
            </h3>
          </div>
          <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginBottom: '1rem', lineHeight: 1.4 }}>
            Formula: <code>XP = floor(100 * Level^1.4)</code>. Each promotion awards +3 Skill Points and bonus tickets:
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {nextLevels.map((nl) => (
              <div 
                key={nl.level}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '6px 10px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  border: '1px solid rgba(255, 255, 255, 0.06)'
                }}
              >
                <div>
                  <span className="font-arcade" style={{ color: nl.tier.color, fontSize: '0.65rem' }}>
                    LEVEL {nl.level}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8', marginLeft: '6px' }}>
                    ({nl.tier.name})
                  </span>
                </div>
                <span className="font-mono" style={{ color: '#67e8f9' }}>
                  {nl.xpNeeded} XP Needed
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* High Score Leaderboard */}
        <div className="arcade-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
            <Trophy size={20} color="#facc15" />
            <h3 className="font-arcade" style={{ fontSize: '0.88rem', color: '#ffffff' }}>
              CABINET HIGH SCORES
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {leaderboard.map((row) => (
              <div
                key={row.rank}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.6rem 0.85rem',
                  borderRadius: '6px',
                  background: row.isUser ? 'rgba(6, 182, 212, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                  border: row.isUser ? '1px solid #06b6d4' : '1px solid rgba(255, 255, 255, 0.06)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '1rem' }}>{row.badge}</span>
                  <span className="font-arcade" style={{ fontSize: '0.68rem', color: '#ffffff' }}>
                    {row.name} {row.isUser && '(YOU)'}
                  </span>
                </div>
                <span className="font-arcade" style={{ fontSize: '0.68rem', color: '#facc15' }}>
                  {row.score}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
