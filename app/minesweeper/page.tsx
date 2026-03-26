"use client";
import { useState, useCallback, useEffect } from "react";

type Cell = { mine: boolean; revealed: boolean; flagged: boolean; adjacent: number };
type Difficulty = { rows: number; cols: number; mines: number; name: string };

const DIFFS: Difficulty[] = [
  { name: "Easy", rows: 9, cols: 9, mines: 10 },
  { name: "Medium", rows: 16, cols: 16, mines: 40 },
  { name: "Hard", rows: 16, cols: 30, mines: 99 },
];

function createBoard(r: number, c: number): Cell[][] {
  return Array.from({ length: r }, () => Array.from({ length: c }, () => ({ mine: false, revealed: false, flagged: false, adjacent: 0 })));
}

function placeMines(board: Cell[][], mines: number, safeR: number, safeC: number) {
  const rows = board.length, cols = board[0].length;
  let placed = 0;
  while (placed < mines) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * cols);
    if (board[r][c].mine || (Math.abs(r - safeR) <= 1 && Math.abs(c - safeC) <= 1)) continue;
    board[r][c].mine = true;
    placed++;
  }
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (board[r][c].mine) continue;
      let count = 0;
      for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) {
        const nr = r + dr, nc = c + dc;
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && board[nr][nc].mine) count++;
      }
      board[r][c].adjacent = count;
    }
  }
}

function reveal(board: Cell[][], r: number, c: number) {
  if (r < 0 || r >= board.length || c < 0 || c >= board[0].length) return;
  if (board[r][c].revealed || board[r][c].flagged) return;
  board[r][c].revealed = true;
  if (board[r][c].adjacent === 0 && !board[r][c].mine) {
    for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) reveal(board, r + dr, c + dc);
  }
}

const NUM_COLORS = ["", "#3b82f6", "#22c55e", "#ef4444", "#8b5cf6", "#7f1d1d", "#06b6d4", "#000", "#6b7280"];

export default function Minesweeper() {
  const [diff, setDiff] = useState(0);
  const [board, setBoard] = useState<Cell[][]>(() => createBoard(9, 9));
  const [started, setStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [time, setTime] = useState(0);

  const d = DIFFS[diff];
  const flags = board.flat().filter(c => c.flagged).length;

  useEffect(() => {
    if (!started || gameOver) return;
    const t = setInterval(() => setTime(p => p + 1), 1000);
    return () => clearInterval(t);
  }, [started, gameOver]);

  const newGame = useCallback((di?: number) => {
    const dd = DIFFS[di ?? diff];
    setBoard(createBoard(dd.rows, dd.cols));
    setStarted(false); setGameOver(false); setWon(false); setTime(0);
    if (di !== undefined) setDiff(di);
  }, [diff]);

  const handleClick = (r: number, c: number) => {
    if (gameOver || board[r][c].flagged) return;
    const b = board.map(row => row.map(cell => ({ ...cell })));
    if (!started) { placeMines(b, d.mines, r, c); setStarted(true); }
    if (b[r][c].mine) {
      b.forEach(row => row.forEach(cell => { if (cell.mine) cell.revealed = true; }));
      setBoard(b); setGameOver(true); return;
    }
    reveal(b, r, c);
    const unrevealed = b.flat().filter(c => !c.revealed && !c.mine).length;
    if (unrevealed === 0) { setWon(true); setGameOver(true); }
    setBoard(b);
  };

  const handleRightClick = (e: React.MouseEvent, r: number, c: number) => {
    e.preventDefault();
    if (gameOver || board[r][c].revealed) return;
    const b = board.map(row => row.map(cell => ({ ...cell })));
    b[r][c].flagged = !b[r][c].flagged;
    setBoard(b);
  };

  const cellSize = diff === 2 ? "w-6 h-6 text-xs" : diff === 1 ? "w-7 h-7 text-xs" : "w-8 h-8 text-sm";

  return (
    <div className="space-y-6">
      <section className="text-center">
        <h1 className="text-4xl font-bold mb-2">Minesweeper</h1>
        <p className="text-[var(--text-secondary)]">Classic minesweeper. Left click to reveal, right click to flag.</p>
      </section>

      <div className="flex justify-center gap-2">
        {DIFFS.map((dd, i) => (
          <button key={dd.name} onClick={() => newGame(i)}
            className={`px-4 py-2 rounded-lg text-sm font-bold ${diff === i ? "bg-blue-600 text-white" : "bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-secondary)]"}`}>
            {dd.name}
          </button>
        ))}
      </div>

      <div className="flex justify-center gap-6 items-center">
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg px-4 py-2 font-mono">
          💣 {d.mines - flags}
        </div>
        <button onClick={() => newGame()} className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-lg font-bold">
          {gameOver ? (won ? "😎" : "💀") : "🙂"} New
        </button>
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg px-4 py-2 font-mono">
          ⏱ {time}s
        </div>
      </div>

      {gameOver && (
        <div className={`text-center text-lg font-bold ${won ? "text-emerald-400" : "text-red-400"}`}>
          {won ? `You won in ${time}s!` : "Game Over! 💥"}
        </div>
      )}

      <div className="flex justify-center overflow-x-auto">
        <div className="inline-grid gap-0 border border-[var(--border)] rounded" style={{ gridTemplateColumns: `repeat(${d.cols}, minmax(0, 1fr))` }}>
          {board.map((row, r) => row.map((cell, c) => (
            <button key={`${r}-${c}`} onClick={() => handleClick(r, c)} onContextMenu={e => handleRightClick(e, r, c)}
              className={`${cellSize} flex items-center justify-center border border-[var(--border)]/30 font-bold select-none
                ${cell.revealed ? (cell.mine ? "bg-red-900/50" : "bg-[var(--bg-primary)]") : "bg-[var(--bg-secondary)] hover:bg-[var(--bg-primary)] cursor-pointer"}`}>
              {cell.revealed ? (cell.mine ? "💣" : cell.adjacent > 0 ? <span style={{ color: NUM_COLORS[cell.adjacent] }}>{cell.adjacent}</span> : "") : cell.flagged ? "🚩" : ""}
            </button>
          )))}
        </div>
      </div>
    </div>
  );
}
