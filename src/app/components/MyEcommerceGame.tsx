import React, { useEffect, useRef, useState } from 'react';

// --- CONSTANTS ---
const CANVAS_WIDTH = 224;
const CANVAS_HEIGHT = 288;
const PLAYER_WIDTH = 24;
const PLAYER_HEIGHT = 16;
const PLAYER_SPEED = 3;
const SPAWN_RATE = 40; // Frames between normal spawns

// Colors
const COLOR_BG = '#101010';
const COLOR_CART = '#FF0055'; // Neon Red
const COLOR_ITEM_BOX = '#00FFFF'; // Cyan Box
const COLOR_ITEM_BAG = '#FFFF00'; // Yellow Bag
const COLOR_SPECIAL = '#00FF00'; // Neon Green (Special)
const COLOR_BAD_BUG = '#FF0000'; // Red Bug
const COLOR_TEXT = '#FF0055';

// --- TYPES ---
type ItemType = 'BOX' | 'BAG' | 'BUG' | 'SPECIAL';

interface Item {
    x: number;
    y: number;
    type: ItemType;
    speed: number;
    active: boolean;
    width: number;
    height: number;
}

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    color: string;
}

interface MyEcommerceGameProps {
    onGameStart: () => void;
    onGameEnd: () => void;
    isActiveCabinet: boolean;
    onScoreUpdate?: (points: number) => void;
}

