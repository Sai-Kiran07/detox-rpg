import React from 'react';
import { 
  Trophy, 
  Flame, 
  Zap, 
  Award, 
  Cpu, 
  CheckCircle, 
  ShieldAlert, 
  User 
} from 'lucide-react';
import { useGame, calculateXpRequired } from '../../context/GameContext.jsx';

export const StatsView = () => {
  const { profile, missions, inventory, getComboMultiplier } = useGame();

  const clearedMissions = missions.filter((m) => m.completed);
  const combo = getComboMultiplier(profile.streak);
  const currentLevelXpNeeded = calculateXpRequired(profile.level);

  // Next level projections
  const nextLevels = [1, 2, 3, 4, 5].map((lvlOffset) => {
    const targetLevel = profile.level + lvlOffset;
    return {
      level: targetLevel,
      xpNeeded: calculateXpRequired(targetLevel),
    };
  });

  const attributes = [
    { key: 'INT', name: 'Intellect', val: profile.attributes.INT || 10, color: '#06b6d4', desc: 'Coding, algorithmic logic, computer science labs' },
    { key: 'STR', name: 'Strength', val: profile.attributes.STR || 10, color: '#f43f5e', desc: 'Resistance training, athletics, physical conditioning' },
    { key: 'AGI', name: 'Agility', val: profile.attributes.AGI || 10, color: '#facc15', desc: 'Quick chore completion, tidying, rapid turnaround' },
    { key: 'END', name: 'Endurance', val: profile.attributes.END || 10, color: '#10b981', desc: '50-minute Pomodoro study sprints, daily consistency' },
    { key: 'CHA', name: 'Charisma', val: profile.attributes.CHA || 10, color: '#a855f7', desc: 'Hackathon presentations, team syncs, networking' },
  ];

  // High score leaderboard simulated entries
  const leaderboard = [
    { rank: '1ST', name: 'CYBER-ACE', score: '18,450 PTS', badge: '🥇' },
    { rank: '2ND', name: profile.name, score: `${profile.score.toLocaleString()} PTS`, badge: '🥈', isUser: true },
    { rank: '3RD', name: 'PIXEL-MONK', score: '3,890 PTS', badge: '🥉' },
    { rank: '4TH', name: 'GLITCH-FOX', score: '2,410 PTS', badge: '🎖️' },
  ];

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
          Real-time metrics tracking your 5 core Life RPG attributes, non-linear XP thresholds, and leaderboard rank.
        </p>
      </div>

      {/* 2. Top Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div className="arcade-card" style={{ padding: '1.25rem', borderTop: '4px solid #06b6d4' }}>
          <div style={{ fontSize: '0.68rem', color: '#94a3b8', textTransform: 'uppercase' }}>Current Rank</div>
          <div className="font-arcade" style={{ fontSize: '1.4rem', color: '#ffffff', marginTop: '4px' }}>
            LVL {profile.level}
          </div>
          <div className="font-arcade" style={{ fontSize: '0.58rem', color: '#67e8f9', marginTop: '4px' }}>
            {profile.callsign}
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
            {inventory.length} Prizes Claimed
          </div>
        </div>
      </div>

      {/* 3. The 5 Attributes Progression Bars */}
      <div className="arcade-card" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
        <h3 className="font-arcade" style={{ fontSize: '1.05rem', color: '#ffffff', marginBottom: '1.5rem' }}>
          ATTRIBUTE MATRIX (SKILL POINTS)
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {attributes.map((attr) => {
            const percent = Math.min(100, Math.round((attr.val / 30) * 100));

            return (
              <div key={attr.key}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="font-arcade" style={{ fontSize: '0.78rem', color: attr.color }}>
                      {attr.key}
                    </span>
                    <span style={{ fontWeight: 600, color: '#f1f5f9', fontSize: '0.92rem' }}>
                      {attr.name}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                      — {attr.desc}
                    </span>
                  </div>
                  <span className="font-arcade" style={{ fontSize: '0.78rem', color: attr.color }}>
                    {attr.val} PTS
                  </span>
                </div>

                <div style={{
                  height: '8px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  border: `1px solid ${attr.color}40`
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

      {/* 4. Non-linear Leveling Curve Simulator & Leaderboard */}
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
              NON-LINEAR XP CURVE
            </h3>
          </div>
          <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginBottom: '1rem', lineHeight: 1.4 }}>
            Formula: <code>XP = floor(100 * Level^1.4)</code>. Each milestone requires escalating mastery:
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {nextLevels.map((nl) => (
              <div 
                key={nl.level}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '6px 10px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  border: '1px solid rgba(255, 255, 255, 0.06)'
                }}
              >
                <span className="font-arcade" style={{ color: '#facc15', fontSize: '0.68rem' }}>
                  LEVEL {nl.level}
                </span>
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
