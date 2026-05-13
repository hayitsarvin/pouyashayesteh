import { motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

interface PixelGhostProps {
  size?: number;
  color?: string;
  className?: string;
}

export function PixelGhost({ size = 40, color = '#ff0000', className = '' }: PixelGhostProps) {
  const ghostRef = useRef<HTMLDivElement>(null);
  const [pupilOffset, setPupilOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!ghostRef.current) return;

      // Get ghost position
      const rect = ghostRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Calculate distance from mouse
      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;

      // Normalize movement (clamp between -1 and 1 for pixel art feel)
      const maxMove = 2; // Max pixels the eye can move
      const angle = Math.atan2(deltaY, deltaX);
      const distance = Math.min(Math.sqrt(deltaX * deltaX + deltaY * deltaY), 200); // 200px visual range
      
      // Calculate offset based on distance/angle, clamped to 1 pixel movement for strict pixel grid feel
      // or slightly more for fluid movement. Let's do constrained float for smoothness but small range.
      const moveScale = distance > 20 ? 1 : distance / 20; 
      
      const x = Math.cos(angle) * maxMove * moveScale;
      const y = Math.sin(angle) * maxMove * moveScale;

      setPupilOffset({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div ref={ghostRef} className={className} style={{ width: size, height: size }}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 14 14"
        xmlns="http://www.w3.org/2000/svg"
        shapeRendering="crispEdges" // Keeps pixels sharp even when transforming
      >
        {/* Ghost body */}
        <path 
          fill={color} 
          d="M5,1 H9 V2 H11 V3 H12 V4 H13 V14 H11 V13 H10 V14 H8 V13 H6 V14 H4 V13 H3 V14 H1 V4 H2 V3 H3 V2 H5 V1 Z" 
        />
        
        {/* Eyes - white background */}
        <rect x="2" y="3" width="4" height="4" fill="white" />
        <rect x="8" y="3" width="4" height="4" fill="white" />
        
        {/* Pupils - Dynamic Movement */}
        <g style={{ transform: `translate(${pupilOffset.x}px, ${pupilOffset.y}px)`, transition: 'transform 0.1s ease-out' }}>
            <rect x="3" y="4" width="2" height="2" fill="#2121DE" />
            <rect x="9" y="4" width="2" height="2" fill="#2121DE" />
        </g>
      </svg>
    </div>
  );
}