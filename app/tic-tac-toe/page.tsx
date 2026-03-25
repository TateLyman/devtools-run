"use client";
import { useState } from "react";

type Board = (string | null)[];

function checkWinner(board: Board): string | null {
  const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  for (const [a,b,c] of lines) { if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a]; }
  return null;
}

function minimax(board: Board, isMax: boolean): number {
  const winner = checkWinner(board);
  if (winner === "O") return 10;
  if (winner === "X") return -10;
  if (board.every((c) => c !== null)) return 0;
  if (isMax) {
    let best = -Infinity;
    for (let i = 0; i < 9; i++) { if (!board[i]) { board[i] = "O"; best = Math.max(best, minimax(board, false)); board[i] = null; } }
    return best;
  } else {
    let best = Infinity;
    for (let i = 0; i < 9; i++) { if (!board[i]) { board[i] = "X"; best = Math.min(best, minimax(board, true)); board[i] = null; } }
    return best;
  }
}

function aiMove(board: Board): number {
  let bestScore = -Infinity, bestMove = -1;
  for (let i = 0; i < 9; i++) {
    if (!board[i]) { board[i] = "O"; const score = minimax(board, false); board[i] = null; if (score > bestScore) { bestScore = score; bestMove = i; } }
  }
  return bestMove;
}

export default function TicTacToe() {
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [scores, setScores] = useState({ you: 0, ai: 0, draw: 0 });

  const handleClick = (i: number) => {
    if (board[i] || gameOver) return;
    const newBoard = [...board];
    newBoard[i] = "X";
    const w = checkWinner(newBoard);
    if (w) { setBoard(newBoard); setWinner(w); setGameOver(true); setScores((s) => ({ ...s, you: s.you + 1 })); return; }
    if (newBoard.every((c) => c !== null)) { setBoard(newBoard); setGameOver(true); setScores((s) => ({ ...s, draw: s.draw + 1 })); return; }
    const ai = aiMove(newBoard);
    if (ai >= 0) newBoard[ai] = "O";
    const w2 = checkWinner(newBoard);
    if (w2) { setBoard(newBoard); setWinner(w2); setGameOver(true); setScores((s) => ({ ...s, ai: s.ai + 1 })); return; }
    if (newBoard.every((c) => c !== null)) { setBoard(newBoard); setGameOver(true); setScores((s) => ({ ...s, draw: s.draw + 1 })); return; }
    setBoard(newBoard);
  };

  const reset = () => { setBoard(Array(9).fill(null)); setGameOver(false); setWinner(null); };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Tic Tac Toe</h1>
        <p className="text-[var(--text-secondary)]">Play Tic Tac Toe against AI. Unbeatable minimax algorithm. Track wins, losses, draws. Free online.</p>
      </div>
      <div className="max-w-xs mx-auto space-y-4 text-center">
        <div className="flex justify-between text-sm">
          <span className="text-blue-400">You (X): {scores.you}</span>
          <span className="text-gray-400">Draw: {scores.draw}</span>
          <span className="text-red-400">AI (O): {scores.ai}</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {board.map((cell, i) => (
            <button key={i} onClick={() => handleClick(i)} className={`w-24 h-24 rounded-xl text-4xl font-bold transition-all ${cell === "X" ? "bg-blue-600/20 text-blue-400 border-2 border-blue-500" : cell === "O" ? "bg-red-600/20 text-red-400 border-2 border-red-500" : "bg-[var(--bg-secondary)] border-2 border-[var(--border)] hover:border-purple-500/50 text-transparent"}`}>
              {cell || "·"}
            </button>
          ))}
        </div>
        {gameOver && (
          <div className={`rounded-xl p-4 ${winner === "X" ? "bg-blue-500/10 border border-blue-500" : winner === "O" ? "bg-red-500/10 border border-red-500" : "bg-gray-500/10 border border-gray-500"}`}>
            <p className="text-lg font-bold">{winner === "X" ? "You win! 🎉" : winner === "O" ? "AI wins! 🤖" : "It's a draw! 🤝"}</p>
          </div>
        )}
        <button onClick={reset} className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-xl font-bold">{gameOver ? "Play Again" : "Reset"}</button>
      </div>
    </div>
  );
}
