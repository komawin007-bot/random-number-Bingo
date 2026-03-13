
import React from 'react';

interface ControlsProps {
  onDraw: () => void;
  onReset: () => void;
  isAnimating: boolean;
}

const Controls: React.FC<ControlsProps> = ({ 
  onDraw, 
  onReset,
  isAnimating,
}) => {
  
  const handlePress = () => {
    onDraw();
  };

  return (
    <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={onReset}
              className="px-5 py-1.5 bg-[#32CD32] text-white border-2 border-white rounded-lg font-bold text-[20px] tracking-wider shadow-md hover:brightness-110 active:scale-95 transition-all text-center whitespace-nowrap"
            >
              Reset Balls
            </button>
            <div className="text-white text-center font-roboto text-[11px] sm:text-[14px] leading-tight drop-shadow-md select-none whitespace-nowrap">
              Press button to<br/>draw ball
            </div>
          </div>

          <button
            onClick={handlePress}
            className={`
                w-[22vw] h-[22vw] max-w-[102px] max-h-[102px] min-w-[85px] min-h-[85px] rounded-full 
                bg-[#ff0000]
                shadow-[0_10px_20px_rgba(0,0,0,0.5),inset_0_4px_6px_rgba(255,255,255,0.8),inset_0_-4px_6px_rgba(0,0,0,0.4)]
                hover:brightness-110 hover:scale-105
                active:scale-95
                transition-all duration-150
                flex items-center justify-center
                relative
                p-1 sm:p-[5px]
                mt-8
            `}
          >
            <div className="w-full h-full rounded-full bg-[#ff0000] shadow-[inset_0_4px_6px_rgba(0,0,0,0.4),inset_0_-2px_4px_rgba(255,255,255,0.1)] flex items-center justify-center relative">
              <span className="text-white text-xl sm:text-2xl drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)] relative z-10">
                  Press
              </span>
            </div>
          </button>
      </div>
  );
};

export default Controls;
