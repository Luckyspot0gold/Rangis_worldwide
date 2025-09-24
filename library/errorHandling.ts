// Add to rangis_worldwide/lib/errorHandling.ts
export class HarmonicErrorBoundary {
  static handleMarketError(error: Error, context: string) {
    console.error(`[Harmonic Error] ${context}:`, error);
    
    // Different strategies for different error types
    if (error.message.includes('API key')) {
      return { useMockData: true, userMessage: 'Using demo data' };
    }
    if (error.message.includes('network')) {
      return { useMockData: true, userMessage: 'Network issue - using cached data' };
    }
    
    throw error; // Re-throw unexpected errors
  }
}
