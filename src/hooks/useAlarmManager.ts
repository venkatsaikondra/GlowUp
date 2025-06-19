import { useState, useEffect, useCallback } from 'react';
import { Alarm, AlarmState, SunriseSettings } from '../types';
import { useLocalStorage } from './useLocalStorage';
import { format, isToday, addMinutes, differenceInMinutes } from 'date-fns';

const defaultSettings: SunriseSettings = {
  theme: 'warm',
  customColors: {
    start: '#1a1a2e',
    middle: '#FF6B35',
    end: '#FFD700',
  },
  brightness: {
    start: 0,
    end: 100,
  },
  smartHomeEnabled: false,
  smartHomeDevices: [],
};

export function useAlarmManager() {
  const [alarms, setAlarms] = useLocalStorage<Alarm[]>('sunrise-alarms', []);
  const [settings, setSettings] = useLocalStorage<SunriseSettings>('sunrise-settings', defaultSettings);
  const [alarmState, setAlarmState] = useState<AlarmState>({
    isActive: false,
    sunriseProgress: 0,
    timeRemaining: 0,
    phase: 'waiting',
  });

  const addAlarm = useCallback((alarm: Omit<Alarm, 'id' | 'createdAt'>) => {
    const newAlarm: Alarm = {
      ...alarm,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setAlarms(prev => [...prev, newAlarm]);
  }, [setAlarms]);

  const updateAlarm = useCallback((id: string, updates: Partial<Alarm>) => {
    setAlarms(prev => prev.map(alarm => 
      alarm.id === id ? { ...alarm, ...updates } : alarm
    ));
  }, [setAlarms]);

  const deleteAlarm = useCallback((id: string) => {
    setAlarms(prev => prev.filter(alarm => alarm.id !== id));
  }, [setAlarms]);

  const toggleAlarm = useCallback((id: string) => {
    setAlarms(prev => prev.map(alarm => 
      alarm.id === id ? { ...alarm, enabled: !alarm.enabled } : alarm
    ));
  }, [setAlarms]);

  const getNextAlarm = useCallback(() => {
    const now = new Date();
    const enabledAlarms = alarms.filter(alarm => alarm.enabled);
    
    let nextAlarm: Alarm | null = null;
    let shortestTime = Infinity;

    enabledAlarms.forEach(alarm => {
      const [hours, minutes] = alarm.time.split(':').map(Number);
      const alarmTime = new Date();
      alarmTime.setHours(hours, minutes, 0, 0);

      // If alarm time has passed today, check tomorrow
      if (alarmTime <= now) {
        alarmTime.setDate(alarmTime.getDate() + 1);
      }

      // Check if alarm should ring on this day
      const dayOfWeek = alarmTime.getDay();
      if (alarm.repeatDays.length > 0 && !alarm.repeatDays[dayOfWeek]) {
        return;
      }

      const timeUntilAlarm = differenceInMinutes(alarmTime, now);
      if (timeUntilAlarm < shortestTime) {
        shortestTime = timeUntilAlarm;
        nextAlarm = alarm;
      }
    });

    return nextAlarm;
  }, [alarms]);

  const startSunrise = useCallback((alarm: Alarm) => {
    setAlarmState({
      isActive: true,
      currentAlarm: alarm,
      sunriseProgress: 0,
      timeRemaining: alarm.sunriseDuration * 60,
      phase: 'sunrise',
    });
  }, []);

  const snoozeAlarm = useCallback(() => {
    if (alarmState.currentAlarm?.snoozeEnabled) {
      setAlarmState(prev => ({
        ...prev,
        phase: 'snooze',
        timeRemaining: prev.currentAlarm!.snoozeDuration * 60,
      }));
    }
  }, [alarmState.currentAlarm]);

  const stopAlarm = useCallback(() => {
    setAlarmState({
      isActive: false,
      sunriseProgress: 0,
      timeRemaining: 0,
      phase: 'waiting',
    });
  }, []);

  // Check for alarms every minute
  useEffect(() => {
    const checkAlarms = () => {
      if (alarmState.isActive) return;

      const nextAlarm = getNextAlarm();
      if (!nextAlarm) return;

      const now = new Date();
      const [hours, minutes] = nextAlarm.time.split(':').map(Number);
      const alarmTime = new Date();
      alarmTime.setHours(hours, minutes, 0, 0);

      if (alarmTime <= now) {
        alarmTime.setDate(alarmTime.getDate() + 1);
      }

      const sunriseStartTime = addMinutes(alarmTime, -nextAlarm.sunriseDuration);
      
      if (now >= sunriseStartTime && now < alarmTime) {
        startSunrise(nextAlarm);
      }
    };

    const interval = setInterval(checkAlarms, 60000); // Check every minute
    checkAlarms(); // Check immediately

    return () => clearInterval(interval);
  }, [alarmState.isActive, getNextAlarm, startSunrise]);

  // Update sunrise progress
  useEffect(() => {
    if (!alarmState.isActive || alarmState.phase !== 'sunrise') return;

    const interval = setInterval(() => {
      setAlarmState(prev => {
        if (!prev.currentAlarm) return prev;

        const newTimeRemaining = prev.timeRemaining - 1;
        const totalDuration = prev.currentAlarm.sunriseDuration * 60;
        const progress = ((totalDuration - newTimeRemaining) / totalDuration) * 100;

        if (newTimeRemaining <= 0) {
          return {
            ...prev,
            phase: 'alarm',
            sunriseProgress: 100,
            timeRemaining: 0,
          };
        }

        return {
          ...prev,
          sunriseProgress: Math.min(progress, 100),
          timeRemaining: newTimeRemaining,
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [alarmState.isActive, alarmState.phase]);

  return {
    alarms,
    settings,
    alarmState,
    addAlarm,
    updateAlarm,
    deleteAlarm,
    toggleAlarm,
    setSettings,
    getNextAlarm,
    snoozeAlarm,
    stopAlarm,
  };
}