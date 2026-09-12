import React, { useState } from 'react';
import { ShieldCheck, LogIn, UserPlus } from 'lucide-react';
import { useGame } from '../../context/GameContext.jsx';

export const AuthView = () => {
  const { login, signup, authError } = useGame();
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    setLocalError('');

    if (!email.trim()) {
      setLocalError('Email is required.');
      return;
    }

    if (password.length < 8) {
      setLocalError('Password must be at least 8 characters.');
      return;
    }

    if (mode === 'signup') {
      if (!name.trim()) {
        setLocalError('Display name is required.');
        return;
      }
      signup({ name: name.trim(), email: email.trim(), password });
      return;
    }

    login({ email: email.trim(), password });
  };

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        padding: '1rem',
      }}
    >
      <section
        className="arcade-card"
        style={{
          width: '100%',
          maxWidth: '480px',
          padding: '1.75rem',
          border: '2px solid rgba(6, 182, 212, 0.45)',
        }}
        aria-labelledby="auth-title"
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.75rem' }}>
          <ShieldCheck color="#06b6d4" />
          <h1 id="auth-title" className="font-arcade" style={{ fontSize: '0.92rem' }}>
            LIFE RPG ACCESS TERMINAL
          </h1>
        </div>

        <p style={{ color: '#94a3b8', marginBottom: '1rem', fontSize: '0.9rem' }}>
          Sign in to access your own quests, progression, streaks, rewards, and history.
        </p>

        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
          <button
            type="button"
            className={`arcade-btn ${mode === 'login' ? 'arcade-btn-primary' : ''}`}
            onClick={() => setMode('login')}
            aria-pressed={mode === 'login'}
          >
            <LogIn size={14} /> LOGIN
          </button>
          <button
            type="button"
            className={`arcade-btn ${mode === 'signup' ? 'arcade-btn-primary' : ''}`}
            onClick={() => setMode('signup')}
            aria-pressed={mode === 'signup'}
          >
            <UserPlus size={14} /> SIGNUP
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {mode === 'signup' && (
            <div style={{ marginBottom: '0.75rem' }}>
              <label htmlFor="name-input" className="font-arcade" style={{ fontSize: '0.62rem', color: '#67e8f9' }}>
                DISPLAY NAME
              </label>
              <input
                id="name-input"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                autoComplete="name"
                style={fieldStyle}
              />
            </div>
          )}

          <div style={{ marginBottom: '0.75rem' }}>
            <label htmlFor="email-input" className="font-arcade" style={{ fontSize: '0.62rem', color: '#67e8f9' }}>
              EMAIL
            </label>
            <input
              id="email-input"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              style={fieldStyle}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="password-input" className="font-arcade" style={{ fontSize: '0.62rem', color: '#67e8f9' }}>
              PASSWORD
            </label>
            <input
              id="password-input"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
              style={fieldStyle}
            />
          </div>

          {(localError || authError) && (
            <p role="alert" style={{ color: '#fda4af', marginBottom: '0.8rem', fontSize: '0.85rem' }}>
              {localError || authError}
            </p>
          )}

          <button type="submit" className="arcade-btn arcade-btn-primary" style={{ width: '100%' }}>
            {mode === 'signup' ? 'CREATE ACCOUNT' : 'LOGIN'}
          </button>
        </form>
      </section>
    </main>
  );
};

const fieldStyle = {
  width: '100%',
  padding: '0.65rem 0.75rem',
  borderRadius: '6px',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  background: 'rgba(21, 17, 40, 0.85)',
  color: '#fff',
  marginTop: '0.3rem',
};
