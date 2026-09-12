// ==========================================================================
// API CLIENT & PERSISTENCE LAYER (Target: http://localhost:8080)
// Seamless offline fallback & optimistic cache integration
// ==========================================================================

const DEFAULT_API_URL = 'http://localhost:8080';
const STORAGE_KEYS = {
  API_URL: 'aetheria_api_url',
  QUESTS: 'aetheria_quests_v1',
  ITEMS: 'aetheria_items_v1',
  PROFILE: 'aetheria_profile_v1',
  INVENTORY: 'aetheria_inventory_v1',
};

// Initial Starter Lore & Quests
const INITIAL_QUESTS = [
  {
    id: 'quest-1',
    title: 'Decipher the Grand Algorithmic Codex',
    description: 'Solve 3 complex dynamic programming challenges before twilight.',
    category: 'Studies',
    difficulty: 'Epic',
    rewardXp: 180,
    rewardGold: 65,
    completed: false,
    createdAt: new Date().toISOString(),
    deadline: 'Tonight, 22:00',
  },
  {
    id: 'quest-2',
    title: 'Purify the Physical Vessel',
    description: 'Engage in 45 minutes of heavy endurance conditioning at the training grounds.',
    category: 'Fitness',
    difficulty: 'Rare',
    rewardXp: 120,
    rewardGold: 40,
    completed: false,
    createdAt: new Date().toISOString(),
    deadline: 'Daily Bounty',
  },
  {
    id: 'quest-3',
    title: 'Commune with the Guild Mentors',
    description: 'Submit project progress draft for review to the department head.',
    category: 'Academics',
    difficulty: 'Legendary',
    rewardXp: 350,
    rewardGold: 120,
    completed: false,
    createdAt: new Date().toISOString(),
    deadline: 'Tomorrow Noon',
  },
  {
    id: 'quest-4',
    title: 'Sanctify the Alchemist Quarters',
    description: 'Clean workspace desk, organize scrolls, and brew herbal focus tea.',
    category: 'Habits',
    difficulty: 'Common',
    rewardXp: 50,
    rewardGold: 15,
    completed: true,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    deadline: 'Completed',
  }
];

// Initial Starter Shop Items
const INITIAL_ITEMS = [
  {
    id: 'item-1',
    title: 'Elixir of Midnight Focus',
    description: '30-minute uninterrupted deep work trance accompanied by high-grade matcha or artisan coffee.',
    cost: 50,
    icon: 'Coffee',
    rarity: 'Uncommon',
    type: 'Consumable',
  },
  {
    id: 'item-2',
    title: 'Tavern Respite (Gaming Scroll)',
    description: '1 hour of guilt-free video game indulgence or guild gathering.',
    cost: 90,
    icon: 'Gamepad2',
    rarity: 'Rare',
    type: 'Reward',
  },
  {
    id: 'item-3',
    title: 'Cloak of the Quiet Woods',
    description: 'A 20-minute restorative forest walk to dispel mental fatigue and restore mana.',
    cost: 35,
    icon: 'Trees',
    rarity: 'Common',
    type: 'Habit',
  },
  {
    id: 'item-4',
    title: 'Amulet of the Celestial Feast',
    description: 'Order your favorite gourmet banquet dinner upon conquering this week’s hardest trial.',
    cost: 250,
    icon: 'UtensilsCrossed',
    rarity: 'Legendary',
    type: 'Reward',
  },
];

const INITIAL_PROFILE = {
  name: 'Archmage Kaelen',
  title: 'Novice Spellweaver',
  level: 3,
  xp: 320,
  xpToNextLevel: 500,
  gold: 145,
  hp: 95,
  maxHp: 100,
  mana: 80,
  maxMana: 100,
  streak: 5,
  avatar: '🧙‍♂️',
};

class ApiService {
  constructor() {
    this.baseUrl = localStorage.getItem(STORAGE_KEYS.API_URL) || DEFAULT_API_URL;
    this.isServerOnline = false;
    this.listeners = new Set();
  }

  getBaseUrl() {
    return this.baseUrl;
  }

  setBaseUrl(newUrl) {
    this.baseUrl = newUrl.replace(/\/+$/, '');
    localStorage.setItem(STORAGE_KEYS.API_URL, this.baseUrl);
    this.checkHealth();
  }

  subscribeServerStatus(listener) {
    this.listeners.add(listener);
    listener(this.isServerOnline);
    return () => this.listeners.delete(listener);
  }

  notifyStatus(status) {
    if (this.isServerOnline !== status) {
      this.isServerOnline = status;
      this.listeners.forEach((l) => l(status));
    }
  }

