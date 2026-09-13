// ==========================================================================
// ARCADE LIFE 1984 - BACKEND API CLIENT (Target: http://localhost:8080)
// Real-time API Client for Profile, Missions/Quests, Inventory, History, & Prizes
// Pure backend-driven data layer (NO STATIC DUMMY DATA DISPLAYED)
// ==========================================================================

const DEFAULT_API_URL = 'http://localhost:8080';

const STORAGE_KEYS = {
  API_URL: 'arcade_api_url_v3',
  AUTH_TOKEN: 'arcade_jwt_token_v3',
  AUTH_USER: 'arcade_jwt_user_v3',
  PROFILE: 'arcade_profile_v3',
  MISSIONS: 'arcade_missions_v3',
  PRIZES: 'arcade_prizes_v3',
  INVENTORY: 'arcade_inventory_v3',
  HISTORY: 'arcade_history_v3',
};

class ArcadeApiClient {
  constructor() {
    this.baseUrl = (typeof window !== 'undefined' && localStorage.getItem(STORAGE_KEYS.API_URL)) || DEFAULT_API_URL;
    this.isServerOnline = false;
    this.statusListeners = new Set();
    this.authListeners = new Set();

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
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.API_URL, this.baseUrl);
    }
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

  // =========================================================================
  // AUTHENTICATION & JWT TOKEN MANAGEMENT
  // =========================================================================
  getToken() {

    return typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN) : null;
  }

  setToken(token) {
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
      } else {
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      }
    }
  }

  getUsername() {
    return typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.AUTH_USER) : null;
  }

  setUsername(username) {
    if (typeof window !== 'undefined') {
      if (username) {
        localStorage.setItem(STORAGE_KEYS.AUTH_USER, username);
      } else {
        localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
      }
    }
  }

  clearAuth() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
    }
    this.notifyAuthChange(false);
  }

  isAuthenticated() {
    return Boolean(this.getToken());
  }

  subscribeAuth(listener) {
    this.authListeners.add(listener);
    listener(this.isAuthenticated(), this.getUsername());
    return () => this.authListeners.delete(listener);
  }

  notifyAuthChange(isAuth) {
    this.authListeners.forEach((fn) => fn(isAuth, this.getUsername()));
  }

  // Register — NEW: POST /api/auth/register (Request: { username, password })
  async register(username, password) {
    const payload = { username, password };
    try {
      return await this.request('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    } catch (err) {
      // Automatic fallback if backend mapped to /api/auth/signup or /auth/signup
      try {
        return await this.request('/api/auth/signup', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
      } catch {
        try {
          return await this.request('/auth/signup', {
            method: 'POST',
            body: JSON.stringify(payload),
          });
        } catch {
          throw err;
        }
      }
    }
  }

  // Login — NEW: POST /api/auth/login (Request: { username, password }, Response: { token: "..." })
  async login(username, password) {
    const payload = { username, password };
    let res;
    try {
      console.log("doing something")
      res = await this.request('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(payload),

      });
      console.log(res);
    } catch (err) {
      throw err;

    }

    const token = res.token || res.jwt || res.accessToken || (typeof res === 'string' ? res : null);
    if (!token) {
      throw new Error('Authentication response did not contain a valid JWT token.');
    }

    this.setToken(token);
    this.setUsername(username);
    this.notifyAuthChange(true);
    return { success: true, token, username, ...res };
  }

  logout() {
    this.clearAuth();
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

  // HTTP Request Helper with JWT Authorization header injection
  async request(endpoint, options = {}) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const token = this.getToken();
    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    };

    try {
      const res = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        signal: controller.signal,
        headers,
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        this.notifyStatus(true);
        // If response has no content (204 or empty)
        const text = await res.text();
        return text ? JSON.parse(text) : { success: true };
      }

      // Handle 401/403 unauthorized token expiration
      if ((res.status === 401 || res.status === 403) && !endpoint.includes('/auth/')) {
        this.clearAuth();
      }

      let errorMsg = `HTTP ${res.status}: ${res.statusText}`;
      try {
        const errJson = await res.json();
        if (errJson.message) errorMsg = errJson.message;
        else if (errJson.error) errorMsg = errJson.error;
      } catch { }

      throw new Error(errorMsg);
    } catch (err) {
      this.notifyStatus(false);
      throw err;
    }
  }

  // =========================================================================
  // 1. PROFILE, ATTRIBUTES & STREAK (/api/profile)
  // =========================================================================
  async getProfile() {
    console.log("getting profile")
    try {
      const remote = await this.request('/api/profile');
      console.log(remote);
      if (remote) {
        localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(remote));
        return remote;
      }
      return null;
    } catch (err) {
      console.log(err);
      const cached = localStorage.getItem(STORAGE_KEYS.PROFILE);
      if (cached) {
        try { return JSON.parse(cached); } catch { }
      }
      return null;
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
      const merged = { ...cached, ...updates };
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
      if (Array.isArray(remote)) {
        localStorage.setItem(STORAGE_KEYS.MISSIONS, JSON.stringify(remote));
        return remote;
      }
      return [];
    } catch {
      const cached = localStorage.getItem(STORAGE_KEYS.MISSIONS);
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed)) return parsed;
        } catch { }
      }
      return [];
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
    } catch { }
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

  // Compatibility aliases
  async getQuests() {
    return this.getMissions();
  }
  async createQuest(data) {
    return this.createMission(data);
  }
  async updateQuest(id, updates) {
    return this.updateMission(id, updates);
  }
  async deleteQuest(id) {
    return this.deleteMission(id);
  }

  // =========================================================================
  // 3. INVENTORY SYSTEM (/api/inventory)
  // =========================================================================
  async getInventory() {
    try {
      const remote = await this.request('/api/inventory');
      if (Array.isArray(remote)) {
        localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(remote));
        return remote;
      }
      return [];
    } catch {
      const cached = localStorage.getItem(STORAGE_KEYS.INVENTORY);
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed)) return parsed;
        } catch { }
      }
      return [];
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
      if (Array.isArray(remote)) {
        localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(remote));
        return remote;
      }
      return [];
    } catch {
      const cached = localStorage.getItem(STORAGE_KEYS.HISTORY);
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed)) return parsed;
        } catch { }
      }
      return [];
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
      if (Array.isArray(remote)) {
        localStorage.setItem(STORAGE_KEYS.PRIZES, JSON.stringify(remote));
        return remote;
      }
      return [];
    } catch {
      const cached = localStorage.getItem(STORAGE_KEYS.PRIZES);
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed)) return parsed;
        } catch { }
      }
      return [];
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
    } catch { }
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

  // Compatibility aliases
  async getItems() {
    return this.getPrizes();
  }
  async createItem(data) {
    return this.createPrize(data);
  }
  async deleteItem(id) {
    return this.deletePrize(id);
  }

  resetAllData() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.MISSIONS);
      localStorage.removeItem(STORAGE_KEYS.PRIZES);
      localStorage.removeItem(STORAGE_KEYS.PROFILE);
      localStorage.removeItem(STORAGE_KEYS.INVENTORY);
      localStorage.removeItem(STORAGE_KEYS.HISTORY);
    }
  }
}

export const api = new ArcadeApiClient();
