export interface PuzzlePieceDefinition {
	id: string;
	path: string; // SVG path data
	correctX: number; // correct position in solution
	correctY: number;
	correctRotation: number; // 0, 90, 180, or 270
	color: string;
	width?: number; // bounding box width (default 30)
	height?: number; // bounding box height (default 30)
}

export interface PuzzleDefinition {
	id: string;
	difficulty: 'easy' | 'medium' | 'hard' | 'expert';
	pieceCount: number;
	targetShape: string; // SVG path of complete puzzle outline
	pieces: PuzzlePieceDefinition[];
	viewBox: { width: number; height: number };
}

// ============================================
// HARD PUZZLES (4-5 pieces each)
// ============================================

// Puzzle 1: The Castle (12 cells, 4 pieces)
// Grid (4x3):
//    [1][1][2][2]
//    [1][3][3][2]
//    [4][4][4][4]
const HARD_PUZZLE_1: PuzzleDefinition = {
	id: 'hard-castle',
	difficulty: 'hard',
	pieceCount: 4,
	targetShape: 'M 30 30 L 150 30 L 150 120 L 30 120 Z',
	viewBox: { width: 180, height: 450 },
	pieces: [
		{
			id: 'h1-p1',
			path: 'M 0 0 L 60 0 L 60 30 L 30 30 L 30 60 L 0 60 Z', // L-shape (3 cells)
			correctX: 30,
			correctY: 30,
			correctRotation: 0,
			color: '#ef4444',
			width: 60,
			height: 60
		},
		{
			id: 'h1-p2',
			path: 'M 0 0 L 60 0 L 60 30 L 30 30 L 30 60 L 0 60 Z', // L-shape (3 cells)
			correctX: 90,
			correctY: 30,
			correctRotation: 0,
			color: '#3b82f6',
			width: 60,
			height: 60
		},
		{
			id: 'h1-p3',
			path: 'M 0 0 L 60 0 L 60 30 L 0 30 Z', // 2x1 bar (2 cells)
			correctX: 60,
			correctY: 60,
			correctRotation: 0,
			color: '#22c55e',
			width: 60,
			height: 30
		},
		{
			id: 'h3-p4',
			path: 'M 0 0 L 120 0 L 120 30 L 0 30 Z', // 4x1 bar (4 cells)
			correctX: 30,
			correctY: 90,
			correctRotation: 0,
			color: '#f59e0b',
			width: 120,
			height: 30
		}
	]
};

// Puzzle 2: The Fortress (15 cells, 5 pieces)
// Grid (5x3):
//    [1][2][2][2][3]
//    [1][4][4][4][3]
//    [5][5][5][5][5]
const HARD_PUZZLE_2: PuzzleDefinition = {
	id: 'hard-fortress',
	difficulty: 'hard',
	pieceCount: 5,
	targetShape: 'M 30 30 L 180 30 L 180 120 L 30 120 Z',
	viewBox: { width: 210, height: 450 },
	pieces: [
		{
			id: 'h2-p1',
			path: 'M 0 0 L 30 0 L 30 60 L 0 60 Z', // 1x2 bar (2 cells)
			correctX: 30,
			correctY: 30,
			correctRotation: 0,
			color: '#ef4444',
			width: 30,
			height: 60
		},
		{
			id: 'h2-p2',
			path: 'M 0 0 L 90 0 L 90 30 L 0 30 Z', // 3x1 bar (3 cells)
			correctX: 60,
			correctY: 30,
			correctRotation: 0,
			color: '#3b82f6',
			width: 90,
			height: 30
		},
		{
			id: 'h2-p3',
			path: 'M 0 0 L 30 0 L 30 60 L 0 60 Z', // 1x2 bar (2 cells)
			correctX: 150,
			correctY: 30,
			correctRotation: 0,
			color: '#22c55e',
			width: 30,
			height: 60
		},
		{
			id: 'h2-p4',
			path: 'M 0 0 L 90 0 L 90 30 L 0 30 Z', // 3x1 bar (3 cells)
			correctX: 60,
			correctY: 60,
			correctRotation: 0,
			color: '#8b5cf6',
			width: 90,
			height: 30
		},
		{
			id: 'h2-p5',
			path: 'M 0 0 L 150 0 L 150 30 L 0 30 Z', // 5x1 bar (5 cells)
			correctX: 30,
			correctY: 90,
			correctRotation: 0,
			color: '#f59e0b',
			width: 150,
			height: 30
		}
	]
};

