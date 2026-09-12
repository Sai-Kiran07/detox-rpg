import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { soundEffects } from '../services/soundEffects.js';

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
  return Math.floor(100 * Math.pow(level, 1.4));
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

// Initial Retro Starter Missions
const INITIAL_MISSIONS = [
  {
    id: 'm-1',
    title: 'Code the Cyber-Algorithm Matrix',
    description: 'Solve 2 complex graph or dynamic programming challenges with zero compilation bugs.',
    category: 'Academics',
    stage: 'Expert',
    priority: 'high',
    recurrence: 'daily',
    attribute: 'INT',
    attributeGain: 3,
    rewardXp: 220,
    rewardScore: 500,
    rewardTickets: 60,
    completed: false,
    deadline: 'Tonight, 22:00',
    subtasks: [
      { id: 'st-1', text: 'Solve Graph BFS/DFS Problem', completed: true },
      { id: 'st-2', text: 'Solve DP Knapsack Variation', completed: false },
      { id: 'st-3', text: 'Document space & time complexity', completed: false },
    ],
  },
  {
    id: 'm-2',
    title: 'Titan Heavy Lift Circuit',
    description: '45-minute resistance training and core conditioning at the iron gym.',
    category: 'Fitness',
    stage: 'Intermediate',
    priority: 'normal',
    recurrence: 'daily',
    attribute: 'STR',
    attributeGain: 2,
    rewardXp: 160,
    rewardScore: 350,
    rewardTickets: 40,
    completed: false,
    deadline: 'Daily Stage',
    subtasks: [
      { id: 'st-4', text: 'Bench press / Chest press 4 sets', completed: false },
      { id: 'st-5', text: 'Barbell squats or leg press 4 sets', completed: false },
    ],
  },
  {
    id: 'm-3',
    title: 'Deep Work Trance (Pomodoro)',
    description: 'Execute 2 continuous 50-minute laser-focused study sprints without checking phone.',
    category: 'Focus',
    stage: 'Intermediate',
    priority: 'high',
    recurrence: 'daily',
    attribute: 'END',
    attributeGain: 2,
    rewardXp: 150,
    rewardScore: 300,
    rewardTickets: 35,
    completed: false,
    deadline: 'Afternoon',
    subtasks: [],
  },
  {
    id: 'm-4',
    title: 'Hackathon Syndicate Presentation',
    description: 'Deliver the 3-minute project pitch deck confidently to the guild evaluators.',
    category: 'Social',
    stage: 'Boss',
    priority: 'high',
    recurrence: 'weekly',
    attribute: 'CHA',
    attributeGain: 4,
    rewardXp: 380,
    rewardScore: 1000,
    rewardTickets: 120,
    completed: false,
    deadline: 'Saturday Demo',
    subtasks: [
      { id: 'st-6', text: 'Rehearse slide transitions', completed: false },
      { id: 'st-7', text: 'Test screen recording & demo video', completed: false },
    ],
  },
  {
    id: 'm-5',
    title: 'Speed Clean Quarters',
    description: 'Tidy workstation, vacuum room, and organize desk within 15 minutes.',
    category: 'Habits',
    stage: 'Novice',
    priority: 'low',
    recurrence: 'daily',
    attribute: 'AGI',
    attributeGain: 1,
    rewardXp: 80,
    rewardScore: 150,
    rewardTickets: 20,
    completed: true,
    deadline: 'Cleared',
    subtasks: [],
  },
];

