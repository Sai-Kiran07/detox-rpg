import React, { useState } from 'react';
import { Trophy, Flame, Cpu, Play, Coins } from 'lucide-react';
import { useGame } from '../../context/GameContext.jsx';
import { soundEffects } from '../../services/soundEffects.js';

export const LandingPage = () => {
  const { setActiveTab, getComboMultiplier, profile } = useGame();
  const [demoChecked, setDemoChecked] = useState(false);
  const combo = getComboMultiplier(profile.streak);

  const handleStart = () => {
    soundEffects.playCoin();
    setTimeout(() => setActiveTab('missions'), 150);
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', paddingBottom: '4rem' }}>
      <section style={{ textAlign: 'center', padding: '2rem 1rem 3rem', borderBottom: '2px solid rgba(6,182,212,0.25)', marginBottom: '2rem' }}>
        <h1 className="font-arcade" style={{ fontSize: 'clamp(1.4rem, 4vw, 2.8rem)', marginBottom: '0.8rem' }}>
          LIFE RPG
        </h1>
        <p style={{ maxWidth: '720px', margin: '0 auto', color: '#cbd5e1' }}>
          Turn real-life tasks into quests with instant feedback, non-linear leveling, streak multipliers, and a virtual economy.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '0.75rem', marginTop: '1.2rem' }}>
          <button onClick={handleStart} className="arcade-btn arcade-btn-primary">
            <Play size={14} /> START QUESTING
          </button>
          <button onClick={() => setActiveTab('shop')} className="arcade-btn">
            <Coins size={14} /> VISIT SHOP
          </button>
        </div>
      </section>

      <section className="dashboard-grid-3" style={{ marginBottom: '2rem' }}>
        <InfoCard icon={<Trophy size={20} color="#facc15" />} title="Non-linear progression" text="Every level requires more XP than the last: XP = floor(100 * Level^1.4)." />
        <InfoCard icon={<Flame size={20} color="#f43f5e" />} title="Daily streak engine" text={`Current streak: ${profile.streak} days. Active multiplier: ${combo.label}.`} />
        <InfoCard icon={<Cpu size={20} color="#06b6d4" />} title="Attribute growth" text="Quests train Strength, Intelligence, Wisdom, Discipline, and Creativity." />
      </section>

      <section className="arcade-card" style={{ padding: '1.4rem' }}>
        <h2 className="font-arcade" style={{ fontSize: '0.95rem', marginBottom: '0.8rem' }}>INTERACTIVE PREVIEW</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => {
              setDemoChecked((prev) => !prev);
              if (!demoChecked) {
                soundEffects.playCheckmark();
                soundEffects.playCoin();
              } else {
                soundEffects.playClick();
              }
            }}
            className={`arcade-push-checkbox ${demoChecked ? 'completed' : ''}`}
            aria-pressed={demoChecked}
            aria-label="Toggle sample quest completion"
          />
          <div style={{ flex: 1, minWidth: '220px' }}>
            <p style={{ color: '#fff', marginBottom: '0.35rem' }}>Sample quest: 2 focused DSA problems</p>
            <p style={{ color: '#94a3b8', fontSize: '0.86rem' }}>
              {demoChecked ? 'Completed: +140 XP, +28 coins' : 'Mark complete to preview reward feedback'}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

const InfoCard = ({ icon, title, text }) => (
  <article className="arcade-card" style={{ padding: '1.1rem' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', marginBottom: '0.5rem' }}>
      {icon}
      <h3 className="font-arcade" style={{ fontSize: '0.72rem' }}>{title}</h3>
    </div>
    <p style={{ color: '#cbd5e1', fontSize: '0.86rem', lineHeight: 1.45 }}>{text}</p>
  </article>
);
