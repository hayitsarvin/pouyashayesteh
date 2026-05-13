import { ArcadeButton } from './ArcadeButton';

export function ArcadeButtonDemo() {
  return (
    <div className="min-h-screen w-full bg-black flex items-center justify-center p-8">
      <div className="max-w-6xl w-full">
        {/* Title */}
        <h1 className="pixel-font text-white text-center mb-16" style={{ fontSize: 'clamp(1rem, 3vw, 1.5rem)' }}>
          8-BIT ARCADE BUTTON VARIATIONS
        </h1>

        {/* Button Variations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-16">
          {/* Variation 1 - Default State */}
          <div className="flex flex-col items-center">
            <div className="bg-gray-900 border-4 border-gray-700 p-12 rounded-lg mb-6 flex items-center justify-center min-h-[200px]">
              <ArcadeButton text="WORK" />
            </div>
            <div className="pixel-font text-yellow-400 text-center" style={{ fontSize: '0.75rem' }}>
              VARIATION 1: DEFAULT STATE
            </div>
            <div className="pixel-font text-gray-400 text-center mt-2" style={{ fontSize: '0.625rem' }}>
              Yellow outline • Red ghost • Normal eyes
            </div>
          </div>

          {/* Variation 2 - Hover State Preview */}
          <div className="flex flex-col items-center">
            <div className="bg-gray-900 border-4 border-gray-700 p-12 rounded-lg mb-6 flex items-center justify-center min-h-[200px]">
              <div className="relative inline-block hover-preview">
                <ArcadeButton text="WORK" />
              </div>
            </div>
            <div className="pixel-font text-yellow-400 text-center" style={{ fontSize: '0.75rem' }}>
              VARIATION 2: HOVER STATE
            </div>
            <div className="pixel-font text-gray-400 text-center mt-2" style={{ fontSize: '0.625rem' }}>
              Yellow fill • Blue ghost • Scared eyes
            </div>
          </div>
        </div>

        {/* Interactive Demo */}
        <div className="border-t-4 border-gray-800 pt-16">
          <h2 className="pixel-font text-cyan-400 text-center mb-12" style={{ fontSize: 'clamp(0.875rem, 2.5vw, 1.25rem)' }}>
            INTERACTIVE DEMO - HOVER TO TEST
          </h2>
          
          <div className="flex flex-wrap items-center justify-center gap-8">
            <ArcadeButton text="WORK" />
            <ArcadeButton text="CONTACT" />
            <ArcadeButton text="ABOUT" />
            <ArcadeButton text="PLAY" />
          </div>

          <div className="pixel-font text-gray-500 text-center mt-12" style={{ fontSize: '0.625rem' }}>
            HOVER OVER BUTTONS TO SEE THE GHOST TRANSFORM
          </div>
        </div>

        {/* Technical Details */}
        <div className="mt-16 border-4 border-gray-800 p-8">
          <h3 className="pixel-font text-white mb-6" style={{ fontSize: '0.875rem' }}>
            TECHNICAL SPECS:
          </h3>
          <div className="pixel-font text-gray-400 space-y-3" style={{ fontSize: '0.625rem' }}>
            <div>• PIXELATED SVG GHOST (40x40px)</div>
            <div>• CSS HOVER STATE TRANSITIONS</div>
            <div>• AUTHENTIC 8-BIT STYLING</div>
            <div>• RESPONSIVE BUTTON SIZING</div>
            <div>• RETRO ARCADE AESTHETICS</div>
          </div>
        </div>
      </div>

      {/* Force hover state on preview */}
      <style>{`
        .hover-preview .arcade-button {
          background-color: #ffff00 !important;
          color: #000000 !important;
        }

        .hover-preview .ghost-body {
          fill: #0000cd !important;
        }

        .hover-preview .normal-eyes,
        .hover-preview .normal-waves {
          display: none !important;
        }

        .hover-preview .scared-eyes,
        .hover-preview .scared-waves {
          display: block !important;
        }
      `}</style>
    </div>
  );
}
