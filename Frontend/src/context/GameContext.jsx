import React, { createContext, useContext, useState, useEffect } from 'react';
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

const STORAGE_KEYS = {
  PROFILE: 'arcade_profile_v2',
  MISSIONS: 'arcade_missions_v2',
  PRIZES: 'arcade_prizes_v2',
  INVENTORY: 'arcade_inventory_v2',
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
    attribute: 'INT',
    attributeGain: 3,
    rewardXp: 220,
    rewardScore: 500,
    rewardTickets: 60,
    completed: false,
    deadline: 'Tonight, 22:00',
  },
  {
    id: 'm-2',
    title: 'Titan Heavy Lift Circuit',
    description: '45-minute resistance training and core conditioning at the iron gym.',
    category: 'Fitness',
    stage: 'Intermediate',
    attribute: 'STR',
    attributeGain: 2,
    rewardXp: 160,
    rewardScore: 350,
    rewardTickets: 40,
    completed: false,
    deadline: 'Daily Stage',
  },
  {
    id: 'm-3',
    title: 'Deep Work Trance (Pomodoro)',
    description: 'Execute 2 continuous 50-minute laser-focused study sprints without checking phone.',
    category: 'Focus',
    stage: 'Intermediate',
    attribute: 'END',
    attributeGain: 2,
    rewardXp: 150,
    rewardScore: 300,
    rewardTickets: 35,
    completed: false,
    deadline: 'Afternoon',
  },
  {
    id: 'm-4',
    title: 'Hackathon Syndicate Presentation',
    description: 'Deliver the 3-minute project pitch deck confidently to the guild evaluators.',
    category: 'Social',
    stage: 'Boss',
    attribute: 'CHA',
    attributeGain: 4,
    rewardXp: 380,
    rewardScore: 1000,
    rewardTickets: 120,
    completed: false,
    deadline: 'Saturday Demo',
  },
  {
    id: 'm-5',
    title: 'Speed Clean Quarters',
    description: 'Tidy workstation, vacuum room, and organize desk within 15 minutes.',
    category: 'Habits',
    stage: 'Novice',
    attribute: 'AGI',
    attributeGain: 1,
    rewardXp: 80,
    rewardScore: 150,
    rewardTickets: 20,
    completed: true,
    deadline: 'Cleared',
  },
];

// Initial Arcade Prize Counter Items
const INITIAL_PRIZES = [
  {
    id: 'p-1',
    title: '1-Hour Retro Arcade Gaming Pass',
    description: '60 minutes of uninterrupted video game leisure or speedrunning.',
    cost: 75,
    icon: 'Gamepad2',
    tier: 'Rare',
  },
  {
    id: 'p-2',
    title: 'High-Octane Nitro Matcha / Espresso',
    description: 'Gourmet handcrafted coffee or boba tea power-up.',
    cost: 45,
    icon: 'Coffee',
    tier: 'Uncommon',
  },
  {
    id: 'p-3',
    title: 'Arcade Champion Pizza Feast',
    description: 'Order your favorite loaded pizza banquet after conquering all daily stages.',
    cost: 200,
    icon: 'UtensilsCrossed',
    tier: 'Legendary',
  },
  {
    id: 'p-4',
    title: 'Restorative Nature Walk (Mana Recharge)',
    description: '25-minute unplugged stroll through the campus park.',
    cost: 30,
    icon: 'Trees',
    tier: 'Common',
  },
];

const INITIAL_PROFILE = {
  name: 'PLAYER ONE',
  callsign: 'NEO-RAIDER',
  level: 3,
  xp: 180,
  score: 4250,
  tickets: 185,
  hp: 90,
  maxHp: 100,
  energy: 85,
  maxEnergy: 100,
  streak: 5,
  avatar: '🕹️',
  attributes: {
    INT: 14, // Intellect
    STR: 11, // Strength
    AGI: 8,  // Agility
    END: 12, // Endurance
    CHA: 9,  // Charisma
  },
};

