import './CustomCursor.css'
import React, { useEffect, useRef, useState } from 'react';
import cursorImgBG from '../../assets/cursor - just bg.svg';
import cursorImgArrow from '../../assets/cursor - just arrow.svg';

export default function CustomCursor({ size = 50, smooth = 0.15, hasBack = false }) {
  const target = useRef({ x: -100, y: -100 });
  const current = useRef({ x: -100, y: -100 });
  const [renderPos, setRenderPos] = useState({ x: -100, y: -100 });
  const [visible, setVisible] = useState(false);
  const [isLeft, setIsLeft] = useState(false);
  const raf = useRef(null);
  const firstMove = useRef(true);

  useEffect(() => {
    const onMove = (e) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
  // set left/right state for flipping arrow
  setIsLeft(e.clientX < window.innerWidth / 2);
      if (firstMove.current) {
        firstMove.current = false;
        current.current.x = e.clientX;
        current.current.y = e.clientY;
        setRenderPos({ x: e.clientX, y: e.clientY });
      }
      setVisible(true);
    };
    const onEnter = () => setVisible(true);
    const onLeave = () => setVisible(false);

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseenter', onEnter);
    window.addEventListener('mouseleave', onLeave);

    const loop = () => {
      current.current.x += (target.current.x - current.current.x) * smooth;
      current.current.y += (target.current.y - current.current.y) * smooth;

      setRenderPos({ x: current.current.x, y: current.current.y });

      raf.current = requestAnimationFrame(loop);
    };

    raf.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseenter', onEnter);
      window.removeEventListener('mouseleave', onLeave);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [smooth]);

  const style = {
    left: `${renderPos.x}px`,
    top: `${renderPos.y}px`,
    width: `${size}px`,
    height: `${size}px`,
    opacity: visible ? 1 : 0,
  };

  const flipLeft = hasBack && isLeft;
  return (
    <div className={`custom-cursor ${flipLeft ? 'on-left' : ''}`} style={style}>
      <div className="cursor-inner">
        <img className="cursor-bg" src={cursorImgBG}/>
        <img className="cursor-arrow" src={cursorImgArrow}/>
      </div>
    </div>
  );
}
