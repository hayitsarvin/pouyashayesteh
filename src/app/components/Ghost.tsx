import { motion } from 'motion/react';

interface GhostProps {
  size?: number;
  color: string;
  delay?: number;
  direction?: 'left' | 'right';
  startY?: string;
  offsetX?: number; // Offset from starting position in pixels
  scared?: boolean; // Scared mode like in PAC-MAN when ghosts are vulnerable
}

export function Ghost({ 
  size = 40, 
  color, 
  delay = 0, 
  direction = 'left',
  startY = '50%',
  offsetX = 0,
  scared = false
}: GhostProps) {
  const startX = direction === 'left' ? '100vw' : '-100px';
  const endX = direction === 'left' ? '-100px' : '100vw';
  
  return (
    <motion.div
      className="absolute z-20"
      style={{
        width: size,
        height: size,
        top: startY,
      }}
      initial={{ x: startX }}
      animate={{ x: endX }}
      transition={{
        duration: 25, // Slower traversal
        repeat: Infinity,
        delay: delay,
        ease: 'linear',
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 14 14"
        xmlns="http://www.w3.org/2000/svg"
        shapeRendering="crispEdges"
        style={{ animation: 'ghost-float 0.5s ease-in-out infinite alternate' }}
      >
        {scared ? (
          // Scared ghost - blue with wavy mouth
          <>
            {/* Ghost body */}
            <path 
              fill="#2121DE" 
              d="M5,1 H9 V2 H11 V3 H12 V4 H13 V14 H11 V13 H10 V14 H8 V13 H6 V14 H4 V13 H3 V14 H1 V4 H2 V3 H3 V2 H5 V1 Z" 
            />
            
            {/* Eyes - white dots */}
            <rect x="3" y="4" width="2" height="2" fill="white" />
            <rect x="9" y="4" width="2" height="2" fill="white" />
            
            {/* Wavy mouth */}
            <rect x="2" y="9" width="1" height="2" fill="white" />
            <rect x="3" y="10" width="1" height="1" fill="white" />
            <rect x="4" y="9" width="1" height="2" fill="white" />
            <rect x="5" y="10" width="1" height="1" fill="white" />
            <rect x="6" y="9" width="1" height="2" fill="white" />
            <rect x="7" y="10" width="1" height="1" fill="white" />
            <rect x="8" y="9" width="1" height="2" fill="white" />
            <rect x="9" y="10" width="1" height="1" fill="white" />
            <rect x="10" y="9" width="1" height="2" fill="white" />
          </>
        ) : (
          // Normal ghost
          <>
            {/* Ghost body */}
            <path 
              fill={color} 
              d="M5,1 H9 V2 H11 V3 H12 V4 H13 V14 H11 V13 H10 V14 H8 V13 H6 V14 H4 V13 H3 V14 H1 V4 H2 V3 H3 V2 H5 V1 Z" 
            />
            
            {/* Eyes - white background */}
            <rect x="2" y="3" width="4" height="4" fill="white" />
            <rect x="8" y="3" width="4" height="4" fill="white" />
            
            {/* Pupils */}
            <rect x="4" y="5" width="2" height="2" fill="#2121DE" />
            <rect x="10" y="5" width="2" height="2" fill="#2121DE" />
          </>
        )}
      </svg>
    </motion.div>
  );
}