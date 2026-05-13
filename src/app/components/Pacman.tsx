import { motion } from 'motion/react';

interface PacmanProps {
  size?: number;
  color?: string;
  delay?: number;
  animate?: boolean;
}

export function Pacman({ size = 40, color = '#ffff00', delay = 0, animate = true }: PacmanProps) {
  return (
    <motion.div
      className="relative"
      style={{ width: size, height: size }}
      initial={{ x: -100 }}
      animate={animate ? { x: '100vw' } : {}}
      transition={{
        duration: 15,
        repeat: Infinity,
        delay,
        ease: 'linear',
      }}
    >
      <motion.svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        animate={{
          rotate: [0, 15, 0, -15, 0],
        }}
        transition={{
          duration: 0.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M32 4C16.536 4 4 16.536 4 32C4 47.464 16.536 60 32 60C47.464 60 60 47.464 60 32C60 27.516 58.912 23.264 56.992 19.456L32 32L56.992 44.544C58.912 40.736 60 36.484 60 32C60 16.536 47.464 4 32 4Z"
          fill={color}
        />
        <circle cx="42" cy="18" r="3" fill="#000000" />
      </motion.svg>
    </motion.div>
  );
}