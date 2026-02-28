
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
  // 1-10: White
  { bg: 'bg-white', text: 'text-black', border: 'border-gray-300', hex: '#ffffff' },
  // 11-20: Cyan
  { bg: 'bg-cyan-300', text: 'text-black', border: 'border-cyan-500', hex: '#06FFFF' },
  // 21-30: Pink (Magenta)
  { bg: 'bg-fuchsia-500', text: 'text-white', border: 'border-fuchsia-700', hex: '#F300F3' },
  // 31-40: Green (Lime)
  { bg: 'bg-lime-500', text: 'text-black', border: 'border-lime-700', hex: '#00F200' },
  // 41-50: Yellow
  { bg: 'bg-yellow-300', text: 'text-black', border: 'border-yellow-500', hex: '#FFFF0D' },
  // 51-60: Blue
  { bg: 'bg-blue-600', text: 'text-white', border: 'border-blue-800', hex: '#0000E5' },
  // 61-70: Red
  { bg: 'bg-red-600', text: 'text-white', border: 'border-red-800', hex: '#F00000' },
  // 71-80: Orange
  { bg: 'bg-orange-500', text: 'text-white', border: 'border-orange-700', hex: '#E69200' },
  // 81-90: Gray
  { bg: 'bg-gray-500', text: 'text-white', border: 'border-gray-700', hex: '#6b7280' },
  // 91-100: Black
  { bg: 'bg-black', text: 'text-white', border: 'border-gray-800', hex: '#000000' },
];

export const BALL_COLORS = RANGE_COLORS;

export const getBallColor = (num: number): BallColor => {
  if (num < 1) return RANGE_COLORS[0];
  // 1-10 (Index 0) ... 91-100 (Index 9)
  const index = Math.floor((num - 1) / 10) % 10;
  return RANGE_COLORS[index];
};