// Puzzle 3: The Zigzag (10 cells, 4 pieces)
// Grid (4x3):
//    [1][1][2][_]
//    [_][1][2][3]
//    [4][4][4][3]
const HARD_PUZZLE_3: PuzzleDefinition = {
	id: 'hard-zigzag',
	difficulty: 'hard',
	pieceCount: 4,
	targetShape:
		'M 30 30 L 90 30 L 90 60 L 120 60 L 120 90 L 150 90 L 150 120 L 30 120 L 30 90 L 60 90 L 60 60 L 30 60 Z',
	viewBox: { width: 180, height: 450 },
	pieces: [
		{
			id: 'h3-p1',
			path: 'M 0 0 L 60 0 L 60 30 L 30 30 L 30 60 L 0 60 Z', // L-shape (3 cells)
			correctX: 30,
			correctY: 30,
			correctRotation: 0,
			color: '#ef4444',
			width: 60,
			height: 60
		},
		{
			id: 'h3-p2',
			path: 'M 0 0 L 30 0 L 30 60 L 0 60 Z', // 1x2 bar (2 cells)
			correctX: 90,
			correctY: 30,
			correctRotation: 0,
			color: '#3b82f6',
			width: 30,
			height: 60
		},
		{
			id: 'h3-p3',
			path: 'M 0 0 L 30 0 L 30 60 L 0 60 Z', // 1x2 bar (2 cells)
			correctX: 120,
			correctY: 60,
			correctRotation: 0,
			color: '#22c55e',
			width: 30,
			height: 60
		},
		{
			id: 'h3-p4',
			path: 'M 0 0 L 90 0 L 90 30 L 0 30 Z', // 3x1 bar (3 cells)
			correctX: 30,
			correctY: 90,
			correctRotation: 0,
			color: '#f59e0b',
			width: 90,
			height: 30
		}
	]
};

// Puzzle 4: The Pyramid (12 cells, 6 pieces)
// Grid (6x3):
//    [_][_][1][1][_][_]
//    [_][2][2][3][3][_]
//    [4][4][5][5][6][6]
const EXPERT_PUZZLE_1: PuzzleDefinition = {
	id: 'expert-pyramid',
	difficulty: 'hard',
	pieceCount: 6,
	targetShape:
		'M 90 30 L 150 30 L 150 60 L 180 60 L 180 90 L 210 90 L 210 120 L 30 120 L 30 90 L 60 90 L 60 60 L 90 60 Z',
	viewBox: { width: 240, height: 450 },
	pieces: [
		{
			id: 'x1-p1',
			path: 'M 0 0 L 60 0 L 60 30 L 0 30 Z', // 2x1 bar (2 cells)
			correctX: 90,
			correctY: 30,
			correctRotation: 0,
			color: '#ef4444',
			width: 60,
			height: 30
		},
		{
			id: 'x1-p2',
			path: 'M 0 0 L 60 0 L 60 30 L 0 30 Z', // 2x1 bar (2 cells)
			correctX: 60,
			correctY: 60,
			correctRotation: 0,
			color: '#3b82f6',
			width: 60,
			height: 30
		},
		{
			id: 'x1-p3',
			path: 'M 0 0 L 60 0 L 60 30 L 0 30 Z', // 2x1 bar (2 cells)
			correctX: 120,
			correctY: 60,
			correctRotation: 0,
			color: '#22c55e',
			width: 60,
			height: 30
		},
		{
			id: 'x1-p4',
			path: 'M 0 0 L 60 0 L 60 30 L 0 30 Z', // 2x1 bar (2 cells)
			correctX: 30,
			correctY: 90,
			correctRotation: 0,
			color: '#f59e0b',
			width: 60,
			height: 30
		},
		{
			id: 'x1-p5',
			path: 'M 0 0 L 60 0 L 60 30 L 0 30 Z', // 2x1 bar (2 cells)
			correctX: 90,
			correctY: 90,
			correctRotation: 0,
			color: '#8b5cf6',
			width: 60,
			height: 30
		},
		{
			id: 'x1-p6',
			path: 'M 0 0 L 60 0 L 60 30 L 0 30 Z', // 2x1 bar (2 cells)
			correctX: 150,
			correctY: 90,
			correctRotation: 0,
			color: '#ec4899',
			width: 60,
			height: 30
		}
	]
};

