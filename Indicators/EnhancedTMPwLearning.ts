// Enhanced T.M.P. with learning capabilities
class EnhancedTMP {
  private patternHistory: Map<string, PatternEffectiveness> = new Map();
  private userFeedback: UserPreference[] = [];
  
  async playIntelligentPulse(marketData: MarketSnapshot, userContext: UserProfile): Promise<void> {
    // Analyze which patterns worked best historically
    const optimalPattern = this.calculateOptimalPattern(marketData, userContext);
    
    // Adaptive intensity based on user preferences
    const intensity = this.calculatePersonalizedIntensity(userContext);
    
    // Multi-layered haptic experience
    await this.playAdaptivePattern(optimalPattern, intensity);
    
    // Learn from this interaction
    this.recordPatternUsage(optimalPattern, marketData, userContext);
  }
  
  private calculateOptimalPattern(data: MarketSnapshot, user: UserProfile): HapticPattern {
    // Machine learning: which patterns had highest user engagement for similar conditions
    const similarConditions = this.findSimilarMarketConditions(data);
    const effectivePatterns = similarConditions.filter(c => c.userEngagement > 0.7);
    
    return effectivePatterns.length > 0 
      ? this.getMostEffectivePattern(effectivePatterns)
      : this.getDefaultPatternForConditions(data);
  }
}
