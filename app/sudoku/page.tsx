"use client";
import { useState, useCallback } from "react";

function generatePuzzle(clues: number): { puzzle: number[][]; solution: number[][] } {
  const grid: number[][] = Array.from({ length: 9 }, () => Array(9).fill(0));
  
  function isValid(g: number[][], r: number, c: number, n: number): boolean {
    for (let i = 0; i < 9; i++) { if (g[r][i] === n || g[i][c] === n) return false; }
    const br = Math.floor(r / 3) * 3, bc = Math.floor(c / 3) * 3;
    for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) if (g[br + i][bc + j] === n) return false;
    return true;
  }

  function solve(g: number[][]): boolean {
    for (let r = 0; r < 9; r++) for (let c = 0; c < 9; c++) {
      if (g[r][c] !== 0) continue;
      const nums = [1,2,3,4,5,6,7,8,9].sort(() => Math.random() - 0.5);
      for (const n of nums) {
        if (!isValid(g, r, c, n)) continue;
        g[r][c] = n;
        if (solve(g)) return true;
        g[r][c] = 0;
      }
      return false;
    }
    return true;
  }

  solve(grid);
  const solution = grid.map(r => [...r]);
  const puzzle = grid.map(r => [...r]);
  
  const cells = Array.from({ length: 81 }, (_, i) => i).sort(() => Math.random() - 0.5);
  let removed = 0;
  for (const idx of cells) {
    if (removed >= 81 - clues) break;
    const r = Math.floor(idx / 9), c = idx % 9;
    puzzle[r][c] = 0;
    removed++;
  }
  
  return { puzzle, solution };
}

const DIFFS = [
  { name: "Easy", clues: 38 },
  { name: "Medium", clues: 30 },
  { name: "Hard", clues: 24 },
];

export default function Sudoku() {
  const [diff, setDiff] = useState(0);
  const [{ puzzle, solution }, setGame] = useState(() => generatePuzzle(38));
  const [board, setBoard] = useState<number[][]>(() => puzzle.map(r => [...r]));
  const [selected, setSelected] = useState<[number, number] | null>(null);
  const [errors, setErrors] = useState(true);
  const [won, setWon] = useState(false);

  const isGiven = useCallback((r: number, c: number) => puzzle[r][c] !== 0, [puzzle]);

  const newGame = (di?: number) => {
    const d = DIFFS[di ?? diff];
    const g = generatePuzzle(d.clues);
    setGame(g);
    setBoard(g.puzzle.map(r => [...r]));
    setSelected(null);
    setWon(false);
    if (di !== undefined) setDiff(di);
  };

  const setCell = (n: number) => {
    if (!selected || isGiven(selected[0], selected[1]) || won) return;
    const b = board.map(r => [...r]);
    b[selected[0]][selected[1]] = n;
    setBoard(b);
    const complete = b.every((row, r) => row.every((cell, c) => cell === solution[r][c]));
    if (complete) setWon(true);
  };

  const hint = () => {
    if (won) return;
    for (let r = 0; r < 9; r++) for (let c = 0; c < 9; c++) {
      if (board[r][c] === 0) {
        const b = board.map(row => [...row]);
        b[r][c] = solution[r][c];
        setBoard(b);
        setSelected([r, c]);
        return;
      }
    }
  };

  const isError = (r: number, c: number) => errors && board[r][c] !== 0 && board[r][c] !== solution[r][c];
  const isHighlighted = (r: number, c: number) => selected && board[r][c] !== 0 && board[r][c] === board[selected[0]][selected[1]];
  const isSelectedRow = (r: number, c: number) => selected && (r === selected[0] || c === selected[1] || (Math.floor(r/3) === Math.floor(selected[0]/3) && Math.floor(c/3) === Math.floor(selected[1]/3)));

  return (
    <div className="space-y-4">
      <section className="text-center">
        <h1 className="text-4xl font-bold mb-1">Sudoku</h1>
        <p className="text-sm text-[var(--text-secondary)]">Fill every row, column, and 3x3 box with 1-9</p>
      </section>

      <div className="flex justify-center gap-2">
        {DIFFS.map((d, i) => (
          <button key={d.name} onClick={() => newGame(i)}
            className={`px-4 py-2 rounded-lg text-sm font-bold ${diff === i ? "bg-blue-600 text-white" : "bg-[var(--bg-secondary)] border border-[var(--border)]"}`}>
            {d.name}
          </button>
        ))}
      </div>

      {won && <div className="text-center text-xl font-bold text-emerald-400">Puzzle Complete!</div>}

      <div className="flex justify-center">
        <div className="inline-grid grid-cols-9 border-2 border-white/30 rounded">
          {board.map((row, r) => row.map((cell, c) => (
            <button key={`${r}-${c}`} onClick={() => setSelected([r, c])}
              className={`w-9 h-9 md:w-11 md:h-11 flex items-center justify-center text-sm md:text-base font-bold
                ${c % 3 === 2 && c < 8 ? "border-r-2 border-r-white/30" : "border-r border-r-[var(--border)]"}
                ${r % 3 === 2 && r < 8 ? "border-b-2 border-b-white/30" : "border-b border-b-[var(--border)]"}
                ${selected?.[0] === r && selected?.[1] === c ? "bg-blue-600/40" : isHighlighted(r, c) ? "bg-blue-600/20" : isSelectedRow(r, c) ? "bg-white/5" : ""}
                ${isError(r, c) ? "text-red-400" : isGiven(r, c) ? "text-white" : "text-blue-400"}
                ${isGiven(r, c) ? "" : "cursor-pointer hover:bg-white/10"}`}>
              {cell || ""}
            </button>
          )))}
        </div>
      </div>

      <div className="flex justify-center gap-1">
        {[1,2,3,4,5,6,7,8,9].map(n => (
          <button key={n} onClick={() => setCell(n)}
            className="w-9 h-9 md:w-11 md:h-11 bg-[var(--bg-secondary)] border border-[var(--border)] rounded font-bold hover:bg-[var(--bg-primary)]">
            {n}
          </button>
        ))}
        <button onClick={() => setCell(0)} className="w-9 h-9 md:w-11 md:h-11 bg-[var(--bg-secondary)] border border-[var(--border)] rounded text-xs hover:bg-[var(--bg-primary)]">Clear</button>
      </div>

      <div className="flex justify-center gap-2">
        <button onClick={hint} className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg text-sm font-bold">Hint</button>
        <button onClick={() => setErrors(!errors)} className={`px-4 py-2 rounded-lg text-sm font-bold border ${errors ? "bg-red-600/20 border-red-600/50 text-red-400" : "border-[var(--border)]"}`}>
          Errors: {errors ? "ON" : "OFF"}
        </button>
        <button onClick={() => newGame()} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold">New Game</button>
      </div>
    </div>
  );
}
