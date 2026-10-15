// All tuning numbers live here so balancing never touches logic code.
export const SAVE_VERSION = 2;
export const SAVE_KEY = 'virtual-cat-save';

export const START_NEED = 75;
export const START_COINS = 30;
export const MAX_OFFLINE_HOURS = 12;

// Points lost per hour (12/6h, 8/6h, 4/6h, 4/6h).
export const DECAY_PER_HOUR = { hunger: 2, energy: 8 / 6, hygiene: 4 / 6, happiness: 4 / 6 } as const;
export const SLEEP_RECOVERY_PER_HOUR = 30;

export const BATH_GAIN = 60;
export const PET_GAIN = 8;
export const PET_COOLDOWN_MS = 3000;
export const NOT_HUNGRY_ABOVE = 98; // a meal is refused above this hunger level

// Coins are only paid when the need was actually low, so spamming can't farm coins.
export const CARE_COIN_REWARD = 3;
export const REWARD_NEED_THRESHOLD = 80;

export const TICK_MS = 30_000;

// Bath: how much rubbing (in px of finger travel over the cat) fills one step.
export const BATH_STEP_GOAL = 380;
export const BATH_TAP_VALUE = 30; // dropping a tool on the cat also counts a little

// Fishing mini-game
export const FISHING_DURATION_S = 30;
export const FISHING_MAX_COINS = 15;
export const FISH_SPAWN_MS = 650;
export const FISH_MAX_ON_SCREEN = 6;

// Bubble pop mini-game
export const BUBBLE_DURATION_S = 30;
export const BUBBLE_MAX_COINS = 15;
export const BUBBLE_SPAWN_MS = 600;
export const BUBBLE_MAX_ON_SCREEN = 8;

// Memory mini-game
export const MEMORY_MAX_COINS = 12;
export const MEMORY_MIN_COINS = 3;
