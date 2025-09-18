import time
import math

class HeartbeatSimulator:
    """
    Simulates a heartbeat pulse with adjustable frequency and amplitude.
    This can be used to drive visual, audio, or haptic feedback in Rangi's Heartbeat.
    """
    def __init__(self, base_frequency=1.0, amplitude=1.0):
        self.base_frequency = base_frequency  Hz
        self.amplitude = amplitude  # Scale of pulse
        self.is_beating = False

    def start_beat(self):
        """Start the heartbeat simulation."""
        self.is_beating = True
        print("Heartbeat started...")

    def stop_beat(self):
        """Stop the heartbeat simulation."""
        self.is_beating = False
        print("Heartbeat stopped.")

    def generate_pulse(self, time_point):
        """
        Generate a pulse value at a given time point.
        Uses a sinusoidal model with harmonics for a more natural feel.
        """
        pulse = self.amplitude * math.sin(2 * math.pi * self.base_frequency * time_point)
        # Add a secondary harmonic for a more 'organic' feel
        pulse += 0.5 * self.amplitude * math.sin(4 * math.pi * self.base_frequency * time_point)
        return pulse

    def run(self, duration=10):
        """
        Run the heartbeat simulation for a specified duration.
        In a real application, this could drive LEDs, speakers, or haptic motors.
        """
        self.start_beat()
        start_time = time.time()
        try:
            while self.is_beating and (time.time() - start_time) < duration:
                t = time.time() - start_time
                pulse_value = self.generate_pulse(t)
                # Here, you could map pulse_value to output devices
                # For example:
                # - Set LED brightness
                # - Play a sound with volume based on pulse_value
                # - Trigger a haptic motor
                print(f"Pulse value: {pulse_value:.2f}")
                time.sleep(0.05)  # Control update rate
        except KeyboardInterrupt:
            pass
        finally:
            self.stop_beat()

# Example usage
if __name__ == "__main__":
    heartbeat = HeartbeatSimulator(base_frequency=1.5, amplitude=1.0)
    heartbeat.run(duration=10)
