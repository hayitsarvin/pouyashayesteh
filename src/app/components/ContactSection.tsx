import { motion, useInView, AnimatePresence } from 'motion/react';
import { useRef, useState } from 'react';
import { PixelGhost } from './ui/PixelGhost';
import emailjs from "@emailjs/browser";

// --- Pixel Art SVG Components ---

const PixelCherry = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 14 14" className={className} shapeRendering="crispEdges">
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
);

const PixelStrawberry = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 14 14" className={className} shapeRendering="crispEdges">
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
);

const PixelOrange = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 14 14" className={className} shapeRendering="crispEdges">
    {/* Leaf */}
    <rect x="6" y="2" width="2" height="1" fill="#2DBE55"/>
    
    {/* Orange Body */}
    <rect x="5" y="4" width="4" height="1" fill="#FEAE34"/>
    <rect x="4" y="5" width="6" height="1" fill="#FEAE34"/>
    <rect x="3" y="6" width="8" height="3" fill="#FEAE34"/>
    <rect x="4" y="9" width="6" height="1" fill="#FEAE34"/>
    <rect x="5" y="10" width="4" height="1" fill="#FEAE34"/>
  </svg>
);

// --- Social Icons ---

const IconLinkedIn = () => (
  <div className="w-8 h-8 hover:scale-110 transition-transform cursor-pointer relative rounded-[4px] overflow-hidden bg-white">
     <svg viewBox="0 0 24 24" className="w-full h-full fill-[#0077B5]">
       <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
     </svg>
  </div>
);

const IconX = () => (
  <svg viewBox="0 0 24 24" className="w-8 h-8 hover:scale-110 transition-transform cursor-pointer fill-white hover:fill-gray-300">
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
  </svg>
);

const IconDribbble = () => (
  <svg viewBox="0 0 24 24" className="w-8 h-8 hover:scale-110 transition-transform cursor-pointer fill-current text-pink-500 hover:text-pink-400">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm6.605 4.61a8.502 8.502 0 0 1 1.93 5.314c-.281-.054-3.101-.629-5.943-.271-1.08-3.592-2.446-6.641-2.593-6.982 2.508-.33 4.922.569 6.606 1.939zm-8.999 6.535c3.279-.442 6.182.253 6.541.341a8.496 8.496 0 0 1-3.685 5.692c-.615-1.45-1.995-4.782-2.856-6.033zm-1.634-1.306c.068-.13.91-1.742 2.255-5.312a8.5 8.5 0 0 1 6.517 2.112c-.114.281-1.33 2.918-2.316 6.312-3.197-.705-6.095-.3-6.456-.239zM8.27 5.056c.149.336 1.42 3.194 2.378 6.502-3.66 1.05-6.99.705-7.362.661A8.49 8.49 0 0 1 8.27 5.056zM3.503 13.94c.38.04 3.979.379 8.136-1.127.818 1.189 2.059 4.263 2.651 5.76-2.587 1.229-5.465 1.109-5.732 1.088A8.513 8.513 0 0 1 3.503 13.94z"/>
  </svg>
);

