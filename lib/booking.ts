export const BOOKING = {
  autoConfirm: true,
  slotStep: 45,           // un créneau toutes les 45 min
  minNoticeMin: 30,
  maxDaysAhead: 30,
  maxActivePerPhone: 2,
};

// Tous les services = 45 min (tu peux changer un service plus tard)
export const DURATIONS: Record<string, number> = {
  coupe: 45,
  fade: 45,
  barbe: 45,
  rasage: 45,
  "coupe-barbe": 45,
  enfant: 45,
};