// Puzzle 5: The Tetris Complex (15 cells, 5 pieces)
// Grid (5x3):
//    [1][1][1][2][2]
//    [3][3][4][4][2]
//    [3][5][5][5][5]
const EXPERT_PUZZLE_2: PuzzleDefinition = {
	id: 'expert-tetris',
	difficulty: 'hard',
	pieceCount: 5,
	targetShape: 'M 30 30 L 180 30 L 180 120 L 30 120 Z',
	viewBox: { width: 210, height: 450 },
	pieces: [
		{
			id: 'x2-p1',
			path: 'M 0 0 L 90 0 L 90 30 L 0 30 Z', // 3x1 bar (3 cells)
			correctX: 30,
			correctY: 30,
			correctRotation: 0,
			color: '#ef4444',
			width: 90,
			height: 30
		},
		{
			id: 'x2-p2',
			path: 'M 0 0 L 30 0 L 30 30 L 60 30 L 60 60 L 0 60 Z', // L-shape (3 cells)
			correctX: 120,
			correctY: 30,
			correctRotation: 0,
			color: '#3b82f6',
			width: 60,
			height: 60
		},
		{
			id: 'x2-p3',
			path: 'M 0 0 L 60 0 L 60 30 L 30 30 L 30 60 L 0 60 Z', // L-shape (3 cells)
			correctX: 30,
			correctY: 60,
			correctRotation: 0,
			color: '#22c55e',
			width: 60,
			height: 60
		},
		{
			id: 'x2-p4',
			path: 'M 0 0 L 60 0 L 60 30 L 0 30 Z', // 2x1 bar (2 cells)
			correctX: 90,
			correctY: 60,
			correctRotation: 0,
			color: '#f59e0b',
			width: 60,
			height: 30
		},
		{
			id: 'x2-p5',
			path: 'M 0 0 L 120 0 L 120 30 L 0 30 Z', // 4x1 bar (4 cells)
			correctX: 60,
			correctY: 90,
			correctRotation: 0,
			color: '#8b5cf6',
			width: 120,
			height: 30
		}
	]
};

// Puzzle 6: The Labyrinth (15 cells, 5 pieces)
// Grid (4x4):
//    [1][1][2][_]
//    [1][3][2][4]
//    [5][3][2][4]
//    [5][5][5][4]
const EXPERT_PUZZLE_3: PuzzleDefinition = {
	id: 'expert-labyrinth',
	difficulty: 'hard',
	pieceCount: 5,
	targetShape:
		'M 30 30 L 120 30 L 120 60 L 150 60 L 150 150 L 120 150 L 120 120 L 30 120 L 30 90 L 60 90 L 60 60 L 30 60 Z',
	viewBox: { width: 180, height: 450 },
	pieces: [
		{
			id: 'x3-p1',
			path: 'M 0 0 L 60 0 L 60 30 L 30 30 L 30 60 L 0 60 Z', // L-shape (3 cells)
			correctX: 30,
			correctY: 30,
			correctRotation: 0,
			color: '#ef4444',
			width: 60,
			height: 60
		},
		{
			id: 'x3-p2',
			path: 'M 0 0 L 30 0 L 30 90 L 0 90 Z', // 1x3 bar (3 cells)
			correctX: 90,
			correctY: 30,
			correctRotation: 0,
			color: '#3b82f6',
			width: 30,
			height: 90
		},
		{
			id: 'x3-p3',
			path: 'M 0 0 L 30 0 L 30 60 L 0 60 Z', // 1x2 bar (2 cells)
			correctX: 60,
			correctY: 60,
			correctRotation: 0,
			color: '#22c55e',
			width: 30,
			height: 60
		},
		{
			id: 'x3-p4',
			path: 'M 0 0 L 30 0 L 30 90 L 0 90 Z', // 1x3 bar (3 cells)
			correctX: 120,
			correctY: 60,
			correctRotation: 0,
			color: '#f59e0b',
			width: 30,
			height: 90
		},
		{
			id: 'x3-p5',
			path: 'M 0 0 L 30 0 L 30 30 L 90 30 L 90 60 L 0 60 Z', // L-shape (4 cells)
			correctX: 30,
			correctY: 90,
			correctRotation: 0,
			color: '#8b5cf6',
			width: 90,
			height: 60
		}
	]
};

