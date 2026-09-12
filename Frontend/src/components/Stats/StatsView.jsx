import React from 'react';
import { Trophy, Flame, Cpu } from 'lucide-react';
import { useGame, calculateXpRequired } from '../../context/GameContext.jsx';
import { ATTRIBUTE_CONFIG } from '../../constants/gameConfig.js';

export const StatsView = () => {
  const { profile, missions, inventory, getComboMultiplier, history } = useGame();
  const clearedMissions = missions.filter((mission) => mission.completed);
  const combo = getComboMultiplier(profile.streak);
  const currentLevelXpNeeded = calculateXpRequired(profile.level);

  const nextLevels = [1, 2, 3, 4, 5].map((offset) => {
    const level = profile.level + offset;
    return { level, xpNeeded: calculateXpRequired(level) };
  });

  const attributes = Object.entries(ATTRIBUTE_CONFIG).map(([key, meta]) => ({
    key,
    ...meta,
    value: profile.attributes[key] || 1,
  }));

  return (
    <div style={{ maxWidth: '980px', margin: '0 auto', paddingBottom: '3rem' }}>
      <div style={{ marginBottom: '1.75rem', borderBottom: '2px solid rgba(6, 182, 212, 0.25)', paddingBottom: '1.25rem' }}>
        <span className="font-arcade" style={{ fontSize: '0.68rem', color: '#06b6d4' }}>
          // CHARACTER STATS //
        </span>
        <h2 className="font-arcade" style={{ fontSize: '1.5rem', marginTop: '0.35rem' }}>ATTRIBUTES & PROGRESSION</h2>
      </div>

      <div className="dashboard-grid-4" style={{ marginBottom: '2rem' }}>
        <Card title="Level" value={`LVL ${profile.level}`} subtitle={profile.callsign} accent="#06b6d4" />
        <Card title="Coins" value={`${profile.coins}`} subtitle="Spend in reward shop" accent="#f43f5e" />
        <Card title="Streak" value={`${profile.streak} days`} subtitle={combo.label} accent="#facc15" />
        <Card title="Quests Cleared" value={`${clearedMissions.length}/${missions.length}`} subtitle={`${inventory.length} rewards owned`} accent="#10b981" />
      </div>

      <div className="arcade-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <h3 className="font-arcade" style={{ fontSize: '1rem', marginBottom: '1rem' }}>CORE ATTRIBUTES</h3>
        <div style={{ display: 'grid', gap: '1rem' }}>
          {attributes.map((attr) => {
            const percent = Math.min(100, Math.round((attr.value / 40) * 100));
            return (
              <div key={attr.key}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className={`attr-pill ${attr.className}`}>{attr.key}</span>
                    <span style={{ fontWeight: 600 }}>{attr.label}</span>
                  </div>
                  <span className="font-arcade" style={{ fontSize: '0.72rem', color: attr.color }}>
                    {attr.value} PTS
                  </span>
                </div>
                <div style={{ height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden', border: `1px solid ${attr.color}40` }}>
                  <div style={{ height: '100%', width: `${percent}%`, background: attr.color, boxShadow: `0 0 10px ${attr.color}` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="dashboard-grid-2">
        <div className="arcade-card" style={{ padding: '1.4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.85rem' }}>
            <Cpu size={20} color="#06b6d4" />
            <h3 className="font-arcade" style={{ fontSize: '0.85rem' }}>NON-LINEAR XP CURVE</h3>
          </div>
          <p style={{ fontSize: '0.84rem', color: '#94a3b8', marginBottom: '0.75rem' }}>
            Formula: XP = floor(100 * Level^1.4)
          </p>
          <p style={{ fontSize: '0.84rem', color: '#cbd5e1', marginBottom: '0.75rem' }}>
            Current: {profile.xp} / {currentLevelXpNeeded} XP
          </p>
          <div style={{ display: 'grid', gap: '0.45rem' }}>
            {nextLevels.map((item) => (
              <div key={item.level} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 10px', borderRadius: '6px', background: 'rgba(255,255,255,0.03)' }}>
                <span className="font-arcade" style={{ fontSize: '0.64rem', color: '#facc15' }}>LEVEL {item.level}</span>
                <span className="font-mono" style={{ color: '#67e8f9' }}>{item.xpNeeded} XP</span>
              </div>
            ))}
          </div>
        </div>

        <div className="arcade-card" style={{ padding: '1.4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.85rem' }}>
            <Trophy size={20} color="#facc15" />
            <h3 className="font-arcade" style={{ fontSize: '0.85rem' }}>PROGRESSION SUMMARY</h3>
          </div>
          <ul style={{ listStyle: 'none', display: 'grid', gap: '0.65rem' }}>
            <li style={summaryItemStyle}><Flame size={14} color="#f43f5e" /> Streak combo: {combo.label}</li>
            <li style={summaryItemStyle}>Completed quests: {clearedMissions.length}</li>
            <li style={summaryItemStyle}>Rewards purchased: {history.filter((item) => item.type === 'purchase').length}</li>
            <li style={summaryItemStyle}>Timeline events: {history.length}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

const Card = ({ title, value, subtitle, accent }) => (
  <div className="arcade-card" style={{ padding: '1rem', borderTop: `4px solid ${accent}` }}>
    <div style={{ fontSize: '0.68rem', color: '#94a3b8', textTransform: 'uppercase' }}>{title}</div>
    <div className="font-arcade" style={{ fontSize: '1.25rem', color: '#fff', marginTop: '4px' }}>{value}</div>
    <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '4px' }}>{subtitle}</div>
  </div>
);

const summaryItemStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.45rem',
  fontSize: '0.84rem',
  color: '#cbd5e1',
  padding: '0.55rem 0.7rem',
  borderRadius: '6px',
  border: '1px solid rgba(255,255,255,0.08)',
  background: 'rgba(255,255,255,0.03)',
};