export function ContactSection({ onScoreUpdate }: { onScoreUpdate?: (points: number) => void }) {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.2 });
  const [popups, setPopups] = useState<{id: number}[]>([]);
  const [clickCount, setClickCount] = useState(0);
  const MAX_CLICKS = 2;

  const form = useRef();

  const sendEmail = (e) => {
    console.log("a")
    e.preventDefault();
    // console.log(e.target[0].value)
    console.log()



    emailjs.sendForm(
        "service_63j2jgo",
        "template_qkj8cyi",
        form.current,
        "7S3I1XJFQOgj9n0Ob"
      )
      .then(
        (result) => {
          console.log("ارسال شد", result.text);
    console.log("b")

        },
        (error) => {
          console.log(error.text);
    console.log("c")

        }
      );
  };

  const handleGhostClick = () => {
    if (clickCount >= MAX_CLICKS) return;

    if (onScoreUpdate) onScoreUpdate(1000);
    setClickCount(prev => prev + 1);
    
    const newId = Date.now();
    setPopups(prev => [...prev, { id: newId }]);
    
    // Cleanup popup after animation
    setTimeout(() => {
        setPopups(prev => prev.filter(p => p.id !== newId));
    }, 1000);
  };

  return (
    <section ref={containerRef} className="relative min-h-screen w-full bg-transparent flex flex-col items-center justify-center p-4 overflow-hidden">
      
      {/* Decorative Dots Removed */}
      
      <div className="relative z-10 w-full max-w-5xl flex flex-col items-center">
        
        {/* Header */}
        <motion.h2 
          className="pixel-font mb-24 text-center relative z-10 flex flex-col md:flex-row items-center justify-center gap-4"
          style={{
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
            color: '#ffff00',
            textShadow: '4px 4px 0px #ff0000, 8px 8px 0px #00ffff',
            letterSpacing: '0.1em',
            lineHeight: 1.2
          }}
          initial={{ opacity: 0, filter: 'blur(10px)' }}
          animate={isInView ? { opacity: 1, filter: 'blur(0px)' } : { opacity: 0, filter: 'blur(10px)' }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <span>GAME OVER</span>
        </motion.h2>

        {/* Main Content Area */}
        <div className="flex flex-col md:flex-row w-full gap-8 md:gap-16">
          {/* --- LEFT: FORM --- */}
          <form ref={form} onSubmit={sendEmail}>

          <div className="flex-1 flex flex-col gap-6">

             <div className="flex flex-col md:flex-row gap-6">
                {/* Name Field */}
                <div className="flex-1">
                   <label className="pixel-font text-[#FFFF00] text-xs mb-2 block tracking-wider ml-1 drop-shadow-[0_0_5px_rgba(255,255,0,0.5)]">NAME</label>
                   <input 
                      name='from_name'
                      type="text" 
                      placeholder="NAME"
                      className="w-full bg-black text-white pixel-font text-sm p-4 outline-none border-4 border-[#FFFF00] shadow-[0_0_10px_rgba(255,255,0,0.5),inset_0_0_10px_rgba(255,255,0,0.2)] placeholder:text-gray-600 focus:shadow-[0_0_20px_rgba(255,255,0,0.8),inset_0_0_15px_rgba(255,255,0,0.3)] transition-all duration-300 rounded-sm"
                   />
                </div>
                {/* Email Field */}
                <div className="flex-1">
                   <label className="pixel-font text-[#FFFF00] text-xs mb-2 block tracking-wider ml-1 drop-shadow-[0_0_5px_rgba(255,255,0,0.5)]">EMAIL</label>
                   <input 
                      name='from_email'
                      type="email" 
                      placeholder="EMAIL"
                      className="w-full bg-black text-white pixel-font text-sm p-4 outline-none border-4 border-[#FFFF00] shadow-[0_0_10px_rgba(255,255,0,0.5),inset_0_0_10px_rgba(255,255,0,0.2)] placeholder:text-gray-600 focus:shadow-[0_0_20px_rgba(255,255,0,0.8),inset_0_0_15px_rgba(255,255,0,0.3)] transition-all duration-300 rounded-sm"
                   />
                </div>
             </div>

             {/* Message Field */}
             <div>
                <label className="pixel-font text-[#FFFF00] text-xs mb-2 block tracking-wider ml-1 drop-shadow-[0_0_5px_rgba(255,255,0,0.5)]">MESSAGE</label>
                <textarea 
                   rows={6}
                   name='message'
                   placeholder="MESSAGE"
                   className="w-full bg-black text-white pixel-font text-sm p-4 outline-none border-4 border-[#FFFF00] shadow-[0_0_10px_rgba(255,255,0,0.5),inset_0_0_10px_rgba(255,255,0,0.2)] placeholder:text-gray-600 focus:shadow-[0_0_20px_rgba(255,255,0,0.8),inset_0_0_15px_rgba(255,255,0,0.3)] transition-all duration-300 rounded-sm resize-none"
                />
             </div>
             {/* <button type="submit"
              className="pixel-font bg-transparent text-[#FFFF00] text-xl px-12 py-4 border-4 border-[#FFFF00] hover:bg-[#FFFF00] hover:text-black transition-all duration-200 font-bold tracking-wider active:translate-x-[2px] active:translate-y-[2px]"
           >
              SEND
           </button> */}

          </div>
          </form>
          

          {/* --- RIGHT: INFO & DECOR --- */}
          <div className="w-full md:w-1/3 flex flex-col items-center justify-center relative mt-10 md:mt-0">
             
             {/* Decorative Fruits (Positioned relative to this column) */}
             <motion.div 
               className="absolute -top-10 -right-4"
               animate={{ y: [0, -15, 0] }}
               transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
             >
               <PixelStrawberry className="w-8 h-8" />
             </motion.div>
             <motion.div 
               className="absolute top-0 -left-6"
               animate={{ y: [0, -10, 0] }}
               transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
             >
               <PixelCherry className="w-10 h-10" />
             </motion.div>
             
             {/* Ghost */}
             <motion.div 
               animate={{ y: [0, -10, 0] }}
               transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
               className={`mb-6 relative ${clickCount < MAX_CLICKS ? 'cursor-pointer' : 'cursor-default'}`}
               onClick={handleGhostClick}
               whileTap={clickCount < MAX_CLICKS ? { scale: 0.95 } : {}}
             >
                <PixelGhost color="#00FFFF" size={80} className="filter drop-shadow-[0_0_10px_rgba(0,255,255,0.5)]" />
                
                <AnimatePresence>
                    {popups.map(popup => (
                        <motion.div
                            key={popup.id}
                            initial={{ opacity: 1, y: 0, scale: 0.5 }}
                            animate={{ opacity: 0, y: -60, scale: 1.2 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="absolute -top-4 left-1/2 -translate-x-1/2 pixel-font text-[#FFFF00] text-xl font-bold whitespace-nowrap pointer-events-none z-50"
                            style={{ 
                                textShadow: '2px 2px 0px #FF0000, 4px 4px 0px #000000'
                            }}
                        >
                            1000
                        </motion.div>
                    ))}
                </AnimatePresence>
             </motion.div>

             {/* Email Info */}
             <div className="text-center mb-6">
                <h3 className="pixel-font text-yellow-400 text-sm mb-2 tracking-widest">EMAIL:</h3>
                <p className="pixel-font text-white text-xs md:text-sm tracking-wide">SHAYESTEHPOUYA@GMAIL.COM</p>
             </div>

             {/* Social Icons */}
             <div className="flex gap-4">
                <IconLinkedIn />
                <IconX />
                <IconDribbble />
             </div>
          </div>
        </div>

        {/* Footer Area */}
        <div className="mt-16 flex flex-col items-center gap-6 w-full relative">
           {/* Decorative Cherries near button */}
           <motion.div 
             className="absolute left-[20%] top-2 hidden md:block"
             animate={{ y: [0, -8, 0] }}
             transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
           >
             <PixelCherry className="w-8 h-8" />
           </motion.div>
           
           <button onClick={sendEmail}
              className="pixel-font bg-transparent text-[#FFFF00] text-xl px-12 py-4 border-4 border-[#FFFF00] hover:bg-[#FFFF00] hover:text-black transition-all duration-200 font-bold tracking-wider active:translate-x-[2px] active:translate-y-[2px]"
           >
              SEND
           </button>
           
           <p className="pixel-font text-white text-sm tracking-[0.2em] animate-pulse">
              READY FOR PLAYER 2?
           </p>

           <motion.div 
             className="absolute right-[10%] top-4 hidden md:flex gap-8"
             animate={{ y: [0, -12, 0] }}
             transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
           >
              <PixelOrange className="w-6 h-6" />
           </motion.div>
        </div>

      </div>
    </section>
  );
}