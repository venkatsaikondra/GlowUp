export interface Alarm {
  id: string;
  time: string;
  enabled: boolean;
  label: string;
  sunriseDuration: number; // in minutes
  soundEnabled: boolean;
  soundType: 'birds' | 'ocean' | 'rain' | 'chimes' | 'none';
  volume: number;
  repeatDays: boolean[];
  snoozeEnabled: boolean;
  snoozeDuration: number;
  createdAt: Date;
}

export interface SunriseSettings {
  theme: 'warm' | 'cool' | 'natural' | 'custom';
  customColors: {
    start: string;
    middle: string;
    end: string;
  };
  brightness: {
    start: number;
    end: number;
  };
  smartHomeEnabled: boolean;
  smartHomeDevices: SmartDevice[];
}

export interface SmartDevice {
  id: string;
  name: string;
  type: 'hue' | 'homeassistant' | 'generic';
  endpoint: string;
  token?: string;
}

export interface AlarmState {
  isActive: boolean;
  currentAlarm?: Alarm;
  sunriseProgress: number;
  timeRemaining: number;
  phase: 'waiting' | 'sunrise' | 'alarm' | 'snooze';
}