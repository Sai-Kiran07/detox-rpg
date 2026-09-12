// ==========================================================================
// ARCADE LIFE 1984 - BACKEND API CLIENT (Target: http://localhost:8080)
// Full CRUD for Profile, Missions/Tasks, Inventory, History, & Economy
// ==========================================================================

const DEFAULT_API_URL = 'http://localhost:8080';

const STORAGE_KEYS = {
  API_URL: 'arcade_api_url_v3',
  PROFILE: 'arcade_profile_v3',
  MISSIONS: 'arcade_missions_v3',
  PRIZES: 'arcade_prizes_v3',
  INVENTORY: 'arcade_inventory_v3',
  HISTORY: 'arcade_history_v3',
};

// Initial Fallback Data for offline resilience
const FALLBACK_PROFILE = {
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
  attributes: {
    INT: 14,
    STR: 11,
    AGI: 8,
    END: 12,
    CHA: 9,
  },
};

const FALLBACK_MISSIONS = [
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

const FALLBACK_PRIZES = [
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

const FALLBACK_INVENTORY = [
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

const FALLBACK_HISTORY = [
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

class ArcadeApiClient {
  constructor() {
    this.baseUrl = localStorage.getItem(STORAGE_KEYS.API_URL) || DEFAULT_API_URL;
    this.isServerOnline = false;
    this.statusListeners = new Set();

    // Periodic non-blocking health check
    if (typeof window !== 'undefined') {
      this.checkHealth();
      setInterval(() => this.checkHealth(), 12000);
    }
  }

  getBaseUrl() {
    return this.baseUrl;
  }

  setBaseUrl(url) {
    this.baseUrl = url.replace(/\/+$/, '');
    localStorage.setItem(STORAGE_KEYS.API_URL, this.baseUrl);
    this.checkHealth();
  }

  subscribeStatus(listener) {
    this.statusListeners.add(listener);
    listener(this.isServerOnline);
    return () => this.statusListeners.delete(listener);
  }

  notifyStatus(online) {
    if (this.isServerOnline !== online) {
      this.isServerOnline = online;
      this.statusListeners.forEach((fn) => fn(online));
    }
  }

  // Quick health probe to http://localhost:8080/api/health
  async checkHealth() {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1800);
      const res = await fetch(`${this.baseUrl}/api/health`, {
        signal: controller.signal,
        method: 'GET',
      });
      clearTimeout(timeoutId);
      const ok = res.ok;
      this.notifyStatus(ok);
      return ok;
    } catch {
      this.notifyStatus(false);
      return false;
    }
  }

  // HTTP Request Helper
  async request(endpoint, options = {}) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    try {
      const res = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          ...(options.headers || {}),
        },
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        this.notifyStatus(true);
        return await res.json();
      }
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    } catch (err) {
      this.notifyStatus(false);
      throw err;
    }
  }

  // =========================================================================
  // 1. PROFILE, ATTRIBUTES & STREAK (/api/profile)
  // =========================================================================
  async getProfile() {
    try {
      const remote = await this.request('/api/profile');
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(remote));
      return remote;
    } catch {
      const cached = localStorage.getItem(STORAGE_KEYS.PROFILE);
      if (cached) return JSON.parse(cached);
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(FALLBACK_PROFILE));
      return FALLBACK_PROFILE;
    }
  }

  async updateProfile(updates) {
    try {
      const remote = await this.request('/api/profile', {
        method: 'PATCH',
        body: JSON.stringify(updates),
      });
      const cached = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROFILE) || '{}');
      const merged = { ...cached, ...(remote || updates) };
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(merged));
      return merged;
    } catch {
      const cached = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROFILE) || '{}');
      const merged = { ...FALLBACK_PROFILE, ...cached, ...updates };
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(merged));
      return merged;
    }
  }

  async claimDailyCheckIn() {
    try {
      const remote = await this.request('/api/profile/check-in', {
        method: 'POST',
        body: JSON.stringify({}),
      });
      return remote;
    } catch {
      return null;
    }
  }

  async allocateSkillPoint(attribute) {
    try {
      const remote = await this.request('/api/profile/allocate-skill', {
        method: 'POST',
        body: JSON.stringify({ attribute }),
      });
      return remote;
    } catch {
      return null;
    }
  }

  // =========================================================================
  // 2. QUESTS / TASKS / MISSIONS (/api/missions)
  // =========================================================================
  async getMissions() {
    try {
      const remote = await this.request('/api/missions');
      localStorage.setItem(STORAGE_KEYS.MISSIONS, JSON.stringify(remote));
      return remote;
    } catch {
      const cached = localStorage.getItem(STORAGE_KEYS.MISSIONS);
      if (cached) return JSON.parse(cached);
      localStorage.setItem(STORAGE_KEYS.MISSIONS, JSON.stringify(FALLBACK_MISSIONS));
      return FALLBACK_MISSIONS;
    }
  }

  async createMission(missionData) {
    const localItem = {
      id: `m-${Date.now()}`,
      completed: false,
      priority: 'normal',
      recurrence: 'daily',
      subtasks: [],
      ...missionData,
    };
    try {
      const remote = await this.request('/api/missions', {
        method: 'POST',
        body: JSON.stringify(localItem),
      });
      const finalItem = remote || localItem;
      this.saveLocalMission(finalItem);
      return finalItem;
    } catch {
      this.saveLocalMission(localItem);
      return localItem;
    }
  }

  async updateMission(id, updates) {
    try {
      const remote = await this.request(`/api/missions/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
      this.updateLocalMission(id, remote || updates);
      return remote || updates;
    } catch {
      this.updateLocalMission(id, updates);
      return updates;
    }
  }

  async deleteMission(id) {
    try {
      await this.request(`/api/missions/${id}`, { method: 'DELETE' });
    } catch {}
    const list = JSON.parse(localStorage.getItem(STORAGE_KEYS.MISSIONS) || '[]').filter((m) => m.id !== id);
    localStorage.setItem(STORAGE_KEYS.MISSIONS, JSON.stringify(list));
    return true;
  }

  async completeMission(id, payload = {}) {
    try {
      const remote = await this.request(`/api/missions/${id}/complete`, {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      return remote;
    } catch {
      return null;
    }
  }

  async uncompleteMission(id) {
    try {
      const remote = await this.request(`/api/missions/${id}/uncomplete`, {
        method: 'POST',
        body: JSON.stringify({}),
      });
      return remote;
    } catch {
      return null;
    }
  }

  async toggleSubtask(missionId, subtaskId) {
    try {
      const remote = await this.request(`/api/missions/${missionId}/subtasks/${subtaskId}/toggle`, {
        method: 'POST',
        body: JSON.stringify({}),
      });
      return remote;
    } catch {
      return null;
    }
  }

  saveLocalMission(mission) {
    const list = JSON.parse(localStorage.getItem(STORAGE_KEYS.MISSIONS) || '[]');
    const updated = [mission, ...list.filter((m) => m.id !== mission.id)];
    localStorage.setItem(STORAGE_KEYS.MISSIONS, JSON.stringify(updated));
  }

  updateLocalMission(id, updates) {
    const list = JSON.parse(localStorage.getItem(STORAGE_KEYS.MISSIONS) || '[]');
    const updated = list.map((m) => (m.id === id ? { ...m, ...updates } : m));
    localStorage.setItem(STORAGE_KEYS.MISSIONS, JSON.stringify(updated));
  }

  // =========================================================================
  // 3. INVENTORY SYSTEM (/api/inventory)
  // =========================================================================
  async getInventory() {
    try {
      const remote = await this.request('/api/inventory');
      localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(remote));
      return remote;
    } catch {
      const cached = localStorage.getItem(STORAGE_KEYS.INVENTORY);
      if (cached) return JSON.parse(cached);
      localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(FALLBACK_INVENTORY));
      return FALLBACK_INVENTORY;
    }
  }

  async toggleEquipItem(id) {
    try {
      const remote = await this.request(`/api/inventory/${id}/equip`, {
        method: 'POST',
        body: JSON.stringify({}),
      });
      return remote;
    } catch {
      return null;
    }
  }

  async useInventoryItem(id) {
    try {
      const remote = await this.request(`/api/inventory/${id}/use`, {
        method: 'POST',
        body: JSON.stringify({}),
      });
      return remote;
    } catch {
      return null;
    }
  }

  async redeemVoucher(id) {
    try {
      const remote = await this.request(`/api/inventory/${id}/redeem`, {
        method: 'POST',
        body: JSON.stringify({}),
      });
      return remote;
    } catch {
      return null;
    }
  }

  // =========================================================================
  // 4. HISTORY & CAREER AUDIT TRAIL (/api/history)
  // =========================================================================
  async getHistory() {
    try {
      const remote = await this.request('/api/history');
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(remote));
      return remote;
    } catch {
      const cached = localStorage.getItem(STORAGE_KEYS.HISTORY);
      if (cached) return JSON.parse(cached);
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(FALLBACK_HISTORY));
      return FALLBACK_HISTORY;
    }
  }

  async createHistoryEntry(entryData) {
    const localEntry = {
      id: `h-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString(),
      ...entryData,
    };
    try {
      const remote = await this.request('/api/history', {
        method: 'POST',
        body: JSON.stringify(localEntry),
      });
      const finalEntry = remote || localEntry;
      const list = JSON.parse(localStorage.getItem(STORAGE_KEYS.HISTORY) || '[]');
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify([finalEntry, ...list.slice(0, 99)]));
      return finalEntry;
    } catch {
      const list = JSON.parse(localStorage.getItem(STORAGE_KEYS.HISTORY) || '[]');
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify([localEntry, ...list.slice(0, 99)]));
      return localEntry;
    }
  }

  // =========================================================================
  // 5. PRIZE COUNTER & ECONOMY (/api/prizes)
  // =========================================================================
  async getPrizes() {
    try {
      const remote = await this.request('/api/prizes');
      localStorage.setItem(STORAGE_KEYS.PRIZES, JSON.stringify(remote));
      return remote;
    } catch {
      const cached = localStorage.getItem(STORAGE_KEYS.PRIZES);
      if (cached) return JSON.parse(cached);
      localStorage.setItem(STORAGE_KEYS.PRIZES, JSON.stringify(FALLBACK_PRIZES));
      return FALLBACK_PRIZES;
    }
  }

  async createPrize(prizeData) {
    const localPrize = {
      id: `p-${Date.now()}`,
      category: 'treat',
      ...prizeData,
    };
    try {
      const remote = await this.request('/api/prizes', {
        method: 'POST',
        body: JSON.stringify(localPrize),
      });
      const finalPrize = remote || localPrize;
      const list = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRIZES) || '[]');
      localStorage.setItem(STORAGE_KEYS.PRIZES, JSON.stringify([finalPrize, ...list]));
      return finalPrize;
    } catch {
      const list = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRIZES) || '[]');
      localStorage.setItem(STORAGE_KEYS.PRIZES, JSON.stringify([localPrize, ...list]));
      return localPrize;
    }
  }

  async deletePrize(id) {
    try {
      await this.request(`/api/prizes/${id}`, { method: 'DELETE' });
    } catch {}
    const list = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRIZES) || '[]').filter((p) => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.PRIZES, JSON.stringify(list));
    return true;
  }

  async buyPrize(id, options = {}) {
    try {
      const remote = await this.request(`/api/prizes/${id}/buy`, {
        method: 'POST',
        body: JSON.stringify(options),
      });
      return remote;
    } catch {
      return null;
    }
  }
}

export const api = new ArcadeApiClient();
