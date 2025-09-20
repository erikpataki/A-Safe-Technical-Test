import './App.css';
import React, { useState, useEffect } from 'react';

function App() {
  const [joke, setJoke] = useState(null);

  const fetchJoke = async () => {
      const res = await fetch('http://localhost:5000/api/jokes/random');
      const data = await res.json();
      setJoke(data);
  };

  //fetches joke on load
  useEffect(() => {
    fetchJoke();
  }, []);

  //clicking handler
  const handleClick = () => {
  fetchJoke();
  };

  useEffect(() => {
    const onDocClick = () => handleClick();
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, []);

  return (
    <div className='joke-container-parent'>
      <div className='joke-container'>
        <h2 className='joke-setup'>{joke ? joke.setup : ' '}</h2>
        <p className='joke-punchline'>{joke ? joke.punchline : ' '}</p>
      </div>
    </div>
  );
}

export default App;