export const GameProvider = ({ children }) => {
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
    return saved ? JSON.parse(saved) : INITIAL_PROFILE;
  });

  const [missions, setMissions] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MISSIONS);
    return saved ? JSON.parse(saved) : INITIAL_MISSIONS;
  });

  const [prizes, setPrizes] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PRIZES);
    return saved ? JSON.parse(saved) : INITIAL_PRIZES;
  });

  const [inventory, setInventory] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.INVENTORY);
    return saved ? JSON.parse(saved) : [
      {
        id: 'inv-init-1',
        title: 'Golden Arcade Token Badge',
        description: 'Proof of entry into the 1984 Life RPG Championship.',
        icon: 'Award',
        tier: 'Legendary',
        acquiredAt: new Date().toLocaleDateString(),
      }
    ];
  });

  const [activeTab, setActiveTab] = useState('landing'); // 'landing', 'missions', 'shop', 'attributes', 'leaderboard', 'settings'
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
    localStorage.setItem(STORAGE_KEYS.CRT, JSON.stringify(crtEnabled));
  }, [crtEnabled]);

  // Calculate Combo Multiplier based on daily streak
  const getComboMultiplier = (streak) => {
    if (streak >= 14) return { mult: 1.5, label: 'SUPER COMBO x1.50', color: '#f43f5e' };
    if (streak >= 7) return { mult: 1.3, label: 'MEGA COMBO x1.30', color: '#facc15' };
    if (streak >= 3) return { mult: 1.15, label: 'COMBO x1.15', color: '#06b6d4' };
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

  // Check Level Progression using non-linear curve
  const checkNonLinearLevelUp = (currentXp, currentLevel, addedXp) => {
    let totalXp = currentXp + addedXp;
    let newLevel = currentLevel;
    let xpNeeded = calculateXpRequired(newLevel);
    let leveledUp = false;

    while (totalXp >= xpNeeded) {
      totalXp -= xpNeeded;
      newLevel += 1;
      xpNeeded = calculateXpRequired(newLevel);
      leveledUp = true;
    }

    if (leveledUp) {
      soundEffects.playLevelUp();
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#f43f5e', '#06b6d4', '#facc15', '#10b981'],
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
      ];
      const callsign = titles[Math.min(newLevel - 1, titles.length - 1)];

      setLevelUpData({
        level: newLevel,
        callsign,
        rewardTickets: newLevel * 40,
      });

      return {
        level: newLevel,
        callsign,
        xp: totalXp,
        leveledUp: true,
        ticketBonus: newLevel * 40,
      };
    }

    return {
      level: currentLevel,
      callsign: profile.callsign,
      xp: totalXp,
      leveledUp: false,
      ticketBonus: 0,
    };
  };

  // Complete Mission Action
  const completeMission = (mission, e) => {
    if (mission.completed) return;

    let clickX = window.innerWidth / 2;
    let clickY = window.innerHeight / 2;
    if (e && e.clientX && e.clientY) {
      clickX = e.clientX;
      clickY = e.clientY;
    }

    // Audio & Combo check
    soundEffects.playCheckmark();
    const combo = getComboMultiplier(profile.streak);
    if (combo.mult > 1.0) {
      setTimeout(() => soundEffects.playCombo(), 120);
    }

    // Calculate score with combo multiplier
    const finalScoreGain = Math.round(mission.rewardScore * combo.mult);

    // Floating text feedback
    triggerFloatingReward(`+${mission.rewardXp} XP`, 'xp', clickX - 30, clickY - 25);
    setTimeout(() => {
      soundEffects.playCoin();
      triggerFloatingReward(`+${finalScoreGain} PTS`, 'score', clickX + 40, clickY - 25);
    }, 180);

    // Level progression
    const levelRes = checkNonLinearLevelUp(profile.xp, profile.level, mission.rewardXp);

    // Update Attribute (INT, STR, AGI, END, CHA)
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
      attributes: updatedAttributes,
    };

    setProfile(updatedProfile);
    setMissions((prev) =>
      prev.map((m) => (m.id === mission.id ? { ...m, completed: true } : m))
    );
  };

  // Uncomplete mission
  const uncompleteMission = (mission) => {
    soundEffects.playClick();
    setMissions((prev) =>
      prev.map((m) => (m.id === mission.id ? { ...m, completed: false } : m))
    );
  };

  // Add / Forge new mission
  const addMission = (missionData) => {
    soundEffects.playCoin();
    const newMission = {
      id: `m-${Date.now()}`,
      completed: false,
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

  // Buy item from Prize Counter
  const buyPrize = (prize, e) => {
    if (profile.tickets < prize.cost) {
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
    triggerFloatingReward(`-${prize.cost} TICKETS`, 'ticket-deduct', clickX, clickY - 20);

    const updatedProfile = {
      ...profile,
      tickets: profile.tickets - prize.cost,
    };
    setProfile(updatedProfile);

    const newItem = {
      id: `inv-${Date.now()}`,
      title: prize.title,
      description: prize.description,
      icon: prize.icon,
      tier: prize.tier,
      acquiredAt: new Date().toLocaleDateString(),
    };
    setInventory((prev) => [newItem, ...prev]);
    return true;
  };

  // Add custom prize
  const addPrize = (prizeData) => {
    soundEffects.playCoin();
    const newPrize = {
      id: `p-${Date.now()}`,
      ...prizeData,
    };
    setPrizes((prev) => [newPrize, ...prev]);
  };

  // Delete prize
  const deletePrize = (id) => {
    soundEffects.playClick();
    setPrizes((prev) => prev.filter((p) => p.id !== id));
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
    setProfile(INITIAL_PROFILE);
    setMissions(INITIAL_MISSIONS);
    setPrizes(INITIAL_PRIZES);
    window.location.reload();
  };

  return (
    <GameContext.Provider
      value={{
        profile,
        missions,
        prizes,
        inventory,
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
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
