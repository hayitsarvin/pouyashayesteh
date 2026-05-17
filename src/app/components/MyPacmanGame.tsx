import React, { useEffect, useRef, useState } from 'react';

// --- CONSTANTS ---
const TILE_SIZE = 16;
const COLS = 15;
const ROWS = 17;
const CANVAS_WIDTH = COLS * TILE_SIZE; // 240
const CANVAS_HEIGHT = ROWS * TILE_SIZE; // 272

// Colors
const COLOR_BG = '#000000';
const COLOR_WALL = '#1919A6'; // Arcade Blue
const COLOR_DOT = '#FFB8AE'; // Pinkish Dot
const COLOR_PACMAN = '#FFFF00';
const COLOR_SPECIAL = '#00FF00'; // Neon Green for the Project Link
const COLOR_TEXT = '#FFB852';

// Map: 1=Wall, 0=Dot, 2=Empty/Path, 9=GhostHouse
// Improved Map Layout
const LEVEL_MAP = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,1,0,0,0,0,0,0,1],
    [1,0,1,1,0,1,0,1,0,1,0,1,1,0,1],
    [1,0,1,1,0,1,0,1,0,1,0,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,0,1,1,1,1,1,0,1,1,0,1],
    [1,0,0,0,0,2,2,9,2,2,0,0,0,0,1], // Ghost house entrance
    [1,1,1,1,0,1,1,9,1,1,0,1,1,1,1],
    [1,2,2,2,0,1,9,9,9,1,0,2,2,2,1], // Middle Lane / Teleport zone lookalike
    [1,1,1,1,0,1,1,1,1,1,0,1,1,1,1],
    [1,0,0,0,0,0,0,1,0,0,0,0,0,0,1], // Row 10 - Center is Wall (Index 7)
    [1,0,1,1,0,1,0,1,0,1,0,1,1,0,1],
    [1,0,0,1,0,0,0,0,0,0,0,1,0,0,1], // Row 12 - Center is Open (Index 7)
    [1,1,0,1,0,1,1,1,1,1,0,1,0,1,1],
    [1,0,0,0,0,0,0,1,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,1,1,1,1,1,1,1,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
];

interface MyPacmanGameProps {
    onGameStart: () => void;
    onGameEnd: () => void;
    isActiveCabinet: boolean;
    onScoreUpdate?: (points: number) => void;
}

