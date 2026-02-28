
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Trash2, ShieldCheck, ArrowRight, X, Trophy, ListOrdered, Send, UserCheck } from 'lucide-react';
import { syncService, BingoRoomState } from '../services/syncService';

interface AdminPanelProps {
  initialRoomName: string | null;
  onBack: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ initialRoomName, onBack }) => {
  const [roomName, setRoomName] = useState<string | null>(initialRoomName);
  const [tempRoomName, setTempRoomName] = useState('');
  const [lockedQueue, setLockedQueue] = useState<number[]>([]);
  const [drawnNumbers, setDrawnNumbers] = useState<number[]>([]);
  const [totalBalls, setTotalBalls] = useState(75);
  const [isOnline, setIsOnline] = useState(false);
  const [showSettings, setShowSettings] = useState(!initialRoomName);
  
  // RIGWINNER States
  const [isRigOpen, setIsRigOpen] = useState(false);
  const [rigInput, setRigInput] = useState('');

  useEffect(() => {
    if (!roomName) return;
    
    syncService.joinRoom(roomName);

    const unsubscribeState = syncService.subscribe((state: BingoRoomState) => {
        setDrawnNumbers(state.drawn || []);
        setLockedQueue(state.queue || []);
        setTotalBalls(state.total || 75);
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

  const handleToggleQueue = async (num: number) => {
    if (drawnNumbers.includes(num) || num > totalBalls) return;

    const state = syncService.getCurrentState();
    let newQueue = [...(state.queue || [])];

    if (newQueue.includes(num)) {
        newQueue = newQueue.filter(n => n !== num);
    } else {
        newQueue.push(num);
    }

    await syncService.updateQueue(newQueue);
  };

  const shuffle = <T,>(array: T[]): T[] => {
    const newArr = [...array];
    for (let i = newArr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
  };

  const handleRigForWinner = async (winnerIdx: number) => {
    // ชุดตัวเลขผู้ชนะคนที่ n คือ n, n+25, n+50
    const winSet = [winnerIdx, winnerIdx + 25, winnerIdx + 50];
    
    // สุ่มความยาวคิว 20 - 40
    const seqLength = Math.floor(Math.random() * (40 - 20 + 1)) + 20;
    
    // เตรียมเลขทั้งหมด (1-75)
    const allBalls = Array.from({ length: 75 }, (_, i) => i + 1);
    
    // แยกเลขผู้ชนะออกจากเลขอื่น
    const otherBalls = allBalls.filter(b => !winSet.includes(b));
    let shuffledOthers = shuffle(otherBalls);
    
    // สร้างคิวตัวเติม (Filler) 
    // เราต้องระวังไม่ให้เลขคนอื่นออกครบ 3 ตัว (m, m+25, m+50)
    const fillers: number[] = [];
    const setCounts: Record<number, number> = {};
    
    for (const b of shuffledOthers) {
        if (fillers.length >= seqLength - 3) break;
        
        // ตรวจสอบว่าเลขนี้จะทำให้ใครคนอื่นชนะไหม
        const setIdx = b > 50 ? b - 50 : b > 25 ? b - 25 : b;
        const currentCount = setCounts[setIdx] || 0;
        
        if (currentCount < 2) { // ให้คนอื่นออกได้ไม่เกิน 2 ตัวในเซ็ตของเขา
            fillers.push(b);
            setCounts[setIdx] = currentCount + 1;
        }
    }

    // สุ่มเลือกเลข 1 ตัวจากชุดชนะเพื่อไปเป็นตัวปิดเกม (Winning Ball)
    const winBallsShuffled = shuffle(winSet);
    const winningBall = winBallsShuffled[0];
    const internalWinners = [winBallsShuffled[1], winBallsShuffled[2]];
    
    // ผสมเลขภายในคิว (ยกเว้นตัวสุดท้าย)
    const queueBeforeEnd = shuffle([...fillers, ...internalWinners]);
    const finalQueue = [...queueBeforeEnd, winningBall];

    await syncService.updateQueue(finalQueue);
    setIsRigOpen(false);
  };

  const handleApplyRigManual = async () => {
    const nums = rigInput
      .split(/[\s,]+/)
      .map(n => parseInt(n.trim()))
      .filter(n => !isNaN(n) && n > 0 && n <= totalBalls && !drawnNumbers.includes(n));
    
    if (nums.length > 0) {
      await syncService.updateQueue(nums);
      setRigInput('');
      setIsRigOpen(false);
    }
  };

  const clearQueue = async () => {
      await syncService.updateQueue([]);
  };

  const joinRoom = () => {
      if (!tempRoomName) return;
      setRoomName(tempRoomName);
      localStorage.setItem('bingo_room', tempRoomName);
      setShowSettings(false);
  };

  if (showSettings || !roomName) {
      return (
          <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 text-white font-roboto">
              <div className="bg-white rounded-[40px] p-10 max-w-md w-full text-center shadow-2xl">
                  <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-200"> <ShieldCheck size={40} className="text-white" /> </div>
                  <h2 className="text-3xl font-black text-slate-900 mb-2">MASTER SETUP</h2>
                  <div className="bg-slate-50 p-2 rounded-3xl border border-slate-100 mb-6">
                    <input type="text" placeholder="ROOM NAME" autoFocus value={tempRoomName} onChange={(e) => setTempRoomName(e.target.value.toUpperCase())} onKeyDown={(e) => e.key === 'Enter' && joinRoom()} className="w-full px-6 py-5 rounded-2xl text-2xl font-black text-slate-900 text-center focus:outline-none placeholder:text-slate-200" />
                  </div>
                  <div className="flex gap-3">
                      <button onClick={onBack} className="flex-1 py-4 bg-slate-100 text-slate-400 font-bold rounded-2xl">EXIT</button>
                      <button onClick={joinRoom} disabled={!tempRoomName} className="flex-[2] py-4 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-100 disabled:opacity-50"> JOIN ADMIN </button>
                  </div>
              </div>
          </div>
      );
  }
  
  return (
    <div className="h-screen w-screen bg-[#0f172a] text-white font-roboto flex flex-col overflow-hidden">
      <header className="bg-slate-900/90 backdrop-blur-xl p-4 border-b border-white/5 z-50 flex-shrink-0">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
                <button onClick={onBack} className="p-3 bg-slate-800 rounded-2xl hover:bg-slate-700 transition-all text-slate-400"> <ArrowLeft size={20} /> </button>
                <div>
                    <h1 className="text-xl font-black flex items-center gap-2 tracking-tight"> <span className="bg-yellow-400 text-slate-900 px-2 py-0.5 rounded text-[10px] font-black uppercase">Admin</span> {roomName} </h1>
                    <div className="flex items-center gap-2 text-[10px] uppercase font-black tracking-widest opacity-60"> 
                      {isOnline ? <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /> : <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />} 
                      <span>{isOnline ? 'Connected' : 'Syncing...'}</span> 
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <button 
                  onClick={() => setIsRigOpen(true)}
                  className="bg-yellow-400 text-slate-900 px-4 py-2.5 rounded-xl font-black flex items-center gap-2 hover:bg-yellow-300 transition-all shadow-lg active:scale-95"
                >
                  <Trophy size={18} />
                  <span className="hidden sm:inline">RIG WINNER</span>
                </button>

                <div className={`flex items-center gap-4 px-4 py-2 rounded-2xl border transition-all ${lockedQueue.length > 0 ? 'bg-blue-600/10 border-blue-500/40' : 'bg-slate-800/50 border-white/5'}`}>
                    <div className="flex flex-col hidden sm:flex">
                        <span className="text-[10px] uppercase font-black text-slate-500 tracking-widest"> Sequence ({lockedQueue.length}) </span>
                        <div className="flex items-center gap-2 text-lg font-black text-blue-400 max-w-[150px] overflow-x-auto no-scrollbar">
                            {lockedQueue.length > 0 ? lockedQueue.map((num, i) => ( <span key={i} className="flex items-center"> {num}{i < lockedQueue.length - 1 && <ArrowRight size={14} className="mx-1 opacity-40 text-white" />} </span> )) : <span className="text-slate-700 italic text-sm">Empty</span>}
                        </div>
                    </div>
                    {lockedQueue.length > 0 && ( <button onClick={clearQueue} className="bg-red-500/20 text-red-400 p-2.5 rounded-xl border border-red-500/30 hover:bg-red-500 hover:text-white transition-all"> <Trash2 size={18} /> </button> )}
                </div>
            </div>
        </div>
      </header>
      
      <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 bg-[#0f172a]">
        <div className="max-w-6xl mx-auto h-full">
            <div className="overflow-x-auto h-full pb-10">
                <div 
                className="grid grid-flow-col grid-rows-[repeat(25,minmax(0,1fr))] gap-2 sm:gap-3 min-w-[600px] md:min-w-full"
                style={{ gridAutoColumns: 'minmax(0, 1fr)' }}
                >
                    {Array.from({ length: 100 }, (_, i) => i + 1).map((num) => {
                        const isDrawn = drawnNumbers.includes(num);
                        const isOutOfRange = num > totalBalls;
                        const qIdx = lockedQueue.indexOf(num);
                        const isInQ = qIdx !== -1;
                        
                        return (
                            <button 
                            key={num} 
                            onClick={() => handleToggleQueue(num)} 
                            disabled={isDrawn || isOutOfRange} 
                            className={`relative h-12 sm:h-14 rounded-xl sm:rounded-[20px] font-black text-lg sm:text-xl flex flex-col items-center justify-center transition-all 
                                ${isDrawn ? 'bg-slate-800/40 text-slate-700 border border-transparent cursor-not-allowed opacity-50' 
                                : isOutOfRange ? 'bg-slate-900/60 text-slate-800 border border-white/5 cursor-not-allowed grayscale pointer-events-none'
                                : isInQ ? 'bg-blue-600 text-white ring-4 ring-blue-500/40 scale-105 z-10 border-2 border-white/20 shadow-lg' 
                                : 'bg-white text-slate-900 hover:bg-slate-100 shadow-sm border-b-4 border-slate-200 active:border-b-0 active:translate-y-1'
                                }`}>
                                {num}
                                {isInQ && ( <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 text-slate-900 text-[9px] font-black rounded-full flex items-center justify-center border-2 border-[#0f172a] shadow-md"> {qIdx + 1} </div> )}
                                {isDrawn && <div className="absolute inset-0 flex items-center justify-center"><X size={20} className="text-red-500/20" /></div>}
                                {isOutOfRange && <div className="absolute inset-0 flex items-center justify-center opacity-10"><ShieldCheck size={24} /></div>}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
      </main>

      {/* RIGWINNER MODAL */}
      {isRigOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-6">
          <div className="bg-white rounded-[40px] p-6 sm:p-8 max-w-2xl w-full shadow-2xl overflow-hidden relative max-h-[90vh] flex flex-col">
            <button 
              onClick={() => setIsRigOpen(false)}
              className="absolute top-6 right-6 p-2 bg-slate-100 text-slate-400 rounded-full hover:bg-slate-200 transition-colors z-10"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-yellow-400 rounded-2xl flex items-center justify-center shadow-lg shadow-yellow-100">
                <Trophy size={28} className="text-slate-900" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900 leading-tight tracking-tight uppercase">Master Rigging</h3>
                <p className="text-slate-400 font-bold text-sm tracking-wide">SELECT WINNER OR CUSTOM SEQUENCE</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-8">
              {/* Quick Rig Grid */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                    <UserCheck size={18} className="text-blue-500" />
                    <h4 className="font-black text-slate-900 uppercase text-sm tracking-widest">Select Winner (1-25)</h4>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {Array.from({ length: 25 }, (_, i) => i + 1).map((n) => (
                    <button
                      key={n}
                      onClick={() => handleRigForWinner(n)}
                      className="aspect-square bg-slate-50 border-2 border-slate-100 rounded-2xl flex flex-col items-center justify-center group hover:bg-blue-600 hover:border-blue-500 transition-all active:scale-90"
                    >
                      <span className="text-[10px] font-black text-slate-300 group-hover:text-blue-200 uppercase">Winner</span>
                      <span className="text-xl font-black text-slate-900 group-hover:text-white leading-none">{n}</span>
                    </button>
                  ))}
                </div>
                <p className="mt-3 text-[10px] text-slate-400 font-bold bg-slate-50 p-2 rounded-lg border border-slate-100 italic">
                  * System will auto-generate 20-40 balls sequence ending with winner set numbers.
                </p>
              </section>

              {/* Manual Rig */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                    <ListOrdered size={18} className="text-slate-400" />
                    <h4 className="font-black text-slate-900 uppercase text-sm tracking-widest">Custom Sequence</h4>
                </div>
                <div className="bg-slate-50 p-6 rounded-[32px] border border-slate-100 mb-4">
                  <textarea 
                    placeholder="Enter numbers manually: 1 23 45..."
                    value={rigInput}
                    onChange={(e) => setRigInput(e.target.value)}
                    className="w-full bg-transparent text-xl font-black text-slate-900 focus:outline-none placeholder:text-slate-200 resize-none h-24"
                  />
                </div>
                <button 
                  onClick={handleApplyRigManual}
                  disabled={!rigInput.trim()}
                  className="w-full py-5 rounded-3xl bg-slate-900 text-yellow-400 font-black uppercase tracking-widest shadow-xl shadow-slate-200 flex items-center justify-center gap-3 active:scale-95 transition-all disabled:opacity-50"
                >
                  <Send size={20} />
                  Inject Custom Sequence
                </button>
              </section>
            </div>
            
            <div className="mt-6 pt-6 border-t border-slate-100">
                <button 
                  onClick={() => setIsRigOpen(false)}
                  className="w-full py-4 rounded-2xl bg-slate-100 text-slate-400 font-black uppercase tracking-widest active:scale-95 transition-all text-sm"
                >
                  Cancel
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default AdminPanel;
