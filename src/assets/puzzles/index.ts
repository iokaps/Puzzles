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

// Easy: The Pyramid (4 pieces)
const EASY_PUZZLE_1: PuzzleDefinition = {
	id: 'easy-pyramid',
	difficulty: 'easy',
	pieceCount: 4,
	targetShape:
		'M 60 30 L 90 30 L 90 60 L 120 60 L 120 90 L 30 90 L 30 60 L 60 60 Z',
	viewBox: { width: 150, height: 300 },
	pieces: [
		{
			id: 'piece-1',
			path: 'M 0 0 L 30 0 L 30 30 L 0 30 Z', // 1x1
			correctX: 60,
			correctY: 30,
			correctRotation: 0,
			color: '#ef4444' // Red
		},
		{
			id: 'piece-2',
			path: 'M 0 0 L 30 0 L 30 30 L 0 30 Z', // 1x1
			correctX: 30,
			correctY: 60,
			correctRotation: 0,
			color: '#22c55e' // Green
		},
		{
			id: 'piece-3',
			path: 'M 0 0 L 30 0 L 30 30 L 0 30 Z', // 1x1
			correctX: 60,
			correctY: 60,
			correctRotation: 0,
			color: '#3b82f6' // Blue
		},
		{
			id: 'piece-4',
			path: 'M 0 0 L 30 0 L 30 30 L 0 30 Z', // 1x1
			correctX: 90,
			correctY: 60,
			correctRotation: 0,
			color: '#f59e0b' // Amber
		}
	]
};

// Easy: The Corner (3 pieces)
const EASY_PUZZLE_2: PuzzleDefinition = {
	id: 'easy-corner',
	difficulty: 'easy',
	pieceCount: 3,
	targetShape: 'M 30 30 L 90 30 L 90 60 L 60 60 L 60 90 L 30 90 Z',
	viewBox: { width: 150, height: 300 },
	pieces: [
		{
			id: 'piece-1',
			path: 'M 0 0 L 30 0 L 30 30 L 0 30 Z', // 1x1
			correctX: 30,
			correctY: 30,
			correctRotation: 0,
			color: '#f59e0b' // Amber
		},
		{
			id: 'piece-2',
			path: 'M 0 0 L 30 0 L 30 30 L 0 30 Z', // 1x1
			correctX: 60,
			correctY: 30,
			correctRotation: 0,
			color: '#8b5cf6' // Violet
		},
		{
			id: 'piece-3',
			path: 'M 0 0 L 30 0 L 30 30 L 0 30 Z', // 1x1
			correctX: 30,
			correctY: 60,
			correctRotation: 0,
			color: '#ec4899' // Pink
		}
	]
};

// Medium: The Big T (5 pieces)
const MEDIUM_PUZZLE_1: PuzzleDefinition = {
	id: 'medium-big-t',
	difficulty: 'medium',
	pieceCount: 5,
	targetShape:
		'M 30 30 L 120 30 L 120 60 L 90 60 L 90 120 L 60 120 L 60 60 L 30 60 Z',
	viewBox: { width: 150, height: 350 },
	pieces: [
		{
			id: 'piece-1',
			path: 'M 0 0 L 30 0 L 30 30 L 0 30 Z', // 1x1
			correctX: 30,
			correctY: 30,
			correctRotation: 0,
			color: '#ef4444'
		},
		{
			id: 'piece-2',
			path: 'M 0 0 L 30 0 L 30 30 L 0 30 Z', // 1x1
			correctX: 60,
			correctY: 30,
			correctRotation: 0,
			color: '#3b82f6'
		},
		{
			id: 'piece-3',
			path: 'M 0 0 L 30 0 L 30 30 L 0 30 Z', // 1x1
			correctX: 90,
			correctY: 30,
			correctRotation: 0,
			color: '#22c55e'
		},
		{
			id: 'piece-4',
			path: 'M 0 0 L 30 0 L 30 30 L 0 30 Z', // 1x1
			correctX: 60,
			correctY: 60,
			correctRotation: 0,
			color: '#f59e0b'
		},
		{
			id: 'piece-5',
			path: 'M 0 0 L 30 0 L 30 30 L 0 30 Z', // 1x1
			correctX: 60,
			correctY: 90,
			correctRotation: 0,
			color: '#8b5cf6'
		}
	]
};

