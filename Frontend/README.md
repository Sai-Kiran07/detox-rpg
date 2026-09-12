# Frontend - Life RPG

This README documents the **frontend-only** work completed in `/Frontend`.

## What was changed

### 1) Authentication & session security (frontend gate)
- Added login/signup screen: [`AuthView.jsx`](/home/sidhu/Desktop/unstop/detox-rpg/Frontend/src/components/Auth/AuthView.jsx)
- Added session handling in [`GameContext.jsx`](/home/sidhu/Desktop/unstop/detox-rpg/Frontend/src/context/GameContext.jsx)
  - account storage
  - tokenized session object
  - per-user isolated game data keys
  - logout flow
- Added password rules and auth error handling.

### 2) Quest / Task management
- Full quest CRUD + completion remains available and was refactored:
  - create/edit modal: [`QuestModal.jsx`](/home/sidhu/Desktop/unstop/detox-rpg/Frontend/src/components/QuestBoard/QuestModal.jsx)
  - list/search/filter UI: [`QuestList.jsx`](/home/sidhu/Desktop/unstop/detox-rpg/Frontend/src/components/QuestBoard/QuestList.jsx)
  - completion card interactions: [`QuestCard.jsx`](/home/sidhu/Desktop/unstop/detox-rpg/Frontend/src/components/QuestBoard/QuestCard.jsx)
- Added explicit validation errors for invalid form input.

### 3) RPG progression engine
- Kept and enforced non-linear leveling:
  - `XP Required(level) = floor(100 * level^1.4)`
- Level-up rewards are now coin-based and shown in modal.
- Updated progression summaries in [`StatsView.jsx`](/home/sidhu/Desktop/unstop/detox-rpg/Frontend/src/components/Stats/StatsView.jsx).

### 4) Streak system
- Implemented real daily streak progression based on completion date.
- Added streak bonus coins for sustained consistency.
- Combo multiplier and streak status are reflected in navbar + stats.

### 5) Character attributes (required set)
- Migrated to required attributes:
  - Strength (STR)
  - Intelligence (INT)
  - Wisdom (WIS)
  - Discipline (DIS)
  - Creativity (CRE)
- Added config source: [`gameConfig.js`](/home/sidhu/Desktop/unstop/detox-rpg/Frontend/src/constants/gameConfig.js)
- Added legacy attribute migration support for older saved data.

### 6) Rewards & economy
- Converted economy from tickets to coins across core gameplay.
- Shop now supports reward types: virtual item / badge / theme.
- Updated reward creation and buying flows:
  - [`ShopList.jsx`](/home/sidhu/Desktop/unstop/detox-rpg/Frontend/src/components/Shop/ShopList.jsx)
  - [`AddItemModal.jsx`](/home/sidhu/Desktop/unstop/detox-rpg/Frontend/src/components/Shop/AddItemModal.jsx)

### 7) History & progress tracking
- Added new timeline screen:
  - [`HistoryView.jsx`](/home/sidhu/Desktop/unstop/detox-rpg/Frontend/src/components/History/HistoryView.jsx)
- Tracks:
  - quest completion events
  - purchase events
  - coin deltas per event

### 8) Responsive + accessibility improvements
- Added skip link, keyboard focus styling, screen-reader helper class, and semantic nav landmarks.
- Added responsive layout classes for sidebar, content, forms, and dashboard cards.
- Added modal dialog semantics (`role="dialog"`, `aria-modal`) and Escape close behavior.
- Added SEO metadata in [`index.html`](/home/sidhu/Desktop/unstop/detox-rpg/Frontend/index.html).
- Styling updates in [`index.css`](/home/sidhu/Desktop/unstop/detox-rpg/Frontend/src/index.css).

## Updated main wiring
- App shell and routing updates in [`App.jsx`](/home/sidhu/Desktop/unstop/detox-rpg/Frontend/src/App.jsx)
- Sidebar/navigation updates in [`Navbar.jsx`](/home/sidhu/Desktop/unstop/detox-rpg/Frontend/src/components/Navbar.jsx)

## Checklist mapping

- [x] Authentication & Security (frontend auth/session gate, per-user isolation)
- [x] Quest management (create/view/edit/delete/complete)
- [x] RPG progression (non-linear level curve)
- [x] Streak system (daily streak + streak bonus)
- [x] Character attributes (STR/INT/WIS/DIS/CRE)
- [x] Rewards & economy (coin earn + spend in shop for virtual rewards)
- [x] History tracking (timeline of quest and purchase actions)
- [x] Responsive and keyboard/screen-reader accessibility improvements

## Run

```bash
npm install
npm run dev
```

Build check:

```bash
npm run build
```
