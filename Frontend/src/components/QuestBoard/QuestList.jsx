import React, { useState } from 'react';
import { Plus, Search, Gamepad2 } from 'lucide-react';
import { useGame } from '../../context/GameContext.jsx';
import { QuestCard } from './QuestCard.jsx';
import { QuestModal } from './QuestModal.jsx';

export const QuestList = () => {
  const { missions, profile, getComboMultiplier } = useGame();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState('all');
  const [attrFilter, setAttrFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMission, setEditingMission] = useState(null);

  const combo = getComboMultiplier(profile.streak);

  const filteredMissions = missions.filter((mission) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = mission.title.toLowerCase().includes(query) || (mission.description || '').toLowerCase().includes(query);
    const matchesAttr = attrFilter === 'all' || mission.attribute === attrFilter;
    const matchesTab =
      filterTab === 'all' ||
      (filterTab === 'active' && !mission.completed) ||
      (filterTab === 'cleared' && mission.completed) ||
      (filterTab === 'boss' && mission.stage === 'Boss');

    return matchesSearch && matchesAttr && matchesTab;
  });

  const activeCount = missions.filter((item) => !item.completed).length;
  const clearedCount = missions.filter((item) => item.completed).length;
  const availableXp = missions.filter((item) => !item.completed).reduce((acc, item) => acc + (item.rewardXp || 0), 0);

  return (
    <div style={{ maxWidth: '980px', margin: '0 auto', paddingBottom: '3rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        <div>
          <h2 className="font-arcade" style={{ fontSize: '1.35rem' }}>QUEST MANAGEMENT</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Create, edit, complete, and track quests.</p>
        </div>
        <button onClick={() => { setEditingMission(null); setIsModalOpen(true); }} className="arcade-btn arcade-btn-primary">
          <Plus size={16} /> CREATE QUEST
        </button>
      </div>

      <div className="dashboard-grid-3" style={{ marginBottom: '1.2rem' }}>
        <StatCard title="Active Quests" value={`${activeCount}`} accent="#f43f5e" />
        <StatCard title="Cleared Quests" value={`${clearedCount}`} accent="#10b981" />
        <StatCard title="Available XP" value={`+${availableXp}`} accent="#06b6d4" subtitle={`Combo: ${combo.label}`} />
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.35rem', background: 'rgba(18, 14, 32, 0.8)', padding: '4px', borderRadius: '6px' }}>
          {[
            { key: 'all', label: 'ALL' },
            { key: 'active', label: 'ACTIVE' },
            { key: 'boss', label: 'BOSS' },
            { key: 'cleared', label: 'CLEARED' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilterTab(tab.key)}
              className="font-arcade"
              style={{
                background: filterTab === tab.key ? '#06b6d4' : 'transparent',
                border: 'none',
                color: filterTab === tab.key ? '#04101e' : '#94a3b8',
                padding: '0.4rem 0.65rem',
                borderRadius: '4px',
                fontSize: '0.6rem',
                cursor: 'pointer',
              }}
              aria-pressed={filterTab === tab.key}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
          {['all', 'STR', 'INT', 'WIS', 'DIS', 'CRE'].map((attr) => (
            <button
              key={attr}
              onClick={() => setAttrFilter(attr)}
              className="font-arcade"
              style={{
                fontSize: '0.58rem',
                padding: '4px 8px',
                borderRadius: '4px',
                cursor: 'pointer',
                border: attrFilter === attr ? '1px solid #facc15' : '1px solid rgba(255,255,255,0.1)',
                background: attrFilter === attr ? 'rgba(250, 204, 21, 0.2)' : 'rgba(0, 0, 0, 0.3)',
                color: attrFilter === attr ? '#fef08a' : '#94a3b8',
              }}
              aria-pressed={attrFilter === attr}
            >
              {attr === 'all' ? 'ALL ATTR' : attr}
            </button>
          ))}
        </div>

        <label htmlFor="quest-search" className="sr-only">Search quests</label>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(18, 14, 32, 0.8)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: '6px',
          padding: '0.45rem 0.85rem',
          minWidth: '220px',
          flex: 1,
          maxWidth: '360px',
        }}>
          <Search size={14} color="#67e8f9" />
          <input
            id="quest-search"
            type="text"
            placeholder="Search quests..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            style={{ background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: '0.85rem', width: '100%' }}
          />
        </div>
      </div>

      {filteredMissions.length === 0 ? (
        <div className="arcade-card" style={{ padding: '3rem 1rem', textAlign: 'center' }}>
          <Gamepad2 size={44} color="#06b6d4" style={{ margin: '0 auto 1rem' }} />
          <h3 className="font-arcade" style={{ fontSize: '0.95rem', color: '#fff', marginBottom: '0.5rem' }}>
            NO QUESTS MATCH FILTERS
          </h3>
          <button onClick={() => setIsModalOpen(true)} className="arcade-btn arcade-btn-primary">
            <Plus size={16} /> CREATE QUEST
          </button>
        </div>
      ) : (
        <div>
          {filteredMissions.map((mission) => (
            <QuestCard key={mission.id} mission={mission} onEdit={(selected) => { setEditingMission(selected); setIsModalOpen(true); }} />
          ))}
        </div>
      )}

      <QuestModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} initialData={editingMission} />
    </div>
  );
};

const StatCard = ({ title, value, subtitle, accent }) => (
  <div className="arcade-card" style={{ padding: '1rem', borderLeft: `4px solid ${accent}` }}>
    <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase' }}>{title}</div>
    <div className="font-arcade" style={{ fontSize: '1.2rem', color: '#fff', marginTop: '2px' }}>{value}</div>
    {subtitle && <div style={{ fontSize: '0.76rem', color: '#94a3b8', marginTop: '4px' }}>{subtitle}</div>}
  </div>
);
