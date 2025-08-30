import React from 'react';

const pieceGlyph = (p) => {
  if (!p) return '';
  const mapWhite = { king: '♔', queen: '♕', rook: '♖', bishop: '♗', knight: '♘', pawn: '♙' };
  const mapBlack = { king: '♚', queen: '♛', rook: '♜', bishop: '♝', knight: '♞', pawn: '♟' };
  return p.color === 'white' ? mapWhite[p.type] : mapBlack[p.type];
};

export default function ChessBoard({ board, selected, validMoves, onSelect, onMove }) {
  const isSelected = (r, c) => selected && selected.r === r && selected.c === c;
  const isValid = (r, c) => validMoves?.some((m) => m.r === r && m.c === c);
  const isCapture = (r, c) => validMoves?.some((m) => m.r === r && m.c === c && m.type === 'capture');

  return (
    <div className="aspect-square w-full max-w-3xl mx-auto rounded-xl overflow-hidden ring-1 ring-white/10">
      <div className="grid grid-cols-8 grid-rows-8 w-full h-full">
        {board.map((row, r) =>
          row.map((cell, c) => {
            const dark = (r + c) % 2 === 1;
            const sel = isSelected(r, c);
            const valid = isValid(r, c);
            const capture = isCapture(r, c);
            return (
              <button
                key={`${r}-${c}`}
                onClick={() => (sel ? null : (valid ? onMove(r, c) : onSelect(r, c)))}
                className={[
                  'relative flex items-center justify-center text-3xl md:text-4xl',
                  dark ? 'bg-neutral-800' : 'bg-neutral-700',
                  sel ? 'outline outline-2 outline-indigo-400' : '',
                ].join(' ')}
              >
                <span className="pointer-events-none select-none">
                  {pieceGlyph(cell)}
                </span>
                {cell && (
                  <div className="absolute left-1 top-1 flex gap-1">
                    {cell.abilities?.shield && <span title="Shield" className="w-2 h-2 rounded-full bg-emerald-400" />}
                    {cell.abilities?.jumper && <span title="Jumper" className="w-2 h-2 rounded-full bg-sky-400" />}
                    {cell.abilities?.dash && <span title="Dash" className="w-2 h-2 rounded-full bg-amber-400" />}
                    {cell.abilities?.teleports > 0 && <span title="Teleport" className="w-2 h-2 rounded-full bg-fuchsia-400" />}
                  </div>
                )}
                {valid && !capture && (
                  <span className="absolute w-3 h-3 rounded-full bg-white/60" />
                )}
                {capture && (
                  <span className="absolute inset-0 ring-4 ring-rose-500/70" />
                )}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