export function MyEcommerceGame({ onGameStart, onGameEnd, isActiveCabinet, onScoreUpdate }: MyEcommerceGameProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [gameStateDisplay, setGameStateDisplay] = useState<'START' | 'PLAY' | 'GAME_OVER'>('START');
    const [score, setScore] = useState(0);

    // Game State
    const stateRef = useRef({
        playerX: CANVAS_WIDTH / 2 - PLAYER_WIDTH / 2,
        items: [] as Item[],
        particles: [] as Particle[],
        spawnTimer: 0,
        score: 0,
        lives: 3,
        level: 1,
        frameCount: 0,
        // Special Block State
        gameTime: 0,        // Total frames played
        specialCaught: false,
        specialRetryTimer: 0
    });

    // --- INITIALIZATION ---
    const initGame = () => {
        stateRef.current = {
            playerX: CANVAS_WIDTH / 2 - PLAYER_WIDTH / 2,
            items: [],
            particles: [],
            spawnTimer: 0,
            score: 0,
            lives: 3,
            level: 1,
            frameCount: 0,
            gameTime: 0,
            specialCaught: false,
            specialRetryTimer: 0
        };
        setScore(0);
        setGameStateDisplay('PLAY');
        onGameStart();
    };

    const spawnItem = (level: number, forcedType?: ItemType) => {
        let type: ItemType = forcedType || 'BOX';
        
        if (!forcedType) {
            const types: ItemType[] = ['BOX', 'BOX', 'BAG', 'BUG'];
            if (level > 2) types.push('BUG');
            if (level > 4) types.push('BUG');
            type = types[Math.floor(Math.random() * types.length)];
        }

        const width = 12;
        const height = 12;
        
        const x = Math.random() * (CANVAS_WIDTH - width);
        const speed = type === 'SPECIAL' 
            ? 2.5 
            : 1.5 + (level * 0.2) + (Math.random() * 0.5);

        stateRef.current.items.push({
            x,
            y: -20,
            type,
            speed,
            active: true,
            width,
            height
        });
    };

    const createExplosion = (x: number, y: number, color: string) => {
        for (let i = 0; i < 6; i++) {
            stateRef.current.particles.push({
                x,
                y,
                vx: (Math.random() - 0.5) * 4,
                vy: (Math.random() - 0.5) * 4,
                life: 15 + Math.random() * 10,
                color
            });
        }
    };

    // --- GAME LOOP ---
    useEffect(() => {
        let animationFrameId: number;
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');

        // Inputs
        const keys = { ArrowLeft: false, ArrowRight: false, Enter: false };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isActiveCabinet) return;
            if (['ArrowLeft', 'ArrowRight', ' '].includes(e.key)) e.preventDefault();

            if (e.key === 'ArrowLeft') keys.ArrowLeft = true;
            if (e.key === 'ArrowRight') keys.ArrowRight = true;
            if (e.key === 'Enter') {
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
            if (e.key === 'ArrowLeft') keys.ArrowLeft = false;
            if (e.key === 'ArrowRight') keys.ArrowRight = false;
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        const update = () => {
            if (!ctx) return;
            const state = stateRef.current;
            state.frameCount++;

            if (gameStateDisplay === 'PLAY') {
                state.gameTime++;

                // 1. Move Player
                if (keys.ArrowLeft) state.playerX -= PLAYER_SPEED;
                if (keys.ArrowRight) state.playerX += PLAYER_SPEED;
                state.playerX = Math.max(0, Math.min(CANVAS_WIDTH - PLAYER_WIDTH, state.playerX));

                // 2. Spawn Normal Items
                state.spawnTimer--;
                if (state.spawnTimer <= 0) {
                    spawnItem(state.level);
                    state.spawnTimer = Math.max(10, SPAWN_RATE - (state.level * 2));
                }

                // === SPECIAL ITEM SPAWN LOGIC ===
                const isSpecialActive = state.items.some(i => i.type === 'SPECIAL');
                
                if (state.specialRetryTimer > 0) {
                    state.specialRetryTimer--;
                }

                if (
                    !state.specialCaught &&         
                    !isSpecialActive &&             
                    state.gameTime > 1800 &&        
                    state.specialRetryTimer <= 0    
                ) {
                    spawnItem(state.level, 'SPECIAL');
                }

                // 3. Update Items
                state.items.forEach(item => {
                    item.y += item.speed;

                    // Collision
                    if (
                        item.active &&
                        item.y + item.height >= CANVAS_HEIGHT - 20 && 
                        item.y < CANVAS_HEIGHT - 5 &&
                        item.x + item.width > state.playerX &&
                        item.x < state.playerX + PLAYER_WIDTH
                    ) {
                        item.active = false;
                        
                        if (item.type === 'BUG') {
                            state.lives--;
                            createExplosion(item.x, item.y, COLOR_BAD_BUG);
                            if (state.lives <= 0) setGameStateDisplay('GAME_OVER');
                        } else if (item.type === 'SPECIAL') {
                            state.score += 1000;
                            state.specialCaught = true;
                            createExplosion(item.x, item.y, COLOR_SPECIAL);
                            window.open('https://drmeliha.com', '_blank');
                        } else {
                            const points = item.type === 'BAG' ? 50 : 20;
                            state.score += points;
                            createExplosion(item.x, item.y, item.type === 'BAG' ? COLOR_ITEM_BAG : COLOR_ITEM_BOX);
                            state.level = 1 + Math.floor(state.score / 500);
                        }
                        
                        setScore(state.score);
                        if (onScoreUpdate) onScoreUpdate(state.score);
                    }

                    // Missed Items
                    if (item.active && item.y > CANVAS_HEIGHT) {
                        item.active = false;
                        if (item.type === 'SPECIAL') {
                            state.specialRetryTimer = 300;
                        }
                    }
                });

                state.items = state.items.filter(i => i.active);

                // 4. Particles
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

            const drawText = (text: string, x: number, y: number, color: string, font: string, align: CanvasTextAlign = 'center') => {
                ctx.font = font;
                ctx.textAlign = align;
                ctx.lineWidth = 3;
                ctx.strokeStyle = '#000000';
                ctx.strokeText(text, x, y);
                ctx.fillStyle = color;
                ctx.fillText(text, x, y);
            };

            if (gameStateDisplay === 'START') {
                // Title
                drawText('SUPER SHOPPER', CANVAS_WIDTH / 2, 40, COLOR_TEXT, 'bold 26px "Courier New"', 'center');
                
                // LEGEND
                const leftCol = CANVAS_WIDTH/2 - 50; 
                const iconSize = 14;
                // Changed to Arial for better readability at small size
                const legendFont = 'bold 15px "Arial"';
                const lineHeight = 30;
                let startY = 80;
                
                // Box
                ctx.fillStyle = COLOR_ITEM_BOX; ctx.fillRect(leftCol, startY - 12, iconSize, iconSize);
                drawText('= 20 PTS', leftCol + 25, startY, '#fff', legendFont, 'left');

                // Bag
                startY += lineHeight;
                ctx.fillStyle = COLOR_ITEM_BAG; ctx.fillRect(leftCol, startY - 12, iconSize, iconSize);
                drawText('= 50 PTS', leftCol + 25, startY, '#fff', legendFont, 'left');
                
                // Bug
                startY += lineHeight;
                ctx.fillStyle = COLOR_BAD_BUG; ctx.fillRect(leftCol, startY - 12, iconSize, iconSize);
                drawText('= AVOID', leftCol + 25, startY, '#fff', legendFont, 'left');

                // Special
                startY += lineHeight;
                ctx.fillStyle = COLOR_SPECIAL; ctx.fillRect(leftCol, startY - 12, iconSize, iconSize);
                drawText('= PROJECT', leftCol + 25, startY, '#fff', legendFont, 'left');

                // Mission Text
                drawText('CATCH THE', CANVAS_WIDTH / 2, 210, '#FFFFFF', 'bold 18px "Courier New"', 'center');
                drawText('GREEN BLOCK', CANVAS_WIDTH / 2, 235, COLOR_SPECIAL, 'bold 22px "Courier New"', 'center');

                if (Math.floor(Date.now() / 500) % 2 === 0) {
                    drawText('PRESS ENTER', CANVAS_WIDTH / 2, 270, '#FFFFFF', 'bold 18px "Courier New"', 'center');
                }

            } else if (gameStateDisplay === 'GAME_OVER') {
                drawText('GAME OVER', CANVAS_WIDTH / 2, 80, '#FF0000', 'bold 28px "Courier New"', 'center');
                drawText(`SCORE: ${state.score}`, CANVAS_WIDTH / 2, 140, '#FFFFFF', 'bold 22px "Courier New"', 'center');
                if (Math.floor(Date.now() / 500) % 2 === 0) {
                    drawText('PRESS ENTER', CANVAS_WIDTH / 2, 220, '#FFFFFF', 'bold 18px "Courier New"', 'center');
                }
            } else {
                // Play Mode Drawing (Player, Items, etc)
                const px = state.playerX;
                const py = CANVAS_HEIGHT - 20;
                
                // Player
                ctx.fillStyle = COLOR_CART;
                ctx.fillRect(px, py, PLAYER_WIDTH, PLAYER_HEIGHT);
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(px + 2, py + PLAYER_HEIGHT, 4, 4);
                ctx.fillRect(px + PLAYER_WIDTH - 6, py + PLAYER_HEIGHT, 4, 4);
                ctx.strokeStyle = '#AAAAAA';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(px, py);
                ctx.lineTo(px - 4, py - 6);
                ctx.stroke();

                // Items
                state.items.forEach(item => {
                    if (item.type === 'BUG') {
                        ctx.fillStyle = COLOR_BAD_BUG;
                        ctx.beginPath();
                        ctx.arc(item.x + item.width/2, item.y + item.height/2, item.width/2, 0, Math.PI*2);
                        ctx.fill();
                        ctx.fillStyle = '#000';
                        ctx.fillText('!', item.x + item.width/2, item.y + item.height - 2);
                    } else if (item.type === 'SPECIAL') {
                        ctx.fillStyle = COLOR_SPECIAL;
                        ctx.fillRect(item.x, item.y, item.width, item.height);
                        ctx.strokeStyle = '#FFFFFF';
                        ctx.lineWidth = 1;
                        ctx.strokeRect(item.x, item.y, item.width, item.height);
                        ctx.fillStyle = '#000';
                        ctx.font = 'bold 10px Arial';
                        ctx.fillText('?', item.x + item.width/2, item.y + item.height - 2);
                    } else {
                        ctx.fillStyle = item.type === 'BAG' ? COLOR_ITEM_BAG : COLOR_ITEM_BOX;
                        ctx.fillRect(item.x, item.y, item.width, item.height);
                        ctx.fillStyle = 'rgba(0,0,0,0.3)';
                        ctx.fillRect(item.x + 2, item.y + 2, item.width - 4, item.height - 4);
                    }
                });

                // Particles
                state.particles.forEach(p => {
                    ctx.fillStyle = p.color;
                    ctx.fillRect(p.x, p.y, 2, 2);
                });

                // HUD
                drawText(`SCORE: ${state.score}`, 50, 20, '#FFFFFF', 'bold 14px "Courier New"', 'center');
                
                ctx.fillStyle = '#FF0000';
                for(let i=0; i<state.lives; i++) {
                    ctx.fillRect(CANVAS_WIDTH - 20 - (i * 10), 10, 6, 6);
                }
            }

            animationFrameId = requestAnimationFrame(update);
        };

        animationFrameId = requestAnimationFrame(update);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            cancelAnimationFrame(animationFrameId);
        };
    }, [isActiveCabinet, gameStateDisplay]);

    return (
        <div className="w-full h-full bg-[#101010] flex items-center justify-center overflow-hidden relative">
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
