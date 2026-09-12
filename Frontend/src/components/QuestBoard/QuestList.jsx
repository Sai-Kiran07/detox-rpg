import React, { useState } from 'react';
import { Plus, Search, Filter, Gamepad2, Trophy, Flame, Zap, Star } from 'lucide-react';
import { useGame } from '../../context/GameContext.jsx';
import { QuestCard } from './QuestCard.jsx';
import { QuestModal } from './QuestModal.jsx';

export const QuestList = () => {
  const { missions, profile, getComboMultiplier, intXpMultiplier } = useGame();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState('active'); // 'all' | 'active' | 'priority' | 'boss' | 'cleared'
  const [attrFilter, setAttrFilter] = useState('all'); // all, INT, STR, AGI, END, CHA
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMission, setEditingMission] = useState(null);

  const combo = getComboMultiplier(profile.streak);

  const handleCreateNew = () => {
    setEditingMission(null);
    setIsModalOpen(true);
  };

  const handleEdit = (mission) => {
    setEditingMission(mission);
    setIsModalOpen(true);
  };

  const filteredMissions = missions
    .filter((m) => {
      const matchesSearch = 
        m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (m.description && m.description.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesAttr = attrFilter === 'all' || m.attribute === attrFilter;

      let matchesTab = true;
      if (filterTab === 'active') matchesTab = !m.completed;
      if (filterTab === 'priority') matchesTab = m.priority === 'high' && !m.completed;
      if (filterTab === 'cleared') matchesTab = m.completed;
      if (filterTab === 'boss') matchesTab = m.stage === 'Boss';

      return matchesSearch && matchesAttr && matchesTab;
    })
    .sort((a, b) => {
      // Completed missions sink to bottom
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      // High priority floats to top
      if (a.priority === 'high' && b.priority !== 'high') return -1;
      if (b.priority === 'high' && a.priority !== 'high') return 1;
      return 0;
    });

  const activeCount = missions.filter((m) => !m.completed).length;
  const clearedCount = missions.filter((m) => m.completed).length;
  const priorityCount = missions.filter((m) => !m.completed && m.priority === 'high').length;
  const availableXp = missions
    .filter((m) => !m.completed)
    .reduce((acc, m) => acc + Math.round((m.rewardXp || 0) * intXpMultiplier), 0);

  return (
    <div style={{ maxWidth: '980px', margin: '0 auto', paddingBottom: '3rem' }}>
      {/* 1. Header Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '1.75rem',
        borderBottom: '2px solid rgba(6, 182, 212, 0.25)',
        paddingBottom: '1.25rem'
      }}>
        <div>
          <span className="font-arcade" style={{ fontSize: '0.68rem', color: '#facc15', letterSpacing: '0.12em' }}>
            // ACTIVE STAGE MATRIX //
          </span>
          <h2 className="font-arcade" style={{
            fontSize: '1.6rem',
            color: '#ffffff',
            marginTop: '0.35rem',
            textShadow: '0 0 12px rgba(6, 182, 212, 0.6)'
          }}>
            ARCADE STAGES & MISSIONS
          </h2>
          <p style={{ fontSize: '0.88rem', color: '#94a3b8', marginTop: '0.3rem' }}>
            Clear stages to harvest XP, boost your 5 Attributes, execute subtasks, and trigger combo score multipliers.
          </p>
        </div>

        {/* Program Mission Button */}
        <button
          onClick={handleCreateNew}
          className="arcade-btn arcade-btn-primary"
        >
          <Plus size={16} /> PROGRAM NEW MISSION
        </button>
      </div>

      {/* 2. Tactical Metric Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '1.5rem'
      }}>
        <div className="arcade-card" style={{ padding: '1rem', borderLeft: '4px solid #f43f5e' }}>
          <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase' }}>Active Stages</div>
          <div className="font-arcade" style={{ fontSize: '1.35rem', color: '#ffffff', marginTop: '2px' }}>
            {activeCount} PENDING
          </div>
          {priorityCount > 0 && (
            <div style={{ fontSize: '0.72rem', color: '#fca5a5', marginTop: '2px' }}>
              ★ {priorityCount} High Priority
            </div>
          )}
        </div>

        <div className="arcade-card" style={{ padding: '1rem', borderLeft: '4px solid #06b6d4' }}>
          <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase' }}>Available Renown</div>
          <div className="font-arcade" style={{ fontSize: '1.35rem', color: '#67e8f9', marginTop: '2px' }}>
            +{availableXp} XP
          </div>
          <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px' }}>
            Includes INT Boost (+{Math.round((intXpMultiplier - 1) * 100)}%)
          </div>
        </div>

        <div className="arcade-card" style={{ padding: '1rem', borderLeft: '4px solid #facc15' }}>
          <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase' }}>Active Streak Flame</div>
          <div className="font-arcade" style={{ fontSize: '1.25rem', color: '#facc15', marginTop: '2px' }}>
            🔥 {combo.label}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px' }}>
            Day {profile.streak} consecutive
          </div>
        </div>
      </div>

      {/* 3. Filtering & Search Toolbar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.85rem',
        marginBottom: '1.25rem'
      }}>
        {/* Stage Filter Tabs */}
        <div style={{ display: 'flex', gap: '0.35rem', background: 'rgba(18, 14, 32, 0.8)', padding: '4px', borderRadius: '6px', border: '1px solid rgba(255, 255, 255, 0.08)', flexWrap: 'wrap' }}>
          {[
            { key: 'active', label: 'ACTIVE' },
            { key: 'priority', label: '★ PRIORITY' },
            { key: 'boss', label: 'BOSS STAGES' },
            { key: 'cleared', label: 'CLEARED' },
            { key: 'all', label: 'ALL' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilterTab(tab.key)}
              className="font-arcade"
              style={{
                background: filterTab === tab.key ? '#06b6d4' : 'transparent',
                border: 'none',
                color: filterTab === tab.key ? '#04101e' : '#94a3b8',
                padding: '0.45rem 0.75rem',
                borderRadius: '4px',
                fontSize: '0.62rem',
                cursor: 'pointer',
                transition: 'all 0.1s ease',
                fontWeight: 700
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Attribute Filter Pills */}
        <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
          {['all', 'INT', 'STR', 'AGI', 'END', 'CHA'].map((attr) => (
            <button
              key={attr}
              onClick={() => setAttrFilter(attr)}
              className="font-arcade"
              style={{
                fontSize: '0.6rem',
                padding: '4px 8px',
                borderRadius: '4px',
                cursor: 'pointer',
                border: attrFilter === attr ? '1px solid #facc15' : '1px solid rgba(255, 255, 255, 0.1)',
                background: attrFilter === attr ? 'rgba(250, 204, 21, 0.2)' : 'rgba(0, 0, 0, 0.3)',
                color: attrFilter === attr ? '#fef08a' : '#94a3b8'
              }}
            >
              {attr === 'all' ? 'ALL ATTR' : attr}
            </button>
          ))}
        </div>

        {/* Search */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(18, 14, 32, 0.8)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '6px',
          padding: '0.45rem 0.85rem',
          minWidth: '220px'
        }}>
          <Search size={14} color="#67e8f9" />
          <input
            type="text"
            placeholder="Search missions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#ffffff',
              fontSize: '0.85rem',
              width: '100%'
            }}
          />
        </div>
      </div>

      {/* 4. Missions List */}
      {filteredMissions.length === 0 ? (
        <div 
          className="arcade-card"
          style={{
            padding: '3.5rem 2rem',
            textAlign: 'center',
            border: '2px dashed rgba(6, 182, 212, 0.3)'
          }}
        >
          <Gamepad2 size={44} color="#06b6d4" style={{ margin: '0 auto 1rem' }} />
          <h3 className="font-arcade" style={{ fontSize: '1rem', color: '#ffffff', marginBottom: '0.5rem' }}>
            NO ACTIVE STAGES IN THIS FILTER
          </h3>
          <p style={{ color: '#94a3b8', fontSize: '0.88rem', maxWidth: '380px', margin: '0 auto 1.5rem' }}>
            No missions match your active search or filter. Deploy a new mission contract to continue your streak!
          </p>
          <button
            onClick={handleCreateNew}
            className="arcade-btn arcade-btn-primary"
          >
            <Plus size={16} /> PROGRAM NEW STAGE
          </button>
        </div>
      ) : (
        <div>
          {filteredMissions.map((mission) => (
            <QuestCard key={mission.id} mission={mission} onEdit={handleEdit} />
          ))}
        </div>
      )}

      {/* Modal */}
      <QuestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={editingMission}
      />
    </div>
  );
};
