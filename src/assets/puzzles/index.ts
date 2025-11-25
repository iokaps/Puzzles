export interface PuzzlePieceDefinition {
	id: string;
	path: string; // SVG path data
	correctX: number; // correct position in solution
	correctY: number;
	correctRotation: number; // 0, 90, 180, or 270
	correctFlipH: boolean;
	correctFlipV: boolean;
}

export interface PuzzleDefinition {
	id: string;
	difficulty: 'easy' | 'medium' | 'hard';
	pieceCount: number;
	targetShape: string; // SVG path of complete puzzle outline
	pieces: PuzzlePieceDefinition[];
	viewBox: { width: number; height: number };
}

// Easy: 3-piece rectangle (3 horizontal bars stacked)
const EASY_PUZZLE_1: PuzzleDefinition = {
	id: 'easy-rectangle-1',
	difficulty: 'easy',
	pieceCount: 3,
	targetShape: 'M 30 30 L 120 30 L 120 120 L 30 120 Z', // 3x3 grid square
	viewBox: { width: 150, height: 150 },
	pieces: [
		{
			id: 'piece-1',
			path: 'M 0 0 L 90 0 L 90 30 L 0 30 Z', // 3x1 horizontal bar
			correctX: 30,
			correctY: 30,
			correctRotation: 0,
			correctFlipH: false,
			correctFlipV: false
		},
		{
			id: 'piece-2',
			path: 'M 0 0 L 90 0 L 90 30 L 0 30 Z', // 3x1 horizontal bar
			correctX: 30,
			correctY: 60,
			correctRotation: 0,
			correctFlipH: false,
			correctFlipV: false
		},
		{
			id: 'piece-3',
			path: 'M 0 0 L 90 0 L 90 30 L 0 30 Z', // 3x1 horizontal bar
			correctX: 30,
			correctY: 90,
			correctRotation: 0,
			correctFlipH: false,
			correctFlipV: false
		}
	]
};

// Easy: 3-piece L-shape (rotation required)
const EASY_PUZZLE_2: PuzzleDefinition = {
	id: 'easy-lshape-1',
	difficulty: 'easy',
	pieceCount: 3,
	targetShape: 'M 30 30 L 90 30 L 90 60 L 60 60 L 60 120 L 30 120 Z', // L-shape
	viewBox: { width: 150, height: 150 },
	pieces: [
		{
			id: 'piece-1',
			path: 'M 0 0 L 60 0 L 60 30 L 0 30 Z', // 2x1 horizontal (top of L)
			correctX: 30,
			correctY: 30,
			correctRotation: 0,
			correctFlipH: false,
			correctFlipV: false
		},
		{
			id: 'piece-2',
			path: 'M 0 0 L 30 0 L 30 60 L 0 60 Z', // 1x2 vertical (bottom of L)
			correctX: 30,
			correctY: 60,
			correctRotation: 0,
			correctFlipH: false,
			correctFlipV: false
		},
		{
			id: 'piece-3',
			path: 'M 0 0 L 60 0 L 60 30 L 0 30 Z', // 2x1 horizontal - NEEDS 90° ROTATION to fill corner
			correctX: 30,
			correctY: 60,
			correctRotation: 90,
			correctFlipH: false,
			correctFlipV: false
		}
	]
};

// Easy: 3-piece square (3 vertical bars side by side)
const EASY_PUZZLE_3: PuzzleDefinition = {
	id: 'easy-square-1',
	difficulty: 'easy',
	pieceCount: 3,
	targetShape: 'M 30 30 L 120 30 L 120 120 L 30 120 Z', // 3x3 grid square
	viewBox: { width: 150, height: 150 },
	pieces: [
		{
			id: 'piece-1',
			path: 'M 0 0 L 30 0 L 30 90 L 0 90 Z', // 1x3 vertical bar
			correctX: 30,
			correctY: 30,
			correctRotation: 0,
			correctFlipH: false,
			correctFlipV: false
		},
		{
			id: 'piece-2',
			path: 'M 0 0 L 30 0 L 30 90 L 0 90 Z', // 1x3 vertical bar
			correctX: 60,
			correctY: 30,
			correctRotation: 0,
			correctFlipH: false,
			correctFlipV: false
		},
		{
			id: 'piece-3',
			path: 'M 0 0 L 30 0 L 30 90 L 0 90 Z', // 1x3 vertical bar
			correctX: 90,
			correctY: 30,
			correctRotation: 0,
			correctFlipH: false,
			correctFlipV: false
		}
	]
};

