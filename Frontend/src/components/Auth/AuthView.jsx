import React, { useState } from 'react';
import { 
  Gamepad2, 
  Lock, 
  User, 
  Key, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  Zap,
  Terminal,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useGame } from '../../context/GameContext.jsx';
import { soundEffects } from '../../services/soundEffects.js';

export const AuthView = ({ defaultMode = 'login', onAuthSuccess }) => {
  const { login, register, isServerOnline } = useGame();

  const [mode, setMode] = useState(defaultMode); // 'login' | 'register'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const switchMode = (newMode) => {
    soundEffects.playClick();
    setMode(newMode);
    setErrorMessage('');
    setSuccessMessage('');
    // Sync URL without full page reload
    if (typeof window !== 'undefined') {
      window.history.replaceState({}, '', `/${newMode}`);
    }
  };

  const handleFillDemoCredentials = () => {
    soundEffects.playCoin();
    setUsername('satyam');
    setPassword('123456');
    setConfirmPassword('123456');
    setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!username.trim()) {
      soundEffects.playError();
      setErrorMessage('Please enter an operator callsign/username.');
      return;
    }

    if (!password) {
      soundEffects.playError();
      setErrorMessage('Please enter your security access key/password.');
      return;
    }

    if (mode === 'register' && password !== confirmPassword) {
      soundEffects.playError();
      setErrorMessage('Passwords do not match. Please verify your access key.');
      return;
    }

    setLoading(true);
    soundEffects.playClick();

    try {
      if (mode === 'login') {
        await login(username.trim(), password);
        soundEffects.playLevelUp();
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#06b6d4', '#f43f5e', '#facc15'],
          });
        } catch {}
        setSuccessMessage('ACCESS GRANTED! Initializing Arcade Machine...');
        if (onAuthSuccess) onAuthSuccess();
      } else {
        await register(username.trim(), password);
        soundEffects.playCoin();
        setSuccessMessage('CADET REGISTERED! Logging in now...');
        // Auto-login after registration
        setTimeout(async () => {
          try {
            await login(username.trim(), password);
            soundEffects.playLevelUp();
            if (onAuthSuccess) onAuthSuccess();
          } catch {
            setMode('login');
            setSuccessMessage('Registration successful! Please login with your credentials.');
          }
        }, 600);
      }
    } catch (err) {
      soundEffects.playError();
      const rawMsg = err?.message || 'Authentication request failed.';
      if (rawMsg.toLowerCase().includes('failed to fetch') || rawMsg.toLowerCase().includes('network')) {
        setErrorMessage('Cannot reach backend on http://localhost:8080. Verify backend is running.');
      } else {
        setErrorMessage(rawMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1rem',
      position: 'relative',
      background: 'radial-gradient(ellipse at center, #181132 0%, #080612 100%)',
    }}>
      {/* Arcade Ambient Glows */}
      <div style={{
        position: 'absolute',
        top: '15%',
        left: '20%',
        width: '350px',
        height: '350px',
        background: 'radial-gradient(circle, rgba(6, 182, 212, 0.15) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        bottom: '15%',
        right: '20%',
        width: '350px',
        height: '350px',
        background: 'radial-gradient(circle, rgba(244, 63, 94, 0.15) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Main Terminal Card */}
      <div 
        className="arcade-card"
        style={{
          maxWidth: '480px',
          width: '100%',
          padding: '2.5rem 2rem',
          border: '2px solid rgba(6, 182, 212, 0.5)',
          background: 'linear-gradient(180deg, rgba(20, 16, 38, 0.95) 0%, rgba(11, 8, 22, 0.98) 100%)',
          boxShadow: '0 0 50px rgba(6, 182, 212, 0.35), inset 0 0 30px rgba(6, 182, 212, 0.08)',
          position: 'relative',
          zIndex: 10,
        }}
      >
        {/* Marquee Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #f43f5e 0%, #06b6d4 100%)',
            margin: '0 auto 1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(6, 182, 212, 0.6)',
            border: '2px solid #ffffff'
          }}>
            <Gamepad2 size={30} color="#ffffff" />
          </div>

          <span className="font-arcade" style={{
            fontSize: '0.62rem',
            color: '#facc15',
            letterSpacing: '0.18em',
            display: 'block',
            marginBottom: '0.35rem'
          }}>
            // ARCADE LIFE 1984 // SECURITY CLEARANCE //
          </span>

          <h1 className="font-arcade" style={{
            fontSize: '1.4rem',
            color: '#ffffff',
            textShadow: '0 0 15px rgba(6, 182, 212, 0.8)',
            marginBottom: '0.4rem'
          }}>
            {mode === 'login' ? 'INSERT COIN & LOGIN' : 'CREATE OPERATOR ID'}
          </h1>

          <p style={{ fontSize: '0.84rem', color: '#94a3b8', lineHeight: 1.4 }}>
            {mode === 'login' 
              ? 'Authenticate to unlock your Life RPG stages, inventory vault, and character sheet.' 
              : 'Register your save slot on http://localhost:8080 to begin your journey.'}
          </p>
        </div>

        {/* Mode Selector Tabs */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '6px',
          background: 'rgba(0, 0, 0, 0.5)',
          padding: '4px',
          borderRadius: '8px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          marginBottom: '1.75rem',
        }}>
          <button
            type="button"
            onClick={() => switchMode('login')}
            className="font-arcade"
            style={{
              padding: '0.65rem 0.5rem',
              border: 'none',
              borderRadius: '6px',
              fontSize: '0.68rem',
              cursor: 'pointer',
              fontWeight: 700,
              background: mode === 'login' ? '#06b6d4' : 'transparent',
              color: mode === 'login' ? '#04101e' : '#94a3b8',
              boxShadow: mode === 'login' ? '0 0 12px rgba(6, 182, 212, 0.6)' : 'none',
              transition: 'all 0.2s',
            }}
          >
            OPERATOR LOGIN
          </button>

          <button
            type="button"
            onClick={() => switchMode('register')}
            className="font-arcade"
            style={{
              padding: '0.65rem 0.5rem',
              border: 'none',
              borderRadius: '6px',
              fontSize: '0.68rem',
              cursor: 'pointer',
              fontWeight: 700,
              background: mode === 'register' ? '#f43f5e' : 'transparent',
              color: mode === 'register' ? '#ffffff' : '#94a3b8',
              boxShadow: mode === 'register' ? '0 0 12px rgba(244, 63, 94, 0.6)' : 'none',
              transition: 'all 0.2s',
            }}
          >
            NEW CADET REGISTER
          </button>
        </div>

        {/* Quick Demo Credentials Pill */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.5rem 0.85rem',
          background: 'rgba(250, 204, 21, 0.08)',
          border: '1px dashed rgba(250, 204, 21, 0.3)',
          borderRadius: '6px',
          marginBottom: '1.5rem',
          fontSize: '0.72rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#facc15' }}>
            <Terminal size={14} />
            <span>Sample Cadet: <strong>satyam</strong> / <strong>123456</strong></span>
          </div>
          <button
            type="button"
            onClick={handleFillDemoCredentials}
            style={{
              background: 'rgba(250, 204, 21, 0.2)',
              border: '1px solid #facc15',
              color: '#fef08a',
              borderRadius: '4px',
              padding: '3px 8px',
              fontSize: '0.62rem',
              cursor: 'pointer',
              fontWeight: 700
            }}
          >
            AUTO-FILL
          </button>
        </div>

        {/* Alerts: Error & Success */}
        {errorMessage && (
          <div style={{
            padding: '0.75rem 1rem',
            background: 'rgba(244, 63, 94, 0.15)',
            border: '1px solid #f43f5e',
            borderRadius: '6px',
            color: '#fda4af',
            fontSize: '0.82rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '1.25rem'
          }}>
            <AlertCircle size={16} color="#f43f5e" style={{ flexShrink: 0 }} />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div style={{
            padding: '0.75rem 1rem',
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid #10b981',
            borderRadius: '6px',
            color: '#6ee7b7',
            fontSize: '0.82rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '1.25rem'
          }}>
            <ShieldCheck size={16} color="#10b981" style={{ flexShrink: 0 }} />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Authentication Form */}
        <form onSubmit={handleSubmit}>
          {/* Username Field */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label className="font-arcade" style={{
              display: 'block',
              fontSize: '0.62rem',
              color: '#67e8f9',
              marginBottom: '0.45rem',
              letterSpacing: '0.08em'
            }}>
              OPERATOR CALLSIGN / USERNAME
            </label>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(0, 0, 0, 0.4)',
              border: '1px solid rgba(6, 182, 212, 0.4)',
              borderRadius: '6px',
              padding: '0.65rem 0.85rem',
              gap: '10px',
            }}>
              <User size={16} color="#06b6d4" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username (e.g. satyam)"
                autoComplete="username"
                disabled={loading}
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#ffffff',
                  fontSize: '0.88rem',
                  width: '100%',
                }}
              />
            </div>
          </div>

          {/* Password Field */}
          <div style={{ marginBottom: mode === 'register' ? '1.25rem' : '1.75rem' }}>
            <label className="font-arcade" style={{
              display: 'block',
              fontSize: '0.62rem',
              color: '#67e8f9',
              marginBottom: '0.45rem',
              letterSpacing: '0.08em'
            }}>
              SECURITY ACCESS KEY / PASSWORD
            </label>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(0, 0, 0, 0.4)',
              border: '1px solid rgba(6, 182, 212, 0.4)',
              borderRadius: '6px',
              padding: '0.65rem 0.85rem',
              gap: '10px',
            }}>
              <Lock size={16} color="#06b6d4" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter security password"
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                disabled={loading}
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#ffffff',
                  fontSize: '0.88rem',
                  width: '100%',
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#64748b',
                  cursor: 'pointer',
                  padding: '2px',
                  display: 'flex',
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Confirm Password (Register mode only) */}
          {mode === 'register' && (
            <div style={{ marginBottom: '1.75rem' }}>
              <label className="font-arcade" style={{
                display: 'block',
                fontSize: '0.62rem',
                color: '#67e8f9',
                marginBottom: '0.45rem',
                letterSpacing: '0.08em'
              }}>
                CONFIRM SECURITY ACCESS KEY
              </label>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                background: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid rgba(6, 182, 212, 0.4)',
                borderRadius: '6px',
                padding: '0.65rem 0.85rem',
                gap: '10px',
              }}>
                <Key size={16} color="#06b6d4" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter security password"
                  autoComplete="new-password"
                  disabled={loading}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    color: '#ffffff',
                    fontSize: '0.88rem',
                    width: '100%',
                  }}
                />
              </div>
            </div>
          )}

          {/* Submit Action Button */}
          <button
            type="submit"
            disabled={loading}
            className={`arcade-btn ${mode === 'login' ? 'arcade-btn-primary' : 'arcade-btn-yellow'}`}
            style={{
              width: '100%',
              padding: '0.85rem 1.5rem',
              fontSize: '0.78rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: loading ? 'wait' : 'pointer',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? (
              <span>COMMUNICATING WITH PORT 8080...</span>
            ) : mode === 'login' ? (
              <>
                AUTHENTICATE & ENTER ARCADE <ArrowRight size={16} />
              </>
            ) : (
              <>
                <Zap size={16} /> DEPLOY SAVE SLOT & REGISTER
              </>
            )}
          </button>
        </form>

        {/* Footer Note */}
        <div style={{
          marginTop: '1.75rem',
          paddingTop: '1rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          textAlign: 'center',
          fontSize: '0.74rem',
          color: '#64748b'
        }}>
          Protected by JWT Bearer Authentication. Requests dispatched to <code>Backend</code>.
        </div>
      </div>
    </div>
  );
};
