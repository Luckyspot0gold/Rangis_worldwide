``python
# harmonic_colorizer.py
import numpy as np
import matplotlib.colors as mcolors
from scipy.signal import spectrogram

class HarmonicColorizer:
    # Define the user's precise color mapping for notes
    NOTE_TO_COLOR = {
        'C': '#FF00FF',  # Magenta
        'D': '#FFA500',  # Orange
        'E': '#FFFF00',  # Yellow
        'F': '#0000FF',  # Blue
        'G': '#800080',  # Purple
        'A': '#FFFFFF',  # White (432Hz base)
        'B': '#FF0000'   # Red
    }
    
    # 432Hz Tuning System - Base frequency and ratios for equal temperament
    A4_FREQ = 432.0  # Base frequency
    # Frequency ratios for equal temperament scale
    EQUAL_TEMPERAMENT_RATIOS = {
        'C': 261.63 / 440.0,  # Calculated from standard then converted
        'D': 293.66 / 440.0,
        'E': 329.63 / 440.0,
        'F': 349.23 / 440.0,
        'G': 392.00 / 440.0,
        'A': 440.00 / 440.0,
        'B': 493.88 / 440.0
    }
    
    def __init__(self, sample_rate=44100):
        self.sample_rate = sample_rate
        # Pre-calculate the precise 432Hz-based frequencies
        self.note_frequencies = {
            note: ratio * self.A4_FREQ 
            for note, ratio in self.EQUAL_TEMPERAMENT_RATIOS.items()
        }
        print("Note Frequencies for 432Hz Tuning:")
        for note, freq in self.note_frequencies.items():
            print(f"{note}: {freq:.2f} Hz")
    
    def frequency_to_note(self, frequency, tolerance=5.0):
        """
        Convert a frequency to the closest note in the 432Hz scale.
        
        Parameters:
        frequency (float): Input frequency in Hz
        tolerance (float): Frequency range to accept a match (in Hz)
        
        Returns:
        str: Note name or None if no match
        """
        for note, target_freq in self.note_frequencies.items():
            if abs(frequency - target_freq) <= tolerance:
                return note
        return None
    
    def note_to_color(self, note):
        """
        Get the RGB color for a given note.
        
        Parameters:
        note (str): Note name ('C', 'D', etc.)
        
        Returns:
        tuple: RGB values in 0-1 range, or None if not found
        """
        hex_color = self.NOTE_TO_COLOR.get(note)
        if hex_color:
            # Convert HEX to RGB (0-1 range for matplotlib)
            return mcolors.hex2color(hex_color)
        return None
    
    def frequency_to_color(self, frequency):
        """
        Directly convert a frequency to its corresponding color.
        
        Parameters:
        frequency (float): Input frequency in Hz
        
        Returns:
        tuple: RGB values in 0-1 range, or (0, 0, 0) if no match
        """
        note = self.frequency_to_note(frequency)
        if note:
            return self.note_to_color(note)
        return (0, 0, 0)  # Black for no match
    
    def analyze_audio_buffer(self, audio_data, visualize=True):
        """
        Analyze an audio buffer to find dominant frequencies and their colors.
        
        Parameters:
        audio_data (array): Input audio samples
        visualize (bool): Whether to create a visualization
        
        Returns:
        dict: Dominant notes and their colors
        """
        # Use spectrogram to find dominant frequencies
        freqs, times, Sxx = spectrogram(audio_data, self.sample_rate)
        
        # Find dominant frequency at each time segment
        dominant_freqs = []
        for i in range(Sxx.shape[1]):
            power_spectrum = Sxx[:, i]
            dominant_idx = np.argmax(power_spectrum)
            dominant_freqs.append(freqs[dominant_idx])
        
        # Convert to notes and colors
        note_counts = {}
        for freq in dominant_freqs:
            note = self.frequency_to_note(freq)
            if note:
                note_counts[note] = note_counts.get(note, 0) + 1
        
        # Get most common notes
        dominant_notes = sorted(note_counts.items(), key=lambda x: x[1], reverse=True)
        
        result = {}
        for note, count in dominant_notes[:3]:  # Top 3 notes
            result[note] = {
                'color_hex': self.NOTE_TO_COLOR[note],
                'color_rgb': self.note_to_color(note),
                'frequency': self.note_frequencies[note],
                'count': count
            }
        
        if visualize:
            self._create_visualization(audio_data, result)
        
        return result
    
    def _create_visualization(self, audio_data, note_data):
        """Create a visualization of the audio analysis"""
        try:
            import matplotlib.pyplot as plt
            from matplotlib.patches import Rectangle
            
            # Create figure
            fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(10, 8))
            
            # Plot waveform
            ax1.plot(np.linspace(0, len(audio_data)/self.sample_rate, len(audio_data)), audio_data)
            ax1.set_title('Audio Waveform')
            ax1.set_xlabel('Time (s)')
            ax1.set_ylabel('Amplitude')
            
            # Create color visualization
            ax2.set_title('Dominant Harmonic Colors')
            ax2.set_xlim(0, 10)
            ax2.set_ylim(0, 10)
            ax2.axis('off')
            
            # Display dominant colors
            x_pos = 1
            for note, data in note_data.items():
                color = data['color_rgb']
                rect = Rectangle((x_pos, 4), 1, 2, facecolor=color)
                ax2.add_patch(rect)
                ax2.text(x_pos + 0.5, 3.5, f"{note}\n{data['frequency']:.1f}Hz", 
                        ha='center', va='top')
                x_pos += 2
            
            plt.tight_layout()
            plt.savefig('harmonic_analysis.png')
            plt.close()
            print("Visualization saved as 'harmonic_analysis.png'")
            
        except ImportError:
            print("Matplotlib not installed. Skipping visualization.")
    
    def generate_color_gradient(self, base_note, duration=5.0):
        """
        Generate a smooth color gradient based on harmonic progression.
        
        Parameters:
        base_note (str): Starting note for the gradient
        duration (float): Duration in seconds
        
        Returns:
        array: Sequence of RGB values for animation
        """
        # Get base color
        base_color = np.array(mcolors.hex2color(self.NOTE_TO_COLOR[base_note]))
        
        # Create gradient through related colors
        gradient_frames = []
        for note in ['C', 'D', 'E', 'F', 'G', 'A', 'B']:
            target_color = np.array(mcolors.hex2color(self.NOTE_TO_COLOR[note]))
            # Interpolate between base and target
            for alpha in np.linspace(0, 1, int(duration*10/7)):
                blend_color = base_color * (1-alpha) + target_color * alpha
                gradient_frames.append(blend_color)
        
        return gradient_frames


