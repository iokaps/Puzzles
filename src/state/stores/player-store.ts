import { kmClient } from '@/services/km-client';

export interface PuzzlePiece {
	id: string;
	x: number; // position in SVG coordinates
	y: number;
	rotation: number; // degrees: 0, 90, 180, 270
	flipH: boolean; // horizontal flip
	flipV: boolean; // vertical flip
}

export interface PlayerState {
	name: string;
	currentView:
		| 'lobby'
		| 'shared-state'
		| 'connections'
		| 'puzzle'
		| 'roundResults'
		| 'finalResults';
	puzzleState: {
		pieces: PuzzlePiece[];
		isComplete: boolean;
	};
}

const initialState: PlayerState = {
	name: '',
	currentView: 'lobby',
	puzzleState: {
		pieces: [],
		isComplete: false
	}
};

export const playerStore = kmClient.localStore<PlayerState>(
	'player',
	initialState
);
