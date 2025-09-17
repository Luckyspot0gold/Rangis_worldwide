// File: demo/verification-demo.js
async function demonstrateRecursiveSecurity() {
  // Demo 1: Real-time market data verification
  const marketData = await fetchMarketData('BTC');
  const verification = await verifyDataRecursively(marketData);
  
  // Demo 2: Cross-device verification
  const mobileVerification = await verifyOnMobile(verification.proof);
  
  // Demo 3: Blockchain anchor verification
  const blockchainProof = await verifyBlockchainAnchor(verification.anchor);
  
  return {
    desktopVerification: verification,
    mobileVerification,
    blockchainProof,
    overallValid: verification.valid && mobileVerification.valid && blockchainProof.valid
  };
}
