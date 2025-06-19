import React from 'react';
import { Plus, Edit3, Trash2, Power, Clock, Repeat } from 'lucide-react';
import { Alarm } from '../types';
import { format } from 'date-fns';

interface AlarmListProps {
  alarms: Alarm[];
  onToggleAlarm: (id: string) => void;
  onEditAlarm: (alarm: Alarm) => void;
  onDeleteAlarm: (id: string) => void;
  onAddAlarm: () => void;
}

const AlarmList: React.FC<AlarmListProps> = ({
  alarms,
  onToggleAlarm,
  onEditAlarm,
  onDeleteAlarm,
  onAddAlarm,
}) => {
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return format(date, 'h:mm a');
  };

  const getRepeatText = (repeatDays: boolean[]) => {
    if (repeatDays.every(day => day)) return 'Every day';
    if (repeatDays.every(day => !day)) return 'Once';
    
    const activeDays = repeatDays
      .map((active, index) => active ? dayNames[index] : null)
      .filter(Boolean);
    
    return activeDays.join(', ');
  };

  return (
    <div className="relative z-10 p-6 max-w-md mx-auto">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-white">Alarms</h2>
          <button
            onClick={onAddAlarm}
            className="w-12 h-12 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <Plus className="w-6 h-6 text-white" />
          </button>
        </div>

        <div className="space-y-4">
          {alarms.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="w-12 h-12 text-white/40 mx-auto mb-4" />
              <p className="text-white/60">No alarms set</p>
              <p className="text-white/40 text-sm mt-2">
                Tap the + button to create your first alarm
              </p>
            </div>
          ) : (
            alarms.map((alarm) => (
              <div
                key={alarm.id}
                className={`bg-white/5 backdrop-blur-sm rounded-xl p-4 border transition-all duration-300 ${
                  alarm.enabled 
                    ? 'border-orange-400/30 bg-orange-400/5' 
                    : 'border-white/10'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-2xl font-light text-white">
                        {formatTime(alarm.time)}
                      </h3>
                      <button
                        onClick={() => onToggleAlarm(alarm.id)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                          alarm.enabled
                            ? 'bg-orange-400 text-white shadow-lg'
                            : 'bg-white/20 text-white/60'
                        }`}
                      >
                        <Power className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-white/80 font-medium">{alarm.label}</p>
                      <div className="flex items-center space-x-4 text-sm text-white/60">
                        <div className="flex items-center space-x-1">
                          <Repeat className="w-3 h-3" />
                          <span>{getRepeatText(alarm.repeatDays)}</span>
                        </div>
                        <span>
                          {alarm.sunriseDuration}min sunrise
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => onEditAlarm(alarm)}
                      className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition-all duration-200"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteAlarm(alarm.id)}
                      className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:text-red-400 hover:bg-red-400/20 transition-all duration-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AlarmList;