// Medium: The Stairs (5 pieces)
const MEDIUM_PUZZLE_2: PuzzleDefinition = {
	id: 'medium-stairs',
	difficulty: 'medium',
	pieceCount: 5,
	targetShape:
		'M 30 30 L 90 30 L 90 60 L 120 60 L 120 120 L 90 120 L 90 90 L 60 90 L 60 60 L 30 60 Z',
	viewBox: { width: 150, height: 350 },
	pieces: [
		{
			id: 'piece-1',
			path: 'M 0 0 L 30 0 L 30 30 L 0 30 Z', // 1x1
			correctX: 30,
			correctY: 30,
			correctRotation: 0,
			color: '#8b5cf6'
		},
		{
			id: 'piece-2',
			path: 'M 0 0 L 30 0 L 30 30 L 0 30 Z', // 1x1
			correctX: 60,
			correctY: 30,
			correctRotation: 0,
			color: '#ec4899'
		},
		{
			id: 'piece-3',
			path: 'M 0 0 L 30 0 L 30 30 L 0 30 Z', // 1x1
			correctX: 60,
			correctY: 60,
			correctRotation: 0,
			color: '#06b6d4'
		},
		{
			id: 'piece-4',
			path: 'M 0 0 L 30 0 L 30 30 L 0 30 Z', // 1x1
			correctX: 90,
			correctY: 60,
			correctRotation: 0,
			color: '#f97316'
		},
		{
			id: 'piece-5',
			path: 'M 0 0 L 30 0 L 30 30 L 0 30 Z', // 1x1
			correctX: 90,
			correctY: 90,
			correctRotation: 0,
			color: '#ef4444'
		}
	]
};

// Hard: The Big U (7 pieces)
const HARD_PUZZLE_1: PuzzleDefinition = {
	id: 'hard-big-u',
	difficulty: 'hard',
	pieceCount: 7,
	targetShape:
		'M 30 30 L 60 30 L 60 90 L 90 90 L 90 30 L 120 30 L 120 120 L 30 120 Z',
	viewBox: { width: 150, height: 400 },
	pieces: [
		{
			id: 'piece-1',
			path: 'M 0 0 L 30 0 L 30 30 L 0 30 Z', // 1x1
			correctX: 30,
			correctY: 90,
			correctRotation: 0,
			color: '#ef4444'
		},
		{
			id: 'piece-2',
			path: 'M 0 0 L 30 0 L 30 30 L 0 30 Z', // 1x1
			correctX: 60,
			correctY: 90,
			correctRotation: 0,
			color: '#3b82f6'
		},
		{
			id: 'piece-3',
			path: 'M 0 0 L 30 0 L 30 30 L 0 30 Z', // 1x1
			correctX: 90,
			correctY: 90,
			correctRotation: 0,
			color: '#22c55e'
		},
		{
			id: 'piece-4',
			path: 'M 0 0 L 30 0 L 30 30 L 0 30 Z', // 1x1
			correctX: 30,
			correctY: 60,
			correctRotation: 0,
			color: '#f59e0b'
		},
		{
			id: 'piece-5',
			path: 'M 0 0 L 30 0 L 30 30 L 0 30 Z', // 1x1
			correctX: 30,
			correctY: 30,
			correctRotation: 0,
			color: '#8b5cf6'
		},
		{
			id: 'piece-6',
			path: 'M 0 0 L 30 0 L 30 30 L 0 30 Z', // 1x1
			correctX: 90,
			correctY: 60,
			correctRotation: 0,
			color: '#ec4899'
		},
		{
			id: 'piece-7',
			path: 'M 0 0 L 30 0 L 30 30 L 0 30 Z', // 1x1
			correctX: 90,
			correctY: 30,
			correctRotation: 0,
			color: '#06b6d4'
		}
	]
};

