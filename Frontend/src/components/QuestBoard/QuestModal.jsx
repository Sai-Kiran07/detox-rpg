import React, { useEffect, useState } from 'react';
import { X, Gamepad2, Plus } from 'lucide-react';
import { useGame } from '../../context/GameContext.jsx';

export const QuestModal = ({ isOpen, onClose, initialData = null }) => {
  const { addMission, updateMission } = useGame();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Study');
  const [stage, setStage] = useState('Intermediate');
  const [attribute, setAttribute] = useState('INT');
  const [rewardXp, setRewardXp] = useState(160);
  const [rewardScore, setRewardScore] = useState(350);
  const [rewardCoins, setRewardCoins] = useState(40);
  const [deadline, setDeadline] = useState('Today');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setDescription(initialData.description || '');
      setCategory(initialData.category || 'Study');
      setStage(initialData.stage || 'Intermediate');
      setAttribute(initialData.attribute || 'INT');
      setRewardXp(initialData.rewardXp || 160);
      setRewardScore(initialData.rewardScore || 350);
      setRewardCoins(initialData.rewardCoins || 40);
      setDeadline(initialData.deadline || 'Today');
    } else {
      setTitle('');
      setDescription('');
      setCategory('Study');
      setStage('Intermediate');
      setAttribute('INT');
      setRewardXp(160);
      setRewardScore(350);
      setRewardCoins(40);
      setDeadline('Today');
    }
    setError('');
  }, [initialData, isOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const onEscape = (event) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onEscape);
    return () => window.removeEventListener('keydown', onEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleStageChange = (newStage) => {
    setStage(newStage);
    switch (newStage) {
      case 'Novice':
        setRewardXp(80);
        setRewardScore(150);
        setRewardCoins(20);
        break;
      case 'Intermediate':
        setRewardXp(160);
        setRewardScore(350);
        setRewardCoins(40);
        break;
      case 'Expert':
        setRewardXp(240);
        setRewardScore(600);
        setRewardCoins(70);
        break;
      case 'Boss':
        setRewardXp(400);
        setRewardScore(1200);
        setRewardCoins(120);
        break;
      default:
        break;
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError('');
    if (!title.trim()) {
      setError('Mission title is required.');
      return;
    }

    const payload = {
      title: title.trim(),
      description,
      category,
      stage,
      attribute,
      attributeGain: stage === 'Boss' ? 4 : stage === 'Expert' ? 3 : 2,
      rewardXp: Number(rewardXp),
      rewardScore: Number(rewardScore),
      rewardCoins: Number(rewardCoins),
      deadline,
    };

    if (initialData) {
      updateMission(initialData.id, payload);
    } else {
      addMission(payload);
    }
    onClose();
  };

  return (
    <div className="arcade-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="mission-modal-title">
      <div className="arcade-card" style={containerStyle}>
        <div style={headerStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <Gamepad2 size={22} color="#06b6d4" />
            <h2 id="mission-modal-title" className="font-arcade" style={{ fontSize: '0.9rem', color: '#ffffff' }}>
              {initialData ? 'EDIT QUEST' : 'CREATE QUEST'}
            </h2>
          </div>
          <button onClick={onClose} aria-label="Close quest modal" style={closeBtnStyle}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <label htmlFor="quest-title" className="font-arcade" style={labelStyle}>QUEST TITLE *</label>
          <input id="quest-title" type="text" value={title} onChange={(event) => setTitle(event.target.value)} style={inputStyle} />

          <label htmlFor="quest-description" className="font-arcade" style={labelStyle}>DESCRIPTION</label>
          <textarea id="quest-description" rows={2} value={description} onChange={(event) => setDescription(event.target.value)} style={{ ...inputStyle, resize: 'none' }} />

          <div className="form-grid-2">
            <div>
              <label htmlFor="quest-attribute" className="font-arcade" style={labelStyle}>ATTRIBUTE</label>
              <select id="quest-attribute" value={attribute} onChange={(event) => setAttribute(event.target.value)} style={inputStyle}>
                <option value="INT">INT - Intelligence</option>
                <option value="STR">STR - Strength</option>
                <option value="WIS">WIS - Wisdom</option>
                <option value="DIS">DIS - Discipline</option>
                <option value="CRE">CRE - Creativity</option>
              </select>
            </div>
            <div>
              <label htmlFor="quest-stage" className="font-arcade" style={labelStyle}>DIFFICULTY</label>
              <select id="quest-stage" value={stage} onChange={(event) => handleStageChange(event.target.value)} style={inputStyle}>
                <option value="Novice">Novice</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Expert">Expert</option>
                <option value="Boss">Boss</option>
              </select>
            </div>
          </div>

          <div className="form-grid-3">
            <div>
              <label htmlFor="quest-xp" className="font-arcade" style={labelStyle}>XP</label>
              <input id="quest-xp" type="number" min="10" value={rewardXp} onChange={(event) => setRewardXp(event.target.value)} style={inputStyle} />
            </div>
            <div>
              <label htmlFor="quest-score" className="font-arcade" style={labelStyle}>SCORE</label>
              <input id="quest-score" type="number" min="10" value={rewardScore} onChange={(event) => setRewardScore(event.target.value)} style={inputStyle} />
            </div>
            <div>
              <label htmlFor="quest-coins" className="font-arcade" style={labelStyle}>COINS</label>
              <input id="quest-coins" type="number" min="5" value={rewardCoins} onChange={(event) => setRewardCoins(event.target.value)} style={inputStyle} />
            </div>
          </div>

          <div className="form-grid-2">
            <div>
              <label htmlFor="quest-category" className="font-arcade" style={labelStyle}>CATEGORY</label>
              <input id="quest-category" type="text" value={category} onChange={(event) => setCategory(event.target.value)} style={inputStyle} />
            </div>
            <div>
              <label htmlFor="quest-deadline" className="font-arcade" style={labelStyle}>DEADLINE</label>
              <input id="quest-deadline" type="text" value={deadline} onChange={(event) => setDeadline(event.target.value)} style={inputStyle} />
            </div>
          </div>

          {error && (
            <p role="alert" style={{ color: '#fda4af', marginBottom: '0.75rem', fontSize: '0.84rem' }}>{error}</p>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button type="button" onClick={onClose} className="arcade-btn" style={{ borderColor: 'rgba(255,255,255,0.2)', color: '#cbd5e1' }}>
              CANCEL
            </button>
            <button type="submit" className="arcade-btn arcade-btn-primary">
              <Plus size={14} /> {initialData ? 'SAVE QUEST' : 'DEPLOY QUEST'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const containerStyle = {
  maxWidth: '600px',
  width: '100%',
  border: '2px solid var(--neon-cyan)',
  background: '#0e0b1d',
  padding: '1.5rem',
  boxShadow: '0 0 40px rgba(6, 182, 212, 0.4)',
};

const headerStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '1rem',
};

const closeBtnStyle = {
  background: 'transparent',
  border: 'none',
  color: '#94a3b8',
  cursor: 'pointer',
};

const labelStyle = {
  display: 'block',
  fontSize: '0.62rem',
  color: '#67e8f9',
  marginBottom: '0.35rem',
  marginTop: '0.75rem',
};

const inputStyle = {
  width: '100%',
  padding: '0.65rem',
  borderRadius: '6px',
  background: '#151128',
  border: '1px solid rgba(255, 255, 255, 0.15)',
  color: '#ffffff',
  fontSize: '0.88rem',
  outline: 'none',
};
