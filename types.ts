
export interface BingoState {
  totalBalls: number;
  drawnNumbers: number[];
  currentBall: number | null;
  isAnimating: boolean;
}

export interface BallColor {
  bg: string;
  text: string;
  border: string;
  hex: string;
}

const RANGE_COLORS: BallColor[] = [
  // 1-10: White -> Pure White
  { bg: 'bg-white', text: 'text-black', border: 'border-white', hex: '#ffffff' },
  // 11-20: Cyan -> Neon Cyan
  { bg: 'bg-cyan-400', text: 'text-black', border: 'border-cyan-500', hex: '#00FFFF' },
  // 21-30: Pink -> Neon Magenta
  { bg: 'bg-fuchsia-500', text: 'text-white', border: 'border-fuchsia-600', hex: '#FF00FF' },
  // 31-40: Green -> Neon Lime
  { bg: 'bg-lime-500', text: 'text-black', border: 'border-lime-600', hex: '#00FF00' },
  // 41-50: Yellow -> Neon Yellow
  { bg: 'bg-yellow-400', text: 'text-black', border: 'border-yellow-500', hex: '#FFFF00' },
  // 51-60: Blue -> Neon Blue
  { bg: 'bg-blue-500', text: 'text-white', border: 'border-blue-600', hex: '#0000FF' },
  // 61-70: Red -> Neon Red
  { bg: 'bg-red-500', text: 'text-white', border: 'border-red-600', hex: '#FF0000' },
  // 71-80: Orange -> Neon Orange
  { bg: 'bg-orange-500', text: 'text-white', border: 'border-orange-600', hex: '#FF8C00' },
  // 81-90: Gray -> Bright Silver
  { bg: 'bg-gray-300', text: 'text-black', border: 'border-gray-400', hex: '#E0E0E0' },
  // 91-100: Black -> Dark Charcoal
  { bg: 'bg-gray-800', text: 'text-white', border: 'border-gray-900', hex: '#333333' },
];

export const BALL_COLORS = RANGE_COLORS;

export const getBallColor = (num: number): BallColor => {
  if (num < 1) return RANGE_COLORS[0];
  // 1-10 (Index 0) ... 91-100 (Index 9)
  const index = Math.floor((num - 1) / 10) % 10;
  return RANGE_COLORS[index];
};
