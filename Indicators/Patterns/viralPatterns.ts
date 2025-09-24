// patterns/viralPatterns.ts
export const ViralHapticPatterns = {
  // Patterns designed to make people SHOW THEIR FRIENDS
  THE_ROLLERCOASTER: [100, 50, 25, 12, 6, 3, 100, 200, 300, 500],
  THE_HEART_ATTACK: [50, 50, 50, 50, 50, 500, 50, 50, 50, 50, 50, 500],
  THE_DRUM_SOLO: [25, 25, 50, 25, 25, 50, 100, 25, 25, 25, 25, 200],
  THE_EARTHQUAKE: [100, 100, 100, 100, 100, 100, 100, 100, 100, 100], // Constant rumble
  THE_SNIPER: [1000, 50, 1000], // Long wait... BAM!... long wait
  
  // Market-specific crowd pleasers
  BULL_RUN_EUPHORIA: [50, 50, 50, 100, 50, 50, 50, 150, 50, 50, 50, 200],
  BEAR_MARKET_PANIC: [200, 100, 200, 100, 200, 100, 200, 100, 200, 100],
  SIDEWAYS_BOREDOM: [300, 300, 300, 300, 300], // So boring it's funny
  VOLATILITY_SPIKE: [25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25]
};

export class ViralPatternEngine {
  async playViralPattern(patternName: keyof typeof ViralHapticPatterns, intensity: number = 1.0): Promise<void> {
    const basePattern = ViralHapticPatterns[patternName];
    const scaledPattern = basePattern.map(duration => duration * intensity);
    
    await navigator.vibrate(scaledPattern);
    
    // ADD DRAMATIC AUDIO FOR MAXIMUM IMPACT
    await this.playDramaticSoundEffect(patternName);
  }
  
  private async playDramaticSoundEffect(patternName: string): Promise<void> {
    const audioContext = new AudioContext();
    
    // Different sound effects for different patterns
    const effects = {
      THE_ROLLERCOASTER: () => this.playRisingPitch(200, 800, 2.0),
      THE_HEART_ATTACK: () => this.playHeartbeatSound(),
      THE_EARTHQUAKE: () => this.playLowRumble(50, 3.0)
    };
    
    const effect = effects[patternName] || effects.THE_ROLLERCOASTER;
    await effect();
  }
}
