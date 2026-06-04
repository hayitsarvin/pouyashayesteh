import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import exampleImage from 'figma:asset/d0fe4580a43f839510ed89faea51690abcb95a06.png';
import swordImage from 'figma:asset/b369032d3d64b80e93d88071596f0165b9639f2a.png';
import potionImage from 'figma:asset/3d4f0a57efaeb38f6514c820614b94e9ce4e8437.png';
import shieldImage from 'figma:asset/117914be6c5ca274882ffc8a2091bdcc3f68f599.png';
import { PixelGhost } from './ui/PixelGhost';

export function PlayerStats() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.2 });

  const skills = [
    { name: 'UX RESEARCH', percentage: 90, icon: '🗡️' },
    { name: 'UI DESIGN', percentage: 95, icon: '🛡️' },
    { name: 'PROTOTYPING', percentage: 85, icon: '🧪' }
  ];

  const experience = [
    { status: 'COMPLETED', stage: 'UI DESIGN & DESIGN SYSTEMS', date: '2023-01-24' },
    { status: 'COMPLETED', stage: 'WIREFRAMING & INTERANCTION DESIGN', date: '2023-08-15' },
    { status: 'COMPLETED', stage: 'USER RESEARCH & PROBLEM DEFINITION', date: '2024-01-20' }
  ];

  return (
    <section 
      ref={containerRef}
      className="relative min-h-screen w-full overflow-hidden bg-transparent"
    >
      {/* Container Slide Animation */}
      <motion.div
        className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-8"
        initial={{ y: '100%' }}
        animate={isInView ? { y: 0 } : { y: '100%' }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        {/* Title - Pixelate/Dissolve Effect */}
        <motion.h2
          className="pixel-font mb-8"
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
          PLAYER STATS
        </motion.h2>

        {/* Decorative Ghosts and Fruits - Top Right */}
        <motion.div
          className="absolute top-[22%] right-[10%] flex gap-4"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          {/* Cyan Ghost - Matched Size */}
          <PixelGhost color="#00FFFF" size={40} />
          
          {/* Orange Ghost - Matched Size */}
          <PixelGhost color="#FFB847" size={40} />
        </motion.div>

        {/* Cherry - Top Right - BIGGER */}
        <motion.div
          className="absolute top-[22%] right-[25%]"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        >
          <svg width="48" height="48" viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg" shapeRendering="crispEdges">
            {/* Stems */}
            <rect x="5" y="3" width="1" height="2" fill="#65421D"/>
            <rect x="6" y="2" width="2" height="1" fill="#65421D"/>
            <rect x="8" y="3" width="1" height="2" fill="#65421D"/>
            
            {/* Left Cherry */}
            <rect x="3" y="6" width="1" height="3" fill="#FF0000"/>
            <rect x="4" y="5" width="2" height="5" fill="#FF0000"/>
            <rect x="6" y="6" width="1" height="3" fill="#FF0000"/>
            
            {/* Left Cherry Shine */}
            <rect x="4" y="6" width="1" height="1" fill="#FFB6C1"/>
            
            {/* Right Cherry */}
            <rect x="7" y="6" width="1" height="3" fill="#FF0000"/>
            <rect x="8" y="5" width="2" height="5" fill="#FF0000"/>
            <rect x="10" y="6" width="1" height="3" fill="#FF0000"/>
            
            {/* Right Cherry Shine */}
            <rect x="8" y="6" width="1" height="1" fill="#FFB6C1"/>
          </svg>
        </motion.div>

        {/* Main Content Grid */}
        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8 mb-6">
          
          {/* Left Column - Avatar */}
          <motion.div
            initial={{ x: -200, opacity: 0 }}
            animate={isInView ? { x: 0, opacity: 1 } : { x: -200, opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex justify-center lg:justify-start"
          >
            <motion.div
              className="relative overflow-hidden"
              style={{
                border: '6px solid #FFFF00',
                boxShadow: '0 0 30px rgba(255, 255, 0, 0.8), inset 0 0 30px rgba(255, 255, 0, 0.2)',
                width: 'fit-content',
                height: 'fit-content',
                display: 'flex',
                imageRendering: 'pixelated',
              }}
              animate={isInView ? { 
                boxShadow: [
                  '0 0 30px rgba(255, 255, 0, 0.8), inset 0 0 30px rgba(255, 255, 0, 0.2)',
                  '0 0 50px rgba(255, 255, 0, 1), inset 0 0 50px rgba(255, 255, 0, 0.4)',
                  '0 0 30px rgba(255, 255, 0, 0.8), inset 0 0 30px rgba(255, 255, 0, 0.2)'
                ]
              } : {}}
              transition={{ duration: 0.6, delay: 1.5 }}
            >
              <img 
                src={exampleImage} 
                alt="Player Avatar" 
                className="w-[280px] h-auto"
                style={{ 
                  imageRendering: 'pixelated',
                  objectFit: 'cover',
                  objectPosition: 'top',
                  display: 'block'
                }}
              />
            </motion.div>
          </motion.div>

          {/* Pink Ghost - Left Side - Matched Size */}
          <motion.div
            className="absolute left-[5%] top-[25%]"
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
          >
            <PixelGhost color="#FFB8FF" size={40} />
          </motion.div>

          {/* Right Column - Content */}
          <div className="space-y-8">
            
            {/* Character Bio */}
            <motion.div
              initial={{ x: 200, opacity: 0 }}
              animate={isInView ? { x: 0, opacity: 1 } : { x: 200, opacity: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
            >
              <h3 
                className="pixel-font mb-4"
                style={{
                  fontSize: 'clamp(0.75rem, 2vw, 1rem)',
                  color: '#FFFFFF',
                  letterSpacing: '0.1em'
                }}
              >
                CHARACTER BIO
              </h3>
              <div
                className="relative p-6"
                style={{
                  border: '3px solid #FFFF00',
                  boxShadow: '0 0 20px rgba(255, 255, 0, 0.6)',
                  backgroundColor: 'rgba(0, 0, 0, 0.8)'
                }}
              >
                <motion.p
                  className="pixel-font text-white leading-relaxed"
                  style={{ fontSize: 'clamp(0.5rem, 1.2vw, 0.7rem)' }}
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ duration: 2, delay: 1.3 }}
                >
                  POUYA IS A UI/UX DESIGNER, PASSIONATE ABOUT CREATING ENGAGING EXPERIENCES WITH HIS LIFE. AS A DESIGNER, HE IS EXTREMELY METHODICAL WHEN BUILDING INTERFACES. CURRENTLY ENJOYS WORKING WITH MOTION & 3D. RESIDES THE MOST POWERFUL UPS AND EXITS.
                </motion.p>
              </div>
            </motion.div>

            {/* Power-Ups / Skills */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.6, delay: 1.6 }}
            >
              <h3 
                className="pixel-font mb-4"
                style={{
                  fontSize: 'clamp(0.75rem, 2vw, 1rem)',
                  color: '#FFFFFF',
                  letterSpacing: '0.1em'
                }}
              >
                POWER-UPS / SKILLS
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {skills.map((skill, index) => (
                  <div key={skill.name} className="flex items-center gap-3">
                    {/* Skill Icon - Now on the left */}
                    <div className="flex-shrink-0 w-20 h-20 flex items-center justify-center">
                      {skill.name === 'UX RESEARCH' && (
                        <img 
                          src={swordImage} 
                          alt="Pixel Sword" 
                          className="w-20 h-20 object-contain"
                          style={{ imageRendering: 'pixelated', mixBlendMode: 'screen' }} 
                        />
                      )}

                      {skill.name === 'UI DESIGN' && (
                        <img 
                          src={potionImage} 
                          alt="Pixel Potion" 
                          className="w-20 h-20 object-contain"
                          style={{ imageRendering: 'pixelated', mixBlendMode: 'screen' }} 
                        />
                      )}

                      {skill.name === 'PROTOTYPING' && (
                        <img 
                          src={shieldImage} 
                          alt="Pixel Shield" 
                          className="w-20 h-20 object-contain"
                          style={{ imageRendering: 'pixelated', mixBlendMode: 'screen' }} 
                        />
                      )}
                    </div>

                    {/* Skill Name and Progress Bar */}
                    <div className="flex-1">
                      <div 
                        className="pixel-font text-white mb-2"
                        style={{ fontSize: 'clamp(0.6rem, 1.2vw, 0.8rem)' }}
                      >
                        {skill.name}
                      </div>
                      
                      {/* Progress Bar Container */}
                      <div 
                        className="relative h-6"
                        style={{
                          backgroundColor: '#1a1a1a',
                          border: '2px solid #FFFFFF'
                        }}
                      >
                        {/* Progress Bar Fill */}
                        <motion.div
                          className="absolute left-0 top-0 h-full"
                          style={{
                            backgroundColor: '#FFFF00',
                            boxShadow: '0 0 10px rgba(255, 255, 0, 0.8)'
                          }}
                          initial={{ width: 0 }}
                          animate={isInView ? { width: `${skill.percentage}%` } : { width: 0 }}
                          transition={{ duration: 1, delay: 1.8 + (index * 0.2), ease: 'easeOut' }}
                        />
                        
                        {/* Percentage Text */}
                        <div 
                          className="absolute left-2 top-1/2 -translate-y-1/2 pixel-font text-black z-10"
                          style={{ fontSize: '0.6rem' }}
                        >
                          {skill.percentage}%
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Decorative Potion - Middle Right - BIGGER SVG */}
            <motion.div
              className="absolute right-[8%] top-[45%]"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
            >
              <svg width="48" height="48" viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg" shapeRendering="crispEdges">
                {/* Leaves */}
                <rect x="6" y="2" width="2" height="1" fill="#2DBE55"/>
                <rect x="5" y="3" width="1" height="1" fill="#2DBE55"/>
                <rect x="8" y="3" width="2" height="1" fill="#2DBE55"/>
                
                {/* Strawberry Body */}
                <rect x="5" y="4" width="4" height="1" fill="#FC4A4D"/>
                <rect x="4" y="5" width="6" height="1" fill="#FC4A4D"/>
                <rect x="3" y="6" width="8" height="3" fill="#FC4A4D"/>
                <rect x="4" y="9" width="6" height="1" fill="#FC4A4D"/>
                <rect x="5" y="10" width="4" height="1" fill="#FC4A4D"/>
                
                {/* Seeds */}
                <rect x="5" y="6" width="1" height="1" fill="#FFE989"/>
                <rect x="8" y="6" width="1" height="1" fill="#FFE989"/>
                <rect x="4" y="7" width="1" height="1" fill="#FFE989"/>
                <rect x="6" y="7" width="1" height="1" fill="#FFE989"/>
                <rect x="9" y="7" width="1" height="1" fill="#FFE989"/>
                <rect x="5" y="8" width="1" height="1" fill="#FFE989"/>
                <rect x="8" y="8" width="1" height="1" fill="#FFE989"/>
              </svg>
            </motion.div>



            {/* Decorative Orange - Bottom Right - BIGGER SVG */}
            <motion.div
              className="absolute right-[15%] bottom-[15%]"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
            >
              <svg width="48" height="48" viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg" shapeRendering="crispEdges">
                {/* Leaf */}
                <rect x="6" y="2" width="2" height="1" fill="#2DBE55"/>
                
                {/* Orange Body */}
                <rect x="5" y="4" width="4" height="1" fill="#FEAE34"/>
                <rect x="4" y="5" width="6" height="1" fill="#FEAE34"/>
                <rect x="3" y="6" width="8" height="3" fill="#FEAE34"/>
                <rect x="4" y="9" width="6" height="1" fill="#FEAE34"/>
                <rect x="5" y="10" width="4" height="1" fill="#FEAE34"/>
              </svg>
            </motion.div>
          </div>
        </div>

        {/* Level History / Experience */}
        <motion.div
          className="max-w-6xl w-full"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 2.2 }}
        >
          <h3 
            className="pixel-font mb-4"
            style={{
              fontSize: 'clamp(0.75rem, 2vw, 1rem)',
              color: '#FFFFFF',
              letterSpacing: '0.1em'
            }}
          >
            LEVEL HISTORY / EXPERIENCE
          </h3>
          
          <div className="space-y-2">
            {experience.map((exp, index) => (
              <motion.div
                key={index}
                className="flex items-center gap-4 p-3"
                style={{
                  backgroundColor: 'rgba(255, 255, 0, 0.05)',
                  border: '1px solid rgba(255, 255, 0, 0.2)'
                }}
                initial={{ y: 50, opacity: 0 }}
                animate={isInView ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
                transition={{ duration: 0.5, delay: 2.4 + (index * 0.15) }}
              >
                <div className="flex-shrink-0 text-green-400 pixel-font" style={{ fontSize: '0.7rem' }}>
                  →
                </div>
                <div className="flex-1">
                  <div className="pixel-font text-white" style={{ fontSize: 'clamp(0.5rem, 1.2vw, 0.65rem)' }}>
                    {exp.status} <span className="text-cyan-400">→</span> {exp.stage}
                  </div>
                </div>
                <div className="pixel-font text-yellow-400" style={{ fontSize: '0.6rem' }}>
                  {exp.date}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Decorative Elements - Bottom Left */}
        <motion.div
          className="absolute left-[2%] bottom-[5%]"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2.3, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
        >
          <PixelGhost color="#FF0000" />
        </motion.div>

      </motion.div>
    </section>
  );
}