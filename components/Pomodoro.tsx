
import React, { useState, useEffect, useCallback, useRef } from 'react';

const POMODORO = 25 * 60;
const SHORT_BREAK = 5 * 60;
const LONG_BREAK = 15 * 60;

enum Mode {
  Pomodoro = 'POMODORO',
  ShortBreak = 'SHORT_BREAK',
  LongBreak = 'LONG_BREAK',
}

const Pomodoro: React.FC = () => {
    const [mode, setMode] = useState<Mode>(Mode.Pomodoro);
    const [time, setTime] = useState(POMODORO);
    const [isActive, setIsActive] = useState(false);
    // Fix: Use ReturnType<typeof setInterval> for browser compatibility instead of NodeJS.Timeout
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const timeForMode = (currentMode: Mode) => {
        switch (currentMode) {
            case Mode.Pomodoro: return POMODORO;
            case Mode.ShortBreak: return SHORT_BREAK;
            case Mode.LongBreak: return LONG_BREAK;
        }
    };

    useEffect(() => {
        if (isActive) {
            intervalRef.current = setInterval(() => {
                setTime(prev => prev > 0 ? prev - 1 : 0);
            }, 1000);
        } else {
            if(intervalRef.current) clearInterval(intervalRef.current);
        }

        return () => {
            if(intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isActive]);

    useEffect(() => {
        if (time === 0) {
            setIsActive(false);
            // Optionally add sound notification here
        }
    }, [time]);
    
    const switchMode = useCallback((newMode: Mode) => {
        setIsActive(false);
        setMode(newMode);
        setTime(timeForMode(newMode));
    }, []);

    const toggleTimer = () => {
        setIsActive(!isActive);
    };
    
    const resetTimer = () => {
        setIsActive(false);
        setTime(timeForMode(mode));
    }

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };
    
    const modeLabels: Record<Mode, string> = {
        [Mode.Pomodoro]: 'مطالعه',
        [Mode.ShortBreak]: 'استراحت کوتاه',
        [Mode.LongBreak]: 'استراحت طولانی',
    }

    return (
        <div className="flex flex-col items-center justify-center h-full">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg text-center">
                <div className="flex justify-center space-x-2 space-x-reverse mb-8">
                    {Object.values(Mode).map(m => (
                        <button 
                            key={m}
                            onClick={() => switchMode(m)}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${mode === m ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                        >
                            {modeLabels[m]}
                        </button>
                    ))}
                </div>

                <div className="my-10">
                    <p className="text-8xl font-bold tracking-tighter text-gray-800">{formatTime(time)}</p>
                </div>

                <div className="flex justify-center space-x-4 space-x-reverse">
                    <button
                        onClick={toggleTimer}
                        className="w-32 px-6 py-3 text-xl font-bold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 transition-transform transform hover:scale-105"
                    >
                        {isActive ? 'توقف' : 'شروع'}
                    </button>
                    <button
                        onClick={resetTimer}
                        className="w-32 px-6 py-3 text-xl font-bold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                        شروع مجدد
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Pomodoro;