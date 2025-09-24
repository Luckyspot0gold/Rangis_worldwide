// components/ShareableHapticMoments.tsx
'use client';
import { useState } from 'react';

export function ShareableHapticMoments() {
  const [currentMoment, setCurrentMoment] = useState<string>('');
  
  const createShareableMoment = async (marketEvent: string) => {
    // Play epic haptic pattern
    await playEpicHapticEvent(marketEvent);
    
    // Generate shareable content
    const moment = {
      text: `Just experienced ${marketEvent} with Rangi's Heartbeat! 🤯`,
      pattern: getPatternForEvent(marketEvent),
      timestamp: Date.now(),
      marketData: getCurrentMarketData()
    };
    
    setCurrentMoment(JSON.stringify(moment));
    
    // Offer to share
    if (navigator.share) {
      await navigator.share({
        title: 'Mind-blowing market experience!',
        text: `I just felt ${marketEvent} through haptic feedback!`,
        url: window.location.href
      });
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      <button onClick={() => createShareableMoment('BULL_RUN')} className="bg-green-500 p-4 rounded-lg">
        🚀 BULL RUN EUPHORIA
      </button>
      <button onClick={() => createShareableMoment('CRASH')} className="bg-red-500 p-4 rounded-lg">
        📉 MARKET CRASH PANIC
      </button>
      <button onClick={() => createShareableMoment('VOLATILITY')} className="bg-yellow-500 p-4 rounded-lg">
        ⚡ VOLATILITY SPIKE
      </button>
      <button onClick={() => createShareableMoment('CALM')} className="bg-blue-500 p-4 rounded-lg">
        🌊 CALM BEFORE STORM
      </button>
    </div>
  );
}
