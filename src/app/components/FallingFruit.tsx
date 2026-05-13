import { motion } from 'motion/react';
import { useState } from 'react';

interface FallingFruitProps {
  type: 'cherry' | 'apple' | 'orange';
  delay: number;
  startX: string;
  duration: number;
  onEat: (points: number) => void;
}

export function FallingFruit({ type, delay, startX, duration, onEat }: FallingFruitProps) {
  const [isEaten, setIsEaten] = useState(false);

  const test = ""
  const fruitPoints = {
    cherry: 100,
    apple: 300,
    orange: 500,

  };

  const handleEat = () => {
    if (!isEaten) {
      setIsEaten(true);
      onEat(fruitPoints[type]);
      if ((window as any).triggerPacmanEat) {
        (window as any).triggerPacmanEat();
      }
    }
  };

  if (isEaten) return null;

  const fruits = {
    cherry: (
      <svg width="48" height="48" viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg" shapeRendering="crispEdges">
        {/* Stems */}
        <rect x="5" y="3" width="1" height="2" fill="#65421D"/>
        <rect x="6" y="2" width="2" height="1" fill="#65421D"/>
        <rect x="8" y="3" width="1" height="2" fill="#65421D"/>
        
        {/* Left Cherry */}
        <rect x="3" y="6" width="1" height="3" fill="#FF0000"/>
        <rect x="4" y="5" width="2" height="5" fill="#FF0000"/>
        <rect x="6" y="6" width="1" height="3" fill="#FF0000"/>
        
        {/* Left Cherry Shine */}
        <rect x="4" y="6" width="1" height="1" fill="#FFB6C1"/>
        
        {/* Right Cherry */}
        <rect x="7" y="6" width="1" height="3" fill="#FF0000"/>
        <rect x="8" y="5" width="2" height="5" fill="#FF0000"/>
        <rect x="10" y="6" width="1" height="3" fill="#FF0000"/>
        
        {/* Right Cherry Shine */}
        <rect x="8" y="6" width="1" height="1" fill="#FFB6C1"/>
      </svg>
    ),
    apple: (
      <svg width="48" height="48" viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg" shapeRendering="crispEdges">
        {/* Leaves */}
        <rect x="6" y="2" width="2" height="1" fill="#2DBE55"/>
        <rect x="5" y="3" width="1" height="1" fill="#2DBE55"/>
        <rect x="8" y="3" width="2" height="1" fill="#2DBE55"/>
        
        {/* Strawberry Body */}
        <rect x="5" y="4" width="4" height="1" fill="#FC4A4D"/>
        <rect x="4" y="5" width="6" height="1" fill="#FC4A4D"/>
        <rect x="3" y="6" width="8" height="3" fill="#FC4A4D"/>
        <rect x="4" y="9" width="6" height="1" fill="#FC4A4D"/>
        <rect x="5" y="10" width="4" height="1" fill="#FC4A4D"/>
        
        {/* Seeds */}
        <rect x="5" y="6" width="1" height="1" fill="#FFE989"/>
        <rect x="8" y="6" width="1" height="1" fill="#FFE989"/>
        <rect x="4" y="7" width="1" height="1" fill="#FFE989"/>
        <rect x="6" y="7" width="1" height="1" fill="#FFE989"/>
        <rect x="9" y="7" width="1" height="1" fill="#FFE989"/>
        <rect x="5" y="8" width="1" height="1" fill="#FFE989"/>
        <rect x="8" y="8" width="1" height="1" fill="#FFE989"/>
      </svg>
    ),
    orange: (
      <svg width="48" height="48" viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg" shapeRendering="crispEdges">
        {/* Leaf */}
        <rect x="6" y="2" width="2" height="1" fill="#2DBE55"/>
        
        {/* Orange Body */}
        <rect x="5" y="4" width="4" height="1" fill="#FEAE34"/>
        <rect x="4" y="5" width="6" height="1" fill="#FEAE34"/>
        <rect x="3" y="6" width="8" height="3" fill="#FEAE34"/>
        <rect x="4" y="9" width="6" height="1" fill="#FEAE34"/>
        <rect x="5" y="10" width="4" height="1" fill="#FEAE34"/>
      </svg>
    ),
  };

  return (
    <motion.div
      className="absolute z-50 cursor-none"
      style={{
        left: startX,
        top: -100,
        pointerEvents: 'auto',
      }}
      initial={{ y: -100, opacity: 1, rotate: 0 }}
      animate={{ 
        y: 'calc(100vh + 100px)', 
        opacity: 1,
        rotate: 360,
      }}
      transition={{
        duration: duration,
        delay: delay,
        repeat: Infinity,
        ease: 'linear',
      }}
      onMouseEnter={handleEat}
      onClick={handleEat}
    >
      {fruits[type]}
    </motion.div>
  );
}