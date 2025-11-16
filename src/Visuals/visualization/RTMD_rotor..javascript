var marketRotor = (btcMomentum, volatility, sentiment) => 
  Math.exp(
    btcMomentum * e12 + 
    volatility * e13 + 
    sentiment * e23 + 
    (rsi - 50)/50 * e14
  );
