// Connect hypersphere to harmonic audio
function updateFromHypersphere(point) {
  const [x, y, z, w] = extractCoordinates(point);
  const omega = 432 + (w * 100); // 4th dimension modulates frequency
  const intensity = Math.sqrt(x*x + y*y + z*z); // Distance from origin
  
  // Drive your existing 7-bell system
  sevenBellSynth.play(omega, intensity);
  
  // Update haptic vest patterns
  updateVestPatterns([x, y, z, w]);
}