// Medium: 4-piece square (2x2 grid of equal squares)
const MEDIUM_PUZZLE_1: PuzzleDefinition = {
	id: 'medium-square-1',
	difficulty: 'medium',
	pieceCount: 4,
	targetShape: 'M 30 30 L 90 30 L 90 90 L 30 90 Z', // 2x2 grid square
	viewBox: { width: 120, height: 120 },
	pieces: [
		{
			id: 'piece-1',
			path: 'M 0 0 L 30 0 L 30 30 L 0 30 Z', // top-left
			correctX: 30,
			correctY: 30,
			correctRotation: 0,
			correctFlipH: false,
			correctFlipV: false
		},
		{
			id: 'piece-2',
			path: 'M 0 0 L 30 0 L 30 30 L 0 30 Z', // top-right
			correctX: 60,
			correctY: 30,
			correctRotation: 0,
			correctFlipH: false,
			correctFlipV: false
		},
		{
			id: 'piece-3',
			path: 'M 0 0 L 30 0 L 30 30 L 0 30 Z', // bottom-left
			correctX: 30,
			correctY: 60,
			correctRotation: 0,
			correctFlipH: false,
			correctFlipV: false
		},
		{
			id: 'piece-4',
			path: 'M 0 0 L 30 0 L 30 30 L 0 30 Z', // bottom-right
			correctX: 60,
			correctY: 60,
			correctRotation: 0,
			correctFlipH: false,
			correctFlipV: false
		}
	]
};

// Medium: 4-piece T-shape (rotation required)
const MEDIUM_PUZZLE_2: PuzzleDefinition = {
	id: 'medium-tshape-1',
	difficulty: 'medium',
	pieceCount: 4,
	targetShape:
		'M 30 30 L 120 30 L 120 60 L 90 60 L 90 90 L 60 90 L 60 60 L 30 60 Z', // T-shape
	viewBox: { width: 150, height: 120 },
	pieces: [
		{
			id: 'piece-1',
			path: 'M 0 0 L 90 0 L 90 30 L 0 30 Z', // 3x1 horizontal (top of T)
			correctX: 30,
			correctY: 30,
			correctRotation: 0,
			correctFlipH: false,
			correctFlipV: false
		},
		{
			id: 'piece-2',
			path: 'M 0 0 L 30 0 L 30 30 L 0 30 Z', // 1x1 square
			correctX: 30,
			correctY: 60,
			correctRotation: 0,
			correctFlipH: false,
			correctFlipV: false
		},
		{
			id: 'piece-3',
			path: 'M 0 0 L 30 0 L 30 30 L 0 30 Z', // 1x1 square
			correctX: 60,
			correctY: 60,
			correctRotation: 0,
			correctFlipH: false,
			correctFlipV: false
		},
		{
			id: 'piece-4',
			path: 'M 0 0 L 30 0 L 30 30 L 0 30 Z', // 1x1 square
			correctX: 90,
			correctY: 60,
			correctRotation: 0,
			correctFlipH: false,
			correctFlipV: false
		}
	]
};

