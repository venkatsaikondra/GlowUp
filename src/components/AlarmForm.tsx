import React, { useState, useEffect } from 'react';
import { X, Clock, Sun, Volume2, Repeat, SunSnow as Snooze } from 'lucide-react';
import { Alarm } from '../types';

interface AlarmFormProps {
  alarm?: Alarm | null;
  onSave: (alarm: Omit<Alarm, 'id' | 'createdAt'>) => void;
  onClose: () => void;
}

const AlarmForm: React.FC<AlarmFormProps> = ({ alarm, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    time: '07:00',
    enabled: true,
    label: 'Wake up',
    sunriseDuration: 30,
    soundEnabled: true,
    soundType: 'birds' as const,
    volume: 50,
    repeatDays: [false, true, true, true, true, true, false], // Mon-Fri
    snoozeEnabled: true,
    snoozeDuration: 10,
  });

  useEffect(() => {
    if (alarm) {
      setFormData({
        time: alarm.time,
        enabled: alarm.enabled,
        label: alarm.label,
        sunriseDuration: alarm.sunriseDuration,
        soundEnabled: alarm.soundEnabled,
        soundType: alarm.soundType,
        volume: alarm.volume,
        repeatDays: alarm.repeatDays,
        snoozeEnabled: alarm.snoozeEnabled,
        snoozeDuration: alarm.snoozeDuration,
      });
    }
  }, [alarm]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const toggleDay = (dayIndex: number) => {
    const newRepeatDays = [...formData.repeatDays];
    newRepeatDays[dayIndex] = !newRepeatDays[dayIndex];
    setFormData({ ...formData, repeatDays: newRepeatDays });
  };

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const soundOptions = [
    { value: 'birds', label: 'Birds Chirping' },
    { value: 'ocean', label: 'Ocean Waves' },
    { value: 'rain', label: 'Gentle Rain' },
    { value: 'chimes', label: 'Wind Chimes' },
    { value: 'none', label: 'Silent' },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          <h2 className="text-xl font-semibold text-white">
            {alarm ? 'Edit Alarm' : 'New Alarm'}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition-all duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Time */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              <Clock className="w-4 h-4 inline mr-2" />
              Wake up time
            </label>
            <input
              type="time"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none transition-all duration-200"
              required
            />
          </div>

          {/* Label */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Label
            </label>
            <input
              type="text"
              value={formData.label}
              onChange={(e) => setFormData({ ...formData, label: e.target.value })}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none transition-all duration-200"
              placeholder="e.g., Morning workout"
            />
          </div>

          {/* Sunrise Duration */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              <Sun className="w-4 h-4 inline mr-2" />
              Sunrise duration: {formData.sunriseDuration} minutes
            </label>
            <input
              type="range"
              min="15"
              max="60"
              step="5"
              value={formData.sunriseDuration}
              onChange={(e) => setFormData({ ...formData, sunriseDuration: parseInt(e.target.value) })}
              className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-white/60 mt-1">
              <span>15 min</span>
              <span>60 min</span>
            </div>
          </div>

          {/* Sound Settings */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-white/80">
                <Volume2 className="w-4 h-4 inline mr-2" />
                Alarm Sound
              </label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.soundEnabled}
                  onChange={(e) => setFormData({ ...formData, soundEnabled: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-400"></div>
              </label>
            </div>
            
            {formData.soundEnabled && (
              <div className="space-y-3">
                <select
                  value={formData.soundType}
                  onChange={(e) => setFormData({ ...formData, soundType: e.target.value as any })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none transition-all duration-200"
                >
                  {soundOptions.map(option => (
                    <option key={option.value} value={option.value} className="bg-gray-800">
                      {option.label}
                    </option>
                  ))}
                </select>
                
                <div>
                  <label className="block text-xs text-white/60 mb-1">
                    Volume: {formData.volume}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={formData.volume}
                    onChange={(e) => setFormData({ ...formData, volume: parseInt(e.target.value) })}
                    className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Repeat Days */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-3">
              <Repeat className="w-4 h-4 inline mr-2" />
              Repeat
            </label>
            <div className="grid grid-cols-7 gap-2">
              {dayNames.map((day, index) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => toggleDay(index)}
                  className={`w-10 h-10 rounded-full text-xs font-medium transition-all duration-200 ${
                    formData.repeatDays[index]
                      ? 'bg-orange-400 text-white shadow-lg'
                      : 'bg-white/10 text-white/60 hover:bg-white/20'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          {/* Snooze Settings */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-white/80">
                <Snooze className="w-4 h-4 inline mr-2" />
                Snooze
              </label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.snoozeEnabled}
                  onChange={(e) => setFormData({ ...formData, snoozeEnabled: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-400"></div>
              </label>
            </div>
            
            {formData.snoozeEnabled && (
              <div>
                <label className="block text-xs text-white/60 mb-1">
                  Snooze duration: {formData.snoozeDuration} minutes
                </label>
                <input
                  type="range"
                  min="5"
                  max="30"
                  step="5"
                  value={formData.snoozeDuration}
                  onChange={(e) => setFormData({ ...formData, snoozeDuration: parseInt(e.target.value) })}
                  className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-white/60 mt-1">
                  <span>5 min</span>
                  <span>30 min</span>
                </div>
              </div>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all duration-200 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-400 to-yellow-400 text-white rounded-xl hover:shadow-lg transition-all duration-200 font-medium"
            >
              {alarm ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AlarmForm;