import React from 'react';

export default function Scoreboard({ turn, points, preGame, winner, onStart, onReset }) {
  return (
    <div className="w-full rounded-xl border border-white/10 bg-neutral-900/60 p-4 mt-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded-full bg-white" />
            <div className="text-sm">White</div>
            <div className="text-sm text-neutral-300">{points.white} pts</div>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded-full bg-black ring-1 ring-white/60" />
            <div className="text-sm">Black</div>
            <div className="text-sm text-neutral-300">{points.black} pts</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {preGame ? (
            <button onClick={onStart} className="rounded-md bg-indigo-500 hover:bg-indigo-600 px-3 py-1.5 text-sm font-medium">Start Game</button>
          ) : (
            <div className="text-sm text-neutral-300">Turn: <span className="font-semibold">{turn}</span></div>
          )}
          <button onClick={onReset} className="rounded-md bg-neutral-800 hover:bg-neutral-700 px-3 py-1.5 text-sm border border-white/10">Reset</button>
        </div>
      </div>
      {winner && (
        <div className="mt-3 p-3 rounded-md bg-emerald-600/20 border border-emerald-500/30">
          <div className="font-semibold">{winner.toUpperCase()} wins!</div>
          <div className="text-sm text-emerald-200">Victory bonus: +20 pts awarded.</div>
        </div>
      )}
    </div>
  );
}
