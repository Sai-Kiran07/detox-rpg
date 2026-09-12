import React from 'react';
import { Coins, Trophy, Flame } from 'lucide-react';
import { GameProvider, useGame } from './context/GameContext.jsx';
import { Navbar } from './components/Navbar.jsx';
import { LandingPage } from './components/LandingPage/LandingPage.jsx';
import { QuestList } from './components/QuestBoard/QuestList.jsx';
import { ShopList } from './components/Shop/ShopList.jsx';
import { StatsView } from './components/Stats/StatsView.jsx';
import { SettingsView } from './components/Settings/SettingsView.jsx';
import { FloatingRewards } from './components/FloatingRewards.jsx';
import { LevelUpModal } from './components/LevelUpModal.jsx';
import { AuthView } from './components/Auth/AuthView.jsx';
import { HistoryView } from './components/History/HistoryView.jsx';
import { InventoryView } from './components/Inventory/InventoryView.jsx';

const MainLayout = () => {
  const { activeTab, profile, crtEnabled, getComboMultiplier, isAuthenticated } = useGame();

  if (!isAuthenticated) {
    return <AuthView />;
  }

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
      case 'leaderboard':
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
      case 'landing': return 'PROJECT OVERVIEW';
      case 'missions': return 'QUEST MANAGER';
      case 'shop': return 'REWARD SHOP';
      case 'inventory': return 'INVENTORY';
      case 'attributes': return 'CHARACTER ATTRIBUTES';
      case 'leaderboard': return 'LEADERBOARD';
      case 'history': return 'PROGRESS TIMELINE';
      case 'settings': return 'SETTINGS';
      default: return 'LIFE RPG';
    }
  };

  return (
    <div className="app-shell">
      <a href="#main-content" className="skip-link">Skip to main content</a>
      {crtEnabled && <div className="crt-overlay" aria-hidden="true" />}
      <Navbar />

      <main className="app-main" id="main-content">
        <header className="top-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="font-arcade" style={{ fontSize: '0.62rem', color: '#64748b' }}>CABINET //</span>
            <span className="font-arcade" style={{ fontSize: '0.75rem', color: '#fff' }}>
              {getBreadcrumbTitle()}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <div className="stat-pill" style={{ color: '#facc15' }}>
              <Trophy size={14} />
              <span className="font-arcade" style={{ fontSize: '0.68rem' }}>
                {profile.score.toLocaleString()} PTS
              </span>
            </div>
            <div className="stat-pill" style={{ color: combo.color }}>
              <Flame size={14} color="#f43f5e" />
              <span className="font-arcade" style={{ fontSize: '0.62rem' }}>
                {combo.label}
              </span>
            </div>
            <div className="stat-pill" style={{ color: '#67e8f9' }}>
              <Coins size={14} color="#06b6d4" />
              <span className="font-arcade" style={{ fontSize: '0.65rem' }}>
                {profile.coins} COINS
              </span>
            </div>
          </div>
        </header>

        <div className="app-content">{renderActiveView()}</div>
      </main>

      <FloatingRewards />
      <LevelUpModal />
    </div>
  );
};

export default function App() {
  return (
    <GameProvider>
      <MainLayout />
    </GameProvider>
  );
}
