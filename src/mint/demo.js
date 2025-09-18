// src/mint-demo.js
// Demo mint: creates a local JSON "capsule" and returns a fake txn hash.
// For hackathon we show "minted" UX without keys.

export async function miniMintDemo({ ownerAddress = 'demo', payload = {} } = {}) {
  // payload could include timestamp, btcPrice, cymaticSnapshot (we'll store only metadata)
  const capsule = {
    id: 'capsule_' + Date.now(),
    owner: ownerAddress,
    timestamp: new Date().toISOString(),
    meta: payload
  };
  // simulate network delay
  await new Promise(r => setTimeout(r, 900));
  // store in localStorage for demo retrieval
  const list = JSON.parse(localStorage.getItem('reality_capsules') || '[]');
  list.unshift(capsule);
  localStorage.setItem('reality_capsules', JSON.stringify(list.slice(0,50)));
  return { ok: true, txHash: 'demo_tx_' + Math.floor(Math.random()*1000000), capsule };
}
