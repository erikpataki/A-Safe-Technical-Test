import './App.css';
import React, { useState, useEffect, useRef } from 'react';
import CustomCursor from './components/CustomCursor/CustomCursor';
import CategorySelector from './components/CategorySelector/CategorySelector';

function App() {
  const [joke, setJoke] = useState(null);
  const [types, setTypes] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [revealed, setRevealed] = useState(false);

  // history of jokes and index for prev/next navigation
  const historyRef = useRef([]);
  const indexRef = useRef(-1);

  const fetchJoke = async (push = true) => {
    const qs = selectedTypes.length > 0 ? `?types=${encodeURIComponent(selectedTypes.join(','))}` : '';
      const res = await fetch(`http://localhost:5000/api/jokes/random${qs}`);
      if (!res.ok) {
        setJoke(null);
        return;
      }
      const data = await res.json();
      setRevealed(false);
      setJoke(data);

      if (push) {
        // trim forward history if we've gone back
        historyRef.current = historyRef.current.slice(0, indexRef.current + 1);
        historyRef.current.push(data);
        indexRef.current = historyRef.current.length - 1;
      }
  };

  // load categories on start. first click fetches first joke
  useEffect(() => {
    const load = async () => {
      try {
        // Prefer stats (type + count). Fallback to plain list if stats not available.
        const statsRes = await fetch('http://localhost:5000/api/types/stats');
        if (statsRes.ok) {
          const rows = await statsRes.json();
          // Sort by most jokes first. if same then alphabetically
          rows.sort((a, b) => {
            const byCount = (b.count ?? 0) - (a.count ?? 0);
            return byCount !== 0 ? byCount : String(a.type).localeCompare(String(b.type));
          });
          setTypes(rows);
          return;
        }
        const listRes = await fetch('http://localhost:5000/api/types');
        if (listRes.ok) {
          const list = await listRes.json();
          setTypes(list.map((t) => ({ type: t, count: undefined })));
        }
      } catch {}
    };
    load();
  }, []);

  useEffect(() => {
    historyRef.current = historyRef.current.slice(0, indexRef.current + 1);
  }, [selectedTypes]);

  // navigation helpers
  const goPrevious = () => {
    if (indexRef.current > 0) {
      indexRef.current -= 1;
      setRevealed(false);
      setJoke(historyRef.current[indexRef.current]);
    }
  };

  const goNext = () => {
    if (indexRef.current < historyRef.current.length - 1) {
      indexRef.current += 1;
      setRevealed(false);
      setJoke(historyRef.current[indexRef.current]);
    } else {
      // fetch new joke and push into history
      fetchJoke(true);
    }
  };

  // clicking left half = previous, right half = next
  useEffect(() => {
    const onDocClick = (e) => {
      // ignore clicks on the category selector to allow interaction
      const selEl = document.querySelector('.category-selector');
      if (selEl && selEl.contains(e.target)) return;
      if (document.documentElement.dataset.dropdownOpen === '1') return;

      const x = e.clientX;
      const half = window.innerWidth / 2;
      if (x < half) {
        goPrevious();
      } else {
        if (!joke) {
          fetchJoke(true);
        } else if (!revealed) {
          setRevealed(true);
        } else {
          goNext();
        }
      }
    };
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, [selectedTypes, revealed, joke]);

  return (
    <>
      <CustomCursor
        size={50}
        smooth={0.2}
      />
      <CategorySelector
        options={types}
        selected={selectedTypes}
        onChange={setSelectedTypes}
      />
      <div className='joke-container-parent'>
        <div className='joke-container'>
          <h2 className='joke-setup'>{joke ? joke.setup : ' '}</h2>
          <p className={`joke-punchline ${revealed ? 'revealed' : ''}`}>{revealed && joke ? joke.punchline : ' '}</p>
        </div>
      </div>
    </>
  );
}

export default App;