  // Quick non-blocking ping to check if localhost:8080 is reachable
  async checkHealth() {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1200);
      const res = await fetch(`${this.baseUrl}/api/health`, {
        signal: controller.signal,
        method: 'GET',
      });
      clearTimeout(timeoutId);
      this.notifyStatus(res.ok);
      return res.ok;
    } catch {
      this.notifyStatus(false);
      return false;
    }
  }

  // Helper with automatic timeout and fallback
  async request(endpoint, options = {}) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1800);

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
  // QUESTS CRUD
  // =========================================================================
  async getQuests() {
    try {
      return await this.request('/api/quests');
    } catch {
      const cached = localStorage.getItem(STORAGE_KEYS.QUESTS);
      if (cached) return JSON.parse(cached);
      localStorage.setItem(STORAGE_KEYS.QUESTS, JSON.stringify(INITIAL_QUESTS));
      return INITIAL_QUESTS;
    }
  }

  async createQuest(questData) {
    const newQuest = {
      id: `quest-${Date.now()}`,
      createdAt: new Date().toISOString(),
      completed: false,
      ...questData,
    };

    try {
      const remote = await this.request('/api/quests', {
        method: 'POST',
        body: JSON.stringify(newQuest),
      });
      this.saveLocalQuest(remote || newQuest);
      return remote || newQuest;
    } catch {
      this.saveLocalQuest(newQuest);
      return newQuest;
    }
  }

  async updateQuest(id, updates) {
    try {
      const remote = await this.request(`/api/quests/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
      this.updateLocalQuest(id, updates);
      return remote || updates;
    } catch {
      this.updateLocalQuest(id, updates);
      return updates;
    }
  }

  async deleteQuest(id) {
    try {
      await this.request(`/api/quests/${id}`, { method: 'DELETE' });
    } catch {
      // offline mode handled below
    }
    const list = (await this.getQuests()).filter((q) => q.id !== id);
    localStorage.setItem(STORAGE_KEYS.QUESTS, JSON.stringify(list));
    return true;
  }

  // Local storage helpers
  saveLocalQuest(quest) {
    const list = JSON.parse(localStorage.getItem(STORAGE_KEYS.QUESTS) || '[]');
    const updated = [quest, ...list.filter((q) => q.id !== quest.id)];
    localStorage.setItem(STORAGE_KEYS.QUESTS, JSON.stringify(updated));
  }

  updateLocalQuest(id, updates) {
    const list = JSON.parse(localStorage.getItem(STORAGE_KEYS.QUESTS) || '[]');
    const updated = list.map((q) => (q.id === id ? { ...q, ...updates } : q));
    localStorage.setItem(STORAGE_KEYS.QUESTS, JSON.stringify(updated));
  }

  // =========================================================================
  // SHOP ITEMS CRUD
  // =========================================================================
  async getItems() {
    try {
      return await this.request('/api/items');
    } catch {
      const cached = localStorage.getItem(STORAGE_KEYS.ITEMS);
      if (cached) return JSON.parse(cached);
      localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(INITIAL_ITEMS));
      return INITIAL_ITEMS;
    }
  }

  async createItem(itemData) {
    const newItem = {
      id: `item-${Date.now()}`,
      ...itemData,
    };
    try {
      const remote = await this.request('/api/items', {
        method: 'POST',
        body: JSON.stringify(newItem),
      });
      this.saveLocalItem(remote || newItem);
      return remote || newItem;
    } catch {
      this.saveLocalItem(newItem);
      return newItem;
    }
  }

  async deleteItem(id) {
    try {
      await this.request(`/api/items/${id}`, { method: 'DELETE' });
    } catch {}
    const items = (await this.getItems()).filter((i) => i.id !== id);
    localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(items));
    return true;
  }

  saveLocalItem(item) {
    const list = JSON.parse(localStorage.getItem(STORAGE_KEYS.ITEMS) || '[]');
    const updated = [item, ...list.filter((i) => i.id !== item.id)];
    localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(updated));
  }

  // =========================================================================
  // PROFILE & STATS
  // =========================================================================
  async getProfile() {
    try {
      return await this.request('/api/profile');
    } catch {
      const cached = localStorage.getItem(STORAGE_KEYS.PROFILE);
      if (cached) return JSON.parse(cached);
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(INITIAL_PROFILE));
      return INITIAL_PROFILE;
    }
  }

  async updateProfile(updates) {
    try {
      const remote = await this.request('/api/profile', {
        method: 'PATCH',
        body: JSON.stringify(updates),
      });
      const local = { ...(await this.getProfile()), ...updates };
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(local));
      return remote || local;
    } catch {
      const cached = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROFILE) || JSON.stringify(INITIAL_PROFILE));
      const merged = { ...cached, ...updates };
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(merged));
      return merged;
    }
  }

  // =========================================================================
  // INVENTORY
  // =========================================================================
  getInventory() {
    const cached = localStorage.getItem(STORAGE_KEYS.INVENTORY);
    if (cached) return JSON.parse(cached);
    const initial = [
      {
        id: 'inv-1',
        title: 'Tome of Clean Code',
        description: 'Passive +5% XP boost to all programming quests.',
        icon: 'BookOpen',
        rarity: 'Rare',
        acquiredAt: new Date(Date.now() - 86400000 * 2).toLocaleDateString(),
      },
      {
        id: 'inv-2',
        title: 'Boots of Punctuality',
        description: 'Awarded for maintaining a 5-day quest completion streak.',
        icon: 'Sparkles',
        rarity: 'Epic',
        acquiredAt: new Date(Date.now() - 86400000).toLocaleDateString(),
      }
    ];
    localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(initial));
    return initial;
  }

  saveInventory(inventory) {
    localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(inventory));
  }

  resetAllData() {
    localStorage.removeItem(STORAGE_KEYS.QUESTS);
    localStorage.removeItem(STORAGE_KEYS.ITEMS);
    localStorage.removeItem(STORAGE_KEYS.PROFILE);
    localStorage.removeItem(STORAGE_KEYS.INVENTORY);
  }
}

export const api = new ApiService();
