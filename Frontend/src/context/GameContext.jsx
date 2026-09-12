import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import confetti from 'canvas-confetti';
import { soundEffects } from '../services/soundEffects.js';
import { ATTRIBUTE_KEYS } from '../constants/gameConfig.js';

const GameContext = createContext();

export const calculateXpRequired = (level) => Math.floor(100 * Math.pow(level, 1.4));

const STORAGE_KEYS = {
  USERS: 'arcade_users_v1',
  SESSION: 'arcade_session_v1',
  CRT: 'arcade_crt_enabled',
};

const todayKey = () => new Date().toISOString().slice(0, 10);

const hashPassword = (password) => {
  let hash = 0;
  for (let i = 0; i < password.length; i += 1) {
    hash = (hash << 5) - hash + password.charCodeAt(i);
    hash |= 0;
  }
  return `h${Math.abs(hash)}`;
};

const createSession = (user) => {
  const token = globalThis.crypto?.randomUUID?.() || `token-${Date.now()}`;
  return {
    token,
    userId: user.id,
    email: user.email,
    name: user.name,
    expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 7,
  };
};

const buildInitialProfile = (name) => ({
  name: name || 'Player One',
  callsign: 'QUEST SEEKER',
  level: 1,
  xp: 0,
  score: 0,
  coins: 120,
  streak: 0,
  lastActiveDate: null,
  avatar: '🕹️',
  attributes: {
    STR: 1,
    INT: 1,
    WIS: 1,
    DIS: 1,
    CRE: 1,
  },
});

const buildInitialMissions = () => [
  {
    id: 'm-1',
    title: 'Solve 2 medium coding problems',
    description: 'Practice DSA and write clean explanations.',
    category: 'Study',
    stage: 'Intermediate',
    attribute: 'INT',
    attributeGain: 2,
    rewardXp: 140,
    rewardScore: 320,
    rewardCoins: 28,
    completed: false,
    deadline: 'Today',
    createdAt: new Date().toISOString(),
    completedAt: null,
  },
  {
    id: 'm-2',
    title: '45-minute focused deep work',
    description: 'Phone away, uninterrupted block.',
    category: 'Focus',
    stage: 'Intermediate',
    attribute: 'DIS',
    attributeGain: 2,
    rewardXp: 120,
    rewardScore: 280,
    rewardCoins: 24,
    completed: false,
    deadline: 'Today',
    createdAt: new Date().toISOString(),
    completedAt: null,
  },
  {
    id: 'm-3',
    title: '30-minute workout',
    description: 'Strength circuit with warm-up and cool-down.',
    category: 'Health',
    stage: 'Novice',
    attribute: 'STR',
    attributeGain: 1,
    rewardXp: 80,
    rewardScore: 180,
    rewardCoins: 18,
    completed: false,
    deadline: 'Today',
    createdAt: new Date().toISOString(),
    completedAt: null,
  },
];

const buildInitialPrizes = () => [
  {
    id: 'p-1',
    title: 'Night Theme Unlock',
    description: 'Unlock an alternate neon-night theme.',
    cost: 90,
    icon: 'Sparkles',
    tier: 'Rare',
    type: 'Theme',
  },
  {
    id: 'p-2',
    title: 'Focus Badge',
    description: 'Profile badge for consistency streaks.',
    cost: 70,
    icon: 'BookOpen',
    tier: 'Uncommon',
    type: 'Badge',
  },
  {
    id: 'p-3',
    title: 'Gaming Break',
    description: '1 hour guilt-free gaming reward.',
    cost: 110,
    icon: 'Gamepad2',
    tier: 'Rare',
    type: 'Item',
  },
];

const getUserStorageKey = (userId, section) => `arcade_${section}_${userId}`;
const mapLegacyAttribute = (attr) => {
  if (attr === 'AGI') return 'WIS';
  if (attr === 'END') return 'DIS';
  if (attr === 'CHA') return 'CRE';
  return attr;
};

const getStreakBonus = (streak) => {
  if (streak >= 14) return 30;
  if (streak >= 7) return 18;
  if (streak >= 3) return 8;
  return 0;
};

const getNextStreak = (previousDate, previousStreak, currentDay) => {
  if (!previousDate) return 1;
  if (previousDate === currentDay) return previousStreak;

  const prev = new Date(`${previousDate}T00:00:00Z`);
  const curr = new Date(`${currentDay}T00:00:00Z`);
  const diffDays = Math.floor((curr.getTime() - prev.getTime()) / 86400000);

  if (diffDays === 1) return previousStreak + 1;
  return 1;
};

