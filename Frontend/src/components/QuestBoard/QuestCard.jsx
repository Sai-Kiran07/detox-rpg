import React from 'react';
import { Check, Edit3, Trash2, Clock } from 'lucide-react';
import { useGame } from '../../context/GameContext.jsx';
import { ATTRIBUTE_CONFIG } from '../../constants/gameConfig.js';

export const QuestCard = ({ mission, onEdit }) => {
  const { completeMission, uncompleteMission, deleteMission, profile, getComboMultiplier } = useGame();

  const combo = getComboMultiplier(profile.streak);
  const calculatedScore = Math.round(mission.rewardScore * combo.mult);

  const getStageClass = (stage) => {
    switch (stage?.toLowerCase()) {
      case 'intermediate': return 'stage-intermediate';
      case 'expert': return 'stage-expert';
      case 'boss': return 'stage-boss';
      default: return 'stage-novice';
    }
  };

  const getAttrClass = (attr) => ATTRIBUTE_CONFIG[attr]?.className || 'attr-int';

  const handleToggle = (e) => {
    if (mission.completed) {
      uncompleteMission(mission);
    } else {
      completeMission(mission, e);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleToggle(e);
    }
  };

  return (
    <div 
      className={`arcade-card ${getStageClass(mission.stage)}`}
      style={{
        padding: '1.15rem 1.25rem',
        marginBottom: '0.85rem',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '1rem',
        opacity: mission.completed ? 0.6 : 1,
        transition: 'all 0.2s ease',
        background: mission.completed 
          ? 'rgba(12, 10, 22, 0.7)' 
          : undefined
      }}
    >
      {/* Tactile Arcade Push Button Checkbox (Keyboard Accessible) */}
      <button
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        className={`arcade-push-checkbox ${mission.completed ? 'completed' : ''}`}
        title={mission.completed ? 'Stage Cleared - Click to reset' : 'Push button to clear stage'}
        aria-label={`Mark mission ${mission.title} as ${mission.completed ? 'incomplete' : 'complete'}`}
      >
        {mission.completed && <Check size={20} strokeWidth={3} />}
      </button>

      {/* Mission Body */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.35rem' }}>
          {/* Stage badge */}
          <span 
            className="font-arcade"
            style={{
              fontSize: '0.62rem',
              color: mission.stage === 'Boss' ? '#f43f5e' : '#facc15',
              padding: '2px 6px',
              borderRadius: '4px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            {mission.stage ? `${mission.stage.toUpperCase()} STAGE` : 'STAGE 1'}
          </span>

          {/* Attribute Tag */}
          {mission.attribute && (
            <span className={`attr-pill ${getAttrClass(mission.attribute)}`}>
              +{mission.attributeGain || 1} {mission.attribute}
            </span>
          )}

          {/* Category */}
          {mission.category && (
            <span style={{
              fontSize: '0.72rem',
              color: '#94a3b8',
              background: 'rgba(255, 255, 255, 0.04)',
              padding: '2px 8px',
              borderRadius: '4px',
            }}>
              {mission.category}
            </span>
          )}

          {/* Deadline */}
          {mission.deadline && (
            <span style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.72rem',
              color: '#cbd5e1',
              marginLeft: 'auto'
            }}>
              <Clock size={12} color="#67e8f9" />
              {mission.deadline}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 
          style={{
            fontSize: '1.05rem',
            fontWeight: 700,
            color: mission.completed ? '#94a3b8' : '#ffffff',
            textDecoration: mission.completed ? 'line-through' : 'none',
            marginBottom: '0.35rem',
            lineHeight: 1.35
          }}
        >
          {mission.title}
        </h3>

        {/* Description */}
        {mission.description && (
          <p style={{
            fontSize: '0.86rem',
            color: mission.completed ? '#64748b' : '#cbd5e1',
            lineHeight: 1.45,
            marginBottom: '0.75rem'
          }}>
            {mission.description}
          </p>
        )}

        {/* Score & Rewards Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <span className="font-arcade" style={{
              fontSize: '0.62rem',
              color: '#06b6d4',
              background: 'rgba(6, 182, 212, 0.12)',
              padding: '3px 8px',
              borderRadius: '4px',
              border: '1px solid rgba(6, 182, 212, 0.3)'
            }}>
              +{mission.rewardXp} XP
            </span>

            <span className="font-arcade" style={{
              fontSize: '0.62rem',
              color: '#facc15',
              background: 'rgba(250, 204, 21, 0.12)',
              padding: '3px 8px',
              borderRadius: '4px',
              border: '1px solid rgba(250, 204, 21, 0.3)'
            }}>
              +{calculatedScore} PTS {combo.mult > 1.0 && `(${combo.mult}x)`}
            </span>

            <span className="font-arcade" style={{
              fontSize: '0.62rem',
              color: '#fda4af',
              background: 'rgba(244, 63, 94, 0.12)',
              padding: '3px 8px',
              borderRadius: '4px',
              border: '1px solid rgba(244, 63, 94, 0.3)'
            }}>
              +{mission.rewardCoins || 0} COINS
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <button
              onClick={() => onEdit(mission)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#64748b',
                cursor: 'pointer',
                padding: '4px',
              }}
              title="Edit mission details"
              aria-label={`Edit mission ${mission.title}`}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#38bdf8')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#64748b')}
            >
              <Edit3 size={15} />
            </button>
            <button
              onClick={() => deleteMission(mission.id)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#64748b',
                cursor: 'pointer',
                padding: '4px',
              }}
              title="Abort / Delete mission"
              aria-label={`Delete mission ${mission.title}`}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#ef4444')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#64748b')}
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
