import React from 'react';

export default function UpgradePanel({ preGame, currentPlayer, points, selectedInfo, onApply, onTeleport, catalog, teleportMode }) {
  const canInteract = (selectedInfo && (preGame || selectedInfo.piece.color === currentPlayer));
  return (
    <div className="w-full rounded-xl border border-white/10 bg-neutral-900/60 p-4">
      <h3 className="text-lg font-semibold">Upgrades & Abilities</h3>
      <p className="text-sm text-neutral-400">{preGame ? 'Pre-game: Configure any piece.' : `Turn: ${currentPlayer}`}</p>
      <div className="mt-3 p-3 rounded-lg bg-neutral-800/60">
        {selectedInfo ? (
          <div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-neutral-300">Selected</div>
                <div className="text-base font-medium">{selectedInfo.piece.color} {selectedInfo.piece.type}</div>
              </div>
              <div className="text-sm text-neutral-400">Points: {points[selectedInfo.piece.color]}</div>
            </div>
            <div className="mt-3 grid grid-cols-1 gap-2">
              {catalog.map((i) => (
                <button
                  key={i.key}
                  onClick={() => onApply(i.key)}
                  disabled={!canInteract || points[selectedInfo.piece.color] < i.cost}
                  className={`text-left rounded-md px-3 py-2 border transition ${
                    canInteract && points[selectedInfo.piece.color] >= i.cost ? 'bg-neutral-900/60 hover:bg-neutral-800 border-white/10' : 'bg-neutral-900/40 border-white/5 opacity-60 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{i.name}</span>
                    <span className="text-sm text-amber-400">-{i.cost} pts</span>
                  </div>
                  <div className="text-xs text-neutral-400">{i.description}</div>
                </button>
              ))}
            </div>
            <div className="mt-3 flex gap-2">
              <button
                onClick={onTeleport}
                disabled={!canInteract || !(selectedInfo.piece.abilities?.teleports > 0)}
                className={`rounded-md px-3 py-2 text-sm border ${
                  canInteract && selectedInfo.piece.abilities?.teleports > 0 ? 'bg-fuchsia-500/20 hover:bg-fuchsia-500/30 border-fuchsia-400/40' : 'bg-neutral-900/40 border-white/5 opacity-60 cursor-not-allowed'
                }`}
              >
                {teleportMode ? 'Select a teleport square…' : 'Use Teleport'}
              </button>
            </div>
          </div>
        ) : (
          <div className="text-sm text-neutral-400">Select a piece to upgrade.</div>
        )}
      </div>
      <div className="mt-4 text-xs text-neutral-400">
        Tips:
        <ul className="list-disc ml-4 mt-1 space-y-1">
          <li>Capture awards 5 pts (King: 20 pts). Winning awards 20 pts.</li>
          <li>Shield negates the next capture attempt.</li>
          <li>Teleport range is 3 (Manhattan), ends your turn.</li>
          <li>Dash adds up to 2-square orthogonal moves.</li>
          <li>Jumper grants Knight-style moves to any piece.</li>
        </ul>
      </div>
    </div>
  );
}
