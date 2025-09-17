function playFrequency(frequency, duration = 2) {
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioCtx.createOscillator();
  oscillator.type = 'sine';
  oscillator.frequency.value = frequency;
  oscillator.connect(audioCtx.destination);
  oscillator.start();
  setTimeout(() => {
    oscillator.stop();
  }, duration * 1000);
}
