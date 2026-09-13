import React from 'react';
import {
  Gamepad2,
  Ticket,
  User,
  Trophy,
  Settings,
  Tv,
  Volume2,
  VolumeX,
  Flame,
  Home,
  Backpack,
  History,
  Shield,
  Sparkles,
  Zap
} from 'lucide-react';
import { useGame, calculateXpRequired, getRankTier } from '../context/GameContext.jsx';
import { soundEffects } from '../services/soundEffects.js';

export const Navbar = () => {
  const {
    profile,
    missions,
    inventory,
    activeTab,
    setActiveTab,
    crtEnabled,
    toggleCrt,
    isMuted,
    toggleMute,
    getComboMultiplier,
    isServerOnline
  } = useGame();

  const xpNeeded = calculateXpRequired(profile.level);
  const xpPercent = Math.min(100, Math.round((profile.xp / xpNeeded) * 100)) || 0;
  const activeMissionsCount = missions.filter((m) => !m.completed).length;
  const combo = getComboMultiplier(profile.streak);
  const tierInfo = getRankTier(profile.level);

  const handleNavClick = (tabKey) => {
    soundEffects.playClick();
    setActiveTab(tabKey);
  };

  const navItems = [
    { key: 'landing', label: 'PROJECT OVERVIEW', icon: Home },
    {
      key: 'missions',
      label: 'ARCADE STAGES',
      icon: Gamepad2,
      badge: activeMissionsCount > 0 ? activeMissionsCount : null,
      badgeColor: '#f43f5e'
    },
    { key: 'shop', label: 'PRIZE COUNTER', icon: Ticket },
    {
      key: 'inventory',
      label: 'P1 INVENTORY',
      icon: Backpack,
      badge: inventory.length > 0 ? inventory.length : null,
      badgeColor: '#06b6d4'
    },
    {
      key: 'attributes',
      label: 'P1 ATTRIBUTES',
      icon: User,
      badge: profile.unspentSkillPoints > 0 ? `+${profile.unspentSkillPoints}` : null,
      badgeColor: '#facc15'
    },
    { key: 'history', label: 'HISTORY & METRICS', icon: History },
    { key: 'leaderboard', label: 'HIGH SCORES', icon: Trophy },
    { key: 'settings', label: 'CABINET CONFIG', icon: Settings },
  ];

  return (
    <aside style={{
      width: '300px',
      minWidth: '300px',
      height: '100vh',
      position: 'sticky',
      top: 0,
      background: 'linear-gradient(180deg, #0b0918 0%, #06050e 100%)',
      borderRight: '2px solid rgba(6, 182, 212, 0.35)',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 50,
      boxShadow: '6px 0 30px rgba(0, 0, 0, 0.7)'
    }}>
      {/* 1. ARCADE MARQUEE BRANDING */}
      <div style={{
        padding: '1.25rem 1.25rem 1.1rem',
        borderBottom: '2px solid rgba(244, 63, 94, 0.3)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        background: 'rgba(244, 63, 94, 0.05)'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '8px',
          background: 'linear-gradient(135deg, #f43f5e 0%, #9f1239 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 16px rgba(244, 63, 94, 0.6)',
          border: '1px solid #fda4af'
        }}>
          <Gamepad2 size={22} color="#ffffff" />
        </div>
        <div>
          <h1 className="font-arcade" style={{
            fontSize: '0.9rem',
            color: '#ffffff',
            textShadow: '0 0 10px rgba(6, 182, 212, 0.8)',
            lineHeight: 1.25
          }}>
            ARCADE LIFE
          </h1>
          <p className="font-arcade" style={{
            fontSize: '0.58rem',
            color: '#facc15',
            letterSpacing: '0.12em',
            marginTop: '3px'
          }}>
            1984 EDITION // {tierInfo.tier}
          </p>
        </div>
      </div>

      {/* 2. PLAYER 1 VITAL SHEET */}
      <div style={{
        padding: '1rem',
        margin: '0.75rem 0.85rem',
        background: 'rgba(18, 14, 32, 0.85)',
        border: '1px solid rgba(6, 182, 212, 0.4)',
        borderRadius: '10px',
        boxShadow: 'inset 0 0 14px rgba(0, 0, 0, 0.6)'
      }}>
        {/* P1 Header Row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.65rem' }}>
          <div style={{
            fontSize: '1.5rem',
            width: '40px',
            height: '40px',
            borderRadius: '6px',
            background: 'rgba(6, 182, 212, 0.15)',
            border: '2px solid #06b6d4',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 12px rgba(6, 182, 212, 0.3)'
          }}>
            {profile.avatar}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span className="font-arcade" style={{ fontSize: '0.7rem', color: '#ffffff' }}>
                {profile.name}
              </span>
              <span className="font-arcade" style={{
                fontSize: '0.6rem',
                padding: '2px 6px',
                borderRadius: '4px',
                background: '#f43f5e',
                color: '#ffffff',
                boxShadow: '0 0 8px rgba(244, 63, 94, 0.6)'
              }}>
                LVL {profile.level}
              </span>
            </div>
            <p className="font-arcade" style={{ fontSize: '0.56rem', color: '#06b6d4', marginTop: '3px' }}>
              {profile.callsign}
            </p>
          </div>
        </div>

        {/* Score & Combo Pill */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.35rem 0.55rem',
          background: 'rgba(0, 0, 0, 0.4)',
          borderRadius: '6px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          marginBottom: '0.55rem',
        }}>
          <div>
            <div style={{ fontSize: '0.58rem', color: '#94a3b8', textTransform: 'uppercase' }}>Score</div>
            <div className="font-arcade" style={{ fontSize: '0.74rem', color: '#facc15' }}>
              {profile.score.toLocaleString()}
            </div>
          </div>
          <div style={{
            fontSize: '0.6rem',
            padding: '2px 6px',
            borderRadius: '4px',
            background: 'rgba(244, 63, 94, 0.2)',
            border: '1px solid #f43f5e',
            color: combo.color,
            fontWeight: 700
          }}>
            🔥 {combo.label}
          </div>
        </div>

        {/* Non-linear XP Bar */}
        <div style={{ marginBottom: '0.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.62rem', marginBottom: '3px' }}>
            <span className="font-arcade" style={{ color: '#06b6d4', fontSize: '0.55rem' }}>XP PROGRESS</span>
            <span className="font-mono" style={{ color: '#94a3b8', fontSize: '0.65rem' }}>
              {profile.xp} / {xpNeeded} ({xpPercent}%)
            </span>
          </div>
          <div style={{
            height: '6px',
            background: 'rgba(255, 255, 255, 0.08)',
            borderRadius: '3px',
            overflow: 'hidden',
            border: '1px solid rgba(6, 182, 212, 0.3)'
          }}>
            <div style={{
              height: '100%',
              width: `${xpPercent}%`,
              background: 'linear-gradient(90deg, #06b6d4 0%, #38bdf8 100%)',
              boxShadow: '0 0 10px #06b6d4',
              transition: 'width 0.4s ease'
            }} />
          </div>
        </div>

        {/* Badges Bar: Tickets, Streak Shields, Unspent Points */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '4px',
          paddingTop: '0.45rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          fontSize: '0.68rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Ticket size={13} color="#f43f5e" />
            <span className="font-arcade" style={{ fontSize: '0.62rem', color: '#fda4af' }}>
              {profile.tickets} TIX
            </span>
          </div>

          {profile.streakShields > 0 && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '3px',
              color: '#34d399',
              background: 'rgba(16, 185, 129, 0.15)',
              padding: '1px 5px',
              borderRadius: '4px',
              border: '1px solid rgba(16, 185, 129, 0.4)'
            }} title="Active Streak Freeze Shield">
              <Shield size={10} />
              <span className="font-arcade" style={{ fontSize: '0.55rem' }}>
                {profile.streakShields} SHIELD
              </span>
            </div>
          )}

          {profile.unspentSkillPoints > 0 && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '3px',
              color: '#fef08a',
              background: 'rgba(250, 204, 21, 0.2)',
              padding: '1px 5px',
              borderRadius: '4px',
              border: '1px solid #facc15'
            }} title="Unspent Skill Points Ready!">
              <Zap size={10} />
              <span className="font-arcade" style={{ fontSize: '0.55rem' }}>
                +{profile.unspentSkillPoints} PTS
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 3. NAVIGATION LINKS */}
      <nav style={{ flex: 1, padding: '0.4rem 0.75rem', overflowY: 'auto' }}>
        <p className="font-arcade" style={{
          fontSize: '0.55rem',
          color: '#64748b',
          letterSpacing: '0.08em',
          padding: '0.25rem 0.75rem',
          marginBottom: '0.25rem'
        }}>
          MAIN CONSOLE
        </p>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.key;

          return (
            <button
              key={item.key}
              onClick={() => handleNavClick(item.key)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.62rem 0.75rem',
                borderRadius: '6px',
                marginBottom: '0.25rem',
                background: isActive
                  ? 'linear-gradient(90deg, rgba(6, 182, 212, 0.22) 0%, rgba(6, 182, 212, 0.05) 100%)'
                  : 'transparent',
                border: isActive
                  ? '1px solid #06b6d4'
                  : '1px solid transparent',
                color: isActive ? '#ffffff' : '#94a3b8',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.12s ease'
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                  e.currentTarget.style.color = '#ffffff';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#94a3b8';
                }
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <Icon size={15} color={isActive ? '#06b6d4' : '#64748b'} />
                <span className="font-arcade" style={{ fontSize: '0.62rem' }}>
                  {item.label}
                </span>
              </div>

              {item.badge && (
                <span className="font-arcade" style={{
                  fontSize: '0.58rem',
                  padding: '2px 5px',
                  borderRadius: '4px',
                  background: item.badgeColor || '#f43f5e',
                  color: item.badgeColor === '#facc15' ? '#000000' : '#ffffff',
                  fontWeight: 700
                }}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* 4. BACKEND CONNECTION PILL */}
      <div style={{
        padding: '0.45rem 0.85rem',
        margin: '0.25rem 0.85rem 0.4rem',
        borderRadius: '6px',
        background: isServerOnline ? 'rgba(16, 185, 129, 0.12)' : 'rgba(250, 204, 21, 0.1)',
        border: isServerOnline ? '1px solid rgba(16, 185, 129, 0.35)' : '1px solid rgba(250, 204, 21, 0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.62rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{
            width: '7px',
            height: '7px',
            borderRadius: '50%',
            background: isServerOnline ? '#10b981' : '#facc15',
            boxShadow: isServerOnline ? '0 0 8px #10b981' : '0 0 8px #facc15',
            display: 'inline-block'
          }} />
          <span className="font-arcade" style={{ color: isServerOnline ? '#34d399' : '#fef08a', fontSize: '0.52rem' }}>
            PORT 8080
          </span>
        </div>
        <span style={{ fontSize: '0.58rem', color: isServerOnline ? '#6ee7b7' : '#fde047', fontWeight: 700 }}>
          {isServerOnline ? 'ONLINE' : 'CONNECTING...'}
        </span>
      </div>

      {/* 5. FOOTER CONTROLS: CRT & AUDIO TOGGLES */}
      <div style={{
        padding: '0.75rem 0.85rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        background: '#070610',
        display: 'flex',
        gap: '0.5rem'
      }}>
        {/* CRT Scanline Toggle */}
        <button
          onClick={toggleCrt}
          className="arcade-btn"
          style={{
            flex: 1,
            fontSize: '0.6rem',
            padding: '0.45rem',
            borderColor: crtEnabled ? '#06b6d4' : 'rgba(255, 255, 255, 0.15)',
            color: crtEnabled ? '#67e8f9' : '#64748b'
          }}
          title="Toggle retro CRT scanline monitor effect"
        >
          <Tv size={12} /> {crtEnabled ? 'CRT: ON' : 'CRT: OFF'}
        </button>

        {/* Audio Synthesizer Toggle */}
        <button
          onClick={toggleMute}
          className="arcade-btn"
          style={{
            flex: 1,
            fontSize: '0.6rem',
            padding: '0.45rem',
            borderColor: !isMuted ? '#facc15' : 'rgba(255, 255, 255, 0.15)',
            color: !isMuted ? '#fef08a' : '#ef4444'
          }}
          title="Toggle 8-bit procedural sound effects"
        >
          {isMuted ? <VolumeX size={12} /> : <Volume2 size={12} />}
          {!isMuted ? '8-BIT: ON' : 'MUTED'}
        </button>
      </div>
    </aside>
  );
};