# Example usage and integration with your existing MarketSonifier
if __name__ == "__main__":
    # Initialize the colorizer with 432Hz tuning
    colorizer = HarmonicColorizer()
    
    # Test with specific frequencies
    test_frequencies = [432.0, 323.63, 256.0, 550.0]
    
    print("\nFrequency to Color Mapping:")
    for freq in test_frequencies:
        note = colorizer.frequency_to_note(freq)
        color = colorizer.frequency_to_color(freq)
        print(f"{freq:6.2f} Hz -> {note} -> {color}")
    
    # Example: Generate a beautiful gradient from the 432Hz note (A)
    print("\nGenerating color gradient from A (432Hz)...")
    gradient = colorizer.generate_color_gradient('A', duration=3.0)
    print(f"Generated {len(gradient)} color frames for animation")
    
    # This would be integrated with your MarketSonifier like this:
    class EnhancedMarketSonifier(MarketSonifier):
        def __init__(self, *args, **kwargs):
            super().__init__(*args, **kwargs)
            self.colorizer = HarmonicColorizer(sample_rate=self.sample_rate)
        
        def play_asset_with_color(self, asset_symbol, instrument, base_note, hri, sss, duration=1.0):
            """Enhanced version that adds color visualization"""
            # Original audio functionality
            note_id = super().play_asset(asset_symbol, instrument, base_note, hri, sss, duration)
            
            # New color functionality
            base_freq = self.NOTE_FREQUENCIES[base_note]
            adjusted_freq = self.note_frequency(base_note, base_freq, hri)
            
            # Get color for this frequency
            color = self.colorizer.frequency_to_color(adjusted_freq)
            color_hex = self.colorizer.NOTE_TO_COLOR.get(
                self.colorizer.frequency_to_note(adjusted_freq), '#000000')
            
            print(f"Asset {asset_symbol} playing at {adjusted_freq:.2f} Hz with color {color_hex}")
            
            # Here you would send this color data to your visualization system
            # For example: control LED lights, update UI, or generate visual effects
            
            return note_id, color_hex
```
