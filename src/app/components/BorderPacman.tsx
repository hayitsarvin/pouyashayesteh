import { motion, useTime, useTransform, useMotionValue, MotionValue } from 'motion/react';
import { useEffect, useState, useRef } from 'react';

// Grid size creates the alignment logic
const GRID_SIZE = 40;
const SPEED_PX_PER_SEC = 120; // Slower speed for better visibility

interface Point {
  id: string;
  x: number;
  y: number;
  progress: number; // 0 to 1 position along the perimeter
  side: 'top' | 'right' | 'bottom' | 'left';
}

export function BorderPacman({ onDotEat }: { onDotEat?: (id: string) => void }) {
  const [dimensions, setDimensions] = useState({ w: 0, h: 0 });
  const [pathPoints, setPathPoints] = useState<Point[]>([]);
  const [totalPerimeter, setTotalPerimeter] = useState(0);

  // Initialize and handle resize
  useEffect(() => {
    const calculatePath = () => {
      // Snap to grid logic
      // We want the track to be in the center of the outer grid cells
      // If grid is 40px, the center is at 20px.
      const margin = GRID_SIZE / 2;
      
      const w = window.innerWidth;
      const h = window.innerHeight;

      // Ensure the path forms a perfect rectangle aligned with the grid
      // We start from top-left (margin, margin)
      const pathW = w - (margin * 2);
      const pathH = h - (margin * 2);

      const perimeter = (pathW * 2) + (pathH * 2);
      setTotalPerimeter(perimeter);
      setDimensions({ w, h });

      // Generate Dots
      const dots: Point[] = [];
      
      // Helper to add dots for a segment
      // start: starting coordinate
      // vector: direction [x, y]
      // length: length of segment
      // startProgress: progress value at start of segment
      const addSegmentDots = (
        startX: number, 
        startY: number, 
        vecX: number, 
        vecY: number, 
        length: number, 
        baseProgress: number,
        side: 'top' | 'right' | 'bottom' | 'left'
      ) => {
        // We place dots every GRID_SIZE
        const count = Math.floor(length / GRID_SIZE);
        for (let i = 0; i <= count; i++) {
          const dist = i * GRID_SIZE;
          if (dist > length) break;
          
          dots.push({
            id: `${side}-${i}`,
            x: startX + (vecX * dist),
            y: startY + (vecY * dist),
            progress: baseProgress + (dist / perimeter),
            side
          });
        }
      };

      // 1. Top Edge (Left to Right)
      addSegmentDots(margin, margin, 1, 0, pathW, 0, 'top');
      
      // 2. Right Edge (Top to Bottom)
      addSegmentDots(margin + pathW, margin, 0, 1, pathH, pathW / perimeter, 'right');
      
      // 3. Bottom Edge (Right to Left)
      addSegmentDots(margin + pathW, margin + pathH, -1, 0, pathW, (pathW + pathH) / perimeter, 'bottom');
      
      // 4. Left Edge (Bottom to Top)
      addSegmentDots(margin, margin + pathH, 0, -1, pathH, (pathW * 2 + pathH) / perimeter, 'left');

      setPathPoints(dots);
    };

    calculatePath();
    window.addEventListener('resize', calculatePath);
    return () => window.removeEventListener('resize', calculatePath);
  }, []);

  // Time based animation
  // We want constant speed, so duration depends on perimeter
  const duration = totalPerimeter / SPEED_PX_PER_SEC; // seconds
  const time = useTime();
  
  // Transform time into a 0-1 loop
  const progress = useTransform(time, t => {
    if (duration === 0) return 0;
    return (t / 1000 / duration) % 1;
  });

  // Frame-by-frame Mouth Animation (Waka Waka)
  const [isMouthOpen, setIsMouthOpen] = useState(true);

  useEffect(() => {
    // 150ms interval for classic Pacman chomp speed
    const interval = setInterval(() => {
      setIsMouthOpen(prev => !prev);
    }, 150);
    return () => clearInterval(interval);
  }, []);

  // Calculate Pacman Position & Rotation based on progress
  const pacmanX = useTransform(progress, p => {
    const margin = GRID_SIZE / 2;
    const pathW = dimensions.w - (margin * 2);
    const pathH = dimensions.h - (margin * 2);
    const total = totalPerimeter;
    
    // Convert progress back to distance
    const d = p * total;

    if (d < pathW) return margin + d; // Top
    if (d < pathW + pathH) return margin + pathW; // Right
    if (d < pathW * 2 + pathH) return margin + pathW - (d - (pathW + pathH)); // Bottom
    return margin; // Left
  });

  const pacmanY = useTransform(progress, p => {
    const margin = GRID_SIZE / 2;
    const pathW = dimensions.w - (margin * 2);
    const pathH = dimensions.h - (margin * 2);
    const total = totalPerimeter;
    
    const d = p * total;

    if (d < pathW) return margin; // Top
    if (d < pathW + pathH) return margin + (d - pathW); // Right
    if (d < pathW * 2 + pathH) return margin + pathH; // Bottom
    return margin + pathH - (d - (pathW * 2 + pathH)); // Left
  });

  const pacmanRotate = useTransform(progress, p => {
    const margin = GRID_SIZE / 2;
    const pathW = dimensions.w - (margin * 2);
    const pathH = dimensions.h - (margin * 2);
    const total = totalPerimeter;
    const d = p * total;

    if (d < pathW) return 0;
    if (d < pathW + pathH) return 90;
    if (d < pathW * 2 + pathH) return 180;
    return 270;
  });

  if (!dimensions.w) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
      {/* Dots */}
      {pathPoints.map(dot => (
        <Dot 
            key={dot.id} 
            x={dot.x} 
            y={dot.y} 
            progress={dot.progress} 
            currentProgress={progress}
        />
      ))}

      {/* Pacman */}
      <motion.div
        className="absolute w-8 h-8 -ml-4 -mt-4 flex items-center justify-center z-10"
        style={{
          x: pacmanX,
          y: pacmanY,
          rotate: pacmanRotate,
        }}
      >
        <svg viewBox="0 0 64 64" className="w-full h-full fill-[#FFFF00] drop-shadow-[0_0_5px_rgba(255,255,0,0.5)]">
           {/* Frame-by-frame animation using exact paths from PacmanCursor */}
           <path 
              d={isMouthOpen 
                ? "M32 4C16.536 4 4 16.536 4 32C4 47.464 16.536 60 32 60C47.464 60 60 47.464 60 32C60 27.516 58.912 23.264 56.992 19.456L32 32L56.992 44.544C58.912 40.736 60 36.484 60 32C60 16.536 47.464 4 32 4Z" 
                : "M32 4C16.536 4 4 16.536 4 32C4 47.464 16.536 60 32 60C47.464 60 60 47.464 60 32C60 16.536 47.464 4 32 4Z"
              }
           />
           {/* Eye */}
           <circle cx="42" cy="18" r="3" fill="#000000" />
        </svg>
      </motion.div>
    </div>
  );
}

