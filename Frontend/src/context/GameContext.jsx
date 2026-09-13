import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { soundEffects } from '../services/soundEffects.js';
import { api } from '../services/api.js';

const GameContext = createContext();

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

// Non-linear XP formula: XP required for level L = Math.floor(100 * (L ** 1.4))
export const calculateXpRequired = (level) => {
  return Math.floor(100 * Math.pow(Math.max(1, level), 1.4));
};

// Rank milestone tiers
export const getRankTier = (level) => {
  if (level >= 15) return { name: 'CYBER ARCHON', tier: 'MASTER', color: '#f43f5e', badge: '👑' };
  if (level >= 10) return { name: 'CABINET WARLORD', tier: 'DIAMOND', color: '#a855f7', badge: '💎' };
  if (level >= 6) return { name: 'STAGE CLEAR PRO', tier: 'GOLD', color: '#facc15', badge: '🥇' };
  if (level >= 3) return { name: '8-BIT CHALLENGER', tier: 'SILVER', color: '#06b6d4', badge: '🥈' };
  return { name: 'COIN OPERATOR', tier: 'BRONZE', color: '#94a3b8', badge: '🥉' };
};

const STORAGE_KEYS = {
  PROFILE: 'arcade_profile_v3',
  MISSIONS: 'arcade_missions_v3',
  PRIZES: 'arcade_prizes_v3',
  INVENTORY: 'arcade_inventory_v3',
  HISTORY: 'arcade_history_v3',
  CRT: 'arcade_crt_enabled',
};

// Neutral default profile skeleton (ZERO static dummy progress)
const DEFAULT_PROFILE = {
  name: 'PLAYER ONE',
  callsign: 'ROOKIE',
  level: 1,
  xp: 0,
  score: 0,
  tickets: 0,
  unspentSkillPoints: 0,
  hp: 100,
  maxHp: 100,
  energy: 100,
  maxEnergy: 100,
  streak: 0,
  streakShields: 0,
  lastCheckInDate: null,
  avatar: '🕹️',
  attributes: {
    INT: 10,
    STR: 10,
    AGI: 10,
    END: 10,
    CHA: 10,
  },
};

