import React, { useMemo, useState } from 'react';
import Hero from './components/Hero';
import ChessBoard from './components/ChessBoard';
import UpgradePanel from './components/UpgradePanel';
import Scoreboard from './components/Scoreboard';

// Piece utilities
const initialBoard = () => {
  const empty = Array.from({ length: 8 }, () => Array(8).fill(null));
  const createPiece = (type, color, id) => ({ id, type, color, abilities: { shield: false, jumper: false, dash: false, teleports: 0 }, hasMoved: false });
  let id = 1;
  // Place pawns
  for (let c = 0; c < 8; c++) {
    empty[1][c] = createPiece('pawn', 'black', `b${id++}`);
    empty[6][c] = createPiece('pawn', 'white', `w${id++}`);
  }
  // Rooks
  empty[0][0] = createPiece('rook', 'black', `b${id++}`);
  empty[0][7] = createPiece('rook', 'black', `b${id++}`);
  empty[7][0] = createPiece('rook', 'white', `w${id++}`);
  empty[7][7] = createPiece('rook', 'white', `w${id++}`);
  // Knights
  empty[0][1] = createPiece('knight', 'black', `b${id++}`);
  empty[0][6] = createPiece('knight', 'black', `b${id++}`);
  empty[7][1] = createPiece('knight', 'white', `w${id++}`);
  empty[7][6] = createPiece('knight', 'white', `w${id++}`);
  // Bishops
  empty[0][2] = createPiece('bishop', 'black', `b${id++}`);
  empty[0][5] = createPiece('bishop', 'black', `b${id++}`);
  empty[7][2] = createPiece('bishop', 'white', `w${id++}`);
  empty[7][5] = createPiece('bishop', 'white', `w${id++}`);
  // Queens
  empty[0][3] = createPiece('queen', 'black', `b${id++}`);
  empty[7][3] = createPiece('queen', 'white', `w${id++}`);
  // Kings
  empty[0][4] = createPiece('king', 'black', `b${id++}`);
  empty[7][4] = createPiece('king', 'white', `w${id++}`);
  return empty;
};

const cloneBoard = (board) => board.map(row => row.map(cell => (cell ? { ...cell, abilities: { ...cell.abilities } } : null)));

const inBounds = (r, c) => r >= 0 && r < 8 && c >= 0 && c < 8;

function generateMoves(board, r, c, teleportMode = false) {
  const piece = board[r][c];
  if (!piece) return [];
  const moves = [];

  if (teleportMode && piece.abilities.teleports > 0) {
    // Teleport to any empty square within manhattan distance <= 3
    for (let rr = 0; rr < 8; rr++) {
      for (let cc = 0; cc < 8; cc++) {
        if (!board[rr][cc] && Math.abs(rr - r) + Math.abs(cc - c) <= 3) {
          moves.push({ r: rr, c: cc, type: 'teleport' });
        }
      }
    }
    return moves;
  }

  const addSlide = (dr, dc) => {
    let rr = r + dr;
    let cc = c + dc;
    while (inBounds(rr, cc)) {
      const cell = board[rr][cc];
      if (!cell) {
        moves.push({ r: rr, c: cc, type: 'move' });
      } else {
        if (cell.color !== piece.color) moves.push({ r: rr, c: cc, type: 'capture' });
        break;
      }
      rr += dr;
      cc += dc;
    }
  };

  const addStep = (dr, dc) => {
    const rr = r + dr;
    const cc = c + dc;
    if (!inBounds(rr, cc)) return;
    const cell = board[rr][cc];
    if (!cell) moves.push({ r: rr, c: cc, type: 'move' });
    else if (cell.color !== piece.color) moves.push({ r: rr, c: cc, type: 'capture' });
  };

  switch (piece.type) {
    case 'pawn': {
      const dir = piece.color === 'white' ? -1 : 1;
      // forward
      if (inBounds(r + dir, c) && !board[r + dir][c]) {
        moves.push({ r: r + dir, c, type: 'move' });
        if (!piece.hasMoved && inBounds(r + 2 * dir, c) && !board[r + 2 * dir][c]) {
          moves.push({ r: r + 2 * dir, c, type: 'move' });
        }
      }
      // captures
      for (const dc of [-1, 1]) {
        const rr = r + dir;
        const cc = c + dc;
        if (inBounds(rr, cc) && board[rr][cc] && board[rr][cc].color !== piece.color) {
          moves.push({ r: rr, c: cc, type: 'capture' });
        }
      }
      break;
    }
    case 'rook':
      addSlide(-1, 0); addSlide(1, 0); addSlide(0, -1); addSlide(0, 1);
      break;
    case 'bishop':
      addSlide(-1, -1); addSlide(-1, 1); addSlide(1, -1); addSlide(1, 1);
      break;
    case 'queen':
      addSlide(-1, 0); addSlide(1, 0); addSlide(0, -1); addSlide(0, 1);
      addSlide(-1, -1); addSlide(-1, 1); addSlide(1, -1); addSlide(1, 1);
      break;
    case 'king':
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          addStep(dr, dc);
        }
      }
      break;
    case 'knight': {
      const jumps = [
        [-2, -1], [-2, 1], [2, -1], [2, 1],
        [-1, -2], [-1, 2], [1, -2], [1, 2],
      ];
      for (const [dr, dc] of jumps) addStep(dr, dc);
      break;
    }
    default:
      break;
  }

  // Abilities augmentations
  if (piece.abilities.jumper) {
    const jumps = [
      [-2, -1], [-2, 1], [2, -1], [2, 1],
      [-1, -2], [-1, 2], [1, -2], [1, 2],
    ];
    for (const [dr, dc] of jumps) addStep(dr, dc);
  }

  if (piece.abilities.dash) {
    const dirs = [
      [-1, 0], [1, 0], [0, -1], [0, 1],
    ];
    for (const [dr, dc] of dirs) {
      const r1 = r + dr;
      const c1 = c + dc;
      const r2 = r + 2 * dr;
      const c2 = c + 2 * dc;
      if (inBounds(r1, c1) && !board[r1][c1]) moves.push({ r: r1, c: c1, type: 'move' });
      if (inBounds(r1, c1) && !board[r1][c1] && inBounds(r2, c2)) {
        const target2 = board[r2][c2];
        if (!target2) moves.push({ r: r2, c: c2, type: 'move' });
        else if (target2.color !== piece.color) moves.push({ r: r2, c: c2, type: 'capture' });
      }
    }
  }

  return moves;
}

