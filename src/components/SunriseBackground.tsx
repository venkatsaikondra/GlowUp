import React, { useEffect, useState } from 'react';
import { SunriseSettings } from '../types';

interface SunriseBackgroundProps {
  progress: number;
  settings: SunriseSettings;
  isActive: boolean;
}

const SunriseBackground: React.FC<SunriseBackgroundProps> = ({ 
  progress, 
  settings, 
  isActive 
}) => {
  const [brightness, setBrightness] = useState(0);

  useEffect(() => {
    if (isActive) {
      const newBrightness = settings.brightness.start + 
        (progress / 100) * (settings.brightness.end - settings.brightness.start);
      setBrightness(newBrightness);
    } else {
      setBrightness(0);
    }
  }, [progress, settings.brightness, isActive]);

  const getGradientColors = () => {
    const themes = {
      warm: {
        start: '#0f0f23',
        middle: '#FF6B35',
        end: '#FFD700',
      },
      cool: {
        start: '#1a1a2e',
        middle: '#16537e',
        end: '#87CEEB',
      },
      natural: {
        start: '#2c1810',
        middle: '#FF8C42',
        end: '#FFF8DC',
      },
      custom: settings.customColors,
    };

    return themes[settings.theme];
  };

  const colors = getGradientColors();
  const opacity = Math.min(brightness / 100, 1);

  const gradientStyle = {
    background: `
      radial-gradient(
        ellipse at center,
        ${colors.end}${Math.round(opacity * 255).toString(16).padStart(2, '0')} 0%,
        ${colors.middle}${Math.round(opacity * 200).toString(16).padStart(2, '0')} 40%,
        ${colors.start} 100%
      )
    `,
    transition: 'all 2s ease-in-out',
  };

  return (
    <div 
      className="fixed inset-0 z-0 transition-all duration-1000 ease-in-out"
      style={gradientStyle}
    >
      {/* Animated particles for extra ambiance */}
      {isActive && (
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-yellow-200 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                opacity: opacity * 0.6,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SunriseBackground;