apps/web/pages/index.tsx:
/**
 * Reality Protocol - Main Dashboard
 * Real-time market → quantum → sensory output pipeline
 */

import { useState, useEffect, useRef } from 'react';
import { McCreaQuantumBridge, QuantumState, SensoryOutput } from '@reality-protocol/quantum-core';
import { RealTimeMarketFeed, RealTimeMarketData } from '@reality-protocol/market-data';
import { TorusVisualization } from '../components/TorusVisualization';
import { HarmonicWaveform } from '../components/HarmonicWaveform';
import { CymaticPattern } from '../components/CymaticPattern';
import { MetricsDisplay } from '../components/MetricsDisplay';
import { MarketStateIndicator } from '../components/MarketStateIndicator';

export default function Dashboard() {
  const [quantumState, setQuantumState] = useState<QuantumState | null>(null);
  const [sensoryOutput, setSensoryOutput] = useState<SensoryOutput | null>(null);
  const [marketData, setMarketData] = useState<RealTimeMarketData | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [selectedSymbol, setSelectedSymbol] = useState('BTCUSDT');

  const audioContextRef = useRef<AudioContext | null>(null);
  const quantumBridgeRef = useRef<McCreaQuantumBridge | null>(null);
  const marketFeedRef = useRef<RealTimeMarketFeed | null>(null);
  const historicalStatesRef = useRef<QuantumState[]>([]);

  useEffect(() => {
    // Initialize audio context
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Initialize quantum bridge
    quantumBridgeRef.current = new McCreaQuantumBridge(432.0, 111.11);
    
    // Initialize market feed
    marketFeedRef.current = new RealTimeMarketFeed();
    
    // Connect to market data stream
    const connectToMarket = async () => {
      try {
        await marketFeedRef.current!.connect(['BTCUSDT', 'ETHUSDT', 'SOLUSDT']);
        setIsConnected(true);

        // Subscribe to market updates
        const unsubscribe = marketFeedRef.current!.subscribe((data) => {
          if (data.symbol === selectedSymbol) {
            processMarketUpdate(data);
          }
        });

        return () => {
          unsubscribe();
          marketFeedRef.current?.disconnect();
        };
      } catch (error) {
        console.error('Failed to connect to market feed:', error);
        setIsConnected(false);
      }
    };

    connectToMarket();

    return () => {
      audioContextRef.current?.close();
      marketFeedRef.current?.disconnect();
    };
  }, [selectedSymbol]);

  const processMarketUpdate = (data: RealTimeMarketData) => {
    if (!quantumBridgeRef.current) return;

    setMarketData(data);

    // Get VIX from external source (mock for now)
    const vixValue = 20; // Would fetch from real API

    // Compute quantum state
    const quantum = quantumBridgeRef.current.compute({
      rsi: data.rsi || 50,
      vix: vixValue,
      priceChange: data.change24h,
      volume: data.volume,
      price: data.price,
      symbol: data.symbol,
      timestamp: data.timestamp
    });

    // Generate sensory output
    const sensory = quantumBridgeRef.current.generateSensory(quantum, {
      rsi: data.rsi || 50,
      vix: vixValue,
      priceChange: data.change24h,
      volume: data.volume,
      price: data.price,
      symbol: data.symbol,
      timestamp: data.timestamp
    });

    // Update historical states (keep last 50)
    historicalStatesRef.current.push(quantum);
    if (historicalStatesRef.current.length > 50) {
      historicalStatesRef.current.shift();
    }

    setQuantumState(quantum);
    setSensoryOutput(sensory);

    // Play audio tone
    playHarmonicTone(sensory.audio);

    // Trigger haptic feedback
    triggerHapticFeedback(sensory.haptic);
  };

  const playHarmonicTone = (audio: SensoryOutput['audio']) => {
    if (!audioContextRef.current) return;

    const ctx = audioContextRef.current;
    const now = ctx.currentTime;

    // Create oscillators for each harmonic
    audio.harmonics.forEach((freq, index) => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.frequency.value = freq;
      oscillator.type = 'sine';

      // Amplitude decreases for higher harmonics
      const amplitude = audio.amplitude * Math.pow(0.5, index);
      gainNode.gain.value = amplitude * 0.2; // Scale down to prevent distortion

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      // Smooth envelope
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(amplitude * 0.2, now + 0.1);
      gainNode.gain.linearRampToValueAtTime(0, now + 0.9);

      oscillator.start(now);
      oscillator.stop(now + 1);
    });
  };

  const triggerHapticFeedback = (haptic: SensoryOutput['haptic']) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(haptic.pattern);
    }
  };

  const metrics = quantumState && historicalStatesRef.current.length > 1
    ? quantumBridgeRef.current!.calculateMetrics(quantumState, historicalStatesRef.current)
    : null;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
              Reality Protocol
            </h1>
            <p className="text-sm text-gray-400 mt-1">Quantum Harmonic Market Intelligence</p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Symbol Selector */}
            <select 
              value={selectedSymbol}
              onChange={(e) => setSelectedSymbol(e.target.value)}
              className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2"
            >
              <option value="BTCUSDT">BTC/USDT</option>
              <option value="ETHUSDT">ETH/USDT</option>
              <option value="SOLUSDT">SOL/USDT</option>
            </select>

            {/* Connection Status */}
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
              <span className="text-sm text-gray-400">
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {!quantumState || !sensoryOutput || !marketData ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto mb-4" />
              <p className="text-gray-400">Initializing quantum resonance...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Market & Quantum State */}
            <div className="lg:col-span-1 space-y-6">
              {/* Market Data Card */}
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h2 className="text-lg font-semibold mb-4">Market Data</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Price</span>
                    <span className="font-mono">${marketData.price.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">24h Change</span>
                    <span className={`font-mono ${marketData.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {marketData.change24h >= 0 ? '+' : ''}{marketData.change24h.toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Volume</span>
                    <span className="font-mono">{(marketData.volume / 1e6).toFixed(2)}M</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">RSI</span>
                    <span className="font-mono">{marketData.rsi?.toFixed(1) || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Quantum State Card */}
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h2 className="text-lg font-semibold mb-4">Quantum State</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Frequency (Ω)</span>
                    <span className="font-mono text-purple-400">{quantumState.omega.toFixed(2)} Hz</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Note</span>
                    <span className="font-mono">{sensoryOutput.audio.note}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Chord</span>
                    <span className="font-mono capitalize">{sensoryOutput.audio.chord}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Alpha (α)</span>
                    <span className="font-mono">{quantumState.spinor[0].toFixed(3)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Beta (β)</span>
                    <span className="font-mono">{quantumState.spinor[1].toFixed(3)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Phase (φ)</span>
                    <span className="font-mono">{quantumState.phase.toFixed(3)} rad</span>
                  </div>
                </div>
              </div>

              {/* Market State Indicator */}
              <MarketStateIndicator 
                state={sensoryOutput.metadata.state}
                returnTriggered={sensoryOutput.metadata.returnTriggered}
              />

              {/* McCrea Metrics */}
              {metrics && (
                <MetricsDisplay metrics={metrics} />
              )}
            </div>

            {/* Center Column - Main Visualizations */}
            <div className="lg:col-span-2 space-y-6">
              {/* Torus Visualization (Bloch Sphere) */}
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 h-96">
                <h2 className="text-lg font-semibold mb-4">Bloch Sphere - Quantum Market State</h2>
                <TorusVisualization
                  blochCoords={quantumState.blochCoords}
                  phase={quantumState.phase}
                  color={sensoryOutput.visual.color}
                />
              </div>

              {/* Harmonic Waveform */}
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 h-64">
                <h2 className="text-lg font-semibold mb-4">
                  Harmonic Waveform - {sensoryOutput.audio.frequency.toFixed(2)} Hz
                </h2>
                <HarmonicWaveform
                  waveform={sensoryOutput.visual.waveform}
                  color={sensoryOutput.visual.color}
                  amplitude={sensoryOutput.audio.amplitude}
                />
              </div>

              {/* Cymatic Pattern */}
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 h-96">
                <h2 className="text-lg font-semibold mb-4">Cymatic Pattern - Standing Waves</h2>
                <CymaticPattern
                  pattern={sensoryOutput.visual.cymaticPattern}
                  color={sensoryOutput.visual.color}
                />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-12 px-6 py-6">
        <div className="max-w-7xl mx-auto text-center text-sm text-gray-500">
          <p>Reality Protocol © 2025 - McCrea Market Metrics™</p>
          <p className="mt-2">
            Base Frequency: 432Hz | Return Frequency: 111.11Hz | Patent Pending
          </p>
        </div>
      </footer>
    </div>
  );
}
apps/web/components/TorusVisualization.tsx:
import { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Torus } from '@react-three/drei';
import * as THREE from 'three';

interface TorusVisualizationProps {
  blochCoords: [number, number, number];
  phase: number;
  color: string;
}

function AnimatedTorus({ blochCoords, phase, color }: TorusVisualizationProps) {
  const torusRef = useRef<THREE.Mesh>(null);
  const sphereRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (torusRef.current) {
      // Rotate torus based on phase
      torusRef.current.rotation.x = phase;
      torusRef.current.rotation.y += 0.01;
    }

    if (sphereRef.current) {
      // Position sphere on Bloch sphere
      const [x, y, z] = blochCoords;
      sphereRef.current.position.set(x * 2, y * 2, z * 2);
    }
  });

  return (
    <>
      {/* Main Torus */}
      <Torus ref={torusRef} args={[2, 0.5, 16, 100]}>
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} />
      </Torus>

      {/* Bloch Sphere Marker */}
      <mesh ref={sphereRef}>
        <sphereGeometry args={[0.2, 32, 32]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
      </mesh>

      {/* Bloch Sphere Wireframe */}
      <mesh>
        <sphereGeometry args={[2, 32, 32]} />
        <meshBasicMaterial color="#333333" wireframe />
      </mesh>

      {/* Axis Lines */}
      <axesHelper args={[3]} />
    </>
  );
}

export function TorusVisualization(props: TorusVisualizationProps) {
  return (
    <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <AnimatedTorus {...props} />
      <OrbitControls enableZoom={true} enablePan={true} />
    </Canvas>
  );
}
apps/web/components/HarmonicWaveform.tsx:
import { useEffect, useRef } from 'react';

interface HarmonicWaveformProps {
  waveform: number[];
  color: string;
  amplitude: number;
}

export function HarmonicWaveform({ waveform, color, amplitude }: HarmonicWaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const width = canvas.width;
    const height = canvas.height;
    const centerY = height / 2;

    // Clear canvas
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);

    // Draw waveform
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();

    waveform.forEach((value, index) => {
      const x = (index / waveform.length) * width;
      const y = centerY - (value * centerY * 0.8);

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();

    // Draw center line
    ctx.strokeStyle = '#333333';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.stroke();

    // Draw amplitude indicator
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.3;
    ctx.fillRect(0, centerY - (amplitude * centerY), width, amplitude * height);
    ctx.globalAlpha = 1.0;

  }, [waveform, color, amplitude]);

  return (
    <canvas 
      ref={canvasRef} 
      className="w-full h-full rounded-lg"
      style={{ background: '#000000' }}
    />
  );
}
apps/web/components/CymaticPattern.tsx:
import { useEffect, useRef } from 'react';

interface CymaticPatternProps {
  pattern: number[][];
  color: string;
}

export function CymaticPattern({ pattern, color }: CymaticPatternProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const width = canvas.width;
    const height = canvas.height;
    const gridSize = pattern.length;
    const cellWidth = width / gridSize;
    const cellHeight = height / gridSize;

    // Clear canvas
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);

    // Parse color to RGB
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : { r: 255, g: 255, b: 255 };
    };

    const rgb = hexToRgb(color);

    // Draw cymatic pattern
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const intensity = pattern[i][j];
        const alpha = intensity;

        ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
        ctx.fillRect(
          j * cellWidth,
          i * cellHeight,
          cellWidth,
          cellHeight
        );
      }
    }

  }, [pattern, color]);

  return (
    <canvas 
      ref={canvasRef} 
      className="w-full h-full rounded-lg"
      style={{ background: '#000000' }}
    />
  );
}
apps/web/components/MarketStateIndicator.tsx:
interface MarketStateIndicatorProps {
  state: 'extreme_fear' | 'fear' | 'neutral' | 'greed' | 'extreme_greed';
  returnTriggered: boolean;
}

export function MarketStateIndicator({ state, returnTriggered }: MarketStateIndicatorProps) {
  const stateConfig = {
    extreme_fear: { color: 'bg-red-900', text: 'Extreme Fear', emoji: '😱' },
    fear: { color: 'bg-orange-900', text: 'Fear', emoji: '😰' },
    neutral: { color: 'bg-gray-700', text: 'Neutral', emoji: '😐' },
    greed: { color: 'bg-green-900', text: 'Greed', emoji: '😊' },
    extreme_greed: { color: 'bg-green-600', text: 'Extreme Greed', emoji: '🤑' }
  };

  const config = stateConfig[state];

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
      <h2 className="text-lg font-semibold mb-4">Market Sentiment</h2>
      
      <div className={`${config.color} rounded-lg p-4 text-center`}>
        <div className="text-4xl mb-2">{config.emoji}</div>
        <div className="text-xl font-bold">{config.text}</div>
      </div>

      {returnTriggered && (
        <div className="mt-4 bg-yellow-900 border border-yellow-700 rounded-lg p-3 text-center animate-pulse">
          <div className="text-sm font-semibold">⚠️ RETURN TO SENDER ACTIVATED</div>
          <div className="text-xs text-yellow-200 mt-1">111.11Hz Frequency Engaged</div>
        </div>
      )}
    </div>
  );
}
apps/web/components/MetricsDisplay.tsx:
import { McCreaMetrics } from '@reality-protocol/quantum-core';

interface MetricsDisplayProps {
  metrics: McCreaMetrics;
}

export function Met
