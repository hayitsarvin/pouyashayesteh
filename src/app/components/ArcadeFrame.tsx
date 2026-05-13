import { motion } from 'motion/react';

export function ArcadeFrame() {
  return (
    <>
      {/* Corner decorations - arcade cabinet style */}
      <div className="fixed top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-[#ffff00] z-50 pointer-events-none" />
      <div className="fixed top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-[#ff0000] z-50 pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-[#00ffff] z-50 pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-[#ffb8ff] z-50 pointer-events-none" />
    </>
  );
}