// Initial Arcade Prize Counter Items with Categories & Perks
const INITIAL_PRIZES = [
  {
    id: 'p-shield',
    title: 'Streak Freeze Shield',
    description: 'Arcade insurance matrix. Automatically shields your combo streak if you miss a day.',
    cost: 80,
    icon: 'Shield',
    tier: 'Rare',
    category: 'buff',
    usable: true,
    effect: '+1 Streak Shield',
  },
  {
    id: 'p-visor',
    title: 'Cybernetic Focus Visor',
    description: 'Equipable tactical optics. Augments computational analysis with +4 INT passive boost.',
    cost: 160,
    icon: 'Cpu',
    tier: 'Epic',
    category: 'gear',
    slot: 'head',
    statBonus: { INT: 4 },
  },
  {
    id: 'p-gauntlet',
    title: 'Titan Power Gauntlet',
    description: 'Equipable pneumatic exoskeleton. Boosts physical output with +3 STR and +2 AGI.',
    cost: 180,
    icon: 'Shield',
    tier: 'Epic',
    category: 'gear',
    slot: 'hands',
    statBonus: { STR: 3, AGI: 2 },
  },
  {
    id: 'p-1',
    title: '1-Hour Retro Gaming Pass',
    description: '60 minutes of guilt-free video game leisure or arcade speedrunning.',
    cost: 75,
    icon: 'Gamepad2',
    tier: 'Rare',
    category: 'treat',
    redeemable: true,
  },
  {
    id: 'p-2',
    title: 'High-Octane Nitro Matcha / Espresso',
    description: 'Gourmet handcrafted coffee or boba tea power-up voucher.',
    cost: 45,
    icon: 'Coffee',
    tier: 'Uncommon',
    category: 'treat',
    redeemable: true,
  },
  {
    id: 'p-3',
    title: 'Arcade Champion Pizza Feast',
    description: 'Order your favorite loaded pizza banquet after conquering all weekly stages.',
    cost: 200,
    icon: 'UtensilsCrossed',
    tier: 'Legendary',
    category: 'treat',
    redeemable: true,
  },
  {
    id: 'p-4',
    title: 'Restorative Nature Walk (Mana Recharge)',
    description: '25-minute unplugged stroll through the campus botanical park.',
    cost: 30,
    icon: 'Trees',
    tier: 'Common',
    category: 'treat',
    redeemable: true,
  },
  {
    id: 'p-elixir',
    title: 'Hyper Overclock Elixir',
    description: 'Consumable stimulant. Grants +100 bonus instant XP to accelerate your next rank.',
    cost: 50,
    icon: 'Sparkles',
    tier: 'Uncommon',
    category: 'buff',
    usable: true,
    effect: '+100 Instant XP',
  },
];

const INITIAL_PROFILE = {
  name: 'PLAYER ONE',
  callsign: 'NEO-RAIDER',
  level: 3,
  xp: 180,
  score: 4250,
  tickets: 185,
  unspentSkillPoints: 3, // Player can allocate to attributes
  hp: 90,
  maxHp: 100,
  energy: 85,
  maxEnergy: 100,
  streak: 5,
  streakShields: 1, // Start with 1 shield
  lastCheckInDate: null,
  avatar: '🕹️',
  attributes: {
    INT: 14, // Intellect (+1% XP gain per pt)
    STR: 11, // Strength (+0.8% score bonus & crit rolls)
    AGI: 8,  // Agility (combo bonus enhancer)
    END: 12, // Endurance (energy cap & streak resilience)
    CHA: 9,  // Charisma (shop haggle discount %)
  },
};

const INITIAL_INVENTORY = [
  {
    id: 'inv-init-1',
    title: 'Cybernetic Focus Visor',
    description: 'Equipable tactical optics. Augments computational analysis with +4 INT passive boost.',
    category: 'gear',
    slot: 'head',
    statBonus: { INT: 4 },
    tier: 'Epic',
    icon: 'Cpu',
    equipped: true,
    acquiredAt: new Date(Date.now() - 86400000 * 2).toLocaleDateString(),
  },
  {
    id: 'inv-init-2',
    title: 'Streak Freeze Shield',
    description: 'Arcade insurance matrix. Automatically shields your combo streak if you miss a day.',
    category: 'buff',
    usable: true,
    effect: '+1 Streak Shield',
    tier: 'Rare',
    icon: 'Shield',
    acquiredAt: new Date(Date.now() - 86400000).toLocaleDateString(),
  },
  {
    id: 'inv-init-3',
    title: 'High-Octane Nitro Matcha / Espresso',
    description: 'Gourmet handcrafted coffee or boba tea power-up voucher.',
    category: 'treat',
    redeemable: true,
    redeemed: false,
    tier: 'Uncommon',
    icon: 'Coffee',
    acquiredAt: new Date().toLocaleDateString(),
  },
];

const INITIAL_HISTORY = [
  {
    id: 'h-1',
    type: 'stage_clear',
    title: 'Speed Clean Quarters',
    category: 'Habits',
    details: 'Completed Novice Stage in record time.',
    xpEarned: 80,
    scoreEarned: 150,
    ticketsEarned: 20,
    attributeGained: '+1 AGI',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'h-2',
    type: 'prize_claimed',
    title: 'High-Octane Nitro Matcha / Espresso',
    details: 'Redeemed at Prize Counter for 45 Tickets.',
    ticketsSpent: 45,
    timestamp: new Date(Date.now() - 43200000).toISOString(),
  },
  {
    id: 'h-3',
    type: 'daily_checkin',
    title: 'Daily Check-In: Day 5 Streak',
    details: 'Maintained consecutive arcade login streak.',
    ticketsEarned: 50,
    xpEarned: 50,
    timestamp: new Date().toISOString(),
  },
];

