import React, { useState } from 'react';
import { 
  Gamepad2, 
  Sparkles, 
  Flame, 
  Zap, 
  Shield, 
  Trophy, 
  Award, 
  ArrowRight, 
  Coins, 
  Check, 
  Play, 
  Layers, 
  Cpu, 
  Code 
} from 'lucide-react';
import { useGame } from '../../context/GameContext.jsx';
import { soundEffects } from '../../services/soundEffects.js';

export const LandingPage = () => {
  const { setActiveTab } = useGame();
  const [demoChecked, setDemoChecked] = useState(false);
  const [demoPoints, setDemoPoints] = useState(0);

  const handleInsertCoin = () => {
    soundEffects.playCoin();
    setTimeout(() => {
      soundEffects.playLevelUp();
      setActiveTab('missions');
    }, 200);
  };

  const handleDemoClick = (e) => {
    if (demoChecked) {
      soundEffects.playClick();
      setDemoChecked(false);
      setDemoPoints(0);
    } else {
      soundEffects.playCheckmark();
      soundEffects.playCoin();
      setDemoChecked(true);
      setDemoPoints(350);
    }
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', paddingBottom: '5rem' }}>
      {/* 1. HERO BANNER */}
      <section style={{
        textAlign: 'center',
        padding: '3rem 1.5rem 4rem',
        position: 'relative',
        borderBottom: '2px solid rgba(6, 182, 212, 0.25)',
        marginBottom: '3rem'
      }}>
        {/* Blinking Coin Header */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(244, 63, 94, 0.15)',
          border: '1px solid #f43f5e',
          padding: '6px 14px',
          borderRadius: '20px',
          marginBottom: '1.5rem',
        }}>
          <span className="blink" style={{ color: '#facc15', fontSize: '0.8rem', fontWeight: 700 }}>●</span>
          <span className="font-arcade" style={{ fontSize: '0.7rem', color: '#fda4af', letterSpacing: '0.08em' }}>
            INSERT COIN // 2 CREDITS FREE
          </span>
        </div>

        {/* Main Arcade Title */}
        <h1 className="font-arcade" style={{
          fontSize: 'clamp(1.8rem, 5vw, 3.4rem)',
          lineHeight: 1.25,
          color: '#ffffff',
          textShadow: '0 0 15px rgba(6, 182, 212, 0.8), 0 0 35px rgba(244, 63, 94, 0.5)',
          marginBottom: '1.25rem'
        }}>
          ARCADE LIFE <span style={{ color: '#facc15' }}>1984</span>
        </h1>

        <p className="font-arcade" style={{
          fontSize: '0.88rem',
          color: '#67e8f9',
          letterSpacing: '0.12em',
          marginBottom: '1.5rem',
          textTransform: 'uppercase'
        }}>
          // LEVEL UP YOUR REALITY //
        </p>

        {/* Readable Hero Description */}
        <p style={{
          fontSize: '1.15rem',
          color: '#cbd5e1',
          maxWidth: '680px',
          margin: '0 auto 2.25rem',
          lineHeight: 1.6,
          fontWeight: 400
        }}>
          Transform mundane real-world tasks into high scores, combo multipliers, and boss stage triumphs.
          An 80s arcade Life RPG engineered for the hackathon with non-linear leveling, attribute growth, and zero latency.
        </p>

        {/* Hero CTAs */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
          <button
            onClick={handleInsertCoin}
            className="arcade-btn arcade-btn-primary"
            style={{ fontSize: '0.85rem', padding: '0.9rem 2rem' }}
          >
            <Play size={16} fill="currentColor" /> INSERT COIN & PLAY
          </button>
          <button
            onClick={() => {
              soundEffects.playClick();
              setActiveTab('attributes');
            }}
            className="arcade-btn"
            style={{ fontSize: '0.85rem', padding: '0.9rem 1.75rem' }}
          >
            <Trophy size={16} /> VIEW ATTRIBUTE MATRIX
          </button>
        </div>

        {/* 2. INTERACTIVE MINI-MISSION DEMO WIDGET */}
        <div style={{
          maxWidth: '560px',
          margin: '3rem auto 0',
          background: 'rgba(18, 14, 32, 0.95)',
          border: '2px dashed var(--neon-cyan)',
          borderRadius: '12px',
          padding: '1.5rem',
          boxShadow: '0 0 25px rgba(6, 182, 212, 0.2)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span className="font-arcade" style={{ fontSize: '0.68rem', color: '#facc15' }}>
              🕹️ TACTILE LIVE ARCADE PREVIEW
            </span>
            <span className="font-arcade" style={{ fontSize: '0.65rem', color: '#34d399' }}>
              {demoChecked ? 'STAGE CLEARED!' : 'PUSH BUTTON TO TEST'}
            </span>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            background: 'rgba(255, 255, 255, 0.03)',
            padding: '1rem',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            <button
              onClick={handleDemoClick}
              className={`arcade-push-checkbox ${demoChecked ? 'completed' : ''}`}
              title="Push to test 8-bit chiptune & tactile reward"
              aria-label="Demo task checkbox"
            >
              {demoChecked && <Check size={20} strokeWidth={3} />}
            </button>

            <div style={{ textAlign: 'left', flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span className="attr-pill attr-int">+3 INT</span>
                <span className="font-arcade" style={{ fontSize: '0.62rem', color: '#f43f5e' }}>STAGE 1</span>
              </div>
              <h4 style={{
                fontSize: '0.98rem',
                fontWeight: 700,
                color: demoChecked ? '#94a3b8' : '#ffffff',
                textDecoration: demoChecked ? 'line-through' : 'none'
              }}>
                Solve 2 LeetCode Tree Algorithms
              </h4>
            </div>

            <div className="font-arcade" style={{ textAlign: 'right', fontSize: '0.72rem', color: '#facc15' }}>
              {demoChecked ? `+${demoPoints} PTS` : '+150 XP'}
            </div>
          </div>
        </div>
      </section>

      {/* 3. THE 5 LIFE RPG ATTRIBUTES */}
      <section style={{ marginBottom: '4rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span className="font-arcade" style={{ fontSize: '0.72rem', color: '#facc15', letterSpacing: '0.15em' }}>
            CHARACTER SHEET ENGINE
          </span>
          <h2 className="font-arcade" style={{ fontSize: '1.6rem', color: '#ffffff', marginTop: '0.5rem' }}>
            THE 5 LIFE ATTRIBUTES
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem', maxWidth: '580px', margin: '0.5rem auto 0' }}>
            Every mission directly levels up a specific character stat, turning everyday effort into measurable RPG mastery.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.25rem'
        }}>
          {/* INT */}
          <div className="arcade-card" style={{ padding: '1.25rem', borderTop: '4px solid #06b6d4' }}>
            <div className="attr-pill attr-int" style={{ marginBottom: '0.75rem' }}>INTELLECT (INT)</div>
            <p style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.45 }}>
              Augmented through programming, algorithmic problem solving, academic research, and deep technical study.
            </p>
          </div>

          {/* STR */}
          <div className="arcade-card" style={{ padding: '1.25rem', borderTop: '4px solid #f43f5e' }}>
            <div className="attr-pill attr-str" style={{ marginBottom: '0.75rem' }}>STRENGTH (STR)</div>
            <p style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.45 }}>
              Earned at the training grounds via heavy lifting, calisthenics, core workouts, and athletic conditioning.
            </p>
          </div>

          {/* AGI */}
          <div className="arcade-card" style={{ padding: '1.25rem', borderTop: '4px solid #facc15' }}>
            <div className="attr-pill attr-agi" style={{ marginBottom: '0.75rem' }}>AGILITY (AGI)</div>
            <p style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.45 }}>
              Honed through quick household chores, desk organization, rapid inbox triage, and agile task execution.
            </p>
          </div>

          {/* END */}
          <div className="arcade-card" style={{ padding: '1.25rem', borderTop: '4px solid #10b981' }}>
            <div className="attr-pill attr-end" style={{ marginBottom: '0.75rem' }}>ENDURANCE (END)</div>
            <p style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.45 }}>
              Strengthened through 50-minute Pomodoro study sprints, meditation, proper sleep, and hydration routines.
            </p>
          </div>

          {/* CHA */}
          <div className="arcade-card" style={{ padding: '1.25rem', borderTop: '4px solid #a855f7' }}>
            <div className="attr-pill attr-cha" style={{ marginBottom: '0.75rem' }}>CHARISMA (CHA)</div>
            <p style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.45 }}>
              Raised by delivering hackathon presentations, networking with peers, mentorship, and team collaboration.
            </p>
          </div>
        </div>
      </section>

      {/* 4. NON-LINEAR LEVELING & STREAK MULTIPLIERS */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '2rem',
        marginBottom: '4rem'
      }}>
        {/* Non-linear Leveling */}
        <div className="arcade-card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
            <Cpu size={24} color="#06b6d4" />
            <h3 className="font-arcade" style={{ fontSize: '1.1rem', color: '#ffffff' }}>
              NON-LINEAR LEVELING
            </h3>
          </div>
          <p style={{ fontSize: '0.88rem', color: '#94a3b8', lineHeight: 1.5, marginBottom: '1rem' }}>
            Unlike generic apps with static 100-point bars, Arcade Life utilizes a progressive exponential curve:
          </p>
          <div style={{
            background: 'rgba(0, 0, 0, 0.5)',
            border: '1px solid rgba(6, 182, 212, 0.4)',
            padding: '1rem',
            borderRadius: '8px',
            fontFamily: 'monospace',
            color: '#67e8f9',
            fontSize: '0.95rem',
            marginBottom: '1rem'
          }}>
            XP_Required(L) = floor(100 * L^1.4)
          </div>
          <p style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.4 }}>
            Early levels reward initial momentum quickly, while higher levels demand sustained master-tier consistency.
          </p>
        </div>

        {/* Streak Combo Multipliers */}
        <div className="arcade-card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
            <Flame size={24} color="#f43f5e" />
            <h3 className="font-arcade" style={{ fontSize: '1.1rem', color: '#ffffff' }}>
              COMBO MULTIPLIER STREAKS
            </h3>
          </div>
          <p style={{ fontSize: '0.88rem', color: '#94a3b8', lineHeight: 1.5, marginBottom: '1rem' }}>
            Maintaining consecutive daily activity multiplies all score points earned across every stage:
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', padding: '6px 10px', background: 'rgba(6, 182, 212, 0.1)', borderRadius: '6px', color: '#67e8f9' }}>
              <span>3-Day Streak:</span>
              <strong className="font-arcade">1.15x Score Combo</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', padding: '6px 10px', background: 'rgba(250, 204, 21, 0.1)', borderRadius: '6px', color: '#fef08a' }}>
              <span>7-Day Streak:</span>
              <strong className="font-arcade">1.30x Mega Combo</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', padding: '6px 10px', background: 'rgba(244, 63, 94, 0.15)', borderRadius: '6px', color: '#fda4af' }}>
              <span>14-Day Streak:</span>
              <strong className="font-arcade">1.50x Super Combo</strong>
            </div>
          </div>
        </div>
      </section>

      {/* 5. BOTTOM ARCADE CALL TO ACTION */}
      <div className="arcade-card" style={{
        padding: '3rem 2rem',
        textAlign: 'center',
        border: '2px solid var(--neon-magenta)',
        boxShadow: '0 0 35px rgba(244, 63, 94, 0.25)',
        background: 'linear-gradient(180deg, rgba(28, 14, 32, 0.95) 0%, rgba(10, 8, 20, 0.95) 100%)'
      }}>
        <h2 className="font-arcade" style={{
          fontSize: '1.8rem',
          color: '#ffffff',
          marginBottom: '1rem'
        }}>
          READY TO ENTER THE CABINET?
        </h2>
        <p style={{ fontSize: '1rem', color: '#cbd5e1', maxWidth: '520px', margin: '0 auto 1.75rem', lineHeight: 1.5 }}>
          No remote server installation or backend configuration needed. Start right now in pure client-side React.
        </p>
        <button
          onClick={handleInsertCoin}
          className="arcade-btn arcade-btn-primary"
          style={{ fontSize: '0.95rem', padding: '1rem 2.5rem' }}
        >
          <Play size={18} fill="currentColor" /> INSERT COIN (PLAY NOW)
        </button>
      </div>
    </div>
  );
};
