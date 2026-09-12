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
  CRT: 'arcade_crt_enabled',
};

export const GameProvider = ({ children }) => {
  const [profile, setProfile] = useState(() => {
    const cached = localStorage.getItem('arcade_profile_v3');
    return cached ? JSON.parse(cached) : {
      name: 'PLAYER ONE',
      callsign: 'NEO-RAIDER',
      level: 3,
      xp: 180,
      score: 4250,
      tickets: 185,
      unspentSkillPoints: 3,
      hp: 90,
      maxHp: 100,
      energy: 85,
      maxEnergy: 100,
      streak: 5,
      streakShields: 1,
      lastCheckInDate: null,
      avatar: '🕹️',
      attributes: { INT: 14, STR: 11, AGI: 8, END: 12, CHA: 9 },
    };
  });

  const [missions, setMissions] = useState(() => {
    const cached = localStorage.getItem('arcade_missions_v3');
    return cached ? JSON.parse(cached) : [];
  });

  const [prizes, setPrizes] = useState(() => {
    const cached = localStorage.getItem('arcade_prizes_v3');
    return cached ? JSON.parse(cached) : [];
  });

  const [inventory, setInventory] = useState(() => {
    const cached = localStorage.getItem('arcade_inventory_v3');
    return cached ? JSON.parse(cached) : [];
  });

  const [historyLog, setHistoryLog] = useState(() => {
    const cached = localStorage.getItem('arcade_history_v3');
    return cached ? JSON.parse(cached) : [];
  });

  const [isServerOnline, setIsServerOnline] = useState(false);
  const [activeTab, setActiveTab] = useState('landing');
  const [crtEnabled, setCrtEnabled] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CRT);
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [isMuted, setIsMuted] = useState(false);
  const [floatingRewards, setFloatingRewards] = useState([]);
  const [levelUpData, setLevelUpData] = useState(null);

  // 1. Initial Data Fetch from Backend (http://localhost:8080)
  useEffect(() => {
    const unsubscribe = api.subscribeStatus((online) => {
      setIsServerOnline(online);
    });

    const loadBackendData = async () => {
      try {
        const [profData, misData, invData, histData, przData] = await Promise.all([
          api.getProfile(),
          api.getMissions(),
          api.getInventory(),
          api.getHistory(),
          api.getPrizes(),
        ]);

        if (profData) setProfile(profData);
        if (misData) setMissions(misData);
        if (invData) setInventory(invData);
        if (histData) setHistoryLog(histData);
        if (przData) setPrizes(przData);
      } catch (err) {
        console.warn('Backend load notice (using resilient cache):', err);
      }
    };

    loadBackendData();
    return () => unsubscribe();
  }, []);

  // Save CRT setting
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CRT, JSON.stringify(crtEnabled));
  }, [crtEnabled]);

  // Log activity helper (pushes to backend & local state)
  const addHistoryEntry = useCallback(async (entry) => {
    const newEntry = {
      id: `h-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString(),
      ...entry,
    };
    setHistoryLog((prev) => [newEntry, ...prev.slice(0, 99)]);
    await api.createHistoryEntry(newEntry);
  }, []);

  // Compute Effective Attributes (Base + Equipped Gear Bonuses)
  const effectiveAttributes = useMemo(() => {
    const base = { ...(profile.attributes || { INT: 10, STR: 10, AGI: 10, END: 10, CHA: 10 }) };
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
  const intXpMultiplier = useMemo(() => {
    return 1 + (effectiveAttributes.INT || 10) * 0.01;
  }, [effectiveAttributes.INT]);

  const chaDiscountPercent = useMemo(() => {
    return Math.min(25, Math.floor((effectiveAttributes.CHA || 10) * 0.5));
  }, [effectiveAttributes.CHA]);

  const strScoreMultiplier = useMemo(() => {
    return 1 + (effectiveAttributes.STR || 10) * 0.008;
  }, [effectiveAttributes.STR]);

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

  // 1. Complete Mission Action (Synced with Backend)
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

    // Sync with backend API
    await api.completeMission(mission.id, {
      xpEarned: finalXpGain,
      scoreEarned: finalScoreGain,
      ticketsEarned: mission.rewardTickets,
    });

    await api.updateProfile(updatedProfile);

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
    await api.uncompleteMission(mission.id);
  };

  // Toggle Subtask
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
    await api.toggleSubtask(missionId, subtaskId);
  };

  // Add / Forge new mission
  const addMission = async (missionData) => {
    soundEffects.playCoin();
    const created = await api.createMission(missionData);
    setMissions((prev) => [created, ...prev.filter((m) => m.id !== created.id)]);
    return created;
  };

  // Update mission
  const updateMission = async (id, updates) => {
    soundEffects.playClick();
    setMissions((prev) => prev.map((m) => (m.id === id ? { ...m, ...updates } : m)));
    await api.updateMission(id, updates);
  };

  // Delete mission
  const deleteMission = async (id) => {
    soundEffects.playClick();
    setMissions((prev) => prev.filter((m) => m.id !== id));
    await api.deleteMission(id);
  };

  // 2. Buy item from Prize Counter (with Charisma Haggle Discount & Backend sync)
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

    // Backend sync
    await api.buyPrize(prize.id, { discountedCost, chaDiscountPercent });
    await api.updateProfile(updatedProfile);

    addHistoryEntry({
      type: 'prize_claimed',
      title: prize.title,
      details: `Purchased at Prize Counter for ${discountedCost} Tickets (CHA Discount: ${chaDiscountPercent}%).`,
      ticketsSpent: discountedCost,
    });

    return true;
  };

  // Add custom prize
  const addPrize = async (prizeData) => {
    soundEffects.playCoin();
    const created = await api.createPrize(prizeData);
    setPrizes((prev) => [created, ...prev.filter((p) => p.id !== created.id)]);
  };

  // Delete prize
  const deletePrize = async (id) => {
    soundEffects.playClick();
    setPrizes((prev) => prev.filter((p) => p.id !== id));
    await api.deletePrize(id);
  };

  // 3. Inventory Actions: Toggle Equip Relic / Gear
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
    await api.toggleEquipItem(itemId);
  };

  // 4. Inventory Actions: Use Consumable Buff
  const useInventoryItem = async (itemId) => {
    const targetItem = inventory.find((i) => i.id === itemId);
    if (!targetItem) return;

    soundEffects.playCombo();

    let updatedProfile = { ...profile };

    if (targetItem.effect === '+1 Streak Shield' || targetItem.title.includes('Shield')) {
      updatedProfile = { ...updatedProfile, streakShields: updatedProfile.streakShields + 1 };
      setProfile(updatedProfile);
      triggerFloatingReward('+1 STREAK SHIELD!', 'score', window.innerWidth / 2, window.innerHeight / 2);
    } else if (targetItem.effect === '+100 Instant XP' || targetItem.title.includes('Elixir')) {
      const levelRes = checkNonLinearLevelUp(profile.xp, profile.level, 100);
      updatedProfile = {
        ...updatedProfile,
        level: levelRes.level,
        callsign: levelRes.callsign,
        xp: levelRes.xp,
        tickets: updatedProfile.tickets + levelRes.ticketBonus,
        unspentSkillPoints: updatedProfile.unspentSkillPoints + levelRes.skillPointsBonus,
      };
      setProfile(updatedProfile);
      triggerFloatingReward('+100 XP CONSUMED!', 'xp', window.innerWidth / 2, window.innerHeight / 2);
    } else {
      triggerFloatingReward('BUFF ACTIVATED!', 'score', window.innerWidth / 2, window.innerHeight / 2);
    }

    setInventory((prev) => prev.filter((i) => i.id !== itemId));

    await api.useInventoryItem(itemId);
    await api.updateProfile(updatedProfile);

    addHistoryEntry({
      type: 'item_used',
      title: `Used ${targetItem.title}`,
      details: targetItem.description,
    });
  };

  // 5. Inventory Actions: Redeem Real-World Voucher
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
    await api.redeemVoucher(itemId);
  };

  // 6. Character Sheet: Allocate Skill Point to Attribute
  const allocateSkillPoint = async (attributeKey) => {
    if (profile.unspentSkillPoints <= 0) {
      soundEffects.playError();
      return;
    }
    soundEffects.playCoin();
    const updated = {
      ...profile,
      unspentSkillPoints: profile.unspentSkillPoints - 1,
      attributes: {
        ...profile.attributes,
        [attributeKey]: (profile.attributes[attributeKey] || 10) + 1,
      },
    };
    setProfile(updated);
    triggerFloatingReward(`+1 ${attributeKey} UPGRADED!`, 'xp', window.innerWidth / 2, window.innerHeight / 2);

    await api.allocateSkillPoint(attributeKey);
    await api.updateProfile(updated);
  };

  // 7. Streak System: Claim Daily Check-In
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

    const newStreak = profile.streak + 1;
    const ticketReward = 20 + newStreak * 5;
    const xpReward = 50;

    triggerFloatingReward(`+${ticketReward} TICKETS (STREAK DAY ${newStreak})!`, 'score', window.innerWidth / 2, window.innerHeight / 2);

    const levelRes = checkNonLinearLevelUp(profile.xp, profile.level, xpReward);

    const updated = {
      ...profile,
      streak: newStreak,
      lastCheckInDate: todayStr,
      tickets: profile.tickets + ticketReward + levelRes.ticketBonus,
      xp: levelRes.xp,
      level: levelRes.level,
      callsign: levelRes.callsign,
      unspentSkillPoints: profile.unspentSkillPoints + levelRes.skillPointsBonus,
    };
    setProfile(updated);

    await api.claimDailyCheckIn();
    await api.updateProfile(updated);

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
    localStorage.removeItem('arcade_profile_v3');
    localStorage.removeItem('arcade_missions_v3');
    localStorage.removeItem('arcade_prizes_v3');
    localStorage.removeItem('arcade_inventory_v3');
    localStorage.removeItem('arcade_history_v3');
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
        isServerOnline,
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