// Puzzle 7: The Spiral (18 cells, 6 pieces)
// Grid (6x3):
//    [1][1][2][2][3][3]
//    [4][_][_][_][_][3]
//    [4][5][5][6][6][6]
const EXPERT_PUZZLE_4: PuzzleDefinition = {
	id: 'expert-spiral',
	difficulty: 'hard',
	pieceCount: 6,
	targetShape:
		'M 30 30 L 90 30 L 90 60 L 150 60 L 150 90 L 210 90 L 210 120 L 90 120 L 90 90 L 60 90 L 60 120 L 30 120 Z',
	viewBox: { width: 240, height: 450 },
	pieces: [
		{
			id: 'x4-p1',
			path: 'M 0 0 L 60 0 L 60 30 L 0 30 Z', // 2x1 bar (2 cells)
			correctX: 30,
			correctY: 30,
			correctRotation: 0,
			color: '#ef4444',
			width: 60,
			height: 30
		},
		{
			id: 'x4-p2',
			path: 'M 0 0 L 60 0 L 60 30 L 0 30 Z', // 2x1 bar (2 cells)
			correctX: 90,
			correctY: 30,
			correctRotation: 0,
			color: '#3b82f6',
			width: 60,
			height: 30
		},
		{
			id: 'x4-p3',
			path: 'M 0 0 L 30 0 L 30 30 L 60 30 L 60 60 L 0 60 Z', // L-shape (3 cells)
			correctX: 150,
			correctY: 30,
			correctRotation: 0,
			color: '#22c55e',
			width: 60,
			height: 60
		},
		{
			id: 'x4-p4',
			path: 'M 0 0 L 30 0 L 30 60 L 0 60 Z', // 1x2 bar (2 cells)
			correctX: 30,
			correctY: 60,
			correctRotation: 0,
			color: '#f59e0b',
			width: 30,
			height: 60
		},
		{
			id: 'x4-p5',
			path: 'M 0 0 L 60 0 L 60 30 L 0 30 Z', // 2x1 bar (2 cells)
			correctX: 60,
			correctY: 90,
			correctRotation: 0,
			color: '#8b5cf6',
			width: 60,
			height: 30
		},
		{
			id: 'x4-p6',
			path: 'M 0 0 L 90 0 L 90 30 L 0 30 Z', // 3x1 bar (3 cells)
			correctX: 120,
			correctY: 90,
			correctRotation: 0,
			color: '#ec4899',
			width: 90,
			height: 30
		}
	]
};

const allPuzzles: PuzzleDefinition[] = [
	HARD_PUZZLE_1,
	HARD_PUZZLE_2,
	HARD_PUZZLE_3,
	EXPERT_PUZZLE_1,
	EXPERT_PUZZLE_2,
	EXPERT_PUZZLE_3,
	EXPERT_PUZZLE_4
];

export function getPuzzleById(id: string): PuzzleDefinition | undefined {
	return allPuzzles.find((p) => p.id === id);
}

export function getPuzzleByDifficulty(
	usedPuzzleIds: string[]
): PuzzleDefinition {
	// Get available puzzles that haven't been used yet
	const availablePuzzles = allPuzzles.filter(
		(p) => !usedPuzzleIds.includes(p.id)
	);

	// If all puzzles used, reset and use all puzzles
	const puzzlePool =
		availablePuzzles.length > 0 ? availablePuzzles : allPuzzles;

	// Return random puzzle from pool
	return puzzlePool[Math.floor(Math.random() * puzzlePool.length)];
}
