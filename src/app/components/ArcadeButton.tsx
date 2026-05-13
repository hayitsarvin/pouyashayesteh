interface ArcadeButtonProps {
  text: string;
  color?: 'yellow' | 'cyan';
  showGhost?: boolean;
  onClick?: () => void;
}

export function ArcadeButton({ text, color = 'yellow', showGhost = true, onClick }: ArcadeButtonProps) {
  const borderColor = color === 'yellow' ? '#ffff00' : '#00ffff';
  const buttonClass = `arcade-button-${color}`;
  
  return (
    <div className="relative inline-block arcade-button-wrapper">
      {/* Ghost floating above button - only show if showGhost is true */}
      {showGhost && (
        <div className="ghost-container absolute left-1/2 -translate-x-1/2 -top-16 transition-all duration-200">
          <svg
            width="48"
            height="48"
            viewBox="0 0 16 16"
            xmlns="http://www.w3.org/2000/svg"
            shapeRendering="crispEdges"
            className="ghost-svg"
            style={{ imageRendering: 'pixelated' }}
          >
            {/* Ghost body */}
            <path 
              className="ghost-body"
              d="M6,2 H10 V3 H12 V4 H13 V5 H14 V15 H13 V14 H11 V15 H9 V14 H7 V15 H5 V14 H3 V15 H2 V5 H3 V4 H4 V3 H6 V2 Z" 
            />
            
            {/* Normal mode - Eyes with pupils */}
            <g className="normal-ghost">
              <rect x="3" y="5" width="4" height="4" fill="white" />
              <rect x="9" y="5" width="4" height="4" fill="white" />
              <rect x="4" y="7" width="2" height="2" fill="#2121DE" />
              <rect x="10" y="7" width="2" height="2" fill="#2121DE" />
            </g>
            
            {/* Scared mode - SIMPLE dots for eyes and wavy mouth */}
            <g className="scared-ghost" style={{ display: 'none' }}>
              {/* Simple dot eyes - MUCH BIGGER */}
              <rect x="3" y="6" width="2" height="2" fill="#FFFFFF"/>
              <rect x="9" y="6" width="2" height="2" fill="#FFFFFF"/>
              
              {/* Simple wavy mouth - MUCH BIGGER AND CLEARER */}
              <rect x="3" y="10" width="1" height="2" fill="#FFFFFF" />
              <rect x="4" y="11" width="1" height="1" fill="#FFFFFF" />
              <rect x="5" y="10" width="1" height="2" fill="#FFFFFF" />
              <rect x="6" y="11" width="1" height="1" fill="#FFFFFF" />
              <rect x="7" y="10" width="1" height="2" fill="#FFFFFF" />
              <rect x="8" y="11" width="1" height="1" fill="#FFFFFF" />
              <rect x="9" y="10" width="1" height="2" fill="#FFFFFF" />
              <rect x="10" y="11" width="1" height="1" fill="#FFFFFF" />
              <rect x="11" y="10" width="1" height="2" fill="#FFFFFF" />
              <rect x="12" y="11" width="1" height="1" fill="#FFFFFF" />
            </g>
          </svg>
        </div>
      )}

      {/* Button */}
      <button 
        className={`${buttonClass} pixel-font relative bg-transparent px-8 py-4 transition-all duration-200`}
        onClick={onClick}
      >
        {text}
      </button>

      <style>{`
        .arcade-button-yellow {
          border: 4px solid #ffff00;
          color: #ffff00;
          font-size: clamp(0.75rem, 2vw, 1rem);
        }

        .arcade-button-yellow:hover {
          background-color: #ffff00;
          color: #000000;
        }

        .arcade-button-cyan {
          border: 4px solid #00ffff;
          color: #00ffff;
          font-size: clamp(0.75rem, 2vw, 1rem);
        }

        .arcade-button-cyan:hover {
          background-color: #00ffff;
          color: #000000;
        }

        .arcade-button-yellow:active,
        .arcade-button-cyan:active {
          transform: translate(2px, 2px);
        }

        /* Ghost body color - default red */
        .ghost-body {
          fill: #ff0000;
          transition: fill 0.2s;
        }

        /* Hover state - turn ghost blue (scared) */
        .arcade-button-wrapper:hover .ghost-body {
          fill: #2121ff;
        }

        /* Ghost floating animation */
        @keyframes ghost-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
        }
        
        .ghost-svg {
          animation: ghost-float 1s ease-in-out infinite;
        }
        
        /* Toggle pupils on hover */
        .arcade-button-wrapper:hover .normal-ghost {
          display: none;
        }

        .arcade-button-wrapper:hover .scared-ghost {
          display: block !important;
        }
      `}</style>
    </div>
  );
}