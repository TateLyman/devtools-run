"use client";
import { useState, useEffect, useCallback } from "react";

type Board = number[][];

function createBoard(): Board { const b = Array.from({length:4}, () => Array(4).fill(0)); addRandom(b); addRandom(b); return b; }
function addRandom(b: Board) { const empty: [number,number][] = []; b.forEach((r,i) => r.forEach((c,j) => { if(!c) empty.push([i,j]); })); if(!empty.length) return; const [r,c] = empty[Math.floor(Math.random()*empty.length)]; b[r][c] = Math.random() < 0.9 ? 2 : 4; }
function clone(b: Board): Board { return b.map(r => [...r]); }

function slideLeft(b: Board): { board: Board; score: number; moved: boolean } {
  let score = 0, moved = false; const nb = clone(b);
  for (let r = 0; r < 4; r++) {
    let row = nb[r].filter(v => v !== 0); const merged: number[] = [];
    for (let i = 0; i < row.length; i++) { if (i+1<row.length && row[i]===row[i+1]) { merged.push(row[i]*2); score+=row[i]*2; i++; } else merged.push(row[i]); }
    while (merged.length < 4) merged.push(0);
    if (merged.some((v,i) => v !== nb[r][i])) moved = true;
    nb[r] = merged;
  }
  return { board: nb, score, moved };
}

function rotate90(b: Board): Board { return b[0].map((_,i) => b.map(r => r[i]).reverse()); }

function move(b: Board, dir: string): { board: Board; score: number; moved: boolean } {
  let rotated = clone(b); let rotations = 0;
  if (dir==="right") { rotated = rotate90(rotate90(rotated)); rotations = 2; }
  else if (dir==="up") { rotated = rotate90(rotate90(rotate90(rotated))); rotations = 3; }
  else if (dir==="down") { rotated = rotate90(rotated); rotations = 1; }
  const result = slideLeft(rotated);
  let final = result.board;
  for (let i = 0; i < (4 - rotations) % 4; i++) final = rotate90(final);
  return { board: final, score: result.score, moved: result.moved };
}

function isGameOver(b: Board): boolean {
  for (let r=0;r<4;r++) for (let c=0;c<4;c++) { if(!b[r][c]) return false; if(c<3&&b[r][c]===b[r][c+1]) return false; if(r<3&&b[r][c]===b[r+1][c]) return false; }
  return true;
}

const tileColors: Record<number,string> = { 0:"bg-gray-800",2:"bg-gray-700 text-white",4:"bg-gray-600 text-white",8:"bg-orange-600 text-white",16:"bg-orange-500 text-white",32:"bg-red-500 text-white",64:"bg-red-600 text-white",128:"bg-yellow-500 text-white",256:"bg-yellow-400 text-gray-900",512:"bg-yellow-300 text-gray-900",1024:"bg-yellow-200 text-gray-900",2048:"bg-purple-500 text-white" };

export default function Game2048() {
  const [board, setBoard] = useState<Board>(createBoard);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);

  const handleMove = useCallback((dir: string) => {
    if (gameOver) return;
    const result = move(board, dir);
    if (!result.moved) return;
    addRandom(result.board);
    setBoard(result.board);
    const newScore = score + result.score;
    setScore(newScore);
    if (newScore > best) setBest(newScore);
    if (result.board.some(r => r.includes(2048)) && !won) setWon(true);
    if (isGameOver(result.board)) setGameOver(true);
  }, [board, score, best, gameOver, won]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const map: Record<string,string> = { ArrowLeft:"left", ArrowRight:"right", ArrowUp:"up", ArrowDown:"down" };
      if (map[e.key]) { e.preventDefault(); handleMove(map[e.key]); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleMove]);

  const reset = () => { setBoard(createBoard()); setScore(0); setGameOver(false); setWon(false); };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold mb-2">2048</h1>
        <p className="text-[var(--text-secondary)]">Slide tiles to merge. Reach 2048 to win! Use arrow keys or swipe. Free 2048 game.</p>
      </div>
      <div className="max-w-xs mx-auto space-y-3 text-center">
        <div className="flex justify-between">
          <div className="bg-[var(--bg-secondary)] rounded px-3 py-1"><span className="text-xs text-gray-400">Score</span><p className="font-bold text-white">{score}</p></div>
          <div className="bg-[var(--bg-secondary)] rounded px-3 py-1"><span className="text-xs text-gray-400">Best</span><p className="font-bold text-purple-400">{best}</p></div>
          <button onClick={reset} className="bg-purple-600 hover:bg-purple-700 text-white px-4 rounded font-bold text-sm">New Game</button>
        </div>
        <div className="grid grid-cols-4 gap-1.5 bg-gray-900 p-2 rounded-xl">
          {board.flat().map((val, i) => (
            <div key={i} className={`aspect-square rounded-lg flex items-center justify-center font-bold ${val >= 1024 ? "text-lg" : val >= 128 ? "text-xl" : "text-2xl"} ${tileColors[val] || "bg-purple-600 text-white"} transition-all`}>
              {val || ""}
            </div>
          ))}
        </div>
        {gameOver && <p className="text-xl font-bold text-red-400">Game Over! Score: {score}</p>}
        {won && <p className="text-xl font-bold text-emerald-400">You reached 2048! 🎉</p>}
        <div className="grid grid-cols-3 gap-1 max-w-[180px] mx-auto">
          <div />
          <button onClick={() => handleMove("up")} className="bg-gray-700 rounded p-2 text-white font-bold">↑</button>
          <div />
          <button onClick={() => handleMove("left")} className="bg-gray-700 rounded p-2 text-white font-bold">←</button>
          <button onClick={() => handleMove("down")} className="bg-gray-700 rounded p-2 text-white font-bold">↓</button>
          <button onClick={() => handleMove("right")} className="bg-gray-700 rounded p-2 text-white font-bold">→</button>
        </div>
        <p className="text-xs text-gray-500">Use arrow keys or tap buttons</p>
      </div>
    </div>
  );
}
