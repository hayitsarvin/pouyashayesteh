import { motion } from 'motion/react';

interface MazeDotsProps {
  eatenDots: Set<string>;
  onDotEat: (dotId: string) => void;
  pacmanPosition?: { x: number; y: number };
}

export function MazeDots({ eatenDots, onDotEat, pacmanPosition }: MazeDotsProps) {
  const horizontalDots = Array.from({ length: 30 });
  const verticalDots = Array.from({ length: 18 });

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Top horizontal line of dots */}
      <div className="absolute top-[22px] left-4 right-4 flex justify-between">
        {horizontalDots.map((_, i) => {
          const dotId = `top-${i}`;
          const isEaten = eatenDots.has(dotId);
          
          return (
            <motion.div
              key={dotId}
              className="w-2 h-2 bg-white rounded-sm"
              initial={{ opacity: 1, scale: 1 }}
              animate={{ 
                opacity: isEaten ? 0 : [1, 0.3, 1],
                scale: isEaten ? 0 : [1, 0.8, 1]
              }}
              transition={{
                duration: 2,
                repeat: isEaten ? 0 : Infinity,
                delay: i * 0.05,
              }}
            />
          );
        })}
      </div>

      {/* Bottom horizontal line of dots */}
      <div className="absolute bottom-[22px] left-4 right-4 flex justify-between">
        {horizontalDots.map((_, i) => {
          const dotId = `bottom-${i}`;
          const isEaten = eatenDots.has(dotId);
          
          return (
            <motion.div
              key={dotId}
              className="w-2 h-2 bg-white rounded-sm"
              initial={{ opacity: 1, scale: 1 }}
              animate={{ 
                opacity: isEaten ? 0 : [1, 0.3, 1],
                scale: isEaten ? 0 : [1, 0.8, 1]
              }}
              transition={{
                duration: 2,
                repeat: isEaten ? 0 : Infinity,
                delay: i * 0.05 + 0.5,
              }}
            />
          );
        })}
      </div>

      {/* Vertical left dots */}
      <div className="absolute top-4 bottom-4 left-[22px] flex flex-col justify-between">
        {verticalDots.map((_, i) => {
          const dotId = `left-${i}`;
          const isEaten = eatenDots.has(dotId);
          
          return (
            <motion.div
              key={dotId}
              className="w-2 h-2 bg-white rounded-sm"
              initial={{ opacity: 1, scale: 1 }}
              animate={{ 
                opacity: isEaten ? 0 : [1, 0.3, 1],
                scale: isEaten ? 0 : [1, 0.8, 1]
              }}
              transition={{
                duration: 2,
                repeat: isEaten ? 0 : Infinity,
                delay: i * 0.1,
              }}
            />
          );
        })}
      </div>

      {/* Vertical right dots */}
      <div className="absolute top-4 bottom-4 right-[22px] flex flex-col justify-between">
        {verticalDots.map((_, i) => {
          const dotId = `right-${i}`;
          const isEaten = eatenDots.has(dotId);
          
          return (
            <motion.div
              key={dotId}
              className="w-2 h-2 bg-white rounded-sm"
              initial={{ opacity: 1, scale: 1 }}
              animate={{ 
                opacity: isEaten ? 0 : [1, 0.3, 1],
                scale: isEaten ? 0 : [1, 0.8, 1]
              }}
              transition={{
                duration: 2,
                repeat: isEaten ? 0 : Infinity,
                delay: i * 0.1 + 0.3,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}