const makeHistoryEntry = ({ type, title, description, coinsDelta = 0 }) => ({
  id: `${type}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
  type,
  title,
  description,
  coinsDelta,
  createdAt: new Date().toISOString(),
});

const normalizeAttributes = (attributes = {}) => ({
  STR: attributes.STR ?? 1,
  INT: attributes.INT ?? 1,
  WIS: attributes.WIS ?? attributes.AGI ?? 1,
  DIS: attributes.DIS ?? attributes.END ?? 1,
  CRE: attributes.CRE ?? attributes.CHA ?? 1,
});

const safeParse = (value, fallback) => {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

export const GameProvider = ({ children }) => {
  const [users, setUsers] = useState(() => safeParse(localStorage.getItem(STORAGE_KEYS.USERS), []));
  const [session, setSession] = useState(() => safeParse(localStorage.getItem(STORAGE_KEYS.SESSION), null));
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState('landing');
  const [crtEnabled, setCrtEnabled] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.CRT);
    return stored ? JSON.parse(stored) : true;
  });
  const [isMuted, setIsMuted] = useState(false);
  const [floatingRewards, setFloatingRewards] = useState([]);
  const [levelUpData, setLevelUpData] = useState(null);

  const [profile, setProfile] = useState(null);
  const [missions, setMissions] = useState([]);
  const [prizes, setPrizes] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [history, setHistory] = useState([]);

  const isAuthenticated = Boolean(session?.userId && session.expiresAt > Date.now());

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (session) {
      localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
      return;
    }
    localStorage.removeItem(STORAGE_KEYS.SESSION);
  }, [session]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CRT, JSON.stringify(crtEnabled));
  }, [crtEnabled]);

  useEffect(() => {
    if (!isAuthenticated) {
      setProfile(null);
      setMissions([]);
      setPrizes([]);
      setInventory([]);
      setHistory([]);
      return;
    }

    const userId = session.userId;
    const loadedProfile = safeParse(localStorage.getItem(getUserStorageKey(userId, 'profile')), null) || buildInitialProfile(session.name);
    const loadedMissionsRaw = safeParse(localStorage.getItem(getUserStorageKey(userId, 'missions')), buildInitialMissions());
    const loadedMissions = loadedMissionsRaw.map((mission) => ({
      ...mission,
      attribute: mapLegacyAttribute(mission.attribute),
      rewardCoins: mission.rewardCoins ?? mission.rewardTickets ?? 0,
    }));
    const loadedPrizes = safeParse(localStorage.getItem(getUserStorageKey(userId, 'prizes')), buildInitialPrizes());
    const loadedInventory = safeParse(localStorage.getItem(getUserStorageKey(userId, 'inventory')), []);
    const loadedHistory = safeParse(localStorage.getItem(getUserStorageKey(userId, 'history')), []);

    setProfile({
      ...buildInitialProfile(session.name),
      ...loadedProfile,
      coins: loadedProfile.coins ?? loadedProfile.tickets ?? 0,
      attributes: normalizeAttributes(loadedProfile.attributes),
    });
    setMissions(loadedMissions);
    setPrizes(loadedPrizes);
    setInventory(loadedInventory);
    setHistory(loadedHistory);
  }, [isAuthenticated, session]);

  useEffect(() => {
    if (!isAuthenticated || !profile) return;
    localStorage.setItem(getUserStorageKey(session.userId, 'profile'), JSON.stringify(profile));
  }, [isAuthenticated, session, profile]);

  useEffect(() => {
    if (!isAuthenticated) return;
    localStorage.setItem(getUserStorageKey(session.userId, 'missions'), JSON.stringify(missions));
  }, [isAuthenticated, session, missions]);

  useEffect(() => {
    if (!isAuthenticated) return;
    localStorage.setItem(getUserStorageKey(session.userId, 'prizes'), JSON.stringify(prizes));
  }, [isAuthenticated, session, prizes]);

  useEffect(() => {
    if (!isAuthenticated) return;
    localStorage.setItem(getUserStorageKey(session.userId, 'inventory'), JSON.stringify(inventory));
  }, [isAuthenticated, session, inventory]);

  useEffect(() => {
    if (!isAuthenticated) return;
    localStorage.setItem(getUserStorageKey(session.userId, 'history'), JSON.stringify(history));
  }, [isAuthenticated, session, history]);

  const addHistory = (entry) => {
    setHistory((prev) => [entry, ...prev].slice(0, 200));
  };

  const triggerFloatingReward = (text, type, x, y) => {
    const id = Date.now() + Math.random();
    setFloatingRewards((prev) => [...prev, { id, text, type, x, y }]);
    setTimeout(() => {
      setFloatingRewards((prev) => prev.filter((item) => item.id !== id));
    }, 1200);
  };

  const getComboMultiplier = (streak) => {
    if (streak >= 14) return { mult: 1.5, label: 'SUPER COMBO x1.50', color: '#f43f5e' };
    if (streak >= 7) return { mult: 1.3, label: 'MEGA COMBO x1.30', color: '#facc15' };
    if (streak >= 3) return { mult: 1.15, label: 'COMBO x1.15', color: '#06b6d4' };
    return { mult: 1, label: '1.0x NORMAL', color: '#94a3b8' };
  };

  const resolveLevelProgression = (currentXp, currentLevel, xpGain) => {
    let xp = currentXp + xpGain;
    let level = currentLevel;
    let leveledUp = false;

    while (xp >= calculateXpRequired(level)) {
      xp -= calculateXpRequired(level);
      level += 1;
      leveledUp = true;
    }

    if (!leveledUp) {
      return { level, xp, leveledUp: false, bonusCoins: 0, callsign: profile.callsign };
    }

    soundEffects.playLevelUp();
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#f43f5e', '#06b6d4', '#facc15', '#10b981'],
    });

    const callsignPool = ['ROOKIE', 'PATHFINDER', 'CHALLENGER', 'VANGUARD', 'MASTER', 'MYTHIC'];
    const callsign = callsignPool[Math.min(level - 1, callsignPool.length - 1)];
    const bonusCoins = level * 20;

    setLevelUpData({
      level,
      callsign,
      rewardCoins: bonusCoins,
    });

    return { level, xp, leveledUp: true, bonusCoins, callsign };
  };

  const completeMission = (mission, event) => {
    if (!profile || mission.completed) return;

    let clickX = window.innerWidth / 2;
    let clickY = window.innerHeight / 2;
    if (event?.clientX && event?.clientY) {
      clickX = event.clientX;
      clickY = event.clientY;
    }

    soundEffects.playCheckmark();
    const combo = getComboMultiplier(profile.streak);
    const scoreGain = Math.round((mission.rewardScore || 0) * combo.mult);
    const day = todayKey();
    const streak = getNextStreak(profile.lastActiveDate, profile.streak, day);
    const streakBonus = profile.lastActiveDate === day ? 0 : getStreakBonus(streak);
    const levelResult = resolveLevelProgression(profile.xp, profile.level, mission.rewardXp || 0);
    const attributeCode = ATTRIBUTE_KEYS.includes(mission.attribute) ? mission.attribute : 'INT';
    const attributeGain = Number(mission.attributeGain) || 1;
    const missionCoins = Number(mission.rewardCoins) || 0;
    const totalCoinGain = missionCoins + streakBonus + levelResult.bonusCoins;

    triggerFloatingReward(`+${mission.rewardXp || 0} XP`, 'xp', clickX - 20, clickY - 20);
    setTimeout(() => {
      soundEffects.playCoin();
      triggerFloatingReward(`+${totalCoinGain} COINS`, 'score', clickX + 40, clickY - 20);
    }, 180);

    setProfile((prev) => ({
      ...prev,
      xp: levelResult.xp,
      level: levelResult.level,
      callsign: levelResult.callsign,
      score: prev.score + scoreGain,
      coins: prev.coins + totalCoinGain,
      streak,
      lastActiveDate: day,
      attributes: {
        ...prev.attributes,
        [attributeCode]: (prev.attributes[attributeCode] || 1) + attributeGain,
      },
    }));

    setMissions((prev) =>
      prev.map((item) =>
        item.id === mission.id
          ? { ...item, completed: true, completedAt: new Date().toISOString() }
          : item
      )
    );

    addHistory(
      makeHistoryEntry({
        type: 'quest-completed',
        title: `Quest Completed: ${mission.title}`,
        description: `+${mission.rewardXp || 0} XP, +${missionCoins} coins${streakBonus ? `, +${streakBonus} streak bonus` : ''}.`,
        coinsDelta: totalCoinGain,
      })
    );
  };

  const uncompleteMission = (mission) => {
    soundEffects.playClick();
    setMissions((prev) => prev.map((item) => (item.id === mission.id ? { ...item, completed: false } : item)));
  };

  const addMission = (missionData) => {
    const title = missionData.title?.trim();
    if (!title) {
      throw new Error('Mission title is required.');
    }
    soundEffects.playCoin();
    const newMission = {
      id: `m-${Date.now()}`,
      completed: false,
      createdAt: new Date().toISOString(),
      completedAt: null,
      ...missionData,
      title,
    };
    setMissions((prev) => [newMission, ...prev]);
    return newMission;
  };

  const updateMission = (id, updates) => {
    soundEffects.playClick();
    setMissions((prev) => prev.map((item) => (item.id === id ? { ...item, ...updates } : item)));
  };

  const deleteMission = (id) => {
    soundEffects.playClick();
    setMissions((prev) => prev.filter((item) => item.id !== id));
  };

  const buyPrize = (prize, event) => {
    if (!profile) return false;
    if (profile.coins < prize.cost) {
      soundEffects.playError();
      const x = event?.clientX || window.innerWidth / 2;
      const y = event?.clientY || window.innerHeight / 2;
      triggerFloatingReward('NOT ENOUGH COINS', 'error', x, y - 20);
      return false;
    }

    soundEffects.playPurchase();
    const x = event?.clientX || window.innerWidth / 2;
    const y = event?.clientY || window.innerHeight / 2;
    triggerFloatingReward(`-${prize.cost} COINS`, 'ticket-deduct', x, y - 20);

    setProfile((prev) => ({ ...prev, coins: prev.coins - prize.cost }));
    setInventory((prev) => [
      {
        id: `inv-${Date.now()}`,
        title: prize.title,
        description: prize.description,
        icon: prize.icon,
        rarity: prize.tier,
        type: prize.type,
        acquiredAt: new Date().toLocaleDateString(),
      },
      ...prev,
    ]);

    addHistory(
      makeHistoryEntry({
        type: 'purchase',
        title: `Purchased: ${prize.title}`,
        description: `${prize.type || 'Reward'} unlocked.`,
        coinsDelta: -prize.cost,
      })
    );
    return true;
  };

  const addPrize = (prizeData) => {
    soundEffects.playCoin();
    setPrizes((prev) => [{ id: `p-${Date.now()}`, ...prizeData }, ...prev]);
  };

  const deletePrize = (id) => {
    soundEffects.playClick();
    setPrizes((prev) => prev.filter((item) => item.id !== id));
  };

  const toggleCrt = () => {
    soundEffects.playClick();
    setCrtEnabled((prev) => !prev);
  };

  const toggleMute = () => {
    const muted = soundEffects.toggleMute();
    setIsMuted(muted);
  };

  const closeLevelUpModal = () => setLevelUpData(null);

  const resetArcadeData = () => {
    if (!session?.userId) return;
    localStorage.removeItem(getUserStorageKey(session.userId, 'profile'));
    localStorage.removeItem(getUserStorageKey(session.userId, 'missions'));
    localStorage.removeItem(getUserStorageKey(session.userId, 'prizes'));
    localStorage.removeItem(getUserStorageKey(session.userId, 'inventory'));
    localStorage.removeItem(getUserStorageKey(session.userId, 'history'));
    setProfile(buildInitialProfile(session.name));
    setMissions(buildInitialMissions());
    setPrizes(buildInitialPrizes());
    setInventory([]);
    setHistory([]);
  };

  const updatePlayerIdentity = ({ name, callsign, avatar }) => {
    setProfile((prev) => ({
      ...prev,
      name: name?.trim() || prev.name,
      callsign: callsign?.trim() || prev.callsign,
      avatar: avatar || prev.avatar,
    }));
  };

  const signup = ({ name, email, password }) => {
    setAuthError('');
    const normalizedEmail = email.toLowerCase();
    if (users.some((item) => item.email === normalizedEmail)) {
      setAuthError('Account already exists for this email.');
      return;
    }

    const user = {
      id: `u-${Date.now()}`,
      name: name.trim(),
      email: normalizedEmail,
      passwordHash: hashPassword(password),
      createdAt: new Date().toISOString(),
    };

    setUsers((prev) => [...prev, user]);
    const createdSession = createSession(user);
    setSession(createdSession);
    setActiveTab('landing');
  };

  const login = ({ email, password }) => {
    setAuthError('');
    const normalizedEmail = email.toLowerCase();
    const user = users.find((item) => item.email === normalizedEmail);

    if (!user || user.passwordHash !== hashPassword(password)) {
      setAuthError('Invalid email or password.');
      return;
    }

    setSession(createSession(user));
    setActiveTab('landing');
  };

  const logout = () => {
    soundEffects.playClick();
    setSession(null);
    setActiveTab('landing');
  };

  const contextValue = useMemo(
    () => ({
      isAuthenticated,
      authUser: session ? { email: session.email, name: session.name } : null,
      authError,
      login,
      signup,
      logout,
      profile: profile || buildInitialProfile(''),
      missions,
      prizes,
      inventory,
      history,
      activeTab,
      setActiveTab,
      crtEnabled,
      toggleCrt,
      isMuted,
      toggleMute,
      floatingRewards,
      levelUpData,
      closeLevelUpModal,
      completeMission,
      uncompleteMission,
      addMission,
      updateMission,
      deleteMission,
      buyPrize,
      addPrize,
      deletePrize,
      getComboMultiplier,
      resetArcadeData,
      updatePlayerIdentity,
    }),
    [
      isAuthenticated,
      session,
      authError,
      profile,
      missions,
      prizes,
      inventory,
      history,
      activeTab,
      crtEnabled,
      isMuted,
      floatingRewards,
      levelUpData,
    ]
  );

  return <GameContext.Provider value={contextValue}>{children}</GameContext.Provider>;
};