// Hard: The Long Cross (6 pieces)
const HARD_PUZZLE_2: PuzzleDefinition = {
	id: 'hard-long-cross',
	difficulty: 'hard',
	pieceCount: 6,
	targetShape:
		'M 60 30 L 90 30 L 90 90 L 120 90 L 120 120 L 90 120 L 90 150 L 60 150 L 60 120 L 30 120 L 30 90 L 60 90 Z',
	viewBox: { width: 150, height: 400 },
	pieces: [
		{
			id: 'piece-1',
			path: 'M 0 0 L 30 0 L 30 30 L 0 30 Z', // 1x1
			correctX: 60,
			correctY: 30,
			correctRotation: 0,
			color: '#ec4899'
		},
		{
			id: 'piece-2',
			path: 'M 0 0 L 30 0 L 30 30 L 0 30 Z', // 1x1
			correctX: 60,
			correctY: 60,
			correctRotation: 0,
			color: '#06b6d4'
		},
		{
			id: 'piece-3',
			path: 'M 0 0 L 30 0 L 30 30 L 0 30 Z', // 1x1
			correctX: 60,
			correctY: 90,
			correctRotation: 0,
			color: '#f43f5e'
		},
		{
			id: 'piece-4',
			path: 'M 0 0 L 30 0 L 30 30 L 0 30 Z', // 1x1
			correctX: 60,
			correctY: 120,
			correctRotation: 0,
			color: '#84cc16'
		},
		{
			id: 'piece-5',
			path: 'M 0 0 L 30 0 L 30 30 L 0 30 Z', // 1x1
			correctX: 30,
			correctY: 90,
			correctRotation: 0,
			color: '#f97316'
		},
		{
			id: 'piece-6',
			path: 'M 0 0 L 30 0 L 30 30 L 0 30 Z', // 1x1
			correctX: 90,
			correctY: 90,
			correctRotation: 0,
			color: '#ef4444'
		}
	]
};

// Expert: The 3x3 Box (3 pieces)
const EXPERT_PUZZLE_1: PuzzleDefinition = {
	id: 'expert-box',
	difficulty: 'expert',
	pieceCount: 3,
	targetShape: 'M 30 30 L 120 30 L 120 120 L 30 120 Z',
	viewBox: { width: 150, height: 450 },
	pieces: [
		// 3x1 Bar
		{
			id: 'p1',
			path: 'M 0 0 L 90 0 L 90 30 L 0 30 Z',
			correctX: 30,
			correctY: 30,
			correctRotation: 0,
			color: '#ef4444',
			width: 90,
			height: 30
		},
		// 1x2 Bar
		{
			id: 'p2',
			path: 'M 0 0 L 30 0 L 30 60 L 0 60 Z',
			correctX: 30,
			correctY: 60,
			correctRotation: 0,
			color: '#22c55e',
			width: 30,
			height: 60
		},
		// 2x2 Square
		{
			id: 'p3',
			path: 'M 0 0 L 60 0 L 60 60 L 0 60 Z',
			correctX: 60,
			correctY: 60,
			correctRotation: 0,
			color: '#3b82f6',
			width: 60,
			height: 60
		}
	]
};

// Expert: The Steps (4 pieces)
const EXPERT_PUZZLE_2: PuzzleDefinition = {
	id: 'expert-steps',
	difficulty: 'expert',
	pieceCount: 4,
	targetShape:
		'M 30 30 L 60 30 L 60 60 L 90 60 L 90 90 L 120 90 L 120 120 L 150 120 L 150 150 L 30 150 Z',
	viewBox: { width: 180, height: 450 },
	pieces: [
		// 1x4 Bar
		{
			id: 'p1',
			path: 'M 0 0 L 30 0 L 30 120 L 0 120 Z',
			correctX: 30,
			correctY: 30,
			correctRotation: 0,
			color: '#ef4444',
			width: 30,
			height: 120
		},
		// 1x3 Bar
		{
			id: 'p2',
			path: 'M 0 0 L 30 0 L 30 90 L 0 90 Z',
			correctX: 60,
			correctY: 60,
			correctRotation: 0,
			color: '#f97316',
			width: 30,
			height: 90
		},
		// 1x2 Bar
		{
			id: 'p3',
			path: 'M 0 0 L 30 0 L 30 60 L 0 60 Z',
			correctX: 90,
			correctY: 90,
			correctRotation: 0,
			color: '#f59e0b',
			width: 30,
			height: 60
		},
		// 1x1 Block
		{
			id: 'p4',
			path: 'M 0 0 L 30 0 L 30 30 L 0 30 Z',
			correctX: 120,
			correctY: 120,
			correctRotation: 0,
			color: '#84cc16',
			width: 30,
			height: 30
		}
	]
};

const allPuzzles: PuzzleDefinition[] = [
	EASY_PUZZLE_1,
	EASY_PUZZLE_2,
	MEDIUM_PUZZLE_1,
	MEDIUM_PUZZLE_2,
	HARD_PUZZLE_1,
	HARD_PUZZLE_2,
	EXPERT_PUZZLE_1,
	EXPERT_PUZZLE_2
];

export function getPuzzleById(id: string): PuzzleDefinition | undefined {
	return allPuzzles.find((p) => p.id === id);
}

export function getPuzzleByDifficulty(
	difficulty: 'easy' | 'medium' | 'hard' | 'expert',
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
