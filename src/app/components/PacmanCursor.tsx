import { motion } from 'motion/react';
import { useState, useEffect } from 'react';

export function PacmanCursor({ visible = true }: { visible?: boolean }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isEating, setIsEating] = useState(false);

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', updatePosition);
    return () => window.removeEventListener('mousemove', updatePosition);
  }, []);

  const triggerEat = () => {
    setIsEating(true);
    setTimeout(() => setIsEating(false), 200);
  };

  useEffect(() => {
    (window as any).triggerPacmanEat = triggerEat;
  }, []);

  if (!visible) return null;

  return (
    <motion.div
      className="fixed pointer-events-none z-[100]"
      style={{
        left: position.x - 20,
        top: position.y - 20,
      }}
    >
      <motion.svg
        width={40}
        height={40}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        animate={{
          rotate: isEating ? [0, 15, 0, -15, 0] : 0,
        }}
        transition={{
          duration: 0.2,
        }}
      >
        <motion.path
          fillRule="evenodd"
          clipRule="evenodd"
          d={isEating 
            ? "M32 4C16.536 4 4 16.536 4 32C4 47.464 16.536 60 32 60C47.464 60 60 47.464 60 32C60 16.536 47.464 4 32 4Z"
            : "M32 4C16.536 4 4 16.536 4 32C4 47.464 16.536 60 32 60C47.464 60 60 47.464 60 32C60 27.516 58.912 23.264 56.992 19.456L32 32L56.992 44.544C58.912 40.736 60 36.484 60 32C60 16.536 47.464 4 32 4Z"
          }
          fill="#FFFF00"
          animate={{
            scale: isEating ? [1, 1.2, 1] : 1,
          }}
          transition={{ duration: 0.2 }}
        />
      </motion.svg>
    </motion.div>
  );
}