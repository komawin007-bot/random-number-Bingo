
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import PhysicsBackground from './components/PhysicsBackground';
import BingoBoard from './components/BingoBoard';
import Controls from './components/Controls';
import BallDispenser from './components/BallDispenser';
import AdminPanel from './components/AdminPanel';
import { syncService, BingoRoomState } from './services/syncService';
import { audioService } from './services/audioService';
import { X, RotateCcw, Cloud, Wifi, Globe, ShieldCheck, ArrowRight, Settings2, Play, Sparkles, Settings, History } from 'lucide-react';
import { getBallColor } from './types';

const LandingPage: React.FC<{ onEnter: () => void }> = ({ onEnter }) => {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#5da9e9] font-roboto select-none flex flex-col">
      <div className="absolute inset-0 bg-gradient-to-b from-[#7ec4f5] to-[#4a90e2]"></div>
      <div className="absolute top-4 right-4 z-50">
          <button className="bg-white/20 p-2 rounded-xl border-2 border-white/40 text-white hover:bg-white/30 transition-colors shadow-lg">
             <div className="flex flex-col items-center">
                <Settings size={24} strokeWidth={2.5} />
                <span className="text-[10px] font-bold mt-0.5">Settings</span>
             </div>
          </button>
      </div>
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-4">
          <div className="text-center mb-6 sm:mb-12 w-full max-w-3xl">
             <p className="text-white text-xs sm:text-base font-bold mb-2 opacity-90 drop-shadow-md tracking-wide">
                This is a just for fun app and cannot guarantee the lottery numbers
             </p>
             <div className="relative inline-block scale-90 sm:scale-100">
                <h1 className="text-5xl sm:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-[#d8b4fe] to-[#7e22ce] drop-shadow-[2px_4px_0_rgba(0,0,0,0.25)] tracking-wide" style={{ WebkitTextStroke: '1.5px white', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))' }}>
                   RANDOM NUMBER
                </h1>
                <div className="flex items-center justify-end -mt-3 sm:-mt-6 gap-3 translate-x-4">
                   <span className="text-5xl sm:text-7xl font-black italic text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.3)]" style={{ fontFamily: 'cursive' }}>Suite</span>
                   <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-red-500 to-red-700 border-2 border-white flex items-center justify-center shadow-xl">
                      <span className="text-white font-bold text-lg sm:text-2xl drop-shadow-md">8</span>
                   </div>
                </div>
             </div>
             <p className="text-blue-100 text-xs sm:text-sm max-w-xl mx-auto mt-6 font-medium leading-relaxed drop-shadow-md bg-blue-900/10 p-2 rounded-lg backdrop-blur-sm">
                Click the icon you want to use to find a random number or a set of numbers or even if you want to play a game of bingo / keno
             </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 w-full max-w-5xl items-end justify-items-center">
             <div className="flex flex-col items-center opacity-70 hover:opacity-100 transition-all duration-300 scale-90 hover:scale-95 cursor-not-allowed group">
                <div className="text-white font-black text-shadow-sm mb-3 rotate-[-5deg] text-sm sm:text-lg group-hover:text-yellow-300 transition-colors" style={{ textShadow: '2px 2px 0 #000' }}>Spin The Wheel</div>
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-[3px] border-white shadow-2xl relative overflow-hidden" style={{ background: 'conic-gradient(#ef4444 0deg 60deg, #eab308 60deg 120deg, #22c55e 120deg 180deg, #3b82f6 180deg 240deg, #a855f7 240deg 300deg, #ec4899 300deg 360deg)' }}>
                   <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-4 h-4 bg-white rounded-full shadow-md"></div>
                   </div>
                </div>
                <div className="text-blue-100 text-xs font-bold mt-2 bg-black/20 px-2 py-0.5 rounded">Numbers 2 - 8</div>
             </div>
             <button 
                onClick={onEnter}
                className="col-span-2 md:col-span-1 flex flex-col items-center transform transition-all duration-300 hover:scale-110 active:scale-95 z-20 order-first md:order-none mb-6 md:mb-0"
             >
                <div className="text-white font-black text-lg sm:text-xl mb-2 -rotate-2 tracking-wide" style={{ textShadow: '2px 2px 0 #000, 0 0 10px rgba(255,255,255,0.5)' }}>Bingo and Keno</div>
                <div className="relative w-32 h-32 sm:w-36 sm:h-36 drop-shadow-2xl filter">
                   <div className="absolute top-2 left-2 w-20 h-20 bg-gradient-to-br from-red-700 to-red-900 rounded-lg transform -rotate-12 border-2 border-white/80 shadow-lg flex items-center justify-center">
                      <div className="grid grid-cols-3 gap-1 p-1 w-full h-full opacity-50">
                         {[...Array(9)].map((_,i) => <div key={i} className="bg-white rounded-[1px]"></div>)}
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center">
                         <span className="text-white/20 font-black text-4xl">B</span>
                      </div>
                   </div>
                   <div className="absolute bottom-4 left-6 w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full border-[3px] border-white shadow-[0_4px_6px_rgba(0,0,0,0.4)] flex items-center justify-center z-10">
                      <span className="text-black font-black text-2xl">12</span>
                      <div className="absolute top-2 left-2 w-4 h-3 bg-white/40 rounded-full -rotate-45 blur-[1px]"></div>
                   </div>
                   <div className="absolute bottom-6 -right-2 w-14 h-14 bg-gradient-to-br from-fuchsia-400 to-fuchsia-600 rounded-full border-[3px] border-white shadow-[0_4px_6px_rgba(0,0,0,0.4)] flex items-center justify-center z-0">
                      <span className="text-white font-black text-xl">34</span>
                   </div>
                </div>
                <div className="text-white font-bold mt-1 text-sm bg-blue-600 px-3 py-1 rounded-full border border-blue-400 shadow-lg">Numbers 1 - 99</div>
             </button>
             <div className="flex flex-col items-center opacity-70 hover:opacity-100 transition-all duration-300 scale-90 hover:scale-95 cursor-not-allowed group">
                <div className="text-white font-black text-shadow-sm mb-3 rotate-[3deg] text-sm sm:text-lg group-hover:text-yellow-300 transition-colors" style={{ textShadow: '2px 2px 0 #000' }}>Lottery</div>
                <div className="relative w-24 h-24 drop-shadow-xl">
                   <div className="absolute top-0 left-4 w-16 h-16 bg-gradient-to-br from-slate-700 to-slate-900 rounded-full border border-white/20 z-0 shadow-inner"></div>
                   <div className="absolute bottom-0 left-0 w-12 h-12 bg-cyan-400 rounded-full border-2 border-white shadow-md z-10 flex items-center justify-center text-black font-black">1</div>
                   <div className="absolute top-8 left-8 w-14 h-14 bg-red-600 rounded-full border-2 border-white shadow-md z-20 flex items-center justify-center text-white font-black text-xl">2</div>
                   <div className="absolute bottom-2 right-0 w-10 h-10 bg-green-500 rounded-full border-2 border-white shadow-md z-10 flex items-center justify-center text-black font-black">4</div>
                </div>
                <div className="text-blue-100 text-xs font-bold mt-2 bg-black/20 px-2 py-0.5 rounded">Numbers 49 - 99</div>
             </div>
             <div className="flex flex-col items-center opacity-70 hover:opacity-100 transition-all duration-300 scale-90 hover:scale-95 cursor-not-allowed group">
                <div className="text-white font-black text-shadow-sm mb-3 -rotate-[3deg] text-sm sm:text-lg group-hover:text-yellow-300 transition-colors" style={{ textShadow: '2px 2px 0 #000' }}>Random Numbers</div>
                <div className="w-24 h-16 bg-[#3b5376] rounded-lg border-2 border-white/60 grid grid-cols-3 gap-1 p-1 shadow-2xl transform rotate-6 hover:rotate-0 transition-transform">
                   {[89, 243, 62, 2, 511, 4].map((n,i) => (
                      <div key={i} className="bg-[#5a7499] rounded-[2px] flex items-center justify-center text-[8px] text-white font-bold shadow-sm">{n}</div>
                   ))}
                </div>
                <div className="text-blue-100 text-xs font-bold mt-6 bg-black/20 px-2 py-0.5 rounded">Numbers 1 - 99999</div>
             </div>
          </div>
      </div>
    </div>
  );
};

