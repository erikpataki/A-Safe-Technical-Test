import './App.css';
import React, { useState, useEffect, useRef } from 'react';
import CustomCursor from './components/CustomCursor/CustomCursor';

function App() {
  const [joke, setJoke] = useState(null);

  // history of jokes and index for prev/next navigation
  const historyRef = useRef([]);
  const indexRef = useRef(-1);

  const fetchJoke = async (push = true) => {
      const res = await fetch('http://localhost:5000/api/jokes/random');
      const data = await res.json();
      setJoke(data);

      if (push) {
        // trim forward history if we've gone back
        historyRef.current = historyRef.current.slice(0, indexRef.current + 1);
        historyRef.current.push(data);
        indexRef.current = historyRef.current.length - 1;
      }
  };

  //fetches joke on load and adds to history
  useEffect(() => {
    fetchJoke(true);
  }, []);

  // navigation helpers
  const goPrevious = () => {
    if (indexRef.current > 0) {
      indexRef.current -= 1;
      setJoke(historyRef.current[indexRef.current]);
    }
  };

  const goNext = () => {
    if (indexRef.current < historyRef.current.length - 1) {
      indexRef.current += 1;
      setJoke(historyRef.current[indexRef.current]);
    } else {
      // fetch new joke and push into history
      fetchJoke(true);
    }
  };

  // clicking left half = previous, right half = next
  useEffect(() => {
    const onDocClick = (e) => {
      const x = e.clientX;
      const half = window.innerWidth / 2;
      if (x < half) goPrevious();
      else goNext();
    };
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, []);

  return (
    <>
      <CustomCursor/>
      <div className='joke-container-parent'>
      <div className='joke-container'>
        <h2 className='joke-setup'>{joke ? joke.setup : ' '}</h2>
        <p className='joke-punchline'>{joke ? joke.punchline : ' '}</p>
      </div>
      </div>
    </>
  );
}

export default App;
