# 🕹️ ARCADE LIFE 1984 — The 80s Retro Life RPG Cabinet

> **Hackathon Submission**: Translating mundane real-world tasks into an exhilarating virtual 80s arcade progression machine.

---

## 🌟 Hackathon Architectural Highlights

### 1. Dedicated Hackathon Project Landing Page
- **Retro Arcade Marquee**: Animated `"INSERT COIN // 2 CREDITS FREE"`, high-score banners, and neon cyber-cabinet aesthetic.
- **Interactive Live Mini-Mission Widget**: Evaluators can test the tactile arcade push-button, 8-bit sound chimes, and instant XP/Score popups directly on the landing page!
- **Hackathon Architecture Breakdown**: Explaining the 5 Life Attributes matrix, non-linear leveling math, and streak combo multipliers.
- **Seamless Transition**: One-click **[INSERT COIN (PLAY NOW)]** enters the full playable Life RPG arcade cabinet.

### 2. 80s Arcade Theme & Soulful Micro-Interactions
- **Zero-Dependency 8-Bit Chiptune Synthesizer**: Procedural square and pulse wave oscillators producing authentic retro arcade sounds:
  - 🪙 `playCoin()`: Double-frequency arcade coin chime ($987\text{ Hz} \to 1318\text{ Hz}$).
  - ⚡ `playCheckmark()`: Rapid 4-step power-up arpeggio ($C5 \to E5 \to G5 \to C6$).
  - 🔥 `playCombo()`: High-pitch laser chime on streak multiplier hits.
  - 🎺 `playLevelUp()`: Victorious 80s Stage Clear victory fanfare.
  - 🎟️ `playPurchase()`: Mechanical arcade ticket dispenser chatter.
- **CRT Scanline Monitor Filter**: Optional realistic CRT phosphor scanline & curvature vignette toggle (`[CRT: ON/OFF]`).
- **Tactile 3D Arcade Push Buttons & Floating Hit Numbers**: Spring button depression and floating `+250 PTS` / `+150 XP` combat markers.

### 3. The RPG Progression Engine
- **Non-Linear Leveling Curve**:
  $$\text{XP Required}(L) = \lfloor 100 \times L^{1.4} \rfloor$$
  Prevents early burnout while rewarding consistent long-term discipline.
- **The 5 Core Life RPG Attributes**:
  - 🧠 **INT (Intellect)**: Boosted by coding algorithms, coursework, academic reading.
  - ⚔️ **STR (Strength)**: Boosted by weightlifting, calisthenics, core conditioning.
  - ⚡ **AGI (Agility)**: Boosted by quick chores, desk organization, rapid triage.
  - 🛡️ **END (Endurance)**: Boosted by 50-minute Pomodoro study sprints, meditation.
  - 🌟 **CHA (Charisma)**: Boosted by presentations, networking, and team collaboration.
- **Streak Combo Multipliers**:
  - 3-day streak: `1.15x Score Combo`
  - 7-day streak: `1.30x Mega Combo`
  - 14-day streak: `1.50x Super Arcade Combo`!
- **Arcade Ticket Prize Counter**:
  - Earn tickets for stage completions and redeem them for guilt-free real-world rewards.

### 4. Pure React (JavaScript Only, No TypeScript, No Backend Required)
- Runs completely in-browser with instantaneous client-side persistence (`localStorage`).
- Zero network latency, zero loading lag.
- Fully accessible via keyboard (`Tab`, `Space`, `Enter`).

---

## 🚀 How to Run

```bash
# 1. Install dependencies
npm install

# 2. Run development server
npm run dev
```

Visit `http://localhost:3000` to start playing!
