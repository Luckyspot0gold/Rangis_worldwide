// The winning approach: Enhanced T.M.P. with educational features
class IntelligentTMP {
  // Core refined T.M.P. functionality
  async playMarketPulse(data: MarketSnapshot): Promise<void> {
    const basePattern = this.refinedTMP(data);
    await this.executePattern(basePattern);
  }
  
  // NEW: Educational layer
  async explainMarketMovement(previousData: MarketSnapshot, currentData: MarketSnapshot): Promise<void> {
    const change = this.calculateChange(previousData, currentData);
    const explanationPattern = this.createExplanationPattern(change);
    
    // Play "before" pattern
    await this.playPattern(this.refinedTMP(previousData));
    await this.delay(1000);
    
    // Play "after" pattern with educational cue
    await this.playPattern(explanationPattern);
    await this.playPattern(this.refinedTMP(currentData));
    
    // Provide audio explanation
    this.speakExplanation(change);
  }
  
  // NEW: Learning system
  async adaptToUserPreference(userFeedback: Feedback): Promise<void> {
    this.updatePatternEffectiveness(userFeedback);
    this.adjustSensitivity(userFeedback.comfortLevel);
  }
}
