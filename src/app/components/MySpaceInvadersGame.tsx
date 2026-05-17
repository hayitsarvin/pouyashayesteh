import React, { useEffect, useRef, useState } from 'react';

// --- CONSTANTS ---
const CANVAS_WIDTH = 224; // Standard arcade resolution width
const CANVAS_HEIGHT = 288; // Standard arcade resolution height
const PLAYER_SPEED = 2;
const BULLET_SPEED = 4;
const ALIEN_SPEED_X = 0.5;
const ALIEN_DROP_Y = 10;
const FIRE_COOLDOWN = 30; // Frames

// Colors
const COLOR_BG = '#000000';
const COLOR_PLAYER = '#00FFFF'; // Cyan Nano-bot
const COLOR_ALIEN = '#00FF99'; // Mint/Green Virus
const COLOR_CHARITY = '#FF00FF'; // Magenta for Charity App
const COLOR_BULLET = '#FFFFFF';
const COLOR_TEXT = '#00FF99';
const COLOR_MISSION = '#FFFF00'; // Yellow for instructions

// --- TYPES ---
interface Bullet {
    x: number;
    y: number;
    active: boolean;
}

interface Alien {
    x: number;
    y: number;
    row: number;
    col: number;
    alive: boolean;
    type: 'normal' | 'charity';
}

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    color: string;
}

interface MySpaceInvadersGameProps {
    onGameStart: () => void;
    onGameEnd: () => void;
    isActiveCabinet: boolean;
    onScoreUpdate?: (points: number) => void;
}

