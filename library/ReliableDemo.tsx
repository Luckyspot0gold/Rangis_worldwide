// components/ReliableDemo.tsx
'use client';
import { useState } from 'react';

export function ReliableDemo() {
  const [demoState, setDemoState] = useState<'idle' | 'working' | 'success' | 'error'>('idle');
  
  const runDemo = async () => {
    setDemoState('working');
    
    try {
      // Test haptic
      if (navigator.vibrate) navigator.vibrate([100]);
      
      // Test market data
      const data = await fetch('/api/market-data/demo').then(r => r.json());
      
      // Test audio
      const audioContext = new AudioContext();
      const oscillator = audioContext.createOscillator();
      oscillator.frequency.value = 432;
      oscillator.connect(audioContext.destination);
      oscillator.start();
      setTimeout(() => oscillator.stop(), 500);
      
      setDemoState('success');
    } catch (error) {
      setDemoState('error');
    }
  };
  
  return (
    <div className="p-4 border rounded-lg">
      <button onClick={runDemo} disabled={demoState === 'working'}>
        {demoState === 'idle' && 'Run Demo'}
        {demoState === 'working' && 'Testing...'}
        {demoState === 'success' && '✅ Demo Successful!'}
        {demoState === 'error' && '❌ Demo Failed'}
      </button>
    </div>
  );
}
