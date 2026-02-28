
import React from 'react';

interface ControlsProps {
  onDraw: () => void;
  isAnimating: boolean;
}

const Controls: React.FC<ControlsProps> = ({ 
  onDraw, 
  isAnimating,
}) => {
  
  const handlePress = () => {
    // แก้ไข: สามารถกดได้ตลอดเวลาโดยไม่ต้องเช็ค isAnimating
    onDraw();
  };

  return (
    <div className="flex items-center gap-3 sm:gap-4">
          {/* Label Text */}
          <div className="text-white text-center font-roboto text-[11px] sm:text-[14px] leading-tight drop-shadow-md select-none whitespace-nowrap">
            Press button to<br/>draw ball
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