const ToolsModal: React.FC<{ 
  roomName: string | null, 
  onJoin: (name: string) => void, 
  onDisconnect: () => void,
  onClose: () => void,
  onOpenAdmin: () => void
}> = ({ roomName, onJoin, onDisconnect, onClose, onOpenAdmin }) => {
  const [inputName, setInputName] = useState('');
  const [mode, setMode] = useState<'select' | 'join'>('select');
  const [showAdmin, setShowAdmin] = useState(false);
  const tapTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [taps, setTaps] = useState(0);

  const handleJoinClick = () => { if (inputName) onJoin(inputName); };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'x' || e.key === 'X')) {
            e.preventDefault();
            setShowAdmin(prev => !prev);
        }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSecretTap = () => {
    const newTaps = taps + 1;
    if (tapTimeoutRef.current) clearTimeout(tapTimeoutRef.current);
    
    if (newTaps === 11) {
      setShowAdmin(true);
      setTaps(0);
    } else {
      setTaps(newTaps);
      tapTimeoutRef.current = setTimeout(() => {
        setTaps(0);
      }, 400);
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
      <div className="bg-slate-50 rounded-[44px] p-8 max-w-md w-full shadow-2xl relative border border-white overflow-hidden">
        <div className="flex justify-between items-start mb-6">
          <div onClick={handleSecretTap} className="cursor-pointer select-none active:scale-95 transition-transform">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">CLOUD HUB</h2>
            <p className="text-slate-500 font-bold text-sm">Real-time Connection</p>
          </div>
          <button onClick={onClose} className="p-3 bg-slate-200 text-slate-600 rounded-full hover:bg-slate-300 transition-colors">
            <X size={20} />
          </button>
        </div>

        {mode === 'select' ? (
          <div className="space-y-4">
            <button onClick={() => roomName ? onDisconnect() : setMode('join')} className={`w-full p-6 rounded-3xl border-2 flex items-center gap-5 transition-all active:scale-95 ${roomName ? 'bg-green-50 border-green-200' : 'bg-white border-slate-100 hover:border-blue-300'}`}>
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${roomName ? 'bg-green-500' : 'bg-blue-100'}`}>
                {roomName ? <Wifi className="text-white" /> : <Globe className="text-blue-600" />}
              </div>
              <div className="text-left flex-1">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{roomName ? 'CONNECTED' : 'PLAY ONLINE'}</p>
                <p className="text-lg font-black text-slate-900 leading-tight">{roomName ? roomName : 'Join Room'}</p>
              </div>
              <ArrowRight size={20} className="text-slate-300" />
            </button>
            {showAdmin && (
                <button onClick={onOpenAdmin} className="w-full p-6 rounded-3xl border-2 bg-slate-900 border-slate-800 flex items-center gap-5 transition-all active:scale-95 hover:bg-black">
                <div className="w-14 h-14 bg-yellow-400 rounded-2xl flex items-center justify-center">
                    <ShieldCheck className="text-slate-900" />
                </div>
                <div className="text-left flex-1">
                    <p className="text-xs font-black text-slate-500 uppercase tracking-widest">MASTER CONTROL</p>
                    <p className="text-lg font-black text-white leading-tight">Admin Panel</p>
                </div>
                <Settings2 size={20} className="text-slate-600" />
                </button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white p-2 rounded-[32px] shadow-inner border border-slate-100">
               <input type="text" placeholder="ROOM NAME" autoFocus value={inputName} onChange={(e) => setInputName(e.target.value.toUpperCase())} onKeyDown={(e) => e.key === 'Enter' && handleJoinClick()} className="w-full px-6 py-5 rounded-[24px] text-2xl font-black text-center focus:outline-none placeholder:text-slate-200" />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setMode('select')} className="flex-1 py-5 rounded-3xl bg-slate-200 text-slate-600 font-bold uppercase tracking-widest">Back</button>
              <button disabled={!inputName} onClick={handleJoinClick} className="flex-[2] py-5 rounded-3xl bg-blue-600 text-white font-black uppercase tracking-widest shadow-xl shadow-blue-100 disabled:opacity-50">Connect</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const Game: React.FC<{ roomName: string | null, onOpenTools: () => void }> = ({ roomName, onOpenTools }) => {
  const [totalBalls, setTotalBalls] = useState(75); 
  const [sliderValue, setSliderValue] = useState(75);
  const [drawnNumbers, setDrawnNumbers] = useState<number[]>([]);
  const [queue, setQueue] = useState<number[]>([]);
  const [currentBall, setCurrentBall] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [drawTrigger, setDrawTrigger] = useState(0);
  const [isOnline, setIsOnline] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  // สำหรับการแอบซ่อนปุ่ม Cloud Hub
  const [secretTaps, setSecretTaps] = useState(0);
  const tapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!roomName) { 
      setIsOnline(false); 
      setDrawnNumbers([]);
      setCurrentBall(null);
      return; 
    }
    syncService.joinRoom(roomName);
    const unsubscribeState = syncService.subscribe((state: BingoRoomState) => {
       setTotalBalls(state.total);
       setSliderValue(state.total);
       setDrawnNumbers(state.drawn);
       setQueue(state.queue || []);
       if (state.drawn.length > 0) {
         const lastDrawn = state.drawn[state.drawn.length - 1];
         setCurrentBall(lastDrawn);
       } else {
         setCurrentBall(null);
       }
    });
    const unsubscribeConn = syncService.subscribeConnection((connected) => {
      setIsOnline(connected);
    });
    return () => {
        unsubscribeState();
        unsubscribeConn();
        setIsOnline(false);
    }
  }, [roomName]);

  const drawBall = useCallback(async () => {
    if (drawnNumbers.length >= totalBalls) return;
    
    // Prevent drawing if we are supposed to be online but aren't connected yet
    // This prevents overwriting the server state with an empty local state
    if (roomName && !isOnline) return;

    setIsAnimating(true);
    setDrawTrigger(prev => prev + 1); 
    
    const state = syncService.getCurrentState();
    // If online, use the service state as source of truth to avoid race conditions
    const currentDrawn = roomName ? state.drawn : drawnNumbers;
    const currentQueue = roomName ? (state.queue || []) : queue;
    
    let nextNum: number | null = null;
    let updatedQueue = [...currentQueue];
    
    // Improved queue consumption: find the first number in queue that hasn't been drawn
    while (updatedQueue.length > 0) {
      const candidate = updatedQueue.shift()!;
      if (!currentDrawn.includes(candidate) && candidate <= totalBalls) {
        nextNum = candidate;
        break;
      }
    }
    
    // If no valid number in queue, pick a random one
    if (nextNum === null) {
      const available = Array.from({ length: totalBalls }, (_, i) => i + 1)
        .filter(n => !currentDrawn.includes(n));
      
      if (available.length === 0) {
        setIsAnimating(false);
        return;
      }
      nextNum = available[Math.floor(Math.random() * available.length)];
    }

    const updatedDrawnList = [...currentDrawn, nextNum!];
    setCurrentBall(nextNum);

    audioService.announceNumber(nextNum!);

    if (roomName) {
      await syncService.publishState({
        ...state,
        drawn: updatedDrawnList,
        queue: updatedQueue,
        total: totalBalls
      });
    } else {
       setDrawnNumbers(updatedDrawnList);
       setQueue(updatedQueue);
    }

    setTimeout(() => {
      setIsAnimating(false);
    }, 1600);
  }, [drawnNumbers, queue, totalBalls, roomName, isOnline]); 

  const handleReset = async () => {
    setDrawnNumbers([]);
    setQueue([]);
    setCurrentBall(null);
    setIsAnimating(false);
    setResetKey(prev => prev + 1);
    if (roomName) await syncService.resetAll(totalBalls);
  };

  const handleSliderCommit = () => {
    if (sliderValue !== totalBalls) {
      setTotalBalls(sliderValue);
      setDrawnNumbers([]);
      setQueue([]);
      setCurrentBall(null);
      setResetKey(prev => prev + 1);
      if (roomName) syncService.resetAll(sliderValue);
    }
  };

  const handleSecretTrigger = () => {
    const next = secretTaps + 1;
    if (tapTimerRef.current) clearTimeout(tapTimerRef.current);
    
    if (next >= 5) {
      onOpenTools();
      setSecretTaps(0);
    } else {
      setSecretTaps(next);
      tapTimerRef.current = setTimeout(() => {
        setSecretTaps(0);
      }, 1000);
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden text-gray-900 select-none font-roboto bg-[#235BA0]">
      <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#87BAF8] to-[#235BA0]"></div>
          {/* Background Stars - Top/Mid */}
          <div className="absolute inset-0 opacity-[0.12] pointer-events-none">
            {/* Top Left */}
            <svg className="absolute top-[2%] left-[8%] w-48 h-48 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
            {/* Top Center-Right */}
            <svg className="absolute top-[-10%] left-[45%] w-[400px] h-[400px] text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
            {/* Top Right - Adjusted to be half-visible */}
            <svg className="absolute top-[0%] -right-[175px] w-[350px] h-[350px] text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
            {/* Mid Left (below board) */}
            <svg className="absolute top-[55%] left-[18%] w-32 h-32 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
          </div>
          {/* Background Stars - Bottom (Clearer) */}
          <div className="absolute inset-0 opacity-[0.25] pointer-events-none">
            {/* Bottom Left */}
            <svg className="absolute bottom-[-22%] left-[-15%] w-[480px] h-[480px] text-white animate-star-swing" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
            {/* Bottom Center */}
            <svg className="absolute bottom-[5%] left-[30%] w-20 h-20 text-white animate-star-swing" style={{ animationDelay: '-2s' }} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
            {/* Bottom Right */}
            <svg className="absolute bottom-[-15%] right-[5%] w-[500px] h-[500px] text-white animate-star-swing" style={{ animationDelay: '-4s' }} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
          </div>
      </div>
      <div className="absolute bottom-0 w-full bg-[#235BA0]/70 backdrop-blur-[2px] z-[5] pointer-events-none border-t-2 border-black shadow-[inset_0_0.5px_0_rgba(255,255,255,0.8),inset_0_2px_0_black,inset_0_10px_20px_rgba(0,0,0,0.75)]" style={{ height: '38%' }} />

      <div className="absolute inset-0 z-10 pointer-events-none"> 
        <PhysicsBackground key={resetKey} totalBalls={sliderValue} triggerPulse={drawTrigger} drawnNumbers={drawnNumbers} /> 
      </div>
      
      <div className="relative z-30 w-full h-full flex flex-col p-4">
        <div className="absolute top-4 right-4 flex gap-2 z-50">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                handleReset();
              }} 
              className="bg-red-600/90 text-white rounded-full w-10 h-10 flex items-center justify-center border border-white/20 shadow-lg hover:bg-red-700 active:scale-90 transition-all pointer-events-auto"
            > 
              <X size={22} strokeWidth={3} /> 
            </button>
        </div>
        
        <div className="absolute top-[2vh] left-[2vw] z-40 scale-[0.7] sm:scale-90 md:scale-100 origin-top-left"> 
          <BingoBoard totalBalls={sliderValue} drawnNumbers={drawnNumbers} currentBall={currentBall} /> 
        </div>
        
        <div className="absolute top-[62%] left-[4vw] translate-y-[-10px] z-40 w-[220px] sm:w-60 flex flex-col items-center scale-[0.8] sm:scale-100 origin-left">
            <div className="relative w-full h-12 flex items-center justify-center">
                <div className="absolute w-full h-3 bg-[#235BA0] rounded-full shadow-[inset_0_3px_4px_rgba(0,0,0,0.5)] border border-black/20"></div>
                <input type="range" min="49" max="99" value={sliderValue} onChange={(e) => setSliderValue(parseInt(e.target.value))} onMouseUp={handleSliderCommit} onTouchEnd={handleSliderCommit} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />
                <div className="absolute h-10 w-10 bg-white rounded-full flex items-center justify-center pointer-events-none z-10 shadow-[0_5px_15px_rgba(0,0,0,0.7)]" style={{ left: `${((sliderValue - 49) / 50) * 100}%`, transform: `translateX(-50%)` }}> 
                    <span className="text-black font-bold text-lg leading-none">{sliderValue}</span> 
                </div>
            </div>
            <p 
              onClick={handleSecretTrigger}
              className="text-white/70 text-[14px] sm:text-[20px] font-medium mt-2 text-center leading-tight cursor-default active:text-white/40 transition-colors"
            >
              Drag above disc to select<br/>
              how many balls to use
            </p>
        </div>

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="relative w-full h-full pointer-events-auto">
                <div className="absolute top-[62%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 scale-[0.8] sm:scale-100"> <BallDispenser currentBall={currentBall} isAnimating={isAnimating} /> </div>
                <div className="absolute top-[62%] right-[22vw] sm:right-[102px] translate-y-0 z-30 scale-[0.8] sm:scale-100 origin-right"> <Controls onDraw={drawBall} isAnimating={isAnimating} /> </div>
            </div>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [route, setRoute] = useState(''); 
  const [roomName, setRoomName] = useState<string | null>(localStorage.getItem('bingo_room'));
  const [showTools, setShowTools] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);

  useEffect(() => {
    if (window.location.hash === '#/admin') {
       const url = window.location.href.split('#')[0];
       window.history.replaceState(null, '', url);
    }
    const handleHashChange = () => setRoute(window.location.hash);
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleJoin = (name: string) => { 
      setRoomName(name); 
      localStorage.setItem('bingo_room', name); 
      setShowTools(false);
      audioService.resume();
  };
  const handleDisconnect = () => { 
      setRoomName(null); 
      localStorage.removeItem('bingo_room'); 
      setShowTools(false); 
      syncService.leaveRoom();
  };
  const handleOpenAdmin = () => { 
      setShowTools(false); 
      window.location.hash = '#/admin'; 
  };
  const handleEnterGame = () => {
      audioService.resume();
      setHasEntered(true);
  };

  if (route === '#/admin') {
      return <AdminPanel initialRoomName={roomName} onBack={() => window.location.hash = ''} />;
  }
  if (!hasEntered) {
      return <LandingPage onEnter={handleEnterGame} />;
  }
  return (
    <>
      <Game roomName={roomName} onOpenTools={() => setShowTools(true)} />
      {showTools && (
        <ToolsModal roomName={roomName} onJoin={handleJoin} onDisconnect={handleDisconnect} onClose={() => setShowTools(false)} onOpenAdmin={handleOpenAdmin} />
      )}
    </>
  );
};

export default App;
