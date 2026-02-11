
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Heart, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Bell, 
  Coffee, 
  Moon, 
  Sparkles,
  Timer
} from 'lucide-react';
import { DailyTask, PunishmentState, TaskStatus } from './types';
import { INITIAL_TASKS, REDEMPTION_OPTIONS, PUNISHMENT_DURATION } from './constants';
import { getCurrentTimeString, isTimeAfter, getTimeRemainingSeconds, formatDuration } from './utils';

const App: React.FC = () => {
  const [tasks, setTasks] = useState<DailyTask[]>(INITIAL_TASKS);
  const [currentTime, setCurrentTime] = useState(getCurrentTimeString());
  const [punishment, setPunishment] = useState<PunishmentState>({
    isActive: false,
    timeLeft: 0,
    redemptionTask: '',
    originTaskId: null
  });
  const [lastNotificationId, setLastNotificationId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [showFinalMessage, setShowFinalMessage] = useState(false);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(getCurrentTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Handle Punishment Timer
  useEffect(() => {
    let interval: any;
    if (punishment.isActive && punishment.timeLeft > 0) {
      interval = setInterval(() => {
        setPunishment(prev => ({
          ...prev,
          timeLeft: Math.max(0, prev.timeLeft - 1)
        }));
      }, 1000);
    } else if (punishment.isActive && punishment.timeLeft === 0) {
      // Auto-finish punishment when timer ends
      finishPunishment();
    }
    return () => clearInterval(interval);
  }, [punishment.isActive, punishment.timeLeft]);

  // Logic to monitor tasks and trigger penalties/notifications
  useEffect(() => {
    const now = getCurrentTimeString();
    
    tasks.forEach(task => {
      if (task.status === 'pending') {
        const remaining = getTimeRemainingSeconds(task.endTime);
        
        // Notification logic: 10 minutes left
        if (remaining > 0 && remaining <= 600 && lastNotificationId !== task.id) {
          triggerInAppNotification(`متبقي 10 دقائق لمهمة: ${task.title}! يلا حبيبتي أسرعي! ❤️`);
          setLastNotificationId(task.id);
        }

        // Punishment logic: Time is up and not done
        if (remaining === 0 && !punishment.isActive && !isTimeAfter(task.startTime, now)) {
          triggerPunishment(task.id);
        }
      }
    });

    // Check if all tasks are completed
    const allDone = tasks.every(t => t.status === 'completed');
    if (allDone && !showFinalMessage) {
      setShowFinalMessage(true);
    }
  }, [currentTime, tasks, punishment.isActive]);

  const triggerInAppNotification = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 5000);
  };

  const triggerPunishment = (taskId: string) => {
    const randomRedemption = REDEMPTION_OPTIONS[Math.floor(Math.random() * REDEMPTION_OPTIONS.length)];
    setPunishment({
      isActive: true,
      timeLeft: PUNISHMENT_DURATION,
      redemptionTask: randomRedemption,
      originTaskId: taskId
    });
    
    setTasks(prev => prev.map(t => 
      t.id === taskId ? { ...t, status: 'missed' } : t
    ));
  };

  const finishPunishment = () => {
    setPunishment(prev => ({ ...prev, isActive: false, originTaskId: null }));
    setToast("تم إنهاء العقوبة بنجاح! يمكنك إكمال مهامك الآن ❤️");
  };

  const completeTask = (id: string) => {
    if (punishment.isActive) {
      setToast("لا يمكنك إتمام المهام حتى تنهي العقوبة أولاً! 🥺");
      return;
    }
    setTasks(prev => prev.map(t => 
      t.id === id ? { ...t, status: 'completed' } : t
    ));
    setToast("i love you benti dalo3tii ❤️");
  };

  const allTasksCompleted = tasks.every(t => t.status === 'completed');

  return (
    <div className="min-h-screen bg-zinc-950 text-pink-50 flex flex-col items-center p-4 pb-20 select-none">
      {/* Header */}
      <header className="w-full max-w-md flex flex-col items-center py-6 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="text-pink-500 animate-pulse" />
          <h1 className="text-3xl font-bold tracking-tight text-pink-500 font-romantic">DiiDii Daily Quest</h1>
          <Sparkles className="text-pink-500 animate-pulse" />
        </div>
        <div className="flex items-center gap-2 text-zinc-400 bg-zinc-900/50 px-4 py-1 rounded-full border border-zinc-800">
          <Clock size={16} />
          <span className="text-sm font-medium">{currentTime}</span>
        </div>
      </header>

      {/* Task List */}
      <main className="w-full max-w-md space-y-4 relative">
        {tasks.map((task) => (
          <div 
            key={task.id}
            className={`relative p-5 rounded-2xl border transition-all duration-300 ${
              task.status === 'completed' 
                ? 'bg-zinc-900/30 border-green-900/50 opacity-60' 
                : task.status === 'missed'
                ? 'bg-zinc-900/40 border-red-900/50'
                : 'bg-zinc-900 border-zinc-800 hover:border-pink-900/50'
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">
                {task.startTime} - {task.endTime}
              </span>
              {task.status === 'completed' && <CheckCircle className="text-green-500" size={20} />}
              {task.status === 'missed' && <AlertTriangle className="text-red-500" size={20} />}
            </div>
            
            <h3 className={`text-lg font-bold mb-4 ${task.status === 'completed' ? 'line-through text-zinc-500' : 'text-pink-100'}`}>
              {task.title}
            </h3>

            {task.status === 'pending' && (
              <button 
                onClick={() => completeTask(task.id)}
                disabled={punishment.isActive}
                className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 ${
                  punishment.isActive 
                  ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' 
                  : 'bg-pink-600 hover:bg-pink-500 text-white shadow-lg shadow-pink-900/20'
                }`}
              >
                تم الإنجاز ✨
              </button>
            )}

            {task.status === 'missed' && (
              <p className="text-xs text-red-400 text-center italic">انتهى الوقت ولم تنجز المهمة.. العقوبة بانتظارك</p>
            )}
          </div>
        ))}

        {/* Final Message Overlay */}
        {allTasksCompleted && (
          <div className="mt-12 p-8 bg-zinc-900/80 border-2 border-pink-500 rounded-3xl text-center shadow-2xl animate-bounce">
            <Heart className="mx-auto text-pink-500 fill-pink-500 mb-4" size={48} />
            <p className="text-xl font-bold text-pink-300 mb-2 leading-relaxed">
              from your lovely husband oussi kmaltihooooooooom nmot 3liiiiik benti dalo3tiiiiiiiiiiii ❤️
            </p>
            <div className="flex justify-center gap-2 mt-4">
              <Sparkles className="text-pink-400" />
              <Sparkles className="text-pink-400" />
              <Sparkles className="text-pink-400" />
            </div>
          </div>
        )}
      </main>

      {/* Punishment Overlay */}
      {punishment.isActive && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/90 backdrop-blur-md animate-in fade-in zoom-in duration-300">
          <div className="bg-zinc-900 border-2 border-red-900 p-8 rounded-[2.5rem] w-full max-w-md shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-zinc-800">
              <div 
                className="h-full bg-red-600 transition-all duration-1000 ease-linear" 
                style={{ width: `${(punishment.timeLeft / PUNISHMENT_DURATION) * 100}%` }}
              />
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-900/30 rounded-full flex items-center justify-center mb-6">
                <Timer className="text-red-500" size={32} />
              </div>
              
              <h2 className="text-2xl font-black text-red-500 mb-2">وقت العقوبة ⏳</h2>
              <p className="text-zinc-400 mb-6 text-sm">حبيبتي تأخرتي في إتمام المهمة، يجب عليك القيام بالعقوبة أو الانتظار لتتمكني من متابعة يومك.</p>

              <div className="bg-zinc-800/50 p-6 rounded-2xl border border-zinc-700 w-full mb-8">
                <p className="text-xs text-zinc-500 uppercase tracking-widest mb-2 font-bold">المهمة المطلوبة للإعفاء</p>
                <p className="text-lg font-bold text-pink-400">{punishment.redemptionTask}</p>
              </div>

              <div className="text-4xl font-mono font-bold text-white mb-8">
                {formatDuration(punishment.timeLeft)}
              </div>

              <div className="flex flex-col w-full gap-3">
                <button 
                  onClick={finishPunishment}
                  className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-4 rounded-2xl transition-all active:scale-95 shadow-lg shadow-red-900/30"
                >
                  إتمام العقوبة والعودة للمهام ✅
                </button>
                <p className="text-[10px] text-zinc-500">العقوبة تختفي تلقائياً بعد انتهاء الوقت أو بالضغط على الزر أعلاه بعد التنفيذ</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[60] animate-in slide-in-from-bottom-5 duration-300">
          <div className="bg-pink-600 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 border border-pink-400">
            <Bell size={18} />
            <span className="font-bold whitespace-nowrap">{toast}</span>
          </div>
        </div>
      )}

      {/* Decorative Bottom Bar */}
      <div className="fixed bottom-0 w-full bg-zinc-950 border-t border-zinc-800 flex justify-around items-center h-16 px-4">
        <button className="text-pink-500 p-2"><Heart size={24} fill="currentColor" /></button>
        <button className="text-zinc-500 p-2"><Coffee size={24} /></button>
        <button className="text-zinc-500 p-2"><Moon size={24} /></button>
      </div>
    </div>
  );
};

export default App;
