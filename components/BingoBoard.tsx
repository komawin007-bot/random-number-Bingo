
import React from 'react';

interface BingoBoardProps {
  totalBalls: number;
  drawnNumbers: number[];
  currentBall?: number | null;
}

const BrushX = () => {
  const style = {
    transform: 'rotate(-3deg)',
  };

  return (
    <div 
      className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
      style={style}
    >
      <svg viewBox="0 0 100 100" className="w-[92%] h-[92%] text-[#d00000] filter drop-shadow-[0_1px_1px_rgba(0,0,0,0.15)]">
        {/* Stroke 1: Top-Left to Bottom-Right */}
        {/* Main body */}
        <path 
          d="M20,30 Q35,35 50,50 T80,75" 
          stroke="currentColor" 
          strokeWidth="16" 
          strokeLinecap="round" 
          fill="none" 
          className="opacity-80"
        />
        {/* Tapered end/start */}
        <path 
          d="M18,28 Q30,32 45,45" 
          stroke="currentColor" 
          strokeWidth="6" 
          strokeLinecap="round" 
          fill="none" 
          className="opacity-40"
        />
        <path 
          d="M55,55 Q70,65 85,82" 
          stroke="currentColor" 
          strokeWidth="8" 
          strokeLinecap="round" 
          fill="none" 
          className="opacity-50"
        />
        {/* Dry brush effect */}
        <path 
          d="M25,35 L75,70" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          fill="none" 
          className="opacity-30"
        />

        {/* Stroke 2: Top-Right to Bottom-Left */}
        {/* Main body - slightly thicker and more curved */}
        <path 
          d="M82,25 Q70,40 50,55 T20,85" 
          stroke="currentColor" 
          strokeWidth="18" 
          strokeLinecap="round" 
          fill="none" 
          className="opacity-85"
        />
        {/* Bristle details */}
        <path 
          d="M85,22 Q75,35 60,50" 
          stroke="currentColor" 
          strokeWidth="5" 
          strokeLinecap="round" 
          fill="none" 
          className="opacity-40"
        />
        <path 
          d="M40,65 Q30,75 15,90" 
          stroke="currentColor" 
          strokeWidth="4" 
          strokeLinecap="round" 
          fill="none" 
          className="opacity-60"
        />
        {/* Extra splash/dryness */}
        <path 
          d="M78,28 L25,80" 
          stroke="currentColor" 
          strokeWidth="1.5" 
          strokeLinecap="round" 
          fill="none" 
          className="opacity-25"
        />
      </svg>
    </div>
  );
};

const BingoBoard: React.FC<BingoBoardProps> = ({ totalBalls, drawnNumbers, currentBall }) => {
  const gridCells = Array.from({ length: 100 }, (_, i) => i + 1);
  const drawnSet = new Set(drawnNumbers.map(Number));

  return (
    <div className="bg-black/50 rounded-[12px] shadow-[0_20px_50px_rgba(0,0,0,0.8)] border-2 border-black w-[85vw] max-w-[405px] select-none transition-all duration-500 overflow-hidden">
      <div className="grid grid-cols-10">
        {gridCells.map((num, index) => {
          const isDrawn = drawnSet.has(num);
          const isActive = num <= totalBalls;
          
          return (
            <div
              key={num}
              className="aspect-square flex items-center justify-center relative border border-black bg-[#1a1f26]/60 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]"
            >
              {isActive && (
                <>
                  <div 
                    className={`
                        w-[88%] h-[88%] rounded-full flex items-center justify-center 
                        text-sm xs:text-base sm:text-xl font-black leading-none
                        transition-all duration-300 relative overflow-hidden
                        bg-white text-black shadow-[inset_-1px_-1px_3px_rgba(0,0,0,0.3)]
                        ${isDrawn ? 'opacity-100' : 'scale-100'}
                    `}
                  >
                    <span>{num}</span>
                  </div>
                  {isDrawn && <BrushX />}
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BingoBoard;
