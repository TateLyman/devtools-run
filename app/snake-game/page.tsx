"use client";
import { useState, useEffect, useCallback, useRef } from "react";

const GRID = 20;
const CELL = 20;
type Pos = { x: number; y: number };

export default function SnakeGame() {
  const [snake, setSnake] = useState<Pos[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Pos>({ x: 15, y: 10 });
  const [dir, setDir] = useState<Pos>({ x: 1, y: 0 });
  const [running, setRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [speed, setSpeed] = useState(120);
  const dirRef = useRef(dir);
  dirRef.current = dir;

  const newFood = useCallback((s: Pos[]): Pos => {
    let f: Pos;
    do { f = { x: Math.floor(Math.random() * GRID), y: Math.floor(Math.random() * GRID) }; } while (s.some((p) => p.x === f.x && p.y === f.y));
    return f;
  }, []);

  const reset = () => { const s = [{ x: 10, y: 10 }]; setSnake(s); setFood(newFood(s)); setDir({ x: 1, y: 0 }); setScore(0); setGameOver(false); setRunning(true); };

  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => {
      setSnake((prev) => {
        const d = dirRef.current;
        const head = { x: (prev[0].x + d.x + GRID) % GRID, y: (prev[0].y + d.y + GRID) % GRID };
        if (prev.some((p) => p.x === head.x && p.y === head.y)) { setGameOver(true); setRunning(false); return prev; }
        const ns = [head, ...prev];
        if (head.x === food.x && head.y === food.y) { setScore((s) => { const ns = s + 1; if (ns > best) setBest(ns); return ns; }); setFood(newFood(ns)); }
        else ns.pop();
        return ns;
      });
    }, speed);
    return () => clearInterval(interval);
  }, [running, food, speed, best, newFood]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const map: Record<string, Pos> = { ArrowUp: { x: 0, y: -1 }, ArrowDown: { x: 0, y: 1 }, ArrowLeft: { x: -1, y: 0 }, ArrowRight: { x: 1, y: 0 } };
      const nd = map[e.key];
      if (nd) { e.preventDefault(); setDir((d) => (nd.x + d.x === 0 && nd.y + d.y === 0) ? d : nd); if (!running && !gameOver) reset(); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [running, gameOver]);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold mb-2">Snake Game</h1>
        <p className="text-[var(--text-secondary)]">Classic snake game. Eat food, grow longer, don't hit yourself. Arrow keys to move. Free online snake.</p>
      </div>
      <div className="max-w-md mx-auto space-y-3 text-center">
        <div className="flex justify-between text-sm">
          <span className="text-emerald-400">Score: {score}</span>
          <span className="text-purple-400">Best: {best}</span>
        </div>
        <div className="inline-block bg-gray-900 rounded-lg p-1 border border-[var(--border)]" style={{ width: GRID * CELL + 2, height: GRID * CELL + 2 }}>
          <svg width={GRID * CELL} height={GRID * CELL}>
            <rect width="100%" height="100%" fill="#0f0f1a" />
            {snake.map((p, i) => (
              <rect key={i} x={p.x * CELL} y={p.y * CELL} width={CELL - 1} height={CELL - 1} rx={3} fill={i === 0 ? "#22c55e" : "#16a34a"} />
            ))}
            <rect x={food.x * CELL} y={food.y * CELL} width={CELL - 1} height={CELL - 1} rx={CELL / 2} fill="#ef4444" />
          </svg>
        </div>
        {gameOver && <p className="text-xl font-bold text-red-400">Game Over! Score: {score}</p>}
        {!running && (
          <button onClick={reset} className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-full font-bold text-lg">{gameOver ? "Play Again" : "Start"}</button>
        )}
        <div className="grid grid-cols-3 gap-1 max-w-[150px] mx-auto">
          <div /><button onClick={() => { setDir((d) => d.y === 1 ? d : { x: 0, y: -1 }); if (!running && !gameOver) reset(); }} className="bg-gray-700 rounded p-2 text-white">↑</button><div />
          <button onClick={() => { setDir((d) => d.x === 1 ? d : { x: -1, y: 0 }); if (!running && !gameOver) reset(); }} className="bg-gray-700 rounded p-2 text-white">←</button>
          <button onClick={() => { setDir((d) => d.y === -1 ? d : { x: 0, y: 1 }); if (!running && !gameOver) reset(); }} className="bg-gray-700 rounded p-2 text-white">↓</button>
          <button onClick={() => { setDir((d) => d.x === -1 ? d : { x: 1, y: 0 }); if (!running && !gameOver) reset(); }} className="bg-gray-700 rounded p-2 text-white">→</button>
        </div>
        <p className="text-xs text-gray-500">Arrow keys or tap buttons to move</p>
      </div>
    </div>
  );
}
