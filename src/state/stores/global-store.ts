import { kmClient } from '@/services/km-client';

export type GamePhase = 'lobby' | 'playing' | 'roundResults' | 'finalResults';
export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';

export interface PlayerScore {
	name: string;
	totalScore: number;
	roundScores: number[];
	completedAt?: number; // server timestamp when puzzle completed in current round
}

export interface GlobalState {
	controllerConnectionId: string;
	started: boolean;
	startTimestamp: number;
	gamePhase: GamePhase;
	currentRound: number;
	totalRounds: number;
	roundStartTime: number;
	roundDuration: number; // milliseconds
	difficulty: Difficulty;
	players: Record<string, PlayerScore>;
	puzzleId: string; // identifier for current puzzle
	usedPuzzleIds: string[]; // track puzzles already used in this game
}

const initialState: GlobalState = {
	controllerConnectionId: '',
	started: false,
	startTimestamp: 0,
	gamePhase: 'lobby',
	currentRound: 0,
	totalRounds: 3,
	roundStartTime: 0,
	roundDuration: 60000,
	difficulty: 'easy',
	players: {},
	puzzleId: '',
	usedPuzzleIds: []
};

export const globalStore = kmClient.store<GlobalState>('global', initialState);
