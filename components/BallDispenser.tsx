
import React, { useEffect, useState } from 'react';
import { getBallColor } from '../types';

interface BallDispenserProps {
  currentBall: number | null;
  isAnimating: boolean;
}

const BallDispenser: React.FC<BallDispenserProps> = ({ 
  currentBall, 
  isAnimating,
}) => {
  const [displayBall, setDisplayBall] = useState<number | null>(null);

  useEffect(() => {
    setDisplayBall(currentBall);
  }, [currentBall]);

  const ballColor = displayBall ? getBallColor(displayBall) : null;

  return (
    <div className="relative flex items-center justify-center">
      {/* The Dispenser Hole */}
      <div className="relative w-[42vw] h-[42vw] max-w-[220px] max-h-[220px] min-w-[168px] min-h-[168px] flex items-center justify-center">
        {/* The Black Background / Hole Depth */}
        <div className="absolute inset-0 bg-black rounded-full shadow-2xl border-4 border-gray-800 z-0"></div>
        {/* Inner Shadow for depth */}
        <div className="absolute inset-0 rounded-full shadow-[inset_0_10px_30px_rgba(0,0,0,0.9)] z-0 pointer-events-none"></div>

        {/* The Animated Drawn Ball or Placeholder */}
        {displayBall !== null ? (
            <div 
                key={displayBall}
                className={`
                    relative z-10 w-[95%] h-[95%] rounded-full 
                    flex items-center justify-center 
                    bingo-ball-shadow border border-white/10
                    overflow-hidden /* Mask the black patch sliding in */
                    ${isAnimating ? 'animate-ball-enter' : 'scale-100'}
                `}
                style={{ backgroundColor: ballColor?.hex }}
            >
                {/* Inner Shadow Layer for depth on the colored area */}
                <div className="absolute inset-0 rounded-full shadow-[inset_0_-35px_60px_rgba(0,0,0,0.85),inset_0_20px_40px_rgba(255,255,255,0.2)] pointer-events-none"></div>

                {/* Black Patch (Center) - Reduced size to show more color */}
                <div className={`
                    absolute w-[68%] h-[68%] bg-black rounded-full 
                    flex items-center justify-center shadow-inner
                    ${isAnimating ? 'animate-face-roll' : ''}
                `}>
                    <span className="text-[72px] sm:text-[96px] font-black text-white tracking-tighter leading-none">
                        {displayBall}
                    </span>
                    {/* Underline (White on Black) - moves with the patch */}
                    {[6,9,66,99].includes(displayBall) && (
                        <div className="absolute bottom-[15%] w-[25%] h-[3px] bg-white"></div>
                    )}
                </div>

                {/* Specular Highlight - Static relative to light source */}
                <div className="absolute top-[5%] left-1/2 -translate-x-1/2 w-[60%] h-[30%] bg-gradient-to-b from-white/80 to-transparent rounded-[50%] blur-[2px] z-20 pointer-events-none"></div>
            </div>
        ) : (
            /* Placeholder Ball (Black) with Highlight */
            <div className="relative z-10 w-[95%] h-[95%] rounded-full bg-black bingo-ball-shadow border border-white/5 overflow-hidden">
                {/* Inner Shadow Layer for depth */}
                <div className="absolute inset-0 rounded-full shadow-[inset_0_-45px_70px_rgba(0,0,0,0.95),inset_0_20px_40px_rgba(255,255,255,0.1)] pointer-events-none"></div>
                
                <div className="absolute top-[5%] left-1/2 -translate-x-1/2 w-[60%] h-[30%] bg-gradient-to-b from-white/40 to-transparent rounded-[50%] blur-[2px] z-20 pointer-events-none"></div>
            </div>
        )}
      </div>
    </div>
  );
};

export default BallDispenser;
