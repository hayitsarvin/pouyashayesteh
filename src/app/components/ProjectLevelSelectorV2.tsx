import { motion, useInView } from 'motion/react';
import { useRef, useState, useEffect } from 'react';
import { PixelGhost } from './ui/PixelGhost';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MyPacmanGame } from './MyPacmanGame';
import { MySpaceInvadersGame } from './MySpaceInvadersGame';
import { MyEcommerceGame } from './MyEcommerceGame';

interface Project {
  id: string;
  title: string;
  subtitle: string;
  color: string;
  ghostColor: string;
  icon: string;
}

const projects: Project[] = [
  {
    id: 'ecommerce',
    title: 'SUPER SHOPPER',
    subtitle: 'CATCH EM ALL',
    color: '#A0A0A0', // Base material color
    ghostColor: '#FF0055', // Neon Red Ghost -> Cabinet becomes Red
    icon: 'shopping-bag'
  },
  {
    id: 'fintech',
    title: 'PAC-MAN', // Changed Title
    subtitle: 'PLAYABLE DEMO', // Changed Subtitle
    color: '#A0A0A0', 
    ghostColor: '#FFFF00', // Neon Yellow Ghost -> Cabinet becomes Yellow
    icon: 'smartphone'
  },
  {
    id: 'health',
    title: 'VIRUS INVADERS',
    subtitle: 'ARCADE ACTION',
    color: '#A0A0A0', 
    ghostColor: '#00FF99', // Neon Mint Ghost -> Cabinet becomes Mint
    icon: 'heart'
  }
];

