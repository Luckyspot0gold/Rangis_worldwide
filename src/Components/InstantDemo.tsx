// components/InstantWowDemo.tsx
'use client';
import { useState } from 'react';

export function InstantWowDemo() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [userReaction, setUserReaction] = useState<'meh' | 'cool' | 'mindblown'>('meh');

  const playMarketEarthquake = async (intensity: number) => {
    setIsPlaying(true);
    
    // Progressive intensity that builds to a climax
    const patterns = [
      [100, 200],                    // Gentle rumble
      [50, 100, 50, 100],           // Building intensity
      [25, 25, 25, 25, 25, 25, 25], // Rapid fire
      [500],                         // Big payoff
      [100, 50, 100, 50, 100]       // Victory sequence
    ];
    
    for (const pattern of patterns) {
      await navigator.vibrate(pattern);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    setIsPlaying(false);
    setUserReaction('mindblown');
  };

  return (
    <div className="text-center p-8">
      <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-red-500 to-purple-500 bg-clip-text text-transparent">
        FEEL THE MARKET QUAKE
      </h2>
      
      <button 
        onClick={() => playMarketEarthquake(0.8)}
        disabled={isPlaying}
        className="relative overflow-hidden group"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-purple-600 group-hover:from-red-700 group-hover:to-purple-700 transform group-hover:scale-110 transition-transform duration-200" />
        <span className="relative z-10 text-white text-xl font-bold px-8 py-4 block">
          {isPlaying ? '🌋 EARTHQUAKE ACTIVE!' : '🔥 TRIGGER MARKET QUAKE'}
        </span>
      </button>

      {userReaction === 'mindblown' && (
        <div className="mt-4 animate-bounce">
          <div className="text-4xl">🤯</div>
          <p className="text-lg font-semibold text-green-400">YEAH! THAT'S WHAT WE'RE TALKING ABOUT!</p>
        </div>
      )}
    </div>
  );
}
