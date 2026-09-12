import React, { useState, useEffect } from 'react';
import { X, Sparkles, Gamepad2, Plus, Trash2, ListPlus } from 'lucide-react';
import { useGame } from '../../context/GameContext.jsx';

export const QuestModal = ({ isOpen, onClose, initialData = null }) => {
  const { addMission, updateMission } = useGame();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Academics');
  const [stage, setStage] = useState('Intermediate');
  const [priority, setPriority] = useState('normal');
  const [recurrence, setRecurrence] = useState('daily');
  const [attribute, setAttribute] = useState('INT');
  const [rewardXp, setRewardXp] = useState(160);
  const [rewardScore, setRewardScore] = useState(350);
  const [rewardTickets, setRewardTickets] = useState(40);
  const [deadline, setDeadline] = useState('Daily Stage');
  const [subtasks, setSubtasks] = useState([]);
  const [newSubtaskText, setNewSubtaskText] = useState('');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setDescription(initialData.description || '');
      setCategory(initialData.category || 'Academics');
      setStage(initialData.stage || 'Intermediate');
      setPriority(initialData.priority || 'normal');
      setRecurrence(initialData.recurrence || 'daily');
      setAttribute(initialData.attribute || 'INT');
      setRewardXp(initialData.rewardXp || 160);
      setRewardScore(initialData.rewardScore || 350);
      setRewardTickets(initialData.rewardTickets || 40);
      setDeadline(initialData.deadline || 'Daily Stage');
      setSubtasks(initialData.subtasks || []);
    } else {
      setTitle('');
      setDescription('');
      setCategory('Academics');
      setStage('Intermediate');
      setPriority('normal');
      setRecurrence('daily');
      setAttribute('INT');
      setRewardXp(160);
      setRewardScore(350);
      setRewardTickets(40);
      setDeadline('Daily Stage');
      setSubtasks([]);
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

  const handleAddSubtask = () => {
    if (!newSubtaskText.trim()) return;
    setSubtasks((prev) => [
      ...prev,
      { id: `st-${Date.now()}`, text: newSubtaskText.trim(), completed: false },
    ]);
    setNewSubtaskText('');
  };

  const handleRemoveSubtask = (id) => {
    setSubtasks((prev) => prev.filter((st) => st.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const missionPayload = {
      title,
      description,
      category,
      stage,
      priority,
      recurrence,
      attribute,
      attributeGain: stage === 'Boss' ? 4 : stage === 'Expert' ? 3 : 2,
      rewardXp: Number(rewardXp),
      rewardScore: Number(rewardScore),
      rewardTickets: Number(rewardTickets),
      deadline,
      subtasks,
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
          maxWidth: '580px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
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

          {/* Description */}
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

          {/* Subtasks Checklist Builder */}
          <div style={{ marginBottom: '1rem' }}>
            <label className="font-arcade" style={{ display: 'block', fontSize: '0.62rem', color: '#38bdf8', marginBottom: '0.4rem' }}>
              CHECKLIST SUBTASKS ({subtasks.length})
            </label>

            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <input
                type="text"
                placeholder="Add intermediate subtask..."
                value={newSubtaskText}
                onChange={(e) => setNewSubtaskText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSubtask();
                  }
                }}
                style={{
                  flex: 1,
                  padding: '0.55rem 0.75rem',
                  borderRadius: '6px',
                  background: '#151128',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#ffffff',
                  fontSize: '0.82rem',
                  outline: 'none',
                }}
              />
              <button
                type="button"
                onClick={handleAddSubtask}
                className="arcade-btn"
                style={{ fontSize: '0.62rem', padding: '0.5rem 0.8rem' }}
              >
                <Plus size={12} /> ADD
              </button>
            </div>

            {subtasks.map((st) => (
              <div
                key={st.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'rgba(255, 255, 255, 0.03)',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  marginBottom: '4px',
                  fontSize: '0.8rem',
                  color: '#cbd5e1'
                }}
              >
                <span>• {st.text}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSubtask(st.id)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#64748b',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#ef4444')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#64748b')}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>

          {/* Stage & Attribute Selection */}
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

          {/* Recurrence & Priority */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label className="font-arcade" style={{ display: 'block', fontSize: '0.62rem', color: '#67e8f9', marginBottom: '0.4rem' }}>
                RECURRENCE
              </label>
              <select
                value={recurrence}
                onChange={(e) => setRecurrence(e.target.value)}
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
                <option value="daily">Daily Reset</option>
                <option value="weekly">Weekly Stage</option>
                <option value="one-time">One-Time Contract</option>
              </select>
            </div>

            <div>
              <label className="font-arcade" style={{ display: 'block', fontSize: '0.62rem', color: '#f43f5e', marginBottom: '0.4rem' }}>
                PRIORITY TIER
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
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
                <option value="high">High Priority (Pinned)</option>
                <option value="normal">Normal Priority</option>
                <option value="low">Low Priority</option>
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
            <span className="font-arcade" style={{ fontSize: '0.62rem', color: '#67e8f9' }}>
              PAYOUT YIELD:
            </span>
            <div style={{ display: 'flex', gap: '0.65rem' }}>
              <span className="font-arcade" style={{ fontSize: '0.62rem', color: '#06b6d4' }}>+{rewardXp} XP</span>
              <span className="font-arcade" style={{ fontSize: '0.62rem', color: '#facc15' }}>+{rewardScore} PTS</span>
              <span className="font-arcade" style={{ fontSize: '0.62rem', color: '#f43f5e' }}>+{rewardTickets} TIX</span>
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
