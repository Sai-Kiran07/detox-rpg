import React from 'react';
import { GameProvider, useGame } from './context/GameContext.jsx';
import { Navbar } from './components/Navbar.jsx';
import { LandingPage } from './components/LandingPage/LandingPage.jsx';
import { QuestList } from './components/QuestBoard/QuestList.jsx';
import { ShopList } from './components/Shop/ShopList.jsx';
import { InventoryView } from './components/Inventory/InventoryView.jsx';
import { StatsView } from './components/Stats/StatsView.jsx';
import { HistoryView } from './components/History/HistoryView.jsx';
import { SettingsView } from './components/Settings/SettingsView.jsx';
import { AuthView } from './components/Auth/AuthView.jsx';
import { FloatingRewards } from './components/FloatingRewards.jsx';
import { LevelUpModal } from './components/LevelUpModal.jsx';
import { Ticket, Trophy, Flame, Zap, Shield } from 'lucide-react';

const MainLayout = () => {
  const { activeTab, setActiveTab, profile, crtEnabled, getComboMultiplier } = useGame();
  const combo = getComboMultiplier(profile.streak);

  const renderActiveView = () => {
    switch (activeTab) {
      case 'landing':
        return <LandingPage />;
      case 'missions':
        return <QuestList />;
      case 'shop':
        return <ShopList />;
      case 'inventory':
        return <InventoryView />;
      case 'attributes':
        return <StatsView />;
      case 'history':
        return <HistoryView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <LandingPage />;
    }
  };

  const getBreadcrumbTitle = () => {
    switch (activeTab) {
      case 'landing': return 'HACKATHON PROJECT OVERVIEW';
      case 'missions': return 'ARCADE MISSIONS & STAGES';
      case 'shop': return 'TICKET PRIZE COUNTER';
      case 'inventory': return 'P1 INVENTORY & VAULT';
      case 'attributes': return 'P1 ATTRIBUTE MATRIX';
      case 'history': return 'CAREER AUDIT & PROGRESS METRICS';
      case 'settings': return 'CABINET PREFERENCES';
      default: return 'ARCADE LIFE';
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100%', position: 'relative' }}>
      {/* CRT Scanline Monitor Emulation */}
      {crtEnabled && <div className="crt-overlay" />}

      {/* Left Navigation Bar */}
      <Navbar />

      {/* Main Arcade Cabinet Screen */}
      <main style={{
        flex: 1,
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
        background: 'transparent',
      }}>
        {/* Top Header Bar with Live Vitals */}
        <header style={{
          height: '64px',
          borderBottom: '2px solid rgba(6, 182, 212, 0.25)',
          background: 'rgba(11, 9, 24, 0.85)',
          backdropFilter: 'blur(10px)',
          position: 'sticky',
          top: 0,
          zIndex: 40,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 2rem',
        }}>
          {/* Breadcrumb Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="font-arcade" style={{ fontSize: '0.62rem', color: '#64748b' }}>CABINET //</span>
            <span className="font-arcade" style={{
              fontSize: '0.75rem',
              color: '#ffffff',
              textShadow: '0 0 10px rgba(6, 182, 212, 0.6)'
            }}>
              {getBreadcrumbTitle()}
            </span>
          </div>

          {/* Quick Glances */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            {/* Unspent Skill Points Alert */}
            {profile.unspentSkillPoints > 0 && (
              <button
                onClick={() => setActiveTab('attributes')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  background: 'rgba(250, 204, 21, 0.18)',
                  border: '1px solid #facc15',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  color: '#fef08a',
                  fontSize: '0.72rem',
                  cursor: 'pointer',
                  animation: 'arcadeBlink 1.5s infinite'
                }}
                title="Click to allocate skill points in Character Sheet"
              >
                <Zap size={13} color="#facc15" />
                <span className="font-arcade" style={{ fontSize: '0.62rem' }}>
                  +{profile.unspentSkillPoints} SKILL PTS
                </span>
              </button>
            )}

            {/* Score Ticker */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.72rem',
              background: 'rgba(250, 204, 21, 0.1)',
              border: '1px solid rgba(250, 204, 21, 0.3)',
              padding: '4px 10px',
              borderRadius: '6px',
              color: '#facc15'
            }}>
              <Trophy size={14} />
              <span className="font-arcade" style={{ fontSize: '0.68rem' }}>
                {profile.score.toLocaleString()} PTS
              </span>
            </div>

            {/* Streak Multiplier */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.72rem',
              background: 'rgba(244, 63, 94, 0.12)',
              border: '1px solid rgba(244, 63, 94, 0.3)',
              padding: '4px 10px',
              borderRadius: '6px',
              color: combo.color,
              fontWeight: 700
            }}>
              <Flame size={14} color="#f43f5e" />
              <span className="font-arcade" style={{ fontSize: '0.62rem' }}>
                {combo.label}
              </span>
            </div>

            {/* Tickets */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.72rem',
              background: 'rgba(6, 182, 212, 0.12)',
              border: '1px solid rgba(6, 182, 212, 0.3)',
              padding: '4px 10px',
              borderRadius: '6px',
              color: '#67e8f9'
            }}>
              <Ticket size={14} color="#06b6d4" />
              <span className="font-arcade" style={{ fontSize: '0.65rem' }}>
                {profile.tickets} TIX
              </span>
            </div>
          </div>
        </header>

        {/* View Content */}
        <div style={{ flex: 1, padding: '2rem' }}>
          {renderActiveView()}
        </div>
      </main>

      {/* Celebratory Overlays */}
      <FloatingRewards />
      <LevelUpModal />
    </div>
  );
};

