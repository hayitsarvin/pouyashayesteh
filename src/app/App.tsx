import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { Pacman } from './components/Pacman';
import { Ghost } from './components/Ghost';
import { MazeWalls } from './components/MazeWalls';
import { ArcadeFrame } from './components/ArcadeFrame';
import { ArcadeButton } from './components/ArcadeButton';
import { FallingFruit } from './components/FallingFruit';
import { PacmanCursor } from './components/PacmanCursor';
import { BorderPacman } from './components/BorderPacman';
import { PlayerStats } from './components/PlayerStats';
import { ProjectLevelSelectorV2 as ProjectLevelSelector } from './components/ProjectLevelSelectorV2';
import { ContactSection } from './components/ContactSection';

export default function App() {
  const [score, setScore] = useState(0);
  const [eatenFruits, setEatenFruits] = useState<Set<number>>(new Set());
  const [isHeroHovered, setIsHeroHovered] = useState(true);

  const handleFruitEat = (fruitId: number, points: number) => {
    if (!eatenFruits.has(fruitId)) {
      setEatenFruits(prev => new Set([...prev, fruitId]));
      setScore(prev => prev + points);
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative w-full bg-black min-h-screen">
       {/* Unified Background for all sections */}
       <div 
          className="fixed inset-0 z-0 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 0, 255, 0.08) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 0, 255, 0.08) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />
        
      {/* Hero Section */}
      <div 
        className="relative min-h-screen w-full overflow-hidden crt-effect" 
        style={{ cursor: 'none' }}
        onMouseEnter={() => setIsHeroHovered(true)}
        onMouseLeave={() => setIsHeroHovered(false)}
      >
        
        {/* Scanline effect */}
        <div className="scanline" />
        
        {/* Arcade frame decoration */}
        <ArcadeFrame />
        
        {/* Maze walls */}
        <MazeWalls />
        
        {/* PAC-MAN moving around border eating dots */}
        <BorderPacman />
        
        {/* Ghosts chasing */}
        <Ghost color="#ff0000" size={35} delay={0} direction="left" startY="15%" />
        <Ghost color="#ffb8ff" size={35} delay={0.8} direction="left" startY="15%" />
        <Ghost color="#00ffff" size={35} delay={1.6} direction="left" startY="15%" />
        <Ghost color="#ffb852" size={35} delay={2.4} direction="left" startY="15%" />

        {/* Main content */}
        <div className="relative z-10 flex items-center justify-center min-h-screen px-6">
          <div className="max-w-4xl w-full text-center">
            
            {/* High Score Display */}
            <motion.div
              className="pixel-font text-white mb-8 flex justify-between items-center max-w-2xl mx-auto"
              style={{ fontSize: 'clamp(0.5rem, 2vw, 0.875rem)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div>
                <div className="text-red-500">1UP</div>
                <motion.div 
                  className="mt-2"
                  key={score}
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 0.3 }}
                >
                  {score.toString().padStart(5, '0')}
                </motion.div>
              </div>
              <div>
                <div className="text-white">HIGH SCORE</div>
                <div className="mt-2">10000</div>
              </div>
              <div>
                <div className="text-cyan-400">2UP</div>
                <div className="mt-2">00</div>
              </div>
            </motion.div>

            {/* Main title - Designer name */}
            <motion.h1
              className="pixel-font mb-8"
              style={{
                fontSize: 'clamp(2rem, 8vw, 5rem)',
                lineHeight: 1.3,
                color: '#ffff00',
                textShadow: '4px 4px 0px #ff0000, 8px 8px 0px #00ffff',
              }}
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              POUYA
            </motion.h1>

            {/* Pixel art divider */}
            <motion.div
              className="flex items-center justify-center gap-2 mb-6"
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <div className="w-3 h-3 bg-white" style={{ imageRendering: 'pixelated' }} />
              <div className="w-3 h-3 bg-[#ff0000]" style={{ imageRendering: 'pixelated' }} />
              <div className="w-3 h-3 bg-[#ffb8ff]" style={{ imageRendering: 'pixelated' }} />
              <div className="w-3 h-3 bg-[#00ffff]" style={{ imageRendering: 'pixelated' }} />
              <div className="w-3 h-3 bg-[#ffb852]" style={{ imageRendering: 'pixelated' }} />
              <div className="h-1 w-32 bg-white" />
              <div className="w-3 h-3 bg-[#ffb852]" style={{ imageRendering: 'pixelated' }} />
              <div className="w-3 h-3 bg-[#00ffff]" style={{ imageRendering: 'pixelated' }} />
              <div className="w-3 h-3 bg-[#ffb8ff]" style={{ imageRendering: 'pixelated' }} />
              <div className="w-3 h-3 bg-[#ff0000]" style={{ imageRendering: 'pixelated' }} />
              <div className="w-3 h-3 bg-white" style={{ imageRendering: 'pixelated' }} />
            </motion.div>

            {/* Subtitle - Role with monospaced font */}
            <motion.div
              className="pixel-font text-white mb-12"
              style={{
                fontSize: 'clamp(0.75rem, 2.5vw, 1.25rem)',
                lineHeight: 1.8,
                letterSpacing: '0.2em',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.9 }}
            >
              UI/UX DESIGNER
            </motion.div>

            {/* Ready message */}
            <motion.div
              className="pixel-font text-cyan-400 mb-8"
              style={{ fontSize: 'clamp(0.625rem, 2vw, 1rem)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1.2 }}
            >
              READY!
            </motion.div>

            {/* Action buttons */}
            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.4 }}
            >
              <ArcadeButton 
                text="WORK" 
                color="yellow" 
                showGhost={true} 
                onClick={() => scrollToSection('level-selector')} 
              />
              <ArcadeButton 
                text="CONTACT" 
                color="cyan" 
                showGhost={false} 
                onClick={() => scrollToSection('contact-section')} 
              />
            </motion.div>

            {/* Lives/Credits display */}
            <motion.div
              className="pixel-font text-white flex items-center justify-center gap-3 mb-8"
              style={{ fontSize: 'clamp(0.625rem, 2vw, 0.875rem)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.6 }}
            >
              <span>CREDIT 03</span>
              <span className="mx-4">|</span>
              <div className="flex items-center gap-2">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 64 64"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M32 4C16.536 4 4 16.536 4 32C4 47.464 16.536 60 32 60C47.464 60 60 47.464 60 32C60 27.516 58.912 23.264 56.992 19.456L32 32L56.992 44.544C58.912 40.736 60 36.484 60 32C60 16.536 47.464 4 32 4Z"
                    fill="#FFFF00"
                  />
                </svg>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 64 64"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M32 4C16.536 4 4 16.536 4 32C4 47.464 16.536 60 32 60C47.464 60 60 47.464 60 32C60 27.516 58.912 23.264 56.992 19.456L32 32L56.992 44.544C58.912 40.736 60 36.484 60 32C60 16.536 47.464 4 32 4Z"
                    fill="#FFFF00"
                  />
                </svg>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 64 64"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M32 4C16.536 4 4 16.536 4 32C4 47.464 16.536 60 32 60C47.464 60 60 47.464 60 32C60 27.516 58.912 23.264 56.992 19.456L32 32L56.992 44.544C58.912 40.736 60 36.484 60 32C60 16.536 47.464 4 32 4Z"
                    fill="#FFFF00"
                  />
                </svg>
              </div>
            </motion.div>

            {/* SCROLL DOWN - Primary CTA with blinking */}
            <motion.div
              className="pixel-font text-yellow-400 mb-8"
              style={{ fontSize: 'clamp(0.75rem, 2vw, 1rem)', letterSpacing: '0.15em' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 1, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 1.8 }}
            >
              SCROLL DOWN
            </motion.div>

            {/* Copyright text */}
            <motion.div
              className="pixel-font text-gray-500"
              style={{ fontSize: 'clamp(0.5rem, 1.5vw, 0.75rem)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 2 }}
            >
              © 2024 POUYA DESIGN
            </motion.div>
          </div>
        </div>

        {/* Floating score texts */}
        <motion.div
          className="absolute pixel-font text-[#00ffff]"
          style={{ 
            fontSize: '1rem',
            top: '25%',
            left: '10%',
          }}
          animate={{
            y: [-20, -60],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 3,
          }}
        >
          200
        </motion.div>

        <motion.div
          className="absolute pixel-font text-[#ffb852]"
          style={{ 
            fontSize: '1rem',
            top: '60%',
            right: '15%',
          }}
          animate={{
            y: [-20, -60],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 4,
            delay: 1,
          }}
        >
          400
        </motion.div>

        <motion.div
          className="absolute pixel-font text-[#ff0000]"
          style={{ 
            fontSize: '1rem',
            bottom: '30%',
            left: '20%',
          }}
          animate={{
            y: [-20, -60],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 5,
            delay: 2,
          }}
        >
          800
        </motion.div>

        {/* Falling fruits */}
        <FallingFruit type="cherry" delay={0} startX="15%" duration={8} onEat={() => handleFruitEat(1, 100)} />
        <FallingFruit type="apple" delay={1} startX="85%" duration={9} onEat={() => handleFruitEat(2, 300)} />
        <FallingFruit type="orange" delay={2} startX="30%" duration={7} onEat={() => handleFruitEat(3, 500)} />
        <FallingFruit type="cherry" delay={3} startX="70%" duration={8} onEat={() => handleFruitEat(4, 100)} />
        <FallingFruit type="apple" delay={4} startX="50%" duration={9} onEat={() => handleFruitEat(5, 300)} />
        <FallingFruit type="orange" delay={1.5} startX="20%" duration={8} onEat={() => handleFruitEat(6, 500)} />
        <FallingFruit type="cherry" delay={2.5} startX="90%" duration={7} onEat={() => handleFruitEat(7, 100)} />
        <FallingFruit type="apple" delay={3.5} startX="40%" duration={9} onEat={() => handleFruitEat(8, 300)} />
        <FallingFruit type="orange" delay={4.5} startX="60%" duration={8} onEat={() => handleFruitEat(9, 500)} />
        <FallingFruit type="cherry" delay={0.5} startX="25%" duration={9} onEat={() => handleFruitEat(10, 100)} />

        {/* Pacman cursor */}
        <PacmanCursor visible={isHeroHovered} />
      </div>

      {/* Sections Container with Gap */}
      <div className="flex flex-col gap-40 relative z-10 pb-20">
        {/* Player Stats Section */}
        <PlayerStats />

        {/* Project Level Selector Section */}
        <div id="level-selector">
          <ProjectLevelSelector onScoreUpdate={(points) => setScore(prev => prev + points)} />
        </div>

        {/* Contact Section */}
        <div id="contact-section">
          <ContactSection onScoreUpdate={(points) => setScore(prev => prev + points)} />
        </div>
      </div>
    </div>
  );
}