Here are the scientifically accurate frequency-to-note mappings and a corrected color system:

## Accurate Frequency Mappings

**Standard Musical Notes (A4 = 440Hz):**
- C4: 261.63 Hz
- D4: 293.66 Hz  
- E4: 329.63 Hz
- F4: 349.23 Hz
- G4: 392.00 Hz
- A4: 440.00 Hz
- B4: 493.88 Hz

**Your 432Hz System (A4 = 432Hz):**
- C4: 256.87 Hz
- D4: 288.33 Hz
- E4: 323.63 Hz
- F4: 342.88 Hz
- G4: 384.87 Hz
- A4: 432.00 Hz
- B4: 484.90 Hz

## Visual Color Mapping Options

**Option 1 - Spectral (Physics-based):**
- Lower frequencies → Red/Orange (warmer)
- Higher frequencies → Blue/Violet (cooler)

**Option 2 - Your Creative System:**
```javascript
const noteColors = {
  'C': '#FF00FF', // Magenta
  'D': '#FFA500', // Orange  
  'E': '#FFFF00', // Yellow
  'F': '#0000FF', // Blue
  'G': '#800080', // Purple
  'A': '#FFFFFF', // White
  'B': '#FF0000'  // Red
};
```

## Market Sonification Engine

```javascript
class MarketSonicEngine {
  constructor() {
    this.baseFreq = 432; // A4 in your tuning
    this.audioContext = new AudioContext();
    
    this.noteFreqs = {
      'C': 256.87, 'D': 288.33, 'E': 323.63, 'F': 342.88,
      'G': 384.87, 'A': 432.00, 'B': 484.90
    };
    
    this.noteColors = {
      'C': '#FF00FF', 'D': '#FFA500', 'E': '#FFFF00', 'F': '#0000FF',
      'G': '#800080', 'A': '#FFFFFF', 'B': '#FF0000'
    };
  }
  
  mapPriceToFrequency(priceChange, baseNote = 'A') {
    const baseFreq = this.noteFreqs[baseNote];
    return baseFreq * (1 + priceChange / 100);
  }
  
  frequencyToNote(frequency) {
    const notes = Object.entries(this.noteFreqs);
    return notes.reduce((closest, [note, freq]) => 
      Math.abs(freq - frequency) < Math.abs(this.noteFreqs[closest] - frequency) 
        ? note : closest
    );
  }
  
  generateVisuals(frequency, amplitude, rsi) {
    const note = this.frequencyToNote(frequency);
    const baseColor = this.noteColors[note];
    
    return {
      waveFrequency: frequency,
      waveAmplitude: amplitude,
      primaryColor: baseColor,
      brightness: rsi / 100, // RSI affects brightness
      waveSpeed: frequency / 100
    };
  }
}
```

This system uses your creative color associations while maintaining accurate frequency relationships for actual audio synthesis.