// Hard: 5-piece cross
const HARD_PUZZLE_1: PuzzleDefinition = {
	id: 'hard-cross-1',
	difficulty: 'hard',
	pieceCount: 5,
	targetShape:
		'M 45 15 L 75 15 L 75 45 L 105 45 L 105 75 L 75 75 L 75 105 L 45 105 L 45 75 L 15 75 L 15 45 L 45 45 Z',
	viewBox: { width: 120, height: 120 },
	pieces: [
		{
			id: 'piece-1',
			path: 'M 0 0 L 30 0 L 30 30 L 0 30 Z', // center
			correctX: 45,
			correctY: 45,
			correctRotation: 0,
			correctFlipH: false,
			correctFlipV: false
		},
		{
			id: 'piece-2',
			path: 'M 0 0 L 30 0 L 30 30 L 0 30 Z', // top
			correctX: 45,
			correctY: 15,
			correctRotation: 0,
			correctFlipH: false,
			correctFlipV: false
		},
		{
			id: 'piece-3',
			path: 'M 0 0 L 30 0 L 30 30 L 0 30 Z', // right
			correctX: 75,
			correctY: 45,
			correctRotation: 0,
			correctFlipH: false,
			correctFlipV: false
		},
		{
			id: 'piece-4',
			path: 'M 0 0 L 30 0 L 30 30 L 0 30 Z', // bottom
			correctX: 45,
			correctY: 75,
			correctRotation: 0,
			correctFlipH: false,
			correctFlipV: false
		},
		{
			id: 'piece-5',
			path: 'M 0 0 L 30 0 L 30 30 L 0 30 Z', // left
			correctX: 15,
			correctY: 45,
			correctRotation: 0,
			correctFlipH: false,
			correctFlipV: false
		}
	]
};

// Hard: 5-piece rectangle (rotation required)
const HARD_PUZZLE_2: PuzzleDefinition = {
	id: 'hard-rectangle-1',
	difficulty: 'hard',
	pieceCount: 5,
	targetShape: 'M 30 30 L 120 30 L 120 90 L 30 90 Z',
	viewBox: { width: 150, height: 120 },
	pieces: [
		{
			id: 'piece-1',
			path: 'M 0 0 L 60 0 L 60 30 L 0 30 Z', // 2x1 horizontal
			correctX: 30,
			correctY: 30,
			correctRotation: 0,
			correctFlipH: false,
			correctFlipV: false
		},
		{
			id: 'piece-2',
			path: 'M 0 0 L 60 0 L 60 30 L 0 30 Z', // 2x1 horizontal
			correctX: 30,
			correctY: 60,
			correctRotation: 0,
			correctFlipH: false,
			correctFlipV: false
		},
		{
			id: 'piece-3',
			path: 'M 0 0 L 30 0 L 30 60 L 0 60 Z', // 1x2 vertical NEEDS 90° ROTATION
			correctX: 90,
			correctY: 30,
			correctRotation: 90,
			correctFlipH: false,
			correctFlipV: false
		},
		{
			id: 'piece-4',
			path: 'M 0 0 L 30 0 L 30 30 L 0 30 Z', // 1x1 square
			correctX: 30,
			correctY: 30,
			correctRotation: 0,
			correctFlipH: false,
			correctFlipV: false
		},
		{
			id: 'piece-5',
			path: 'M 0 0 L 30 0 L 30 30 L 0 30 Z', // 1x1 square
			correctX: 60,
			correctY: 60,
			correctRotation: 0,
			correctFlipH: false,
			correctFlipV: false
		}
	]
};

const allPuzzles: PuzzleDefinition[] = [
	EASY_PUZZLE_1,
	EASY_PUZZLE_2,
	EASY_PUZZLE_3,
	MEDIUM_PUZZLE_1,
	MEDIUM_PUZZLE_2,
	HARD_PUZZLE_1,
	HARD_PUZZLE_2
];

export function getPuzzleById(id: string): PuzzleDefinition | undefined {
	return allPuzzles.find((p) => p.id === id);
}

export function getPuzzleByDifficulty(
	difficulty: 'easy' | 'medium' | 'hard',
	usedPuzzleIds: string[]
): PuzzleDefinition {
	const availablePuzzles = allPuzzles.filter(
		(p) => p.difficulty === difficulty && !usedPuzzleIds.includes(p.id)
	);

	if (availablePuzzles.length === 0) {
		// If all puzzles used, reset and start over
		const allDifficultyPuzzles = allPuzzles.filter(
			(p) => p.difficulty === difficulty
		);
		return (
			allDifficultyPuzzles[
				Math.floor(Math.random() * allDifficultyPuzzles.length)
			] || allPuzzles[0]
		);
	}

	return availablePuzzles[Math.floor(Math.random() * availablePuzzles.length)];
}