export const GameProvider = ({ children }) => {
  // Pure dynamic data states: initialized empty, loaded strictly from API
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [missions, setMissions] = useState([]);
  const [prizes, setPrizes] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [historyLog, setHistoryLog] = useState([]);

  const [activeTab, setActiveTab] = useState('landing');
  const [crtEnabled, setCrtEnabled] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CRT);
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [isMuted, setIsMuted] = useState(false);
  const [floatingRewards, setFloatingRewards] = useState([]);
  const [levelUpData, setLevelUpData] = useState(null);
  const [isServerOnline, setIsServerOnline] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(() => api.isAuthenticated());
  const [currentUser, setCurrentUser] = useState(() => api.getUsername());

  // Subscribe to live Auth state changes
  useEffect(() => {
    const unsubscribeAuth = api.subscribeAuth((isAuth, username) => {
      setIsAuthenticated(isAuth);
      setCurrentUser(username);
      if (!isAuth) {
        setProfile(DEFAULT_PROFILE);
        setMissions([]);
        setPrizes([]);
        setInventory([]);
        setHistoryLog([]);
      }
    });
    return () => unsubscribeAuth();
  }, []);

  // Proactively purge any legacy mock data from localStorage
  useEffect(() => {
    try {
      const storedMissions = localStorage.getItem(STORAGE_KEYS.MISSIONS);
      if (storedMissions && storedMissions.includes('Cyber-Algorithm')) {
        localStorage.removeItem(STORAGE_KEYS.MISSIONS);
      }
      const storedPrizes = localStorage.getItem(STORAGE_KEYS.PRIZES);
      if (storedPrizes && storedPrizes.includes('Streak Freeze Shield')) {
        localStorage.removeItem(STORAGE_KEYS.PRIZES);
      }
      const storedInv = localStorage.getItem(STORAGE_KEYS.INVENTORY);
      if (storedInv && (storedInv.includes('inv-init') || storedInv.includes('Focus Visor'))) {
        localStorage.removeItem(STORAGE_KEYS.INVENTORY);
      }
      const storedHistory = localStorage.getItem(STORAGE_KEYS.HISTORY);
      if (storedHistory && storedHistory.includes('Speed Clean Quarters')) {
        localStorage.removeItem(STORAGE_KEYS.HISTORY);
      }
    } catch {}
  }, []);

  // Sync to local cache
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MISSIONS, JSON.stringify(missions));
  }, [missions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRIZES, JSON.stringify(prizes));
  }, [prizes]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(historyLog));
  }, [historyLog]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CRT, JSON.stringify(crtEnabled));
  }, [crtEnabled]);

  // Subscribe to live API Server Status (target: http://localhost:8080)
  useEffect(() => {
    const unsubscribe = api.subscribeStatus((online) => {
      setIsServerOnline(online);
    });
    return () => unsubscribe();
  }, []);

  // Fetch real data dynamically from all API endpoints on mount (only when authenticated)
  const loadDataFromApi = useCallback(async () => {
    if (!api.isAuthenticated()) {
      setIsLoadingData(false);
      return;
    }

    setIsLoadingData(true);
    try {
      const [profileRes, missionsRes, prizesRes, inventoryRes, historyRes] = await Promise.allSettled([
        api.getProfile(),
        api.getMissions(),
        api.getPrizes(),
        api.getInventory(),
        api.getHistory(),
      ]);

      if (profileRes.status === 'fulfilled' && profileRes.value) {
        setProfile((prev) => ({
          ...prev,
          ...profileRes.value,
          attributes: { ...prev.attributes, ...(profileRes.value.attributes || {}) },
        }));
      }

      if (missionsRes.status === 'fulfilled' && Array.isArray(missionsRes.value)) {
        setMissions(missionsRes.value);
      }

      if (prizesRes.status === 'fulfilled' && Array.isArray(prizesRes.value)) {
        setPrizes(prizesRes.value);
      }

      if (inventoryRes.status === 'fulfilled' && Array.isArray(inventoryRes.value)) {
        setInventory(inventoryRes.value);
      }

      if (historyRes.status === 'fulfilled' && Array.isArray(historyRes.value)) {
        setHistoryLog(historyRes.value);
      }
    } catch (err) {
      console.warn('Initial API data fetch note:', err);
    } finally {
      setIsLoadingData(false);
    }
  }, []);

  useEffect(() => {
    loadDataFromApi();
  }, [loadDataFromApi]);

  // Auth methods
  const login = async (username, password) => {
    const res = await api.login(username, password);
    setIsAuthenticated(true);
    setCurrentUser(username);
    await loadDataFromApi();
    return res;
  };

  const register = async (username, password) => {
    return await api.register(username, password);
  };

  const logout = () => {
    api.logout();
    setIsAuthenticated(false);
    setCurrentUser(null);
    setProfile(DEFAULT_PROFILE);
    setMissions([]);
    setPrizes([]);
    setInventory([]);
    setHistoryLog([]);
    if (typeof window !== 'undefined') {
      window.history.replaceState({}, '', '/login');
    }
  };

  // Activity log helper with API dispatch
  const addHistoryEntry = async (entry) => {
    const newEntry = {
      id: `h-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString(),
      ...entry,
    };
    setHistoryLog((prev) => [newEntry, ...prev.slice(0, 99)]);
    try {
      await api.createHistoryEntry(newEntry);
    } catch (err) {
      console.warn('Could not sync history entry to backend:', err);
    }
  };

  // Compute Effective Attributes (Base + Equipped Gear Bonuses)
  const effectiveAttributes = useMemo(() => {
    const base = { ...(profile.attributes || DEFAULT_PROFILE.attributes) };
    inventory
      .filter((item) => item.equipped && item.statBonus)
      .forEach((item) => {
        Object.entries(item.statBonus).forEach(([attr, val]) => {
          base[attr] = (base[attr] || 0) + val;
        });
      });
    return base;
  }, [profile.attributes, inventory]);

  // Equipment Stat Bonuses only
  const gearStatBonuses = useMemo(() => {
    const bonuses = { INT: 0, STR: 0, AGI: 0, END: 0, CHA: 0 };
    inventory
      .filter((item) => item.equipped && item.statBonus)
      .forEach((item) => {
        Object.entries(item.statBonus).forEach(([attr, val]) => {
          bonuses[attr] = (bonuses[attr] || 0) + val;
        });
      });
    return bonuses;
  }, [inventory]);

  // Gameplay Modifiers based on Attributes:
  // INT: +1% XP per INT point
  const intXpMultiplier = useMemo(() => {
    return 1 + (effectiveAttributes.INT || 10) * 0.01;
  }, [effectiveAttributes.INT]);

  // CHA: Haggle Discount at Shop: 0.5% per CHA point (capped at 25%)
  const chaDiscountPercent = useMemo(() => {
    return Math.min(25, Math.floor((effectiveAttributes.CHA || 10) * 0.5));
  }, [effectiveAttributes.CHA]);

  // STR: Score multiplier: +0.8% score per STR point
  const strScoreMultiplier = useMemo(() => {
    return 1 + (effectiveAttributes.STR || 10) * 0.008;
  }, [effectiveAttributes.STR]);

  // Calculate Combo Multiplier based on daily streak + AGI boost
  const getComboMultiplier = (streak = 0) => {
    const agiBonus = (effectiveAttributes.AGI || 8) >= 12 ? 0.1 : 0;
    if (streak >= 14) return { mult: Number((1.5 + agiBonus).toFixed(2)), label: `SUPER COMBO x${(1.5 + agiBonus).toFixed(2)}`, color: '#f43f5e' };
    if (streak >= 7) return { mult: Number((1.3 + agiBonus).toFixed(2)), label: `MEGA COMBO x${(1.3 + agiBonus).toFixed(2)}`, color: '#facc15' };
    if (streak >= 3) return { mult: Number((1.15 + agiBonus).toFixed(2)), label: `COMBO x${(1.15 + agiBonus).toFixed(2)}`, color: '#06b6d4' };
    return { mult: 1.0, label: '1.0x NORMAL', color: '#94a3b8' };
  };

  // Spawn floating arcade hit numbers
  const triggerFloatingReward = (text, type, x, y) => {
    const id = Date.now() + Math.random();
    setFloatingRewards((prev) => [...prev, { id, text, type, x, y }]);
    setTimeout(() => {
      setFloatingRewards((prev) => prev.filter((r) => r.id !== id));
    }, 1200);
  };

  // Check Level Progression using non-linear curve & award Skill Points
  const checkNonLinearLevelUp = (currentXp, currentLevel, addedXp) => {
    let totalXp = currentXp + addedXp;
    let newLevel = currentLevel;
    let xpNeeded = calculateXpRequired(newLevel);
    let leveledUp = false;
    let levelsGained = 0;

    while (totalXp >= xpNeeded) {
      totalXp -= xpNeeded;
      newLevel += 1;
      levelsGained += 1;
      xpNeeded = calculateXpRequired(newLevel);
      leveledUp = true;
    }

    if (leveledUp) {
      soundEffects.playLevelUp();
      try {
        confetti({
          particleCount: 110,
          spread: 85,
          origin: { y: 0.6 },
          colors: ['#f43f5e', '#06b6d4', '#facc15', '#10b981', '#a855f7'],
        });
      } catch (e) {
        console.warn('Confetti error', e);
      }

      const titles = [
        'COIN OPERATOR',
        '8-BIT CHALLENGER',
        'CABINET HERO',
        'STAGE CLEAR EXPERT',
        'PIXEL WARLORD',
        'NEON ARCADE CHAMPION',
        'LEGENDARY HIGH SCORER',
        'CYBER ARCHON',
      ];
      const callsign = titles[Math.min(newLevel - 1, titles.length - 1)];
      const ticketBonus = newLevel * 50;
      const pointsBonus = levelsGained * 3;

      setLevelUpData({
        level: newLevel,
        callsign,
        rewardTickets: ticketBonus,
        skillPointsEarned: pointsBonus,
      });

      addHistoryEntry({
        type: 'level_up',
        title: `Promoted to Level ${newLevel}!`,
        details: `Reached Rank: ${callsign}. Awarded +${ticketBonus} Tickets & +${pointsBonus} Skill Points!`,
        ticketsEarned: ticketBonus,
      });

      return {
        level: newLevel,
        callsign,
        xp: totalXp,
        leveledUp: true,
        ticketBonus,
        skillPointsBonus: pointsBonus,
      };
    }

    return {
      level: currentLevel,
      callsign: profile.callsign,
      xp: totalXp,
      leveledUp: false,
      ticketBonus: 0,
      skillPointsBonus: 0,
    };
  };

  // =========================================================================
  // 1. MISSIONS CRUD & ACTIONS (Connected to /api/missions)
  // =========================================================================
  const completeMission = async (mission, e) => {
    if (mission.completed) return;

    let clickX = window.innerWidth / 2;
    let clickY = window.innerHeight / 2;
    if (e && e.clientX && e.clientY) {
      clickX = e.clientX;
      clickY = e.clientY;
    }

    soundEffects.playCheckmark();
    const combo = getComboMultiplier(profile.streak);
    if (combo.mult > 1.0) {
      setTimeout(() => soundEffects.playCombo(), 120);
    }

    const finalXpGain = Math.round(mission.rewardXp * intXpMultiplier);
    const finalScoreGain = Math.round(mission.rewardScore * combo.mult * strScoreMultiplier);

    triggerFloatingReward(`+${finalXpGain} XP`, 'xp', clickX - 30, clickY - 25);
    setTimeout(() => {
      soundEffects.playCoin();
      triggerFloatingReward(`+${finalScoreGain} PTS`, 'score', clickX + 40, clickY - 25);
    }, 180);

    const levelRes = checkNonLinearLevelUp(profile.xp, profile.level, finalXpGain);

    const currentAttrVal = (profile.attributes && profile.attributes[mission.attribute]) || 10;
    const updatedAttributes = {
      ...(profile.attributes || DEFAULT_PROFILE.attributes),
      [mission.attribute]: currentAttrVal + (mission.attributeGain || 1),
    };

    const updatedProfile = {
      ...profile,
      level: levelRes.level,
      callsign: levelRes.callsign,
      xp: levelRes.xp,
      score: profile.score + finalScoreGain,
      tickets: profile.tickets + (mission.rewardTickets || 0) + levelRes.ticketBonus,
      unspentSkillPoints: profile.unspentSkillPoints + levelRes.skillPointsBonus,
      attributes: updatedAttributes,
    };

    // Optimistic local state update
    setProfile(updatedProfile);
    setMissions((prev) =>
      prev.map((m) =>
        m.id === mission.id
          ? {
              ...m,
              completed: true,
              subtasks: (m.subtasks || []).map((st) => ({ ...st, completed: true })),
            }
          : m
      )
    );

    addHistoryEntry({
      type: 'stage_clear',
      title: mission.title,
      category: mission.category || 'General',
      details: `Cleared ${mission.stage || 'Novice'} Stage with combo ${combo.label}.`,
      xpEarned: finalXpGain,
      scoreEarned: finalScoreGain,
      ticketsEarned: mission.rewardTickets,
      attributeGained: `+${mission.attributeGain || 1} ${mission.attribute}`,
    });

    // Backend API Endpoints Execution
    try {
      await api.completeMission(mission.id, {
        rewardXp: finalXpGain,
        rewardScore: finalScoreGain,
        rewardTickets: mission.rewardTickets,
      });
      await api.updateProfile(updatedProfile);
    } catch (err) {
      console.warn('Error syncing mission completion to API:', err);
    }
  };

  const uncompleteMission = async (mission) => {
    soundEffects.playClick();
    setMissions((prev) =>
      prev.map((m) =>
        m.id === mission.id
          ? {
              ...m,
              completed: false,
              subtasks: (m.subtasks || []).map((st) => ({ ...st, completed: false })),
            }
          : m
      )
    );

    try {
      await api.uncompleteMission(mission.id);
    } catch (err) {
      console.warn('Error syncing mission uncomplete to API:', err);
    }
  };

  const toggleSubtask = async (missionId, subtaskId) => {
    soundEffects.playClick();
    setMissions((prev) =>
      prev.map((m) => {
        if (m.id !== missionId) return m;
        const updatedSubtasks = (m.subtasks || []).map((st) =>
          st.id === subtaskId ? { ...st, completed: !st.completed } : st
        );
        const allCompleted = updatedSubtasks.length > 0 && updatedSubtasks.every((st) => st.completed);
        return {
          ...m,
          subtasks: updatedSubtasks,
          completed: allCompleted ? true : m.completed,
        };
      })
    );

    try {
      await api.toggleSubtask(missionId, subtaskId);
    } catch (err) {
      console.warn('Error syncing subtask toggle to API:', err);
    }
  };

  const addMission = async (missionData) => {
    soundEffects.playCoin();
    const newMission = {
      id: `m-${Date.now()}`,
      completed: false,
      priority: 'normal',
      recurrence: 'daily',
      subtasks: [],
      ...missionData,
    };
    setMissions((prev) => [newMission, ...prev]);

    try {
      const created = await api.createMission(newMission);
      if (created && created.id && created.id !== newMission.id) {
        setMissions((prev) => prev.map((m) => (m.id === newMission.id ? created : m)));
      }
      return created || newMission;
    } catch (err) {
      console.warn('Error creating mission in API:', err);
      return newMission;
    }
  };

  const updateMission = async (id, updates) => {
    soundEffects.playClick();
    setMissions((prev) => prev.map((m) => (m.id === id ? { ...m, ...updates } : m)));

    try {
      await api.updateMission(id, updates);
    } catch (err) {
      console.warn('Error updating mission in API:', err);
    }
  };

  const deleteMission = async (id) => {
    soundEffects.playClick();
    setMissions((prev) => prev.filter((m) => m.id !== id));

    try {
      await api.deleteMission(id);
    } catch (err) {
      console.warn('Error deleting mission in API:', err);
    }
  };

  // =========================================================================
  // 2. PRIZE COUNTER & ECONOMY (Connected to /api/prizes)
  // =========================================================================
  const buyPrize = async (prize, e) => {
    const discountedCost = Math.max(1, Math.round(prize.cost * (1 - chaDiscountPercent / 100)));

    if (profile.tickets < discountedCost) {
      soundEffects.playError();
      let clickX = window.innerWidth / 2;
      let clickY = window.innerHeight / 2;
      if (e && e.clientX && e.clientY) {
        clickX = e.clientX;
        clickY = e.clientY;
      }
      triggerFloatingReward('INSUFFICIENT TICKETS!', 'error', clickX, clickY - 20);
      return false;
    }

    soundEffects.playPurchase();
    let clickX = window.innerWidth / 2;
    let clickY = window.innerHeight / 2;
    if (e && e.clientX && e.clientY) {
      clickX = e.clientX;
      clickY = e.clientY;
    }
    triggerFloatingReward(`-${discountedCost} TICKETS`, 'ticket-deduct', clickX, clickY - 20);

    const updatedProfile = {
      ...profile,
      tickets: profile.tickets - discountedCost,
    };
    setProfile(updatedProfile);

    const newItem = {
      id: `inv-${Date.now()}`,
      title: prize.title,
      description: prize.description,
      icon: prize.icon,
      tier: prize.tier,
      category: prize.category || 'treat',
      slot: prize.slot,
      statBonus: prize.statBonus,
      usable: prize.usable || false,
      effect: prize.effect,
      redeemable: prize.redeemable || false,
      redeemed: false,
      equipped: false,
      acquiredAt: new Date().toLocaleDateString(),
    };

    setInventory((prev) => [newItem, ...prev]);

    addHistoryEntry({
      type: 'prize_claimed',
      title: prize.title,
      details: `Purchased at Prize Counter for ${discountedCost} Tickets (CHA Discount: ${chaDiscountPercent}%).`,
      ticketsSpent: discountedCost,
    });

    try {
      await api.buyPrize(prize.id, { cost: discountedCost, item: newItem });
      await api.updateProfile(updatedProfile);
    } catch (err) {
      console.warn('Error syncing prize purchase to API:', err);
    }

    return true;
  };

  const addPrize = async (prizeData) => {
    soundEffects.playCoin();
    const newPrize = {
      id: `p-${Date.now()}`,
      category: 'treat',
      ...prizeData,
    };
    setPrizes((prev) => [newPrize, ...prev]);

    try {
      const created = await api.createPrize(newPrize);
      if (created && created.id && created.id !== newPrize.id) {
        setPrizes((prev) => prev.map((p) => (p.id === newPrize.id ? created : p)));
      }
    } catch (err) {
      console.warn('Error creating prize in API:', err);
    }
  };

  const deletePrize = async (id) => {
    soundEffects.playClick();
    setPrizes((prev) => prev.filter((p) => p.id !== id));

    try {
      await api.deletePrize(id);
    } catch (err) {
      console.warn('Error deleting prize in API:', err);
    }
  };

  // =========================================================================
  // 3. INVENTORY SYSTEM (Connected to /api/inventory)
  // =========================================================================
  const toggleEquipItem = async (itemId) => {
    soundEffects.playCheckmark();
    setInventory((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const nextEquipped = !item.equipped;
          if (nextEquipped && item.statBonus) {
            triggerFloatingReward('EQUIPPED +STATS!', 'xp', window.innerWidth / 2, window.innerHeight / 2);
          }
          return { ...item, equipped: nextEquipped };
        }
        return item;
      })
    );

    try {
      await api.toggleEquipItem(itemId);
    } catch (err) {
      console.warn('Error toggling equip in API:', err);
    }
  };

  const useInventoryItem = async (itemId) => {
    const targetItem = inventory.find((i) => i.id === itemId);
    if (!targetItem) return;

    soundEffects.playCombo();

    let updatedProfile = { ...profile };

    if (targetItem.effect === '+1 Streak Shield' || targetItem.title.includes('Shield')) {
      updatedProfile = { ...profile, streakShields: (profile.streakShields || 0) + 1 };
      setProfile(updatedProfile);
      triggerFloatingReward('+1 STREAK SHIELD!', 'score', window.innerWidth / 2, window.innerHeight / 2);
    } else if (targetItem.effect === '+100 Instant XP' || targetItem.title.includes('Elixir')) {
      const levelRes = checkNonLinearLevelUp(profile.xp, profile.level, 100);
      updatedProfile = {
        ...profile,
        level: levelRes.level,
        callsign: levelRes.callsign,
        xp: levelRes.xp,
        tickets: profile.tickets + levelRes.ticketBonus,
        unspentSkillPoints: profile.unspentSkillPoints + levelRes.skillPointsBonus,
      };
      setProfile(updatedProfile);
      triggerFloatingReward('+100 XP CONSUMED!', 'xp', window.innerWidth / 2, window.innerHeight / 2);
    } else {
      triggerFloatingReward('BUFF ACTIVATED!', 'score', window.innerWidth / 2, window.innerHeight / 2);
    }

    addHistoryEntry({
      type: 'item_used',
      title: `Used ${targetItem.title}`,
      details: targetItem.description,
    });

    setInventory((prev) => prev.filter((i) => i.id !== itemId));

    try {
      await api.useInventoryItem(itemId);
      await api.updateProfile(updatedProfile);
    } catch (err) {
      console.warn('Error syncing item use in API:', err);
    }
  };

  const redeemVoucher = async (itemId) => {
    soundEffects.playCoin();
    setInventory((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? { ...item, redeemed: true, redeemedAt: new Date().toLocaleDateString() }
          : item
      )
    );
    triggerFloatingReward('VOUCHER REDEEMED! ENJOY!', 'score', window.innerWidth / 2, window.innerHeight / 2);

    try {
      await api.redeemVoucher(itemId);
    } catch (err) {
      console.warn('Error redeeming voucher in API:', err);
    }
  };

  // =========================================================================
  // 4. CHARACTER SHEET & ATTRIBUTES (Connected to /api/profile)
  // =========================================================================
  const allocateSkillPoint = async (attributeKey) => {
    if (profile.unspentSkillPoints <= 0) {
      soundEffects.playError();
      return;
    }
    soundEffects.playCoin();
    const updatedProfile = {
      ...profile,
      unspentSkillPoints: profile.unspentSkillPoints - 1,
      attributes: {
        ...(profile.attributes || DEFAULT_PROFILE.attributes),
        [attributeKey]: ((profile.attributes && profile.attributes[attributeKey]) || 10) + 1,
      },
    };
    setProfile(updatedProfile);
    triggerFloatingReward(`+1 ${attributeKey} UPGRADED!`, 'xp', window.innerWidth / 2, window.innerHeight / 2);

    try {
      await api.allocateSkillPoint(attributeKey);
      await api.updateProfile(updatedProfile);
    } catch (err) {
      console.warn('Error allocating skill point in API:', err);
    }
  };

  const updateProfileIdentity = async (updates) => {
    const updatedProfile = {
      ...profile,
      ...updates,
    };
    setProfile(updatedProfile);

    try {
      await api.updateProfile(updatedProfile);
    } catch (err) {
      console.warn('Error updating profile identity in API:', err);
    }
  };

  // =========================================================================
  // 5. STREAK SYSTEM & DAILY CHECK-IN (Connected to /api/profile/check-in)
  // =========================================================================
  const claimDailyCheckIn = async () => {
    const todayStr = new Date().toDateString();
    if (profile.lastCheckInDate === todayStr) {
      soundEffects.playError();
      triggerFloatingReward('ALREADY CHECKED IN TODAY!', 'error', window.innerWidth / 2, window.innerHeight / 2);
      return false;
    }

    soundEffects.playCombo();
    try {
      confetti({
        particleCount: 75,
        spread: 70,
        origin: { y: 0.5 },
        colors: ['#f43f5e', '#facc15', '#06b6d4'],
      });
    } catch (e) {
      console.warn(e);
    }

    const newStreak = (profile.streak || 0) + 1;
    const ticketReward = 20 + newStreak * 5;
    const xpReward = 50;

    triggerFloatingReward(`+${ticketReward} TICKETS (STREAK DAY ${newStreak})!`, 'score', window.innerWidth / 2, window.innerHeight / 2);

    const levelRes = checkNonLinearLevelUp(profile.xp, profile.level, xpReward);

    const updatedProfile = {
      ...profile,
      streak: newStreak,
      lastCheckInDate: todayStr,
      tickets: profile.tickets + ticketReward + levelRes.ticketBonus,
      xp: levelRes.xp,
      level: levelRes.level,
      callsign: levelRes.callsign,
      unspentSkillPoints: profile.unspentSkillPoints + levelRes.skillPointsBonus,
    };

    setProfile(updatedProfile);

    addHistoryEntry({
      type: 'daily_checkin',
      title: `Daily Check-In: Day ${newStreak} Streak!`,
      details: `Maintained continuous arcade streak. Claimed ${ticketReward} Tickets & ${xpReward} XP.`,
      ticketsEarned: ticketReward,
      xpEarned: xpReward,
    });

    try {
      await api.claimDailyCheckIn();
      await api.updateProfile(updatedProfile);
    } catch (err) {
      console.warn('Error syncing daily check-in to API:', err);
    }

    return true;
  };

  // CRT & Audio toggles
  const toggleCrt = () => {
    soundEffects.playClick();
    setCrtEnabled(!crtEnabled);
  };

  const toggleMute = () => {
    const muted = soundEffects.toggleMute();
    setIsMuted(muted);
  };

  const closeLevelUpModal = () => {
    setLevelUpData(null);
  };

  // Reset demo / wipe data
  const resetArcadeData = () => {
    api.resetAllData();
    localStorage.removeItem('arcade_profile_v2');
    localStorage.removeItem('arcade_missions_v2');
    localStorage.removeItem('arcade_prizes_v2');
    localStorage.removeItem('arcade_inventory_v2');
    setProfile(DEFAULT_PROFILE);
    setMissions([]);
    setPrizes([]);
    setInventory([]);
    setHistoryLog([]);
    window.location.reload();
  };

  return (
    <GameContext.Provider
      value={{
        profile,
        setProfile,
        missions,
        prizes,
        inventory,
        historyLog,
        activeTab,
        setActiveTab,
        crtEnabled,
        toggleCrt,
        isMuted,
        toggleMute,
        floatingRewards,
        levelUpData,
        closeLevelUpModal,
        effectiveAttributes,
        gearStatBonuses,
        intXpMultiplier,
        chaDiscountPercent,
        strScoreMultiplier,
        getComboMultiplier,
        completeMission,
        uncompleteMission,
        toggleSubtask,
        addMission,
        updateMission,
        deleteMission,
        buyPrize,
        addPrize,
        deletePrize,
        toggleEquipItem,
        useInventoryItem,
        redeemVoucher,
        allocateSkillPoint,
        updateProfileIdentity,
        claimDailyCheckIn,
        addHistoryEntry,
        resetArcadeData,
        isServerOnline,
        isLoadingData,
        loadDataFromApi,
        isAuthenticated,
        currentUser,
        login,
        register,
        logout,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
