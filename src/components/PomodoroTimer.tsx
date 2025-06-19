import React, { useState, useEffect, useCallback } from 'react';
import { Play, Pause, RotateCcw, Settings as SettingsIcon, Coffee, BookOpen } from 'lucide-react';
import { useStudyData } from '../hooks/useStudyData';

type TimerPhase = 'study' | 'shortBreak' | 'longBreak';

const PomodoroTimer: React.FC = () => {
  const { settings, setSettings } = useStudyData();
  const [phase, setPhase] = useState<TimerPhase>('study');
  const [timeLeft, setTimeLeft] = useState(settings.pomodoroSettings.studyDuration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [showSettings, setShowSettings] = useState(false);

  const getPhaseSettings = useCallback(() => {
    switch (phase) {
      case 'study':
        return {
          duration: settings.pomodoroSettings.studyDuration,
          title: 'Study Time',
          color: 'blue',
          icon: BookOpen,
        };
      case 'shortBreak':
        return {
          duration: settings.pomodoroSettings.shortBreak,
          title: 'Short Break',
          color: 'green',
          icon: Coffee,
        };
      case 'longBreak':
        return {
          duration: settings.pomodoroSettings.longBreak,
          title: 'Long Break',
          color: 'purple',
          icon: Coffee,
        };
    }
  }, [phase, settings]);

  const phaseSettings = getPhaseSettings();

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // Timer finished
      if (phase === 'study') {
        setSessionsCompleted(prev => prev + 1);
        const newSessionsCompleted = sessionsCompleted + 1;
        
        if (newSessionsCompleted % settings.pomodoroSettings.longBreakInterval === 0) {
          setPhase('longBreak');
          setTimeLeft(settings.pomodoroSettings.longBreak * 60);
        } else {
          setPhase('shortBreak');
          setTimeLeft(settings.pomodoroSettings.shortBreak * 60);
        }
      } else {
        setPhase('study');
        setTimeLeft(settings.pomodoroSettings.studyDuration * 60);
      }
      setIsRunning(false);
      
      // Show notification
      if (settings.notifications.enabled) {
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification(`${phaseSettings.title} Complete!`, {
            body: phase === 'study' ? 'Time for a break!' : 'Ready to study again?',
            icon: '/vite.svg',
          });
        }
      }
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, phase, sessionsCompleted, settings, phaseSettings.title]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    if (settings.notifications.enabled && 'Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(phaseSettings.duration * 60);
  };

  const handleSkip = () => {
    setTimeLeft(0);
  };

  const getProgressPercentage = () => {
    const totalTime = phaseSettings.duration * 60;
    return ((totalTime - timeLeft) / totalTime) * 100;
  };

  const PhaseIcon = phaseSettings.icon;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Pomodoro Timer</h1>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
        >
          <SettingsIcon className="w-5 h-5" />
        </button>
      </div>

      {showSettings && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Timer Settings</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Study Duration (minutes)
              </label>
              <input
                type="number"
                min="1"
                max="60"
                value={settings.pomodoroSettings.studyDuration}
                onChange={(e) => setSettings({
                  ...settings,
                  pomodoroSettings: {
                    ...settings.pomodoroSettings,
                    studyDuration: parseInt(e.target.value),
                  }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Short Break (minutes)
              </label>
              <input
                type="number"
                min="1"
                max="30"
                value={settings.pomodoroSettings.shortBreak}
                onChange={(e) => setSettings({
                  ...settings,
                  pomodoroSettings: {
                    ...settings.pomodoroSettings,
                    shortBreak: parseInt(e.target.value),
                  }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Long Break (minutes)
              </label>
              <input
                type="number"
                min="1"
                max="60"
                value={settings.pomodoroSettings.longBreak}
                onChange={(e) => setSettings({
                  ...settings,
                  pomodoroSettings: {
                    ...settings.pomodoroSettings,
                    longBreak: parseInt(e.target.value),
                  }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Long Break Interval
              </label>
              <input
                type="number"
                min="2"
                max="10"
                value={settings.pomodoroSettings.longBreakInterval}
                onChange={(e) => setSettings({
                  ...settings,
                  pomodoroSettings: {
                    ...settings.pomodoroSettings,
                    longBreakInterval: parseInt(e.target.value),
                  }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
          </div>
        </div>
      )}

      <div className="max-w-md mx-auto">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
          <div className="mb-6">
            <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
              phaseSettings.color === 'blue' 
                ? 'bg-blue-100' 
                : phaseSettings.color === 'green'
                ? 'bg-green-100'
                : 'bg-purple-100'
            }`}>
              <PhaseIcon className={`w-8 h-8 ${
                phaseSettings.color === 'blue' 
                  ? 'text-blue-600' 
                  : phaseSettings.color === 'green'
                  ? 'text-green-600'
                  : 'text-purple-600'
              }`} />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {phaseSettings.title}
            </h2>
            <p className="text-gray-600">
              Session {sessionsCompleted + 1}
            </p>
          </div>

          <div className="relative mb-8">
            <div className={`w-32 h-32 mx-auto rounded-full border-8 ${
              phaseSettings.color === 'blue' 
                ? 'border-blue-100' 
                : phaseSettings.color === 'green'
                ? 'border-green-100'
                : 'border-purple-100'
            } relative`}>
              <div 
                className={`absolute top-0 left-0 w-full h-full rounded-full border-8 border-transparent ${
                  phaseSettings.color === 'blue'
                    ? 'border-t-blue-600'
                    : phaseSettings.color === 'green'
                    ? 'border-t-green-600'
                    : 'border-t-purple-600'
                } transition-all duration-1000`}
                style={{
                  transform: `rotate(${(getProgressPercentage() / 100) * 360}deg)`,
                }}
              ></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-gray-900">
                  {formatTime(timeLeft)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-center space-x-4 mb-6">
            {!isRunning ? (
              <button
                onClick={handleStart}
                className={`px-6 py-3 rounded-lg text-white font-medium transition-colors duration-200 ${
                  phaseSettings.color === 'blue'
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : phaseSettings.color === 'green'
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-purple-600 hover:bg-purple-700'
                } flex items-center space-x-2`}
              >
                <Play className="w-4 h-4" />
                <span>Start</span>
              </button>
            ) : (
              <button
                onClick={handlePause}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 flex items-center space-x-2"
              >
                <Pause className="w-4 h-4" />
                <span>Pause</span>
              </button>
            )}
            <button
              onClick={handleReset}
              className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          <div className="flex justify-center space-x-4 text-sm">
            <button
              onClick={handleSkip}
              className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              Skip {phaseSettings.title}
            </button>
          </div>
        </div>

        <div className="mt-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-2">Today's Progress</h3>
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Pomodoros Completed</span>
            <span className="font-medium text-gray-900">{sessionsCompleted}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PomodoroTimer;