export function MyPacmanGame({ onGameStart, onGameEnd, isActiveCabinet, onScoreUpdate }: MyPacmanGameProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [gameStateDisplay, setGameStateDisplay] = useState<'START' | 'PLAY' | 'GAME_OVER'>('START');

    // Using ref for everything to avoid React render lag
    const gameRef = useRef({
        map: [] as number[][],
        pacman: {
            x: 7 * TILE_SIZE + TILE_SIZE/2, 
            y: 12 * TILE_SIZE + TILE_SIZE/2, // Start at Row 12 (Safe spot)
            dir: { x: 0, y: 0 },
            nextDir: { x: 0, y: 0 },
            speed: 2
        },
        ghosts: [] as any[],
        score: 0,
        lives: 3,
        frameCount: 0,
        specialItem: {
            active: false,
            triggered: false, // Prevents multiple window opens
            x: 7 * TILE_SIZE + TILE_SIZE/2, 
            y: 4 * TILE_SIZE + TILE_SIZE/2 
        },
        gameTime: 0
    });

    const initGame = () => {
        // Deep copy map
        const newMap = LEVEL_MAP.map(row => [...row]);
        
        gameRef.current = {
            map: newMap,
            pacman: {
                x: 7 * TILE_SIZE + TILE_SIZE/2, 
                y: 12 * TILE_SIZE + TILE_SIZE/2,
                dir: { x: 1, y: 0 }, // Start moving right
                nextDir: { x: 1, y: 0 },
                speed: 2 // Pixels per frame
            },
            ghosts: [
                { x: 1 * TILE_SIZE + 8, y: 1 * TILE_SIZE + 8, dir: { x: 1, y: 0 }, color: '#FF0000', speed: 1.5 }, // Blinky (Red)
                { x: 13 * TILE_SIZE + 8, y: 1 * TILE_SIZE + 8, dir: { x: -1, y: 0 }, color: '#00FFFF', speed: 1.5 }, // Inky (Cyan)
                { x: 1 * TILE_SIZE + 8, y: 15 * TILE_SIZE + 8, dir: { x: 1, y: 0 }, color: '#FFB8FF', speed: 1.2 }, // Pinky (Pink)
                { x: 13 * TILE_SIZE + 8, y: 15 * TILE_SIZE + 8, dir: { x: -1, y: 0 }, color: '#FFB852', speed: 1.0 }, // Clyde (Orange)
            ],
            score: 0,
            lives: 3,
            frameCount: 0,
            specialItem: {
                active: false,
                triggered: false,
                x: 7 * TILE_SIZE + TILE_SIZE/2,
                y: 4 * TILE_SIZE + TILE_SIZE/2
            },
            gameTime: 0
        };

        if (onScoreUpdate) onScoreUpdate(0);
        setGameStateDisplay('PLAY');
        onGameStart();
    };

    // --- HELPER: Collision Check ---
    const isWall = (x: number, y: number) => {
        if (!gameRef.current.map || gameRef.current.map.length === 0) return true;

        const col = Math.floor(x / TILE_SIZE);
        const row = Math.floor(y / TILE_SIZE);
        
        if (row < 0 || row >= ROWS || col < 0 || col >= COLS) return true;
        
        const rowData = gameRef.current.map[row];
        if (!rowData) return true;

        return rowData[col] === 1;
    };

    // --- HELPER: Center Alignment ---
    const isCentered = (x: number, y: number) => {
        const threshold = 2;
        const centerX = Math.floor(x / TILE_SIZE) * TILE_SIZE + TILE_SIZE / 2;
        const centerY = Math.floor(y / TILE_SIZE) * TILE_SIZE + TILE_SIZE / 2;
        return Math.abs(x - centerX) < threshold && Math.abs(y - centerY) < threshold;
    };

    const snapToGrid = (val: number) => {
        return Math.floor(val / TILE_SIZE) * TILE_SIZE + TILE_SIZE / 2;
    };

    // --- GAME LOOP ---
    useEffect(() => {
        let animationFrameId: number;
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;

        // Input Handling
        const keys = { ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isActiveCabinet) return;
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) e.preventDefault();

            const state = gameRef.current;

            if (gameStateDisplay === 'PLAY') {
                if (e.key === 'ArrowUp') state.pacman.nextDir = { x: 0, y: -1 };
                if (e.key === 'ArrowDown') state.pacman.nextDir = { x: 0, y: 1 };
                if (e.key === 'ArrowLeft') state.pacman.nextDir = { x: -1, y: 0 };
                if (e.key === 'ArrowRight') state.pacman.nextDir = { x: 1, y: 0 };
            }

            if (e.key === 'Enter') {
                if (gameStateDisplay !== 'PLAY') {
                    initGame();
                }
            }
            if (e.key === 'Escape') {
                setGameStateDisplay('START');
                onGameEnd();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        const update = () => {
            const state = gameRef.current;
            state.frameCount++;

            // --- SAFETY CHECK ---
            if (gameStateDisplay === 'PLAY' && (!state.map || state.map.length === 0)) {
                return; 
            }

            if (gameStateDisplay === 'PLAY') {
                state.gameTime++;

                // --- 1. SPECIAL ITEM SPAWN ---
                // Spawn after 3 seconds or 100 points
                if (!state.specialItem.active && !state.specialItem.triggered && (state.gameTime > 180 || state.score >= 100)) {
                    state.specialItem.active = true;
                }

                // --- 2. PACMAN MOVEMENT ---
                const pm = state.pacman;
                
                if (isCentered(pm.x, pm.y)) {
                    const nextX = pm.x + pm.nextDir.x * TILE_SIZE;
                    const nextY = pm.y + pm.nextDir.y * TILE_SIZE;
                    
                    if (!isWall(nextX, nextY)) {
                        pm.dir = pm.nextDir;
                        if (pm.dir.x !== 0) pm.y = snapToGrid(pm.y);
                        if (pm.dir.y !== 0) pm.x = snapToGrid(pm.x);
                    } else {
                        const currX = pm.x + pm.dir.x * TILE_SIZE;
                        const currY = pm.y + pm.dir.y * TILE_SIZE;
                        if (isWall(currX, currY)) {
                            pm.dir = { x: 0, y: 0 };
                            pm.x = snapToGrid(pm.x);
                            pm.y = snapToGrid(pm.y);
                        }
                    }
                }

                pm.x += pm.dir.x * pm.speed;
                pm.y += pm.dir.y * pm.speed;

                if (pm.x < 0) pm.x = CANVAS_WIDTH;
                if (pm.x > CANVAS_WIDTH) pm.x = 0;

                // --- 3. COLLISIONS ---
                const col = Math.floor(pm.x / TILE_SIZE);
                const row = Math.floor(pm.y / TILE_SIZE);
                
                if (row >= 0 && row < ROWS && col >= 0 && col < COLS) {
                    if (state.map[row] && state.map[row][col] === 0) {
                        state.map[row][col] = 2; // Set to empty
                        state.score += 10;
                    }
                }

                // EAT SPECIAL ITEM (Grid-Based Check)
                // Added !state.specialItem.triggered to ensure single execution
                if (state.specialItem.active && !state.specialItem.triggered) {
                    const itemCol = Math.floor(state.specialItem.x / TILE_SIZE);
                    const itemRow = Math.floor(state.specialItem.y / TILE_SIZE);
                    
                    const dx = pm.x - state.specialItem.x;
                    const dy = pm.y - state.specialItem.y;
                    const dist = Math.sqrt(dx*dx + dy*dy);

                    if ((col === itemCol && row === itemRow) || dist < 12) {
                        state.specialItem.triggered = true; // LOCK IT IMMEDIATELY
                        state.score += 1000;
                        state.specialItem.active = false;
                        window.open('https://drmeliha.com', '_blank');
                    }
                }

                state.ghosts.forEach(g => {
                    const gxNext = g.x + g.dir.x * TILE_SIZE * 0.5;
                    const gyNext = g.y + g.dir.y * TILE_SIZE * 0.5;
                    
                    if (isWall(gxNext, gyNext)) {
                        const dirs = [{x:1,y:0}, {x:-1,y:0}, {x:0,y:1}, {x:0,y:-1}];
                        const validDirs = dirs.filter(d => !isWall(g.x + d.x * TILE_SIZE, g.y + d.y * TILE_SIZE));
                        if (validDirs.length > 0) {
                             g.dir = validDirs[Math.floor(Math.random() * validDirs.length)];
                        } else {
                             g.dir = { x: -g.dir.x, y: -g.dir.y };
                        }
                    }
                    
                    g.x += g.dir.x * g.speed;
                    g.y += g.dir.y * g.speed;

                    const dist = Math.sqrt(Math.pow(g.x - pm.x, 2) + Math.pow(g.y - pm.y, 2));
                    if (dist < TILE_SIZE - 4) {
                        setGameStateDisplay('GAME_OVER');
                    }
                });
            }

            // --- DRAW ---
            ctx.fillStyle = COLOR_BG;
            ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

            if (state.map && state.map.length > 0) {
                for (let r = 0; r < ROWS; r++) {
                    for (let c = 0; c < COLS; c++) {
                        const rowData = state.map[r];
                        if (!rowData) continue;
                        const cell = rowData[c];
                        const cx = c * TILE_SIZE;
                        const cy = r * TILE_SIZE;

                        if (cell === 1) {
                            ctx.fillStyle = COLOR_WALL;
                            ctx.strokeStyle = '#000';
                            ctx.lineWidth = 1;
                            ctx.fillRect(cx, cy, TILE_SIZE, TILE_SIZE);
                            ctx.strokeRect(cx, cy, TILE_SIZE, TILE_SIZE);
                            
                            ctx.strokeStyle = '#5555FF';
                            ctx.strokeRect(cx+3, cy+3, TILE_SIZE-6, TILE_SIZE-6);
                            
                        } else if (cell === 0) {
                            ctx.fillStyle = COLOR_DOT;
                            ctx.fillRect(cx + 6, cy + 6, 4, 4);
                        }
                    }
                }
            }

            if (state.specialItem.active) {
                const sx = state.specialItem.x;
                const sy = state.specialItem.y;
                const pulse = 1 + Math.sin(state.frameCount * 0.1) * 0.2;
                
                ctx.save();
                ctx.translate(sx, sy);
                ctx.scale(pulse, pulse);
                ctx.fillStyle = COLOR_SPECIAL;
                ctx.beginPath();
                ctx.arc(0, 0, 6, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#000';
                ctx.font = 'bold 8px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('GO', 0, 0);
                ctx.restore();
            }

            if (gameStateDisplay !== 'START') {
                const pm = state.pacman;
                ctx.fillStyle = COLOR_PACMAN;
                ctx.beginPath();
                
                const mouthSpeed = 0.2;
                const openAmount = 0.25 * Math.sin(state.frameCount * mouthSpeed) + 0.25;
                
                let startAngle = openAmount * Math.PI;
                let endAngle = (2 - openAmount) * Math.PI;
                
                let rotation = 0;
                if (pm.dir.x === -1) rotation = Math.PI;
                if (pm.dir.y === -1) rotation = -Math.PI/2;
                if (pm.dir.y === 1) rotation = Math.PI/2;
                
                ctx.save();
                ctx.translate(pm.x, pm.y);
                ctx.rotate(rotation);
                ctx.arc(0, 0, TILE_SIZE/2 - 1, startAngle, endAngle);
                ctx.lineTo(0, 0);
                ctx.fill();
                ctx.restore();
            }

            if (gameStateDisplay !== 'START') {
                state.ghosts.forEach(g => {
                    ctx.fillStyle = g.color;
                    ctx.beginPath();
                    ctx.arc(g.x, g.y - 2, 6, Math.PI, 0);
                    ctx.lineTo(g.x + 6, g.y + 6);
                    ctx.lineTo(g.x - 6, g.y + 6);
                    ctx.fill();
                    ctx.fillStyle = '#FFF';
                    ctx.fillRect(g.x - 3, g.y - 4, 2, 2);
                    ctx.fillRect(g.x + 1, g.y - 4, 2, 2);
                });
            }

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
                 ctx.fillStyle = 'rgba(0,0,0,0.85)';
                 ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

                 drawText('PAC-MAN', CANVAS_WIDTH/2, 50, COLOR_TEXT, 'bold 28px Arial');
                 
                 drawText('MISSION:', CANVAS_WIDTH/2, 90, '#FFF', 'bold 16px Arial');
                 
                 drawText('EAT GREEN POWER', CANVAS_WIDTH/2, 130, COLOR_SPECIAL, 'bold 18px Arial');
                 drawText('TO SEE PROJECT', CANVAS_WIDTH/2, 155, '#FFF', 'bold 18px Arial');
                 
                 ctx.fillStyle = COLOR_SPECIAL;
                 ctx.beginPath();
                 ctx.arc(CANVAS_WIDTH/2, 190, 8, 0, Math.PI*2);
                 ctx.fill();
                 
                 if (Math.floor(Date.now() / 500) % 2 === 0) {
                     drawText('PRESS ENTER', CANVAS_WIDTH/2, 240, '#FFFFFF', 'bold 18px Arial');
                 }

            } else if (gameStateDisplay === 'GAME_OVER') {
                drawText('GAME OVER', CANVAS_WIDTH/2, 120, '#FF0000', 'bold 30px Arial');
                drawText(`SCORE: ${state.score}`, CANVAS_WIDTH/2, 160, '#FFF', 'bold 20px Arial');
                if (Math.floor(Date.now() / 500) % 2 === 0) {
                     drawText('PRESS ENTER', CANVAS_WIDTH/2, 220, '#FFFFFF', 'bold 18px Arial');
                 }
            } else {
                ctx.fillStyle = '#FFF';
                ctx.font = 'bold 12px Arial';
                ctx.textAlign = 'left';
                ctx.textBaseline = 'top';
                ctx.fillText(`SCORE: ${state.score}`, 5, 5);

                if (state.specialItem.active) {
                    ctx.fillStyle = COLOR_SPECIAL;
                    ctx.textAlign = 'right';
                    ctx.fillText('GET GREEN ITEM!', CANVAS_WIDTH - 5, 5);
                }
            }

            animationFrameId = requestAnimationFrame(update);
        };

        animationFrameId = requestAnimationFrame(update);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
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
