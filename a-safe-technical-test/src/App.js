import React, { useState, useEffect } from 'react';

function App() {
  const [joke, setJoke] = useState(null);

  const fetchJoke = async () => {
      const res = await fetch('http://localhost:5000/api/jokes/random');
      const data = await res.json();
      setJoke(data);
  };

  useEffect(() => {
    fetchJoke();
  }, []);

  const handleClick = () => {
  fetchJoke();
  };

  return (
    <div>
      <div onClick={handleClick}>
        <h2>{joke ? joke.setup : ' '}</h2>
        <p>{joke ? joke.punchline : ' '}</p>
        <p>
          Click
        </p>
      </div>
    </div>
  );
}

export default App;
