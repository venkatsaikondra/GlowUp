import React, { useState } from 'react';
import { useAlarmManager } from './hooks/useAlarmManager';
import SunriseBackground from './components/SunriseBackground';
import AlarmClock from './components/AlarmClock';
import AlarmList from './components/AlarmList';
import AlarmForm from './components/AlarmForm';
import AlarmControls from './components/AlarmControls';
import SettingsPanel from './components/SettingsPanel';
import { Alarm } from './types';

function App() {
  const {
    alarms,
    settings,
    alarmState,
    addAlarm,
    updateAlarm,
    deleteAlarm,
    toggleAlarm,
    setSettings,
    snoozeAlarm,
    stopAlarm,
  } = useAlarmManager();

  const [showAlarmForm, setShowAlarmForm] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [editingAlarm, setEditingAlarm] = useState<Alarm | null>(null);
  const [showAlarmList, setShowAlarmList] = useState(false);

  const handleSaveAlarm = (alarmData: Omit<Alarm, 'id' | 'createdAt'>) => {
    if (editingAlarm) {
      updateAlarm(editingAlarm.id, alarmData);
    } else {
      addAlarm(alarmData);
    }
    setEditingAlarm(null);
  };

  const handleEditAlarm = (alarm: Alarm) => {
    setEditingAlarm(alarm);
    setShowAlarmForm(true);
    setShowAlarmList(false);
  };

  const handleDeleteAlarm = (id: string) => {
    if (window.confirm('Are you sure you want to delete this alarm?')) {
      deleteAlarm(id);
    }
  };

  // Toggle alarm list visibility on click (when not in active alarm state)
  const handleBackgroundClick = () => {
    if (!alarmState.isActive) {
      setShowAlarmList(!showAlarmList);
    }
  };

  return (
    <div className="min-h-screen overflow-hidden font-['Poppins'] relative">
      <SunriseBackground
        progress={alarmState.sunriseProgress}
        settings={settings}
        isActive={alarmState.isActive}
      />

      <div 
        className="relative z-10 min-h-screen cursor-pointer"
        onClick={handleBackgroundClick}
      >
        <AlarmClock
          progress={alarmState.sunriseProgress}
          isActive={alarmState.isActive}
          timeRemaining={alarmState.timeRemaining}
          phase={alarmState.phase}
        />
      </div>

      {/* Alarm List Overlay */}
      {showAlarmList && !alarmState.isActive && (
        <div className="fixed inset-0 z-20">
          <div 
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setShowAlarmList(false)}
          />
          <div className="relative z-30 flex items-center justify-center min-h-screen p-4">
            <AlarmList
              alarms={alarms}
              onToggleAlarm={toggleAlarm}
              onEditAlarm={handleEditAlarm}
              onDeleteAlarm={handleDeleteAlarm}
              onAddAlarm={() => {
                setEditingAlarm(null);
                setShowAlarmForm(true);
                setShowAlarmList(false);
              }}
            />
          </div>
        </div>
      )}

      <AlarmControls
        alarmState={alarmState}
        onSnooze={snoozeAlarm}
        onStop={stopAlarm}
        onSettings={() => setShowSettings(true)}
      />

      {showAlarmForm && (
        <AlarmForm
          alarm={editingAlarm}
          onSave={handleSaveAlarm}
          onClose={() => {
            setShowAlarmForm(false);
            setEditingAlarm(null);
          }}
        />
      )}

      {showSettings && (
        <SettingsPanel
          settings={settings}
          onUpdateSettings={setSettings}
          onClose={() => setShowSettings(false)}
        />
      )}

      {/* Hint text for interaction */}
      {!alarmState.isActive && !showAlarmList && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-10">
          <p className="text-white/40 text-sm text-center animate-pulse">
            Tap anywhere to manage alarms
          </p>
        </div>
      )}
    </div>
  );
}

export default App;