import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:5000';

function Bell({ name, frequency }) {
  const [imageData, setImageData] = useState('');

  useEffect(() => {
    axios.get(`${API_BASE}/api/cymatic?freq=${frequency}&amp=1.0`)
      .then(res => setImageData(res.data.image))
      .catch(err => console.error(err));
  }, [frequency]);

  return (
    <div className="bell">
      <h2>{name}</h2>
      <p>{frequency} Hz</p>
      {imageData ? <img src={imageData} alt={`Cymatic pattern for ${frequency} Hz`} /> : <p>Loading...</p>}
    </div>
  );
}

export default Bell;
