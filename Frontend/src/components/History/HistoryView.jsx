import React from 'react';
import { ScrollText, Coins, CheckCircle2, ShoppingBag } from 'lucide-react';
import { useGame } from '../../context/GameContext.jsx';

export const HistoryView = () => {
  const { history } = useGame();

  return (
    <div style={{ maxWidth: '980px', margin: '0 auto', paddingBottom: '3rem' }}>
      <div
        style={{
          marginBottom: '1.5rem',
          borderBottom: '2px solid rgba(6, 182, 212, 0.25)',
          paddingBottom: '1rem',
        }}
      >
        <span className="font-arcade" style={{ fontSize: '0.68rem', color: '#06b6d4' }}>
          // ADVENTURE HISTORY //
        </span>
        <h2 className="font-arcade" style={{ fontSize: '1.4rem', marginTop: '0.45rem' }}>
          PROGRESS TIMELINE
        </h2>
      </div>

      {history.length === 0 ? (
        <div className="arcade-card" style={{ padding: '2rem', textAlign: 'center' }}>
          <ScrollText size={40} color="#64748b" />
          <p style={{ marginTop: '0.75rem', color: '#94a3b8' }}>No timeline events yet.</p>
        </div>
      ) : (
        <ul style={{ listStyle: 'none', display: 'grid', gap: '0.9rem' }}>
          {history.map((event) => (
            <li key={event.id} className="arcade-card" style={{ padding: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  {event.type === 'quest-completed' ? (
                    <CheckCircle2 size={18} color="#10b981" />
                  ) : (
                    <ShoppingBag size={18} color="#f43f5e" />
                  )}
                  <strong style={{ fontSize: '0.95rem' }}>{event.title}</strong>
                </div>
                <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                  {new Date(event.createdAt).toLocaleString()}
                </span>
              </div>
              <p style={{ color: '#cbd5e1', marginTop: '0.55rem', fontSize: '0.86rem' }}>{event.description}</p>
              {typeof event.coinsDelta === 'number' && (
                <p style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.5rem', color: '#facc15' }}>
                  <Coins size={14} />
                  {event.coinsDelta > 0 ? '+' : ''}
                  {event.coinsDelta} COINS
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
