import React from 'react';
import { X, Palette, Lightbulb, Smartphone } from 'lucide-react';
import { SunriseSettings } from '../types';

interface SettingsPanelProps {
  settings: SunriseSettings;
  onUpdateSettings: (settings: SunriseSettings) => void;
  onClose: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  settings,
  onUpdateSettings,
  onClose,
}) => {
  const themes = [
    { value: 'warm', label: 'Warm Sunrise', colors: ['#0f0f23', '#FF6B35', '#FFD700'] },
    { value: 'cool', label: 'Cool Dawn', colors: ['#1a1a2e', '#16537e', '#87CEEB'] },
    { value: 'natural', label: 'Natural Light', colors: ['#2c1810', '#FF8C42', '#FFF8DC'] },
    { value: 'custom', label: 'Custom', colors: [] },
  ];

  const updateTheme = (theme: string) => {
    onUpdateSettings({
      ...settings,
      theme: theme as any,
    });
  };

  const updateBrightness = (type: 'start' | 'end', value: number) => {
    onUpdateSettings({
      ...settings,
      brightness: {
        ...settings.brightness,
        [type]: value,
      },
    });
  };

  const updateCustomColor = (position: 'start' | 'middle' | 'end', color: string) => {
    onUpdateSettings({
      ...settings,
      customColors: {
        ...settings.customColors,
        [position]: color,
      },
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          <h2 className="text-xl font-semibold text-white">Settings</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition-all duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Theme Selection */}
          <div>
            <h3 className="text-lg font-medium text-white mb-4 flex items-center">
              <Palette className="w-5 h-5 mr-2" />
              Sunrise Theme
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {themes.map((theme) => (
                <button
                  key={theme.value}
                  onClick={() => updateTheme(theme.value)}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                    settings.theme === theme.value
                      ? 'border-orange-400 bg-orange-400/10'
                      : 'border-white/20 bg-white/5 hover:border-white/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-white font-medium">{theme.label}</span>
                    {theme.colors.length > 0 && (
                      <div className="flex space-x-1">
                        {theme.colors.map((color, index) => (
                          <div
                            key={index}
                            className="w-6 h-6 rounded-full border border-white/20"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Colors */}
          {settings.theme === 'custom' && (
            <div>
              <h4 className="text-md font-medium text-white mb-3">Custom Colors</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-white/80">Night (Start)</label>
                  <input
                    type="color"
                    value={settings.customColors.start}
                    onChange={(e) => updateCustomColor('start', e.target.value)}
                    className="w-12 h-8 rounded border border-white/20 bg-transparent"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-white/80">Dawn (Middle)</label>
                  <input
                    type="color"
                    value={settings.customColors.middle}
                    onChange={(e) => updateCustomColor('middle', e.target.value)}
                    className="w-12 h-8 rounded border border-white/20 bg-transparent"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-white/80">Day (End)</label>
                  <input
                    type="color"
                    value={settings.customColors.end}
                    onChange={(e) => updateCustomColor('end', e.target.value)}
                    className="w-12 h-8 rounded border border-white/20 bg-transparent"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Brightness Settings */}
          <div>
            <h3 className="text-lg font-medium text-white mb-4 flex items-center">
              <Lightbulb className="w-5 h-5 mr-2" />
              Screen Brightness
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-white/80 mb-2">
                  Start brightness: {settings.brightness.start}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={settings.brightness.start}
                  onChange={(e) => updateBrightness('start', parseInt(e.target.value))}
                  className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
              <div>
                <label className="block text-white/80 mb-2">
                  End brightness: {settings.brightness.end}%
                </label>
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={settings.brightness.end}
                  onChange={(e) => updateBrightness('end', parseInt(e.target.value))}
                  className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
            </div>
          </div>

          {/* Smart Home Integration */}
          <div>
            <h3 className="text-lg font-medium text-white mb-4 flex items-center">
              <Smartphone className="w-5 h-5 mr-2" />
              Smart Home
            </h3>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <p className="text-white/60 text-sm mb-3">
                Connect smart lights to sync with your sunrise alarm
              </p>
              <button className="w-full py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all duration-200 text-sm">
                Coming Soon - Smart Light Integration
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;