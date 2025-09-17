// src/cymatics.js
// Lightweight cymatic + sonification module.
// Usage: import { initCymatics, triggerEvent } from './cymatics'
// Call initCymatics(canvasElement) once. Call triggerEvent({type:'up'|'down'|'normal', strength:0.0-1.0})

let audioCtx = null;
let masterGain = null;
let oscNodes = [];
let canvas, ctx, w, h, particles = [];
let running = false;
const BASE_FREQ = 432;

export function initCymatics(canvasEl) {
  canvas = canvasEl;
  ctx = canvas.getContext('2d', { alpha: true });
  resize();
  window.addEventListener('resize', resize);
  initAudio();
  initParticles();
  if (!running) { running = true; requestAnimationFrame(loop); }
}

function initAudio() {
  if (audioCtx) return;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return;
  audioCtx = new AC();
  masterGain = audioCtx.createGain();
  masterGain.gain.value = 0.08;
  masterGain.connect(audioCtx.destination);
}

function playHarmonic(base = BASE_FREQ, band = 0.0, duration = 0.45) {
  if (!audioCtx) initAudio();
  if (!audioCtx) return;
  // create fundamental + a couple harmonics
  const freqs = [base, base * 2, base * 3];
  const nodes = freqs.map((f, i) => {
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.type = i === 0 ? 'sine' : 'sawtooth';
    o.frequency.value = f * (1 + band * (i * 0.02));
    g.gain.value = (i === 0 ? 1 : 0.25) * (1 - band * 0.5) * 0.6;
    o.connect(g); g.connect(masterGain);
    o.start();
    g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
    o.stop(audioCtx.currentTime + duration + 0.02);
    return {o,g};
  });
  // cleanup
  setTimeout(() => nodes.forEach(n => { try { n.o.disconnect(); n.g.disconnect(); } catch(e){} }), (duration+0.1)*1000);
}

function resize() {
  if (!canvas) return;
  const rect = canvas.getBoundingClientRect();
  canvas.width = Math.floor(rect.width * (window.devicePixelRatio || 1));
  canvas.height = Math.floor(rect.height * (window.devicePixelRatio || 1));
  canvas.style.width = rect.width + 'px';
  canvas.style.height = rect.height + 'px';
  ctx && ctx.setTransform(window.devicePixelRatio || 1,0,0,window.devicePixelRatio || 1,0,0);
  w = rect.width; h = rect.height;
  initParticles();
}

function initParticles() {
  particles = [];
  if (!w || !h) return;
  const N = Math.min(900, Math.floor((w*h)/3500));
  for (let i=0;i<N;i++){
    particles.push({
      x: Math.random()*w,
      y: Math.random()*h,
      size: 0.8 + Math.random()*2.2,
      hue: 200 + Math.random()*120,
      angle: Math.random()*Math.PI*2,
      speed: 0.2 + Math.random()*1.0,
      base: Math.random()
    });
  }
}

function loop(t) {
  if (!ctx) return;
  ctx.fillStyle = 'rgba(6,12,22,0.12)';
  ctx.fillRect(0,0,w,h);
  const cx = w/2, cy = h/2, time = t*0.001;
  particles.forEach(p=>{
    const dx = p.x - cx, dy = p.y - cy;
    const dist = Math.sqrt(dx*dx+dy*dy)+0.001;
    const wave = Math.sin(dist*0.02 - time*(p.base*2+1));
    const accel = wave * 0.6 * p.speed;
    p.x += Math.cos(p.angle) * accel * 0.6;
    p.y += Math.sin(p.angle) * accel * 0.6;
    p.angle += 0.001 * p.speed;
    if(p.x<-20) p.x = w+20; if(p.x>w+20) p.x=-20;
    if(p.y<-20) p.y = h+20; if(p.y>h+20) p.y=-20;
    ctx.beginPath();
    const alpha = 0.4 + Math.max(0, (1 - dist/Math.max(w,h)));
    ctx.fillStyle = `hsla(${p.hue},85%,${40 + wave*10}%,${alpha})`;
    ctx.arc(p.x,p.y,p.size,0,Math.PI*2);
    ctx.fill();
  });
  requestAnimationFrame(loop);
}

/**
 * triggerEvent({type:'up'|'down'|'normal', strength:0-1})
 */
export function triggerEvent(evt = {type:'normal', strength:0.5}) {
  // sonification mapping
  const band = Math.min(0.6, Math.max(0, evt.strength || 0.4));
  if (evt.type === 'up') {
    playHarmonic(BASE_FREQ * (1 + band*0.06), band, 0.5);
  } else if (evt.type === 'down') {
    // lower freq + distortion
    playHarmonic(BASE_FREQ * (1 - band*0.12), band, 0.55);
  } else {
    playHarmonic(BASE_FREQ, band*0.2, 0.28);
  }
}
