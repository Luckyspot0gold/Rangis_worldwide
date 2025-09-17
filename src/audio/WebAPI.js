import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:5000';

function Bell({ name, frequency }) {
  const [imageData, setImageData] = useState('');
  const audioContextRef = useRef(null);

  useEffect(() => {
    axios.get(`${API_BASE}/api/cymatic?freq=${frequency}&amp=1.0`)
      .then(res => setImageData(res.data.image))
      .catch(err => console.error(err));

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [frequency]);

  const playSound = () => {
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContextRef.current.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;
    oscillator.connect(audioContextRef.current.destination);
    oscillator.start();
    setTimeout(() => {
      oscillator.stop();
    }, 2000);
  };

  return (
    <div className="bell">
      <h2>{name}</h2>
      <p>{frequency} Hz</p>
      {imageData ? <img src={imageData} alt={`Cymatic pattern for ${frequency} Hz`} /> : <p>Loading...</p>}
      <button onClick={playSound}>Play</button>
    </div>
  );
}

export default Bell;