const abilityCatalog = [
  { key: 'shield', name: 'Shield (1x)', cost: 5, description: 'Negate the next capture on this piece.' },
  { key: 'jumper', name: 'Jumper', cost: 8, description: 'Gain Knight-like jumping moves.' },
  { key: 'dash', name: 'Dash', cost: 6, description: 'Gain up to 2-step orthogonal moves.' },
  { key: 'teleports', name: 'Teleport (+1)', cost: 7, description: 'Adds one teleport charge (range 3).' },
];

export default function App() {
  const [board, setBoard] = useState(initialBoard);
  const [turn, setTurn] = useState('white');
  const [selected, setSelected] = useState(null); // {r,c}
  const [validMoves, setValidMoves] = useState([]);
  const [preGame, setPreGame] = useState(true);
  const [teleportMode, setTeleportMode] = useState(false);
  const [points, setPoints] = useState({ white: 10, black: 10 });
  const [winner, setWinner] = useState(null);

  const currentPlayer = turn;

  const handleSelect = (r, c) => {
    if (winner) return;
    const piece = board[r][c];
    if (!piece) {
      setSelected(null);
      setValidMoves([]);
      return;
    }
    if (!preGame && piece.color !== currentPlayer) return;
    setSelected({ r, c });
    setTeleportMode(false);
    const moves = generateMoves(board, r, c, false);
    setValidMoves(moves);
  };

  const tryEndGameIfKingMissing = (nextBoard) => {
    let whiteKing = false;
    let blackKing = false;
    for (let rr = 0; rr < 8; rr++) {
      for (let cc = 0; cc < 8; cc++) {
        const p = nextBoard[rr][cc];
        if (p?.type === 'king') {
          if (p.color === 'white') whiteKing = true; else blackKing = true;
        }
      }
    }
    if (!whiteKing || !blackKing) {
      const winColor = whiteKing ? 'white' : 'black';
      const loseColor = winColor === 'white' ? 'black' : 'white';
      setWinner(winColor);
      setPoints((pt) => ({ ...pt, [winColor]: pt[winColor] + 20 }));
      // Minimal cleanup
      setTurn(winColor);
      setSelected(null);
      setValidMoves([]);
      return true;
    }
    return false;
  };

  const endTurn = () => setTurn((t) => (t === 'white' ? 'black' : 'white'));

  const handleMove = (r, c) => {
    if (winner) return;
    if (!selected) return;
    const { r: sr, c: sc } = selected;
    const piece = board[sr][sc];
    if (!piece) return;

    // Teleport mode
    if (teleportMode) {
      const teleMoves = generateMoves(board, sr, sc, true);
      const can = teleMoves.find((m) => m.r === r && m.c === c);
      if (!can) return;
      const nb = cloneBoard(board);
      nb[sr][sc] = { ...piece, hasMoved: true, abilities: { ...piece.abilities, teleports: piece.abilities.teleports - 1 } };
      nb[r][c] = nb[sr][sc];
      nb[sr][sc] = null;
      setBoard(nb);
      setTeleportMode(false);
      setSelected(null);
      setValidMoves([]);
      if (!preGame) endTurn();
      tryEndGameIfKingMissing(nb);
      return;
    }

    const move = validMoves.find((m) => m.r === r && m.c === c);
    if (!move) return;

    const target = board[r][c];
    const nb = cloneBoard(board);

    if (move.type === 'capture' && target) {
      if (target.abilities.shield) {
        // Consume shield, attacker stays put
        nb[r][c] = { ...target, abilities: { ...target.abilities, shield: false } };
        setBoard(nb);
        setSelected(null);
        setValidMoves([]);
        if (!preGame) endTurn();
        return;
      }
      // Award capture points
      const captorColor = piece.color;
      setPoints((pt) => ({ ...pt, [captorColor]: pt[captorColor] + (target.type === 'king' ? 20 : 5) }));
    }

    // Move piece
    nb[r][c] = { ...piece, hasMoved: true };
    nb[sr][sc] = null;

    // Pawn promotion simplified: auto promote at end to queen
    if (piece.type === 'pawn') {
      if ((piece.color === 'white' && r === 0) || (piece.color === 'black' && r === 7)) {
        nb[r][c] = { ...nb[r][c], type: 'queen' };
      }
    }

    setBoard(nb);
    setSelected(null);
    setValidMoves([]);

    const ended = tryEndGameIfKingMissing(nb);
    if (!preGame && !ended) endTurn();
  };

  const canApplyAbilityTo = (p) => {
    if (!p) return false;
    if (preGame) return true;
    return p.color === currentPlayer;
  };

  const applyAbility = (abilityKey) => {
    if (!selected) return;
    const { r, c } = selected;
    const p = board[r][c];
    if (!p || !canApplyAbilityTo(p)) return;
    const item = abilityCatalog.find((a) => a.key === abilityKey);
    if (!item) return;
    const cost = item.cost;
    const color = p.color;
    if (points[color] < cost) return;

    const nb = cloneBoard(board);
    const target = nb[r][c];
    const abilities = { ...target.abilities };
    if (abilityKey === 'teleports') abilities.teleports = (abilities.teleports || 0) + 1;
    else if (abilityKey === 'shield') abilities.shield = true;
    else if (abilityKey === 'jumper') abilities.jumper = true;
    else if (abilityKey === 'dash') abilities.dash = true;

    nb[r][c] = { ...target, abilities };
    setBoard(nb);
    setPoints((pt) => ({ ...pt, [color]: pt[color] - cost }));
  };

  const startGame = () => {
    setPreGame(false);
    setTurn('white');
  };

  const resetGame = () => {
    setBoard(initialBoard);
    setTurn('white');
    setSelected(null);
    setValidMoves([]);
    setPreGame(true);
    setTeleportMode(false);
    setPoints({ white: 10, black: 10 });
    setWinner(null);
  };

  const requestTeleportMode = () => {
    if (!selected) return;
    const { r, c } = selected;
    const p = board[r][c];
    if (!p || !canApplyAbilityTo(p)) return;
    if (p.abilities.teleports <= 0) return;
    setTeleportMode(true);
    const moves = generateMoves(board, r, c, true);
    setValidMoves(moves);
  };

  const selectableInfo = useMemo(() => {
    if (!selected) return null;
    const p = board[selected.r][selected.c];
    if (!p) return null;
    return { piece: p, r: selected.r, c: selected.c };
  }, [selected, board]);

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <Hero />
      <div className="max-w-6xl mx-auto px-4 pb-24">
        <Scoreboard
          turn={turn}
          points={points}
          preGame={preGame}
          winner={winner}
          onStart={startGame}
          onReset={resetGame}
        />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2">
            <ChessBoard
              board={board}
              selected={selected}
              validMoves={validMoves}
              onSelect={handleSelect}
              onMove={handleMove}
            />
          </div>
          <div className="lg:col-span-1">
            <UpgradePanel
              preGame={preGame}
              currentPlayer={currentPlayer}
              points={points}
              selectedInfo={selectableInfo}
              onApply={applyAbility}
              onTeleport={requestTeleportMode}
              catalog={abilityCatalog}
              teleportMode={teleportMode}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
