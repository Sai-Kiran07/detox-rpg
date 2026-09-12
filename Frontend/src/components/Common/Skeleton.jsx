import React from 'react';

export const Skeleton = ({ width = '100%', height = '20px', borderRadius = '6px', style = {} }) => {
  return (
    <div
      className="skeleton-shimmer"
      style={{
        width,
        height,
        borderRadius,
        ...style,
      }}
    />
  );
};

export const QuestCardSkeleton = () => {
  return (
    <div
      className="arcane-card"
      style={{
        padding: '1.25rem',
        marginBottom: '1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        border: '1px solid rgba(255, 255, 255, 0.05)',
      }}
    >
      <Skeleton width="28px" height="28px" borderRadius="50%" />
      <div style={{ flex: 1 }}>
        <Skeleton width="45%" height="20px" style={{ marginBottom: '8px' }} />
        <Skeleton width="80%" height="14px" />
      </div>
      <Skeleton width="90px" height="32px" borderRadius="16px" />
    </div>
  );
};
