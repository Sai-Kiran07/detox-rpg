import React from 'react';
import {
  Gamepad2,
  Coins,
  User,
  Trophy,
  Settings,
  Tv,
  Volume2,
  VolumeX,
  ScrollText,
  Home,
  Backpack,
  LogOut,
} from 'lucide-react';
import { useGame, calculateXpRequired } from '../context/GameContext.jsx';
import { soundEffects } from '../services/soundEffects.js';

export const Navbar = () => {
  const {
    profile,
    missions,
    activeTab,
    setActiveTab,
    crtEnabled,
    toggleCrt,
    isMuted,
    toggleMute,
    getComboMultiplier,
    logout,
    authUser,
  } = useGame();

  const xpNeeded = calculateXpRequired(profile.level);
  const xpPercent = Math.min(100, Math.round((profile.xp / xpNeeded) * 100)) || 0;
  const activeMissionsCount = missions.filter((item) => !item.completed).length;
  const combo = getComboMultiplier(profile.streak);

  const handleNavClick = (tabKey) => {
    soundEffects.playClick();
    setActiveTab(tabKey);
  };

  const navItems = [
    { key: 'landing', label: 'OVERVIEW', icon: Home },
    { key: 'missions', label: 'QUESTS', icon: Gamepad2, badge: activeMissionsCount > 0 ? activeMissionsCount : null },
    { key: 'shop', label: 'SHOP', icon: Coins },
    { key: 'inventory', label: 'INVENTORY', icon: Backpack },
    { key: 'attributes', label: 'ATTRIBUTES', icon: User },
    { key: 'leaderboard', label: 'LEADERBOARD', icon: Trophy },
    { key: 'history', label: 'HISTORY', icon: ScrollText },
    { key: 'settings', label: 'SETTINGS', icon: Settings },
  ];

  return (
    <aside className="app-sidebar">
      <div style={{
        padding: '1.1rem',
        borderBottom: '2px solid rgba(244, 63, 94, 0.3)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        background: 'rgba(244, 63, 94, 0.05)',
      }}>
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: '8px',
          background: 'linear-gradient(135deg, #f43f5e 0%, #9f1239 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Gamepad2 size={24} color="#fff" />
        </div>
        <div>
          <h1 className="font-arcade" style={{ fontSize: '0.86rem', color: '#fff' }}>LIFE RPG</h1>
          <p style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{authUser?.email}</p>
        </div>
      </div>

      <div style={{
        padding: '1rem',
        margin: '0.85rem 1rem',
        background: 'rgba(18, 14, 32, 0.85)',
        border: '1px solid rgba(6, 182, 212, 0.4)',
        borderRadius: '10px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
          <div style={{
            fontSize: '1.6rem',
            width: '42px',
            height: '42px',
            borderRadius: '6px',
            background: 'rgba(6, 182, 212, 0.15)',
            border: '2px solid #06b6d4',
            display: 'grid',
            placeItems: 'center',
          }}>
            {profile.avatar}
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span className="font-arcade" style={{ fontSize: '0.68rem', color: '#fff' }}>{profile.name}</span>
              <span className="font-arcade" style={{
                fontSize: '0.62rem',
                padding: '2px 6px',
                borderRadius: '4px',
                background: '#f43f5e',
                color: '#fff',
              }}>
                LVL {profile.level}
              </span>
            </div>
            <p className="font-arcade" style={{ fontSize: '0.56rem', color: '#06b6d4', marginTop: '3px' }}>
              {profile.callsign}
            </p>
          </div>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.4rem 0.65rem',
          background: 'rgba(0, 0, 0, 0.4)',
          borderRadius: '6px',
          marginBottom: '0.65rem',
          fontSize: '0.78rem',
        }}>
          <div>
            <div style={{ fontSize: '0.62rem', color: '#94a3b8' }}>Score</div>
            <div className="font-arcade" style={{ fontSize: '0.74rem', color: '#facc15' }}>
              {profile.score.toLocaleString()}
            </div>
          </div>
          <div style={{ color: combo.color, fontSize: '0.62rem' }}>🔥 {combo.label}</div>
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.64rem', marginBottom: '3px' }}>
            <span className="font-arcade" style={{ color: '#06b6d4', fontSize: '0.55rem' }}>XP</span>
            <span className="font-mono" style={{ color: '#94a3b8' }}>
              {profile.xp} / {xpNeeded} ({xpPercent}%)
            </span>
          </div>
          <div style={{ height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${xpPercent}%`, background: 'linear-gradient(90deg, #06b6d4 0%, #38bdf8 100%)' }} />
          </div>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          marginTop: '0.65rem',
          paddingTop: '0.5rem',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          fontSize: '0.72rem',
        }}>
          <Coins size={14} color="#f43f5e" />
          <span className="font-arcade" style={{ fontSize: '0.65rem', color: '#fda4af' }}>
            {profile.coins} COINS
          </span>
        </div>
      </div>

      <nav aria-label="Main navigation" style={{ flex: 1, padding: '0.5rem 0.85rem', overflowY: 'auto' }}>
        <div className="sidebar-nav-grid">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.key;
            return (
              <button
                key={item.key}
                onClick={() => handleNavClick(item.key)}
                className="sidebar-nav-btn"
                aria-current={isActive ? 'page' : undefined}
                style={{
                  background: isActive ? 'linear-gradient(90deg, rgba(6, 182, 212, 0.22) 0%, rgba(6, 182, 212, 0.05) 100%)' : 'transparent',
                  border: isActive ? '1px solid #06b6d4' : '1px solid transparent',
                  color: isActive ? '#ffffff' : '#94a3b8',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <Icon size={16} color={isActive ? '#06b6d4' : '#64748b'} />
                  <span className="font-arcade" style={{ fontSize: '0.62rem' }}>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="font-arcade" style={{
                    fontSize: '0.55rem',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    background: '#f43f5e',
                    color: '#fff',
                  }}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      <div style={{
        padding: '0.85rem 1rem',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        background: '#070610',
        display: 'grid',
        gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
        gap: '0.5rem',
      }}>
        <button
          onClick={toggleCrt}
          className="arcade-btn"
          style={{
            fontSize: '0.58rem',
            padding: '0.45rem',
            borderColor: crtEnabled ? '#06b6d4' : 'rgba(255,255,255,0.15)',
            color: crtEnabled ? '#67e8f9' : '#64748b',
          }}
          aria-pressed={crtEnabled}
        >
          <Tv size={12} /> CRT
        </button>

        <button
          onClick={toggleMute}
          className="arcade-btn"
          style={{
            fontSize: '0.58rem',
            padding: '0.45rem',
            borderColor: !isMuted ? '#facc15' : 'rgba(255,255,255,0.15)',
            color: !isMuted ? '#fef08a' : '#ef4444',
          }}
          aria-pressed={!isMuted}
        >
          {isMuted ? <VolumeX size={12} /> : <Volume2 size={12} />}
          AUDIO
        </button>

        <button onClick={logout} className="arcade-btn" style={{ fontSize: '0.58rem', padding: '0.45rem' }}>
          <LogOut size={12} /> LOGOUT
        </button>
      </div>
    </aside>
  );
};
