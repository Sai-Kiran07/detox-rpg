import React, { useState } from 'react';
import { 
  Settings, 
  Tv, 
  Volume2, 
  Trash2, 
  User, 
  Gamepad2, 
  CheckCircle2, 
  RefreshCw 
} from 'lucide-react';
import { useGame } from '../../context/GameContext.jsx';
import { soundEffects } from '../../services/soundEffects.js';

export const SettingsView = () => {
  const { 
    profile, 
    crtEnabled, 
    toggleCrt, 
    isMuted, 
    toggleMute, 
    resetArcadeData,
    updateProfileIdentity
  } = useGame();

  const [alias, setAlias] = useState(profile.name);
  const [callsign, setCallsign] = useState(profile.callsign);
  const [avatar, setAvatar] = useState(profile.avatar);
  const [savedStatus, setSavedStatus] = useState(false);

  // Sync state if profile loads from API later
  React.useEffect(() => {
    setAlias(profile.name);
    setCallsign(profile.callsign);
    setAvatar(profile.avatar);
  }, [profile.name, profile.callsign, profile.avatar]);

  const handleSaveIdentity = async (e) => {
    e.preventDefault();
    soundEffects.playCoin();
    await updateProfileIdentity({
      name: alias,
      callsign: callsign,
      avatar: avatar,
    });
    setSavedStatus(true);
    setTimeout(() => setSavedStatus(false), 2000);
  };

  const avatars = ['🕹️', '👾', '🤖', '🚀', '⚡', '👑', '🧙‍♂️', '⚔️'];

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto', paddingBottom: '3rem' }}>
      {/* Header */}
      <div style={{
        marginBottom: '1.75rem',
        borderBottom: '2px solid rgba(6, 182, 212, 0.25)',
        paddingBottom: '1.25rem'
      }}>
        <span className="font-arcade" style={{ fontSize: '0.68rem', color: '#06b6d4', letterSpacing: '0.12em' }}>
          // CABINET SYSTEM PREFERENCES //
        </span>
        <h2 className="font-arcade" style={{
          fontSize: '1.6rem',
          color: '#ffffff',
          marginTop: '0.35rem',
          textShadow: '0 0 12px rgba(6, 182, 212, 0.6)'
        }}>
          CABINET CONFIG & SOUNDBOARD
        </h2>
        <p style={{ fontSize: '0.88rem', color: '#94a3b8', marginTop: '0.3rem' }}>
          Toggle authentic 80s CRT scanlines, test procedural 8-bit sound synthesizers, and tune cabinet settings.
        </p>
      </div>

      {/* 1. CRT MONITOR EMULATION */}
      <div className="arcade-card" style={{ padding: '1.75rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              background: 'rgba(6, 182, 212, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#06b6d4'
            }}>
              <Tv size={22} />
            </div>
            <div>
              <h3 className="font-arcade" style={{ fontSize: '0.92rem', color: '#ffffff' }}>
                CRT SCANLINE FILTER
              </h3>
              <p style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
                Simulates phosphor scanlines and curved glass vignette of 1980s coin-op cabinets.
              </p>
            </div>
          </div>

          <button
            onClick={toggleCrt}
            className={`arcade-btn ${crtEnabled ? 'arcade-btn-primary' : ''}`}
            style={{ fontSize: '0.75rem', padding: '0.65rem 1.25rem' }}
          >
            {crtEnabled ? 'SCANLINES: ACTIVE' : 'SCANLINES: DISABLED'}
          </button>
        </div>
      </div>

      {/* 2. 8-BIT CHIPTUNE SOUNDBOARD */}
      <div className="arcade-card" style={{ padding: '1.75rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              background: 'rgba(250, 204, 21, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#facc15'
            }}>
              <Volume2 size={22} />
            </div>
            <div>
              <h3 className="font-arcade" style={{ fontSize: '0.92rem', color: '#ffffff' }}>
                CHIPTUNE SOUNDBOARD
              </h3>
              <p style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
                Procedural square-wave & pulse oscillators synthesizing zero-latency audio.
              </p>
            </div>
          </div>

          <button
            onClick={toggleMute}
            className="arcade-btn"
            style={{ fontSize: '0.7rem' }}
          >
            {isMuted ? 'UNMUTE AUDIO' : 'MUTE AUDIO'}
          </button>
        </div>

        <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
          <button onClick={() => soundEffects.playCoin()} className="arcade-btn arcade-btn-yellow" style={{ fontSize: '0.68rem' }}>
            🪙 COIN DROP
          </button>
          <button onClick={() => soundEffects.playCheckmark()} className="arcade-btn" style={{ fontSize: '0.68rem' }}>
            ⚡ POWER-UP ARPEGGIO
          </button>
          <button onClick={() => soundEffects.playCombo()} className="arcade-btn" style={{ fontSize: '0.68rem' }}>
            🔥 COMBO STRIKE
          </button>
          <button onClick={() => soundEffects.playPurchase()} className="arcade-btn" style={{ fontSize: '0.68rem' }}>
            🎟️ TICKET DISPENSER
          </button>
          <button onClick={() => soundEffects.playLevelUp()} className="arcade-btn arcade-btn-primary" style={{ fontSize: '0.68rem' }}>
            🎺 STAGE CLEAR FANFARE
          </button>
          <button onClick={() => soundEffects.playError()} className="arcade-btn" style={{ borderColor: '#ef4444', color: '#fca5a5', fontSize: '0.68rem' }}>
            ⚠️ ERROR BUZZ
          </button>
        </div>
      </div>

      {/* 3. PLAYER 1 IDENTITY */}
      <div className="arcade-card" style={{ padding: '1.75rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1.25rem' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '8px',
            background: 'rgba(244, 63, 94, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#f43f5e'
          }}>
            <User size={22} />
          </div>
          <div>
            <h3 className="font-arcade" style={{ fontSize: '0.92rem', color: '#ffffff' }}>
              PLAYER 1 CALLSIGN & AVATAR
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
              Customize your arcade cabinet moniker.
            </p>
          </div>
        </div>

        <form onSubmit={handleSaveIdentity}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label className="font-arcade" style={{ display: 'block', fontSize: '0.62rem', color: '#06b6d4', marginBottom: '0.35rem' }}>
                PLAYER NAME
              </label>
              <input
                type="text"
                value={alias}
                onChange={(e) => setAlias(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '6px',
                  background: '#151128',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#ffffff',
                  fontSize: '0.9rem',
                  outline: 'none',
                }}
              />
            </div>

            <div>
              <label className="font-arcade" style={{ display: 'block', fontSize: '0.62rem', color: '#06b6d4', marginBottom: '0.35rem' }}>
                ARCADE CALLSIGN
              </label>
              <input
                type="text"
                value={callsign}
                onChange={(e) => setCallsign(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '6px',
                  background: '#151128',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#ffffff',
                  fontSize: '0.9rem',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <label className="font-arcade" style={{ display: 'block', fontSize: '0.62rem', color: '#facc15', marginBottom: '0.5rem' }}>
              CABINET AVATAR
            </label>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {avatars.map((av) => (
                <button
                  key={av}
                  type="button"
                  onClick={() => setAvatar(av)}
                  style={{
                    fontSize: '1.4rem',
                    width: '44px',
                    height: '44px',
                    borderRadius: '6px',
                    background: avatar === av ? 'rgba(6, 182, 212, 0.25)' : 'rgba(255, 255, 255, 0.04)',
                    border: avatar === av ? '2px solid #06b6d4' : '1px solid rgba(255, 255, 255, 0.1)',
                    cursor: 'pointer'
                  }}
                >
                  {av}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="arcade-btn arcade-btn-primary"
          >
            {savedStatus ? '✓ SAVED TO CABINET' : 'UPDATE MONIKER'}
          </button>
        </form>
      </div>

      {/* 4. RESET MACHINE */}
      <div className="arcade-card" style={{ padding: '1.5rem', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h4 className="font-arcade" style={{ fontSize: '0.85rem', color: '#fca5a5' }}>
              RESET MACHINE MEMORY
            </h4>
            <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '2px' }}>
              Wipes local high scores and resets to initial starter stages and prizes.
            </p>
          </div>
          <button
            onClick={() => {
              if (window.confirm('Reset all arcade high scores, attributes, and stages?')) {
                resetArcadeData();
              }
            }}
            className="arcade-btn"
            style={{ borderColor: '#ef4444', color: '#fca5a5', fontSize: '0.72rem' }}
          >
            <Trash2 size={14} /> RESET MACHINE
          </button>
        </div>
      </div>
    </div>
  );
};