// Dot Component
function Dot({ x, y, progress, currentProgress }: { x: number, y: number, progress: number, currentProgress: MotionValue<number> }) {
    // We determine visibility based on distance between dot's progress and current progress
    const opacity = useTransform(currentProgress, p => {
        let diff = p - progress;
        
        // Handle wrap around (e.g. p=0.01, dot=0.99)
        if (diff < -0.5) diff += 1;
        if (diff > 0.5) diff -= 1;

        // Logic:
        // If pacman is just before the dot (diff is small negative) -> Visible
        // If pacman is just passed the dot (diff is small positive) -> Hidden (Eaten)
        // Respawn after some "distance" (e.g. 0.2 progress)
        
        const EAT_THRESHOLD = 0.005; // Very close
        const RESPAWN_DELAY = 0.2; // 20% of the loop

        if (diff > 0 && diff < RESPAWN_DELAY) {
            return 0; // Eaten and waiting to respawn
        }
        return 1; // Visible
    });
    
    // Scale animation for respawning could be added but opacity is cleaner for performace
    
    return (
        <motion.div
            className="absolute w-2 h-2 bg-[#ffb8ae] rounded-full -ml-1 -mt-1 shadow-[0_0_4px_#ffb8ae]"
            style={{
                left: x,
                top: y,
                opacity
            }}
        />
    );
}
