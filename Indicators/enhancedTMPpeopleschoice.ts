// Enhanced T.M.P. - The "People's Choice" Edition
class PeoplesTMP {
  private crowdFavoritePatterns: Map<string, HapticPattern> = new Map();
  
  async playCrowdPleaser(marketData: MarketSnapshot, userExcitement: number): Promise<void> {
    // Start with what already works
    const basePattern = await this.refinedTMP(marketData);
    
    // ADD THE "WOW FACTOR" - crowd-pleasing enhancements
    await this.addSurpriseElement(basePattern, userExcitement);
    await this.addRhythmicBuildUp(marketData);
    await this.addClimacticFinish(marketData.volatility);
    
    // Record what makes people go "HOLY $#!%"
    this.trackCrowdReaction(marketData, userExcitement);
  }

  private async addSurpriseElement(pattern: HapticPattern, excitement: number): Promise<void> {
    if (excitement > 0.7) {
      // ADD UNEXPECTED TWIST that makes people smile
      const surprisePattern = this.generateSurprisePattern(pattern);
      await this.interweavePatterns(pattern, surprisePattern);
    }
  }

  private generateSurprisePattern(base: HapticPattern): HapticPattern {
    // Patterns that make people go "Whoa!"
    const surprises = [
      [50, 50, 50, 50, 50, 50], // Machine gun rapid fire
      [300, 100, 300, 100],     // Heartbeat then quick double
      [100, 50, 25, 12, 6, 3]   // Exponential decay (mind-bending)
    ];
    
    return surprises[Math.floor(Math.random() * surprises.length)];
  }
}
