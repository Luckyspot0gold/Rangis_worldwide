import { miniMintDemo } from './mint-demo';
import { triggerEvent } from './cymatics';

const mintBtn = document.getElementById('mintBtn');
const mintStatus = document.getElementById('mintStatus');

mintBtn.addEventListener('click', async () => {
  mintBtn.disabled = true;
  mintStatus.textContent = 'Minting Reality Capsule…';
  // capture a tiny payload: price + time
  const price = window.currentBtcPrice || null; // set this in your market fetch
  const payload = { btcPrice: price, note: 'Hackathon demo capsule' };
  // play celebratory harmonic + cymatic flash
  triggerEvent({type:'up', strength:0.8});
  try {
    const r = await miniMintDemo({ ownerAddress: 'demo_user', payload });
    if (r.ok) {
      mintStatus.textContent = `Minted demo: ${r.txHash}`;
    } else {
      mintStatus.textContent = 'Mint failed (demo).';
    }
  } catch (e) {
    mintStatus.textContent = 'Error minting (demo).';
    console.error(e);
  } finally {
    mintBtn.disabled = false;
    setTimeout(()=>mintStatus.textContent = '', 6000);
  }
});
