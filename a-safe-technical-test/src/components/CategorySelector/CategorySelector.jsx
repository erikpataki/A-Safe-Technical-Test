import './CategorySelector.css';
import React, { useEffect, useRef, useState } from 'react';

export default function CategorySelector({ options = [], selected = [], onChange }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const onDocClick = (e) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, []);

  const toggle = (e) => {
    e.stopPropagation();
    setOpen((o) => !o);
  };

  const onItemChange = (type, checked) => {
    const set = new Set(selected);
    if (checked) set.add(type);
    else set.delete(type);
    onChange?.(Array.from(set));
  };

  const stop = (e) => e.stopPropagation();

  // When open, set a global data flag to let the app know to ignore document-click navigation
  useEffect(() => {
    const root = document.documentElement;
    if (open) root.dataset.dropdownOpen = '1';
    else delete root.dataset.dropdownOpen;
    return () => {
      delete root.dataset.dropdownOpen;
    };
  }, [open]);

  return (
    <div ref={containerRef} className={`category-selector ${open ? 'open' : ''}`} onClick={stop}>
      <button className="cat-btn" onClick={toggle} aria-expanded={open} aria-haspopup="listbox">
        {selected.length > 0 ? `${selected.length} selected` : 'All categories'}
        <span className={`triangle ${open ? 'rot' : ''}`} aria-hidden>▾</span>
      </button>

      {/* Keep mounted for animation */}
      <div className={`dropdown ${open ? 'open' : ''}`} role="listbox" aria-hidden={!open}>
        {options.length === 0 ? (
          <div className="empty">No categories</div>
        ) : (
          <ul>
            {options.map((opt) => {
              const type = typeof opt === 'string' ? opt : opt.type;
              const count = typeof opt === 'string' ? undefined : opt.count;
              const id = `cat-${type}`;
              const checked = selected.includes(type);
              return (
                <li key={type}>
                  <label htmlFor={id}>
                    <span className="lbl">{count !== undefined ? `${type} (${count})` : type}</span>
                    <input
                      id={id}
                      type="checkbox"
                      checked={checked}
                      onChange={(e) => onItemChange(type, e.target.checked)}
                      onClick={stop}
                    />
                  </label>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}