const ArcadeCabinet = ({ 
  project, 
  isActive, 
  onGameStart, 
  onGameEnd,
  onScoreUpdate
}: { 
  project: Project; 
  isActive: boolean;
  onGameStart: () => void;
  onGameEnd: () => void;
  onScoreUpdate?: (points: number) => void;
}) => {
  // We use the ghostColor as the primary neon accent for the cabinet
  const neonColor = project.ghostColor;
  
  return (
    <motion.div
      // Removed layoutId to fix performance lag
      className="relative flex flex-col items-center transition-all duration-300 ease-out" 
      style={{ willChange: 'transform, opacity' }} 
      animate={{
        scale: isActive ? 1.1 : 0.95,
        opacity: isActive ? 1 : 0.7,
        zIndex: isActive ? 50 : 10
      }}
      onClick={() => !isActive && document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }))}
    >
      {/* === FLOATING GHOST === */}
      <motion.div 
        className="absolute -top-16 z-50 filter drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]"
        animate={{ y: [0, -8, 0] }}
        transition={{ 
            duration: 2.5, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: isActive ? 0 : 1 // Offset animation
        }}
      >
        <PixelGhost color={neonColor} size={40} />
      </motion.div>

      {/* === CABINET CHASSIS WRAPPER === */}
      {/* This creates the unified body look */}
      <div className="relative flex flex-col items-center w-60 group cursor-pointer perspective-[1000px]">
        
        {/* --- LEFT SIDE PANEL --- */}
        <div 
            className="absolute -left-3 top-0 bottom-0 w-4 bg-[#1a1a1a] rounded-l-lg z-20 border-r border-black flex flex-col justify-between py-10 items-end pr-1"
            style={{ 
               boxShadow: `-2px 0 5px rgba(0,0,0,0.5), inset 1px 0 2px rgba(255,255,255,0.1)`,
            }}
        >
            {/* T-Molding (Now uses neonColor/ghostColor) */}
            <div className="absolute top-0 bottom-0 left-0 w-1.5 rounded-l-md transition-colors duration-300"
                 style={{ backgroundColor: isActive ? neonColor : '#444', boxShadow: isActive ? `0 0 8px ${neonColor}` : 'none' }}></div>
            {/* Bolts */}
            <div className="w-1.5 h-1.5 bg-[#111] rounded-full shadow-[inset_0_0_2px_rgba(255,255,255,0.2)]"></div>
            <div className="w-1.5 h-1.5 bg-[#111] rounded-full shadow-[inset_0_0_2px_rgba(255,255,255,0.2)]"></div>
        </div>

        {/* --- RIGHT SIDE PANEL --- */}
        <div 
            className="absolute -right-3 top-0 bottom-0 w-4 bg-[#1a1a1a] rounded-r-lg z-20 border-l border-black flex flex-col justify-between py-10 items-start pl-1"
            style={{ 
               boxShadow: `2px 0 5px rgba(0,0,0,0.5), inset -1px 0 2px rgba(255,255,255,0.1)`,
            }}
        >
             {/* T-Molding (Now uses neonColor/ghostColor) */}
            <div className="absolute top-0 bottom-0 right-0 w-1.5 rounded-r-md transition-colors duration-300"
                 style={{ backgroundColor: isActive ? neonColor : '#444', boxShadow: isActive ? `0 0 8px ${neonColor}` : 'none' }}></div>
            {/* Bolts */}
            <div className="w-1.5 h-1.5 bg-[#111] rounded-full shadow-[inset_0_0_2px_rgba(255,255,255,0.2)]"></div>
            <div className="w-1.5 h-1.5 bg-[#111] rounded-full shadow-[inset_0_0_2px_rgba(255,255,255,0.2)]"></div>
        </div>

        {/* ================= INTERNAL MODULES ================= */}
        
        {/* 1. ROOF CAP */}
        <div className="w-full h-4 bg-[#111] z-10 rounded-t-sm border-b border-gray-800 relative shadow-md">
             <div className="absolute inset-0 bg-white/5 rounded-t-sm"></div>
        </div>

        {/* 2. MARQUEE (Light Box) */}
        <div className="w-full h-16 bg-black relative overflow-hidden z-10 border-b-4 border-black shadow-lg">
          {/* Backlight & Glow */}
          <div 
            className="absolute inset-0 flex items-center justify-center overflow-hidden transition-all duration-300"
            style={{
              background: isActive 
                ? `linear-gradient(180deg, ${neonColor}dd, ${neonColor}66)` 
                : '#1a1a1a',
              boxShadow: isActive ? `inset 0 0 15px ${neonColor}` : 'inset 0 0 10px #000'
            }}
          >
            {/* Texture */}
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '3px 3px' }}></div>
            
            {/* Text */}
            <h3 
              className="pixel-font relative z-10 text-sm tracking-[0.2em] uppercase text-center leading-none drop-shadow-md transition-all duration-300"
              style={{ 
                color: isActive ? '#fff' : '#666',
                textShadow: isActive ? `0 0 10px ${neonColor}` : 'none',
                transform: isActive ? 'scale(1.05)' : 'scale(1)'
              }}
            >
              {project.title}
            </h3>
          </div>
          
          {/* Plastic Gloss Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none z-20"></div>
        </div>

        {/* 3. MONITOR HOUSING */}
        <div className="w-full bg-[#151515] relative z-10 flex flex-col p-3 shadow-[inset_0_0_20px_#000]">
            
            {/* Speakers */}
            <div className="flex justify-between w-full px-2 mb-2 opacity-50">
               <div className="flex gap-1">
                  {[1,2,3].map(i => <div key={i} className="w-0.5 h-0.5 bg-gray-500 rounded-full shadow-[0_0_2px_#000]"></div>)}
               </div>
               <div className="flex gap-1">
                  {[1,2,3].map(i => <div key={i} className="w-0.5 h-0.5 bg-gray-500 rounded-full shadow-[0_0_2px_#000]"></div>)}
               </div>
            </div>

            {/* CRT Bezel */}
            <div className="bg-[#080808] rounded-lg p-1 shadow-[inset_0_0_10px_#000,0_1px_0_rgba(255,255,255,0.1)] border border-gray-900">
               <div className="relative aspect-[4/3] bg-black rounded overflow-hidden shadow-[inset_0_0_15px_#000] group">
                  {/* Screen Content */}
                  <div className={`w-full h-full relative flex flex-col transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-50 grayscale'}`}>
                     
                     {/* UI Container */}
                     <div className="w-full h-full bg-white text-black p-0 overflow-hidden flex flex-col select-none relative">
                        
                        {/* --- FINTECH UI (NOW PACMAN) --- */}
                        {project.id === 'fintech' ? (
                            <MyPacmanGame 
                                onGameStart={onGameStart} 
                                onGameEnd={onGameEnd}
                                isActiveCabinet={isActive}
                                onScoreUpdate={onScoreUpdate}
                            />
                        ) : null}

                        {/* --- ECOMMERCE UI (NOW SUPER SHOPPER) --- */}
                        {project.id === 'ecommerce' ? (
                            <MyEcommerceGame 
                                onGameStart={onGameStart} 
                                onGameEnd={onGameEnd}
                                isActiveCabinet={isActive}
                                onScoreUpdate={onScoreUpdate}
                            />
                        ) : null}

                        {/* --- HEALTH UI (NOW SPACE INVADERS) --- */}
                        {project.id === 'health' ? (
                            <MySpaceInvadersGame 
                                onGameStart={onGameStart} 
                                onGameEnd={onGameEnd}
                                isActiveCabinet={isActive}
                                onScoreUpdate={onScoreUpdate}
                            />
                        ) : null}
                        
                     </div>
                     
                     {/* CRT Effects */}
                     <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_2px,3px_100%] z-20 mix-blend-overlay"></div>
                     <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_50%,rgba(0,0,0,0.4)_100%)] pointer-events-none z-20"></div>
                     <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-white/10 to-transparent pointer-events-none z-30"></div>
                  </div>
                  
                  {!isActive && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-[1px]">
                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping"></div>
                    </div>
                  )}
               </div>
            </div>
        </div>

        {/* 4. CONTROL DECK (Ultra-High Fidelity) */}
        <div className="relative z-30 w-full mt-[-2px]">
            {/* Ambient Shadow (Occlusion from Monitor) */}
            <div className="absolute -top-5 left-1 right-1 h-6 bg-gradient-to-b from-black to-transparent z-0 opacity-90 pointer-events-none"></div>

            <div 
              className="w-full h-24 relative origin-top z-10"
              style={{ perspective: '800px' }}
            >
               {/* THE PANEL SURFACE */}
               <div 
                  className="w-full h-full relative overflow-hidden rounded-sm border-t border-white/10"
                  style={{ 
                    transform: 'rotateX(20deg)', 
                    transformOrigin: 'top center',
                    background: 'linear-gradient(170deg, #252525 0%, #151515 100%)', // Metallic Dark Grey
                    boxShadow: '0 20px 40px -5px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.05)'
                  }}
               >
                  {/* Texture: Subtle Metal Grain */}
                  <div className="absolute inset-0 opacity-10 mix-blend-overlay" 
                       style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}></div>
                  
                  {/* Graphic Decal (Stripe) */}
                  <div className="absolute top-0 bottom-0 left-8 w-16 opacity-10 transform skew-x-[-10deg]"
                       style={{ background: neonColor }}></div>

                  {/* Mounting Bolts (Carriage Bolts - Realism Detail) */}
                  <div className="absolute top-1.5 left-2 w-1.5 h-1.5 rounded-full bg-gradient-to-br from-gray-500 to-black shadow-sm opacity-80"></div>
                  <div className="absolute top-1.5 right-2 w-1.5 h-1.5 rounded-full bg-gradient-to-br from-gray-500 to-black shadow-sm opacity-80"></div>
                  <div className="absolute bottom-2 left-2 w-1.5 h-1.5 rounded-full bg-gradient-to-br from-gray-500 to-black shadow-sm opacity-80"></div>
                  <div className="absolute bottom-2 right-2 w-1.5 h-1.5 rounded-full bg-gradient-to-br from-gray-500 to-black shadow-sm opacity-80"></div>

                  {/* Control Layout - Fixed positioning */}
                  <div className="absolute inset-0 flex items-center justify-center gap-6 pl-1 pt-1">
                     
                     {/* === JOYSTICK (Sanwa JLF Style - Resized Smaller) === */}
                     <div className="relative w-8 h-8 flex items-center justify-center">
                        {/* Dust Washer (Black Disk) sits on surface */}
                        <div className="absolute w-6 h-6 bg-[#080808] rounded-full border border-gray-800 shadow-[0_1px_2px_rgba(0,0,0,0.8)] z-10"></div>
                        
                        {/* Metal Shaft - Anchored at center */}
                        <div 
                           className="w-1.5 h-6 bg-gradient-to-r from-gray-400 via-white to-gray-400 absolute bottom-1/2 left-1/2 -translate-x-1/2 origin-bottom z-10 rounded-t-sm"
                           style={{ 
                               transform: isActive ? 'rotate(-15deg)' : 'rotate(0deg)',
                               transition: 'transform 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                           }}
                        >
                            {/* Ball Top - Attached to shaft */}
                            <div 
                                className="w-5 h-5 rounded-full absolute -top-4 -left-[7px] shadow-[0_4px_8px_rgba(0,0,0,0.6)] z-20 overflow-hidden"
                                style={{ 
                                    background: `radial-gradient(circle at 30% 30%, ${neonColor}, #000000)`
                                }}
                            >
                                <div className="absolute top-1 left-1 w-1.5 h-1 bg-white rounded-full blur-[0.5px] opacity-80"></div>
                            </div>
                        </div>
                     </div>

                     {/* === BUTTONS (Sanwa OBSF Style) === */}
                     <div className="flex gap-2 mt-2"> 
                        {[1, 2].map(i => (
                           <div key={i} className="w-7 h-7 rounded-full bg-[#111] relative flex items-center justify-center shadow-[0_2px_3px_rgba(0,0,0,0.8)]">
                              {/* Rim */}
                              <div className="absolute inset-0 rounded-full border-[2px] border-[#222]"></div>
                              {/* Plunger */}
                              <div 
                                 className="w-5 h-5 rounded-full transition-all duration-75 relative"
                                 style={{ 
                                    background: isActive 
                                      ? `radial-gradient(circle at 50% 100%, ${neonColor}, #fff)`
                                      : `radial-gradient(circle at 50% 0%, #444, #111)`,
                                    top: isActive ? '1px' : '0px',
                                    boxShadow: isActive ? `0 0 6px ${neonColor}` : 'none'
                                 }}
                              ></div>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>
            </div>
            
            {/* FRONT BOX (The Kickplate - Adds Weight) */}
            <div className="w-[94%] mx-auto h-6 bg-[#181818] relative z-0 mt-[-8px] rounded-b border-t border-black/80 shadow-[inset_0_5px_10px_rgba(0,0,0,0.9)] flex items-center justify-center overflow-hidden">
                 {/* Faux Coin Slot */}
                 <div className="w-6 h-3 bg-black border border-gray-800 rounded mx-auto mt-1 opacity-50 flex items-center justify-center">
                    <div className="w-0.5 h-2 bg-red-900/50"></div>
                 </div>
                 {/* Side grill texture */}
                 <div className="absolute left-2 top-2 flex gap-1 opacity-20"><div className="w-1 h-2 bg-black"></div><div className="w-1 h-2 bg-black"></div></div>
                 <div className="absolute right-2 top-2 flex gap-1 opacity-20"><div className="w-1 h-2 bg-black"></div><div className="w-1 h-2 bg-black"></div></div>
            </div>
        </div>

      </div>

      {/* Floor Reflection/Shadow */}
      <div 
         className="absolute -bottom-6 w-40 h-8 bg-black rounded-[100%] blur-xl transition-all duration-500"
         style={{ 
            opacity: isActive ? 0.7 : 0.3,
            background: isActive ? neonColor : '#000'
         }}
      ></div>

    </motion.div>
  );
};

export function ProjectLevelSelectorV2({ onScoreUpdate }: { onScoreUpdate?: (points: number) => void }) {
  const [activeIndex, setActiveIndex] = useState(1); // Start with Fintech (index 1)
  const [isGamePlaying, setIsGamePlaying] = useState(false);
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.2 });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // LOCK NAVIGATION IF GAME IS PLAYING
      if (isGamePlaying) return;

      if (e.key === 'ArrowLeft') {
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : projects.length - 1));
      } else if (e.key === 'ArrowRight') {
        setActiveIndex((prev) => (prev < projects.length - 1 ? prev + 1 : 0));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGamePlaying]); // Re-bind listener when game state changes

  const handlePrev = () => {
      if (!isGamePlaying) setActiveIndex((prev) => (prev > 0 ? prev - 1 : projects.length - 1));
  };
  
  const handleNext = () => {
      if (!isGamePlaying) setActiveIndex((prev) => (prev < projects.length - 1 ? prev + 1 : 0));
  };

  return (
    <section 
      ref={containerRef}
      className="relative h-screen w-full flex flex-col items-center justify-center bg-transparent overflow-hidden"
    >
      {/* Header */}
      <motion.h2
        className="pixel-font mb-24 text-center relative z-10"
        style={{
          fontSize: 'clamp(2rem, 6vw, 4rem)',
          color: '#ffff00',
          textShadow: '4px 4px 0px #ff0000, 8px 8px 0px #00ffff',
          letterSpacing: '0.1em'
        }}
        initial={{ opacity: 0, filter: 'blur(10px)' }}
        animate={isInView ? { opacity: 1, filter: 'blur(0px)' } : { opacity: 0, filter: 'blur(10px)' }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        SELECT LEVEL
      </motion.h2>

      {/* Cabinets Container - Widened for better spacing */}
      <div className="relative w-full max-w-7xl flex items-center justify-center h-auto mt-4 pb-4">
        
        {/* Navigation Arrow LEFT */}
        {!isGamePlaying && (
            <motion.button 
            onClick={handlePrev}
            whileHover={{ scale: 1.1, x: -5 }}
            whileTap={{ scale: 0.9 }}
            className="absolute left-4 md:left-10 z-50 group hidden md:flex flex-col items-center justify-center"
            >
            <div className="w-12 h-12 md:w-16 md:h-16 border-4 border-white/20 bg-black/50 backdrop-blur-sm rounded-lg flex items-center justify-center group-hover:border-yellow-400/80 group-hover:bg-yellow-900/20 transition-all duration-300 shadow-[0_0_15px_rgba(0,0,0,0.5)] group-hover:shadow-[0_0_20px_rgba(255,255,0,0.4)]">
                {/* Pixel Arrow Left Icon */}
                <svg width="24" height="24" viewBox="0 0 24 24" className="w-6 h-6 md:w-8 md:h-8 fill-white/50 group-hover:fill-yellow-400 transition-colors">
                    <path d="M16 4h4v16h-4v-4h-4v-4h-4v4H4V8h4v4h4V8h4V4z" shapeRendering="crispEdges"/>
                </svg>
            </div>
            <span className="mt-2 text-[10px] pixel-font text-white/30 group-hover:text-yellow-400 transition-colors tracking-widest">PREV</span>
            </motion.button>
        )}

        {/* Navigation Arrow RIGHT */}
        {!isGamePlaying && (
            <motion.button 
            onClick={handleNext}
            whileHover={{ scale: 1.1, x: 5 }}
            whileTap={{ scale: 0.9 }}
            className="absolute right-4 md:right-10 z-50 group hidden md:flex flex-col items-center justify-center"
            >
            <div className="w-12 h-12 md:w-16 md:h-16 border-4 border-white/20 bg-black/50 backdrop-blur-sm rounded-lg flex items-center justify-center group-hover:border-yellow-400/80 group-hover:bg-yellow-900/20 transition-all duration-300 shadow-[0_0_15px_rgba(0,0,0,0.5)] group-hover:shadow-[0_0_20px_rgba(255,255,0,0.4)]">
                {/* Pixel Arrow Right Icon */}
                <svg width="24" height="24" viewBox="0 0 24 24" className="w-6 h-6 md:w-8 md:h-8 fill-white/50 group-hover:fill-yellow-400 transition-colors">
                    <path d="M8 4H4v16h4v-4h4v-4h4v4h4V8h-4v4h-4V8H8V4z" shapeRendering="crispEdges"/>
                </svg>
            </div>
            <span className="mt-2 text-[10px] pixel-font text-white/30 group-hover:text-yellow-400 transition-colors tracking-widest">NEXT</span>
            </motion.button>
        )}

        {/* Render Cabinets with improved spacing */}
        <div className="flex items-center justify-center gap-12 md:gap-32 lg:gap-40 transition-all duration-500">
            {projects.map((project, index) => (
            <ArcadeCabinet 
                key={project.id} 
                project={project} 
                isActive={index === activeIndex}
                onGameStart={() => setIsGamePlaying(true)}
                onGameEnd={() => setIsGamePlaying(false)}
                onScoreUpdate={onScoreUpdate}
            />
            ))}
        </div>
      </div>

      {/* Footer Instructions */}
      <motion.div
        className="mt-8 pixel-font text-white text-center"
        style={{ fontSize: 'clamp(0.75rem, 2vw, 1rem)', letterSpacing: '0.1em' }}
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 0.8 }}
      >
        <span className="animate-pulse">
            {isGamePlaying ? 'PRESS ESC TO EXIT GAME' : 'USE ARROWS TO NAVIGATE'}
        </span>
      </motion.div>
    </section>
  );
}