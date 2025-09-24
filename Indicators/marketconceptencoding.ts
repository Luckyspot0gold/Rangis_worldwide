// Encode financial concepts into haptic language
const HapticMarketAlphabet = {
  BULLISH: [100, 50, 100, 50],       // Strong, confident pulses
  BEARISH: [200, 100],               // Longer, warning pulses
  VOLATILE: [50, 50, 50, 50, 50],    // Rapid, nervous pulses
  STABLE: [300],                     // Calm, sustained pulse
  BREAKOUT: [50, 150, 50],           // Anticipation → action
  REVERSAL: [100, 200, 100]          // Change direction pattern
};

class ConceptEncoder {
  encodeMarketConcept(concept: string, intensity: number): HapticPattern {
    const basePattern = HapticMarketAlphabet[concept] || HapticMarketAlphabet.STABLE;
    return this.scalePatternIntensity(basePattern, intensity);
  }
  
  async teachConcept(concept: string, examples: MarketSnapshot[]): Promise<void> {
    // Play concept pattern
    await this.playPattern(this.encodeMarketConcept(concept, 0.7));
    
    // Play real-market examples
    for (const example of examples) {
      await this.delay(500);
      await this.playPattern(this.refinedTMP(example));
    }
    
    // Reinforce with concept pattern
    await this.playPattern(this.encodeMarketConcept(concept, 0.9));
  }
}
