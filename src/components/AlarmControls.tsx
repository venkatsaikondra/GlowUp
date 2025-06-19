import React from 'react';
import { Pause, RotateCcw, Settings } from 'lucide-react';
import { AlarmState } from '../types';

interface AlarmControlsProps {
  alarmState: AlarmState;
  onSnooze: () => void;
  onStop: () => void;
  onSettings: () => void;
}

const AlarmControls: React.FC<AlarmControlsProps> = ({
  alarmState,
  onSnooze,
  onStop,
  onSettings,
}) => {
  if (!alarmState.isActive) {
    return (
      <div className="fixed bottom-8 right-8 z-20">
        <button
          onClick={onSettings}
          className="w-14 h-14 bg-white/10 backdrop-blur-lg rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition-all duration-300 shadow-lg"
        >
          <Settings className="w-6 h-6" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-20">
      <div className="flex items-center space-x-4">
        {alarmState.phase === 'alarm' && alarmState.currentAlarm?.snoozeEnabled && (
          <button
            onClick={onSnooze}
            className="w-16 h-16 bg-blue-500/80 backdrop-blur-lg rounded-full flex items-center justify-center text-white hover:bg-blue-500 transition-all duration-300 shadow-xl hover:scale-105"
          >
            <Pause className="w-8 h-8" />
          </button>
        )}
        
        <button
          onClick={onStop}
          className="w-20 h-20 bg-red-500/80 backdrop-blur-lg rounded-full flex items-center justify-center text-white hover:bg-red-500 transition-all duration-300 shadow-xl hover:scale-105"
        >
          <RotateCcw className="w-10 h-10" />
        </button>
      </div>
      
      <div className="text-center mt-4">
        <p className="text-white/80 text-sm">
          {alarmState.phase === 'alarm' && alarmState.currentAlarm?.snoozeEnabled && 'Tap to snooze • '}
          Tap stop to dismiss
        </p>
      </div>
    </div>
  );
};

export default AlarmControls;