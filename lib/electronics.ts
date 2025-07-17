
export type ColorCode = {
  color: string;
  name: string;
  digit: number | null;
  multiplier: number | null;
  tolerance: number | null;
  tcr: number | null; // Temperature Coefficient
};

export const RESISTOR_COLORS: Record<string, ColorCode> = {
  none: { color: '#D1D5DB', name: 'None', digit: null, multiplier: null, tolerance: 20, tcr: null },
  silver: { color: '#C0C0C0', name: 'Silver', digit: null, multiplier: 0.01, tolerance: 10, tcr: null },
  gold: { color: '#FFD700', name: 'Gold', digit: null, multiplier: 0.1, tolerance: 5, tcr: null },
  black: { color: '#333333', name: 'Black', digit: 0, multiplier: 1, tolerance: null, tcr: 250 },
  brown: { color: '#A52A2A', name: 'Brown', digit: 1, multiplier: 10, tolerance: 1, tcr: 100 },
  red: { color: '#FF0000', name: 'Red', digit: 2, multiplier: 100, tolerance: 2, tcr: 50 },
  orange: { color: '#FFA500', name: 'Orange', digit: 3, multiplier: 1000, tolerance: 0.05, tcr: 15 },
  yellow: { color: '#EAB308', name: 'Yellow', digit: 4, multiplier: 10000, tolerance: 0.02, tcr: 25 },
  green: { color: '#22C55E', name: 'Green', digit: 5, multiplier: 100000, tolerance: 0.5, tcr: 20 },
  blue: { color: '#3B82F6', name: 'Blue', digit: 6, multiplier: 1000000, tolerance: 0.25, tcr: 10 },
  violet: { color: '#8B5CF6', name: 'Violet', digit: 7, multiplier: 10000000, tolerance: 0.1, tcr: 5 },
  grey: { color: '#6B7280', name: 'Grey', digit: 8, multiplier: 100000000, tolerance: 0.01, tcr: 1 },
  white: { color: '#F9FAFB', name: 'White', digit: 9, multiplier: 1000000000, tolerance: null, tcr: null },
};
