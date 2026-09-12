import React, { useState, useEffect } from 'react';
import { X, Sparkles, Gamepad2, Plus } from 'lucide-react';
import { useGame } from '../../context/GameContext.jsx';

export const QuestModal = ({ isOpen, onClose, initialData = null }) => {
  const { addMission, updateMission } = useGame();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Academics');
  const [stage, setStage] = useState('Intermediate');
  const [attribute, setAttribute] = useState('INT');
  const [rewardXp, setRewardXp] = useState(160);
  const [rewardScore, setRewardScore] = useState(350);
  const [rewardTickets, setRewardTickets] = useState(40);
  const [deadline, setDeadline] = useState('Daily Stage');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setDescription(initialData.description || '');
      setCategory(initialData.category || 'Academics');
      setStage(initialData.stage || 'Intermediate');
      setAttribute(initialData.attribute || 'INT');
      setRewardXp(initialData.rewardXp || 160);
      setRewardScore(initialData.rewardScore || 350);
      setRewardTickets(initialData.rewardTickets || 40);
      setDeadline(initialData.deadline || 'Daily Stage');
    } else {
      setTitle('');
      setDescription('');
      setCategory('Academics');
      setStage('Intermediate');
      setAttribute('INT');
      setRewardXp(160);
      setRewardScore(350);
      setRewardTickets(40);
      setDeadline('Daily Stage');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleStageChange = (newStage) => {
    setStage(newStage);
    switch (newStage) {
      case 'Novice':
        setRewardXp(80);
        setRewardScore(150);
        setRewardTickets(20);
        break;
      case 'Intermediate':
        setRewardXp(160);
        setRewardScore(350);
        setRewardTickets(40);
        break;
      case 'Expert':
        setRewardXp(240);
        setRewardScore(600);
        setRewardTickets(70);
        break;
      case 'Boss':
        setRewardXp(400);
        setRewardScore(1200);
        setRewardTickets(120);
        break;
      default:
        break;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const missionPayload = {
      title,
      description,
      category,
      stage,
      attribute,
      attributeGain: stage === 'Boss' ? 4 : stage === 'Expert' ? 3 : 2,
      rewardXp: Number(rewardXp),
      rewardScore: Number(rewardScore),
      rewardTickets: Number(rewardTickets),
      deadline,
    };

    if (initialData) {
      updateMission(initialData.id, missionPayload);
    } else {
      addMission(missionPayload);
    }
    onClose();
  };

  const attributesList = [
    { key: 'INT', label: 'INT (Intellect / Study)' },
    { key: 'STR', label: 'STR (Strength / Gym)' },
    { key: 'AGI', label: 'AGI (Agility / Chores)' },
    { key: 'END', label: 'END (Endurance / Focus)' },
    { key: 'CHA', label: 'CHA (Charisma / Pitch)' },
  ];

  return (
    <div className="arcade-modal-overlay">
      <div 
        className="arcade-card"
        style={{
          maxWidth: '560px',
          width: '100%',
          border: '2px solid var(--neon-cyan)',
          background: '#0e0b1d',
          padding: '2rem',
          boxShadow: '0 0 40px rgba(6, 182, 212, 0.4)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <Gamepad2 size={22} color="#06b6d4" />
            <h2 className="font-arcade" style={{ fontSize: '0.95rem', color: '#ffffff' }}>
              {initialData ? 'EDIT ARCADE MISSION' : 'PROGRAM NEW MISSION'}
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
            }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Mission Objective Title */}
          <div style={{ marginBottom: '1rem' }}>
            <label className="font-arcade" style={{ display: 'block', fontSize: '0.62rem', color: '#06b6d4', marginBottom: '0.4rem' }}>
              MISSION OBJECTIVE *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Master Module 3 Distributed Systems Lab"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{
                width: '100%',
                padding: '0.7rem 0.85rem',
                borderRadius: '6px',
                background: '#151128',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#ffffff',
                fontSize: '0.92rem',
                outline: 'none',
              }}
            />
          </div>

          {/* Lore / Notes */}
          <div style={{ marginBottom: '1rem' }}>
            <label className="font-arcade" style={{ display: 'block', fontSize: '0.62rem', color: '#06b6d4', marginBottom: '0.4rem' }}>
              DESCRIPTION / CRITERIA
            </label>
            <textarea
              rows={2}
              placeholder="Sub-tasks, specific exercises, or targets..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{
                width: '100%',
                padding: '0.65rem 0.85rem',
                borderRadius: '6px',
                background: '#151128',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#ffffff',
                fontSize: '0.88rem',
                outline: 'none',
                resize: 'none',
              }}
            />
          </div>

          {/* Attribute Boost & Stage Selection */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label className="font-arcade" style={{ display: 'block', fontSize: '0.62rem', color: '#facc15', marginBottom: '0.4rem' }}>
                ATTRIBUTE BOOSTED
              </label>
              <select
                value={attribute}
                onChange={(e) => setAttribute(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem',
                  borderRadius: '6px',
                  background: '#151128',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#ffffff',
                  fontSize: '0.85rem',
                  outline: 'none',
                }}
              >
                {attributesList.map((attr) => (
                  <option key={attr.key} value={attr.key}>{attr.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-arcade" style={{ display: 'block', fontSize: '0.62rem', color: '#facc15', marginBottom: '0.4rem' }}>
                STAGE DIFFICULTY
              </label>
              <select
                value={stage}
                onChange={(e) => handleStageChange(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem',
                  borderRadius: '6px',
                  background: '#151128',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#ffffff',
                  fontSize: '0.85rem',
                  outline: 'none',
                }}
              >
                <option value="Novice">Novice Stage</option>
                <option value="Intermediate">Intermediate Stage</option>
                <option value="Expert">Expert Stage</option>
                <option value="Boss">Boss Battle Stage</option>
              </select>
            </div>
          </div>

          {/* Reward Summary Pill */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(6, 182, 212, 0.08)',
            border: '1px solid rgba(6, 182, 212, 0.3)',
            borderRadius: '6px',
            padding: '0.75rem 1rem',
            marginBottom: '1.5rem',
            fontSize: '0.78rem'
          }}>
            <span className="font-arcade" style={{ fontSize: '0.65rem', color: '#67e8f9' }}>
              REWARDS CALCULATED:
            </span>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <span className="font-arcade" style={{ fontSize: '0.65rem', color: '#06b6d4' }}>+{rewardXp} XP</span>
              <span className="font-arcade" style={{ fontSize: '0.65rem', color: '#facc15' }}>+{rewardScore} PTS</span>
              <span className="font-arcade" style={{ fontSize: '0.65rem', color: '#f43f5e' }}>+{rewardTickets} TIX</span>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button
              type="button"
              onClick={onClose}
              className="arcade-btn"
              style={{ borderColor: 'rgba(255, 255, 255, 0.2)', color: '#cbd5e1' }}
            >
              CANCEL
            </button>
            <button
              type="submit"
              className="arcade-btn arcade-btn-primary"
            >
              <Plus size={14} /> {initialData ? 'SAVE MISSION' : 'DEPLOY MISSION'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
