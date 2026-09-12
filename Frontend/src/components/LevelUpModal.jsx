import React from 'react';
import { Trophy, Coins, ArrowRight, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useGame } from '../context/GameContext.jsx';
import { soundEffects } from '../services/soundEffects.js';

export const LevelUpModal = () => {
  const { levelUpData, closeLevelUpModal } = useGame();

  if (!levelUpData) return null;

  const handleCelebrateMore = () => {
    soundEffects.playLevelUp();
    confetti({
      particleCount: 90,
      spread: 75,
      origin: { y: 0.6 },
      colors: ['#f43f5e', '#06b6d4', '#facc15', '#10b981'],
    });
  };

  return (
    <div className="arcade-modal-overlay">
      <div 
        className="arcade-card"
        style={{
          maxWidth: '540px',
          width: '100%',
          border: '3px solid #facc15',
          background: 'linear-gradient(180deg, #18122c 0%, #0c0818 100%)',
          padding: '2.5rem 2rem',
          textAlign: 'center',
          boxShadow: '0 0 50px rgba(250, 204, 21, 0.4), inset 0 0 30px rgba(250, 204, 21, 0.1)',
        }}
      >
        {/* Trophy icon */}
        <div style={{
          width: '72px',
          height: '72px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #facc15 0%, #b45309 100%)',
          margin: '0 auto 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 25px rgba(250, 204, 21, 0.7)',
          border: '2px solid #fef08a'
        }}>
          <Trophy size={40} color="#000000" />
        </div>

        <p className="font-arcade" style={{
          fontSize: '0.72rem',
          color: '#facc15',
          letterSpacing: '0.15em',
          marginBottom: '0.5rem'
        }}>
          // STAGE CLEARED //
        </p>

        <h2 className="font-arcade" style={{
          fontSize: '1.8rem',
          color: '#ffffff',
          textShadow: '0 0 15px rgba(6, 182, 212, 0.8)',
          marginBottom: '0.75rem',
          lineHeight: 1.2
        }}>
          LEVEL {levelUpData.level}
        </h2>

        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          background: 'rgba(6, 182, 212, 0.15)',
          border: '1px solid #06b6d4',
          padding: '0.4rem 1rem',
          borderRadius: '20px',
          marginBottom: '1.5rem'
        }}>
          <Sparkles size={14} color="#67e8f9" />
          <span className="font-arcade" style={{ color: '#67e8f9', fontSize: '0.68rem' }}>
            RANK: {levelUpData.callsign}
          </span>
        </div>

        <p style={{ color: '#cbd5e1', fontSize: '0.92rem', maxWidth: '420px', margin: '0 auto 1.5rem', lineHeight: 1.5 }}>
          Your discipline echoes across the leaderboard. The machine has dispensed bonus coins to your wallet!
        </p>

        {/* Bonus Box */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '10px',
          background: 'rgba(0, 0, 0, 0.5)',
          border: '1px solid rgba(244, 63, 94, 0.4)',
          borderRadius: '8px',
          padding: '0.75rem 1.5rem',
          marginBottom: '2rem'
        }}>
          <Coins size={22} color="#f43f5e" />
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: '0.62rem', color: '#94a3b8', textTransform: 'uppercase' }}>BONUS COINS EARNED</div>
            <div className="font-arcade" style={{ fontSize: '1rem', color: '#fda4af' }}>
              +{levelUpData.rewardCoins} COINS
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={handleCelebrateMore}
            className="arcade-btn"
            style={{ fontSize: '0.72rem' }}
          >
            FANFARE AGAIN
          </button>
          <button
            onClick={() => {
              soundEffects.playCoin();
              closeLevelUpModal();
            }}
            className="arcade-btn arcade-btn-primary"
            style={{ fontSize: '0.75rem', padding: '0.8rem 1.8rem' }}
          >
            CONTINUE NEXT STAGE <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