export function MySpaceInvadersGame({ onGameStart, onGameEnd, isActiveCabinet, onScoreUpdate }: MySpaceInvadersGameProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [gameStateDisplay, setGameStateDisplay] = useState<'START' | 'PLAY' | 'GAME_OVER'>('START');
    const [score, setScore] = useState(0);

    // Game State Refs (Mutable for game loop)
    const stateRef = useRef({
        playerX: CANVAS_WIDTH / 2,
        bullets: [] as Bullet[],
        aliens: [] as Alien[],
        particles: [] as Particle[],
        alienDir: 1, // 1 = right, -1 = left
        alienMoveTimer: 0,
        fireTimer: 0,
        score: 0,
        lives: 3,
        level: 1,
        frameCount: 0
    });

    // --- INITIALIZATION ---
    const initGame = () => {
        stateRef.current = {
            playerX: CANVAS_WIDTH / 2,
            bullets: [],
            aliens: createAliens(1),
            particles: [],
            alienDir: 1,
            alienMoveTimer: 0,
            fireTimer: 0,
            score: 0,
            lives: 3,
            level: 1,
            frameCount: 0
        };
        setScore(0);
        setGameStateDisplay('PLAY');
        onGameStart();
    };

    const createAliens = (level: number) => {
        const aliens: Alien[] = [];
        const rows = 4;
        const cols = 8;
        const startX = 20;
        const startY = 40;
        const gapX = 20;
        const gapY = 20;

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                // Top-Left alien (row 0, col 0) is the Charity App
                const isCharity = r === 0 && c === 0;
                
                aliens.push({
                    x: startX + c * gapX,
                    y: startY + r * gapY,
                    row: r,
                    col: c,
                    alive: true,
                    type: isCharity ? 'charity' : 'normal'
                });
            }
        }
        return aliens;
    };

    const createExplosion = (x: number, y: number, color: string) => {
        for (let i = 0; i < 8; i++) {
            stateRef.current.particles.push({
                x,
                y,
                vx: (Math.random() - 0.5) * 4,
                vy: (Math.random() - 0.5) * 4,
                life: 20 + Math.random() * 10,
                color
            });
        }
    };

    // --- GAME LOOP ---
    useEffect(() => {
        let animationFrameId: number;
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');

        // Input handling
        const keys = {
            ArrowLeft: false,
            ArrowRight: false,
            Space: false,
            Enter: false
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isActiveCabinet) return;

            // Prevent scrolling for game keys
            if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code) || e.key === ' ') {
                e.preventDefault();
            }

            if (e.code === 'ArrowLeft') keys.ArrowLeft = true;
            if (e.code === 'ArrowRight') keys.ArrowRight = true;
            if (e.code === 'Space' || e.key === ' ') keys.Space = true;
            if (e.code === 'Enter') {
                if (gameStateDisplay === 'START' || gameStateDisplay === 'GAME_OVER') {
                    initGame();
                }
            }
            if (e.key === 'Escape') {
                setGameStateDisplay('START');
                onGameEnd();
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.code === 'ArrowLeft') keys.ArrowLeft = false;
            if (e.code === 'ArrowRight') keys.ArrowRight = false;
            if (e.code === 'Space' || e.key === ' ') keys.Space = false;
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        const update = () => {
            if (!ctx) return;
            const state = stateRef.current;
            state.frameCount++;

            if (gameStateDisplay === 'PLAY') {
                // 1. Player Movement
                if (keys.ArrowLeft) state.playerX -= PLAYER_SPEED;
                if (keys.ArrowRight) state.playerX += PLAYER_SPEED;
                state.playerX = Math.max(10, Math.min(CANVAS_WIDTH - 10, state.playerX));

                // 2. Shooting
                if (state.fireTimer > 0) state.fireTimer--;
                if (keys.Space && state.fireTimer === 0) {
                    state.bullets.push({
                        x: state.playerX,
                        y: CANVAS_HEIGHT - 20,
                        active: true
                    });
                    state.fireTimer = FIRE_COOLDOWN;
                }

                // 3. Update Bullets
                state.bullets.forEach(b => {
                    b.y -= BULLET_SPEED;
                    if (b.y < 0) b.active = false;
                });
                state.bullets = state.bullets.filter(b => b.active);

                // 4. Update Aliens
                let shouldTurn = false;
                const aliveAliens = state.aliens.filter(a => a.alive);

                state.bullets.forEach(b => {
                    if (!b.active) return;
                    for (const alien of aliveAliens) {
                        if (
                            Math.abs(b.x - alien.x) < 8 &&
                            Math.abs(b.y - alien.y) < 8
                        ) {
                            alien.alive = false;
                            b.active = false;
                            
                            const points = alien.type === 'charity' ? 500 : 100;
                            state.score += points;
                            setScore(state.score);
                            if (onScoreUpdate) onScoreUpdate(state.score);
                            
                            const explosionColor = alien.type === 'charity' ? COLOR_CHARITY : COLOR_ALIEN;
                            createExplosion(alien.x, alien.y, explosionColor);

                            // === LINK LOGIC ===
                            if (alien.type === 'charity') {
                                window.open('https://atris.poportfolio.com', '_blank');
                            }
                            break;
                        }
                    }
                });

                if (state.aliens.every(a => !a.alive)) {
                    state.level++;
                    state.aliens = createAliens(state.level);
                    state.bullets = [];
                }

                // Move Aliens
                let maxY = 0;
                aliveAliens.forEach(a => {
                    a.x += ALIEN_SPEED_X * state.alienDir + (state.level * 0.1 * state.alienDir);
                    if (a.x < 10) shouldTurn = true;
                    if (a.x > CANVAS_WIDTH - 10) shouldTurn = true;
                    if (a.y > maxY) maxY = a.y;
                });

                if (shouldTurn) {
                    state.alienDir *= -1;
                    aliveAliens.forEach(a => {
                        a.y += ALIEN_DROP_Y;
                        if(a.x < 10) a.x = 10;
                        if(a.x > CANVAS_WIDTH - 10) a.x = CANVAS_WIDTH - 10;
                    });
                }

                if (maxY > CANVAS_HEIGHT - 30) {
                    setGameStateDisplay('GAME_OVER');
                }

                // 5. Update Particles
                state.particles.forEach(p => {
                    p.x += p.vx;
                    p.y += p.vy;
                    p.life--;
                });
                state.particles = state.particles.filter(p => p.life > 0);
            }

            // --- DRAW ---
            ctx.fillStyle = COLOR_BG;
            ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

            // Helper for outlined text to improve readability
            const drawText = (text: string, x: number, y: number, color: string, font: string) => {
                ctx.font = font;
                ctx.textAlign = 'center';
                ctx.lineWidth = 3;
                ctx.strokeStyle = '#000000'; // Black outline
                ctx.strokeText(text, x, y);
                ctx.fillStyle = color;
                ctx.fillText(text, x, y);
            };

            if (gameStateDisplay === 'START') {
                // Moved slightly up to make room
                drawText('VIRUS INVADERS', CANVAS_WIDTH / 2, 40, COLOR_TEXT, 'bold 24px "Courier New"');
                
                // MISSION INSTRUCTIONS - LARGER
                drawText('MISSION:', CANVAS_WIDTH / 2, 80, COLOR_MISSION, 'bold 18px "Courier New"');
                
                drawText('SHOOT THE', CANVAS_WIDTH / 2, 110, '#FFFFFF', 'bold 18px "Courier New"');
                drawText('PINK VIRUS', CANVAS_WIDTH / 2, 135, COLOR_CHARITY, 'bold 20px "Courier New"');
                drawText('TO SEE PROJECT', CANVAS_WIDTH / 2, 160, '#FFFFFF', 'bold 18px "Courier New"');

                // Decorative alien
                drawAlien(ctx, CANVAS_WIDTH/2, 210, true, 'charity');

                if (Math.floor(Date.now() / 500) % 2 === 0) {
                    drawText('PRESS ENTER', CANVAS_WIDTH / 2, 260, '#FFFFFF', 'bold 18px "Courier New"');
                }

            } else if (gameStateDisplay === 'GAME_OVER') {
                drawText('GAME OVER', CANVAS_WIDTH / 2, 80, '#FF0000', 'bold 28px "Courier New"');
                
                drawText('SCORE', CANVAS_WIDTH / 2, 130, '#FFFFFF', 'bold 16px "Courier New"');
                drawText(`${state.score}`, CANVAS_WIDTH / 2, 155, COLOR_TEXT, 'bold 24px "Courier New"');
                
                if (Math.floor(Date.now() / 500) % 2 === 0) {
                    drawText('PRESS ENTER', CANVAS_WIDTH / 2, 220, '#FFFFFF', 'bold 16px "Courier New"');
                }

            } else {
                // Draw Player
                ctx.fillStyle = COLOR_PLAYER;
                ctx.beginPath();
                ctx.moveTo(state.playerX, CANVAS_HEIGHT - 10);
                ctx.lineTo(state.playerX - 6, CANVAS_HEIGHT);
                ctx.lineTo(state.playerX + 6, CANVAS_HEIGHT);
                ctx.fill();
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(state.playerX - 1, CANVAS_HEIGHT - 14, 2, 4);

                // Draw Aliens
                state.aliens.forEach(a => {
                    if (a.alive) drawAlien(ctx, a.x, a.y, Math.floor(state.frameCount / 30) % 2 === 0, a.type);
                });

                // Draw Bullets
                ctx.fillStyle = COLOR_BULLET;
                state.bullets.forEach(b => {
                    ctx.fillRect(b.x - 1, b.y - 4, 2, 6);
                });

                // Draw Particles
                state.particles.forEach(p => {
                    ctx.fillStyle = p.color;
                    ctx.fillRect(p.x, p.y, 2, 2);
                });

                // HUD
                ctx.fillStyle = '#FFFFFF';
                ctx.font = 'bold 14px "Courier New"';
                ctx.textAlign = 'left';
                ctx.fillText(`SCORE:${state.score}`, 8, 20); 
            }

            animationFrameId = requestAnimationFrame(update);
        };

        const drawAlien = (ctx: CanvasRenderingContext2D, x: number, y: number, frame: boolean, type: 'normal' | 'charity') => {
            ctx.fillStyle = type === 'charity' ? COLOR_CHARITY : COLOR_ALIEN;
            const size = 6;
            ctx.fillRect(x - size, y - size/2, size * 2, size);
            ctx.fillRect(x - size/2, y - size, size, size * 2);
            if (frame) {
                ctx.fillRect(x - size - 2, y - size - 2, 2, 2);
                ctx.fillRect(x + size, y - size - 2, 2, 2);
                ctx.fillRect(x - size - 2, y + size, 2, 2);
                ctx.fillRect(x + size, y + size, 2, 2);
            } else {
                ctx.fillRect(x - size - 2, y, 2, 2);
                ctx.fillRect(x + size, y, 2, 2);
            }
        };

        animationFrameId = requestAnimationFrame(update);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            cancelAnimationFrame(animationFrameId);
        };
    }, [isActiveCabinet, gameStateDisplay]); 

    return (
        <div className="w-full h-full bg-black flex items-center justify-center overflow-hidden relative">
            <div className="absolute inset-0 z-20 pointer-events-none opacity-20"
                 style={{
                     background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
                     backgroundSize: '100% 2px, 3px 100%'
                 }}
            />
            <canvas 
                ref={canvasRef} 
                width={CANVAS_WIDTH} 
                height={CANVAS_HEIGHT} 
                className="w-full h-full object-contain image-pixelated"
            />
        </div>
    );
}
