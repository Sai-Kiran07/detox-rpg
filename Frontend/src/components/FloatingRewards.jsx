import React from 'react';
import { useGame } from '../context/GameContext.jsx';

export const FloatingRewards = () => {
  const { floatingRewards } = useGame();

  if (!floatingRewards || floatingRewards.length === 0) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 99999 }}>
      {floatingRewards.map((reward) => {
        let color = '#facc15';
        let glow = 'rgba(250, 204, 21, 0.7)';

        if (reward.type === 'xp') {
          color = '#06b6d4';
          glow = 'rgba(6, 182, 212, 0.7)';
        } else if (reward.type === 'ticket-deduct' || reward.type === 'error') {
          color = '#f43f5e';
          glow = 'rgba(244, 63, 94, 0.7)';
        }

        return (
          <div
            key={reward.id}
            className="floating-arcade-reward"
            style={{
              left: `${reward.x}px`,
              top: `${reward.y}px`,
              color,
              filter: `drop-shadow(0 0 10px ${glow})`,
            }}
          >
            {reward.text}
          </div>
        );
      })}
    </div>
  );
};