export const GameProvider = ({ children }) => {
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...INITIAL_PROFILE,
        ...parsed,
        attributes: { ...INITIAL_PROFILE.attributes, ...(parsed.attributes || {}) },
      };
    }
    const v2 = localStorage.getItem('arcade_profile_v2');
    if (v2) {
      const parsed2 = JSON.parse(v2);
      return {
        ...INITIAL_PROFILE,
        ...parsed2,
        unspentSkillPoints: 3,
        streakShields: 1,
        attributes: { ...INITIAL_PROFILE.attributes, ...(parsed2.attributes || {}) },
      };
    }
    return INITIAL_PROFILE;
  });

  const [missions, setMissions] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MISSIONS);
    if (saved) return JSON.parse(saved);
    const v2 = localStorage.getItem('arcade_missions_v2');
    if (v2) {
      const parsed = JSON.parse(v2);
      return parsed.map((m) => ({
        ...m,
        priority: m.priority || 'normal',
        recurrence: m.recurrence || 'daily',
        subtasks: m.subtasks || [],
      }));
    }
    return INITIAL_MISSIONS;
  });

  const [prizes, setPrizes] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PRIZES);
    return saved ? JSON.parse(saved) : INITIAL_PRIZES;
  });

  const [inventory, setInventory] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.INVENTORY);
    return saved ? JSON.parse(saved) : INITIAL_INVENTORY;
  });

  const [historyLog, setHistoryLog] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.HISTORY);
    return saved ? JSON.parse(saved) : INITIAL_HISTORY;
  });

  const [activeTab, setActiveTab] = useState('landing');
  const [crtEnabled, setCrtEnabled] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CRT);
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [isMuted, setIsMuted] = useState(false);
  const [floatingRewards, setFloatingRewards] = useState([]);
  const [levelUpData, setLevelUpData] = useState(null);

  // Sync to local storage
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

  // Log activity helper
  const addHistoryEntry = (entry) => {
    const newEntry = {
      id: `h-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString(),
      ...entry,
    };
    setHistoryLog((prev) => [newEntry, ...prev.slice(0, 99)]);
  };

  // Compute Effective Attributes (Base + Equipped Gear Bonuses)
  const effectiveAttributes = useMemo(() => {
    const base = { ...profile.attributes };
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
  const getComboMultiplier = (streak) => {
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

  // 1. Complete Mission Action (with INT XP boost & STR Score boost)
  const completeMission = (mission, e) => {
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

    const currentAttrVal = profile.attributes[mission.attribute] || 10;
    const updatedAttributes = {
      ...profile.attributes,
      [mission.attribute]: currentAttrVal + (mission.attributeGain || 1),
    };

    const updatedProfile = {
      ...profile,
      level: levelRes.level,
      callsign: levelRes.callsign,
      xp: levelRes.xp,
      score: profile.score + finalScoreGain,
      tickets: profile.tickets + mission.rewardTickets + levelRes.ticketBonus,
      unspentSkillPoints: profile.unspentSkillPoints + levelRes.skillPointsBonus,
      attributes: updatedAttributes,
    };

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
  };

  // Uncomplete mission
  const uncompleteMission = (mission) => {
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
  };

  // Toggle Subtask
  const toggleSubtask = (missionId, subtaskId) => {
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
  };

  // Add / Forge new mission
  const addMission = (missionData) => {
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
    return newMission;
  };

  // Update mission
  const updateMission = (id, updates) => {
    soundEffects.playClick();
    setMissions((prev) => prev.map((m) => (m.id === id ? { ...m, ...updates } : m)));
  };

  // Delete mission
  const deleteMission = (id) => {
    soundEffects.playClick();
    setMissions((prev) => prev.filter((m) => m.id !== id));
  };

  // 2. Buy item from Prize Counter (with Charisma Haggle Discount!)
  const buyPrize = (prize, e) => {
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

    return true;
  };

  // Add custom prize
  const addPrize = (prizeData) => {
    soundEffects.playCoin();
    const newPrize = {
      id: `p-${Date.now()}`,
      category: 'treat',
      ...prizeData,
    };
    setPrizes((prev) => [newPrize, ...prev]);
  };

  // Delete prize
  const deletePrize = (id) => {
    soundEffects.playClick();
    setPrizes((prev) => prev.filter((p) => p.id !== id));
  };

  // 3. Inventory Actions: Toggle Equip Relic / Gear
  const toggleEquipItem = (itemId) => {
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
  };

  // 4. Inventory Actions: Use Consumable Buff
  const useInventoryItem = (itemId) => {
    const targetItem = inventory.find((i) => i.id === itemId);
    if (!targetItem) return;

    soundEffects.playCombo();

    if (targetItem.effect === '+1 Streak Shield' || targetItem.title.includes('Shield')) {
      setProfile((prev) => ({ ...prev, streakShields: prev.streakShields + 1 }));
      triggerFloatingReward('+1 STREAK SHIELD!', 'score', window.innerWidth / 2, window.innerHeight / 2);
    } else if (targetItem.effect === '+100 Instant XP' || targetItem.title.includes('Elixir')) {
      const levelRes = checkNonLinearLevelUp(profile.xp, profile.level, 100);
      setProfile((prev) => ({
        ...prev,
        level: levelRes.level,
        callsign: levelRes.callsign,
        xp: levelRes.xp,
        tickets: prev.tickets + levelRes.ticketBonus,
        unspentSkillPoints: prev.unspentSkillPoints + levelRes.skillPointsBonus,
      }));
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
  };

  // 5. Inventory Actions: Redeem Real-World Voucher
  const redeemVoucher = (itemId) => {
    soundEffects.playCoin();
    setInventory((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? { ...item, redeemed: true, redeemedAt: new Date().toLocaleDateString() }
          : item
      )
    );
    triggerFloatingReward('VOUCHER REDEEMED! ENJOY!', 'score', window.innerWidth / 2, window.innerHeight / 2);
  };

  // 6. Character Sheet: Allocate Skill Point to Attribute
  const allocateSkillPoint = (attributeKey) => {
    if (profile.unspentSkillPoints <= 0) {
      soundEffects.playError();
      return;
    }
    soundEffects.playCoin();
    setProfile((prev) => ({
      ...prev,
      unspentSkillPoints: prev.unspentSkillPoints - 1,
      attributes: {
        ...prev.attributes,
        [attributeKey]: (prev.attributes[attributeKey] || 10) + 1,
      },
    }));
    triggerFloatingReward(`+1 ${attributeKey} UPGRADED!`, 'xp', window.innerWidth / 2, window.innerHeight / 2);
  };

  // 7. Streak System: Claim Daily Check-In
  const claimDailyCheckIn = () => {
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

    const newStreak = profile.streak + 1;
    const ticketReward = 20 + newStreak * 5;
    const xpReward = 50;

    triggerFloatingReward(`+${ticketReward} TICKETS (STREAK DAY ${newStreak})!`, 'score', window.innerWidth / 2, window.innerHeight / 2);

    const levelRes = checkNonLinearLevelUp(profile.xp, profile.level, xpReward);

    setProfile((prev) => ({
      ...prev,
      streak: newStreak,
      lastCheckInDate: todayStr,
      tickets: prev.tickets + ticketReward + levelRes.ticketBonus,
      xp: levelRes.xp,
      level: levelRes.level,
      callsign: levelRes.callsign,
      unspentSkillPoints: prev.unspentSkillPoints + levelRes.skillPointsBonus,
    }));

    addHistoryEntry({
      type: 'daily_checkin',
      title: `Daily Check-In: Day ${newStreak} Streak!`,
      details: `Maintained continuous arcade streak. Claimed ${ticketReward} Tickets & ${xpReward} XP.`,
      ticketsEarned: ticketReward,
      xpEarned: xpReward,
    });

    return true;
  };

  // Toggle CRT Scanlines
  const toggleCrt = () => {
    soundEffects.playClick();
    setCrtEnabled(!crtEnabled);
  };

  // Toggle Mute
  const toggleMute = () => {
    const muted = soundEffects.toggleMute();
    setIsMuted(muted);
  };

  // Close Level Up Modal
  const closeLevelUpModal = () => {
    setLevelUpData(null);
  };

  // Reset demo data
  const resetArcadeData = () => {
    localStorage.removeItem(STORAGE_KEYS.PROFILE);
    localStorage.removeItem(STORAGE_KEYS.MISSIONS);
    localStorage.removeItem(STORAGE_KEYS.PRIZES);
    localStorage.removeItem(STORAGE_KEYS.INVENTORY);
    localStorage.removeItem(STORAGE_KEYS.HISTORY);
    localStorage.removeItem('arcade_profile_v2');
    localStorage.removeItem('arcade_missions_v2');
    localStorage.removeItem('arcade_prizes_v2');
    localStorage.removeItem('arcade_inventory_v2');
    setProfile(INITIAL_PROFILE);
    setMissions(INITIAL_MISSIONS);
    setPrizes(INITIAL_PRIZES);
    setInventory(INITIAL_INVENTORY);
    setHistoryLog(INITIAL_HISTORY);
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
        claimDailyCheckIn,
        addHistoryEntry,
        resetArcadeData,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