const AppContent = () => {
  const { isAuthenticated, activeTab, setActiveTab } = useGame();
  const [authMode, setAuthMode] = React.useState('login');

  // URL sync & strict authentication protection:
  // "if user edits url to move another page , redirect it back to login page"
  React.useEffect(() => {
    const handleUrlSync = () => {
      const path = (
        window.location.pathname.replace(/^\/+/, '') || 
        window.location.hash.replace(/^#\/?/, '')
      ).toLowerCase();

      if (!isAuthenticated) {
        // If not logged in: redirect any edited URL back to /login (or /register)
        if (path === 'register') {
          setAuthMode('register');
        } else {
          setAuthMode('login');
          if (window.location.pathname !== '/login' && window.location.hash !== '#/login') {
            window.history.replaceState({}, '', '/login');
          }
        }
      } else {
        // If authenticated: if URL is /login or /register, redirect to /missions
        if (path === 'login' || path === 'register' || !path) {
          setActiveTab('missions');
          window.history.replaceState({}, '', '/missions');
        } else {
          const validTabs = ['landing', 'missions', 'shop', 'inventory', 'attributes', 'history', 'settings'];
          if (validTabs.includes(path)) {
            setActiveTab(path);
          }
        }
      }
    };

    handleUrlSync();
    window.addEventListener('popstate', handleUrlSync);
    window.addEventListener('hashchange', handleUrlSync);
    return () => {
      window.removeEventListener('popstate', handleUrlSync);
      window.removeEventListener('hashchange', handleUrlSync);
    };
  }, [isAuthenticated, setActiveTab]);

  // Synchronize browser address bar when activeTab changes
  React.useEffect(() => {
    if (isAuthenticated && activeTab) {
      const currentPath = window.location.pathname.replace(/^\/+/, '').toLowerCase();
      if (currentPath !== activeTab && activeTab !== 'login' && activeTab !== 'register') {
        window.history.pushState({}, '', `/${activeTab}`);
      }
    }
  }, [activeTab, isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <AuthView 
        defaultMode={authMode} 
        onAuthSuccess={() => {
          setActiveTab('missions');
          window.history.replaceState({}, '', '/missions');
        }} 
      />
    );
  }

  return <MainLayout />;
};

export default function App() {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
}
