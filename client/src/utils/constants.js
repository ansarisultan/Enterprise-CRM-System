export const LEAD_STATUSES = {
  NEW: 'New',
  CONTACTED: 'Contacted',
  QUALIFIED: 'Qualified',
  WON: 'Won',
  LOST: 'Lost',
};

export const STATUS_COLORS = {
  [LEAD_STATUSES.NEW]: {
    bg: 'bg-blue-500/20',
    text: 'text-blue-400',
    border: 'border-blue-500/20',
  },
  [LEAD_STATUSES.CONTACTED]: {
    bg: 'bg-yellow-500/20',
    text: 'text-yellow-400',
    border: 'border-yellow-500/20',
  },
  [LEAD_STATUSES.QUALIFIED]: {
    bg: 'bg-purple-500/20',
    text: 'text-purple-400',
    border: 'border-purple-500/20',
  },
  [LEAD_STATUSES.WON]: {
    bg: 'bg-green-500/20',
    text: 'text-green-400',
    border: 'border-green-500/20',
  },
  [LEAD_STATUSES.LOST]: {
    bg: 'bg-red-500/20',
    text: 'text-red-400',
    border: 'border-red-500/20',
  },
};

export const APP_VERSION = '1.0';
