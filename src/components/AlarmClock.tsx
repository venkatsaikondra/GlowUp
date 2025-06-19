import React from 'react';
import { format } from 'date-fns';
import { Sun, Moon } from 'lucide-react';

interface AlarmClockProps {
  progress: number;
  isActive: boolean;
  timeRemaining: number;
  phase: 'waiting' | 'sunrise' | 'alarm' | 'snooze';
}

const AlarmClock: React.FC<AlarmClockProps> = ({ 
  progress, 
  isActive, 
  timeRemaining,
  phase 
}) => {
  const currentTime = format(new Date(), 'HH:mm');
  const currentDate = format(new Date(), 'EEEE, MMMM do');

  const formatTimeRemaining = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getPhaseText = () => {
    switch (phase) {
      case 'sunrise':
        return 'Sunrise in progress...';
      case 'alarm':
        return 'Good morning!';
      case 'snooze':
        return 'Snoozing...';
      default:
        return 'Sleep well';
    }
  };

  const getPhaseIcon = () => {
    if (phase === 'sunrise' || phase === 'alarm') {
      return <Sun className="w-8 h-8 text-yellow-400 animate-pulse" />;
    }
    return <Moon className="w-8 h-8 text-blue-300" />;
  };

  return (
    <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          {getPhaseIcon()}
        </div>
        <h1 className="text-6xl md:text-8xl font-light text-white mb-2 font-mono tracking-wider">
          {currentTime}
        </h1>
        <p className="text-xl text-white/80 mb-4">
          {currentDate}
        </p>
        <p className="text-lg text-white/60">
          {getPhaseText()}
        </p>
      </div>

      {isActive && (
        <div className="w-80 h-80 relative mb-8">
          {/* Outer ring */}
          <div className="absolute inset-0 rounded-full border-4 border-white/20"></div>
          
          {/* Progress ring */}
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="2"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="url(#sunriseGradient)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 45}`}
              strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
              className="transition-all duration-1000 ease-out"
            />
            <defs>
              <linearGradient id="sunriseGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FF6B35" />
                <stop offset="50%" stopColor="#FFD700" />
                <stop offset="100%" stopColor="#FFF8DC" />
              </linearGradient>
            </defs>
          </svg>

          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-4xl font-bold text-white mb-2">
              {Math.round(progress)}%
            </div>
            {timeRemaining > 0 && (
              <div className="text-lg text-white/80">
                {formatTimeRemaining(timeRemaining)}
              </div>
            )}
          </div>
        </div>
      )}

      {!isActive && (
        <div className="w-64 h-64 rounded-full border-2 border-white/20 flex items-center justify-center mb-8">
          <div className="text-center">
            <Moon className="w-16 h-16 text-blue-300 mx-auto mb-4" />
            <p className="text-white/60">No active alarms</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlarmClock;