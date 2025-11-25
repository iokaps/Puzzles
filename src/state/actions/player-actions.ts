import { getPuzzleById } from '@/assets/puzzles';
import { kmClient } from '@/services/km-client';
import { globalStore } from '../stores/global-store';
import {
	playerStore,
	type PlayerState,
	type PuzzlePiece
} from '../stores/player-store';

export const playerActions = {
	async setCurrentView(view: PlayerState['currentView']) {
		await kmClient.transact([playerStore], ([playerState]) => {
			playerState.currentView = view;
		});
	},

	async setPlayerName(name: string) {
		await kmClient.transact(
			[playerStore, globalStore],
			([playerState, globalState]) => {
				playerState.name = name;
				globalState.players[kmClient.id] = {
					name,
					totalScore: 0,
					roundScores: []
				};
			}
		);
	},

	async initializePuzzle(puzzleId: string) {
		const puzzle = getPuzzleById(puzzleId);
		if (!puzzle) return;

		await kmClient.transact([playerStore], ([playerState]) => {
			// Initialize pieces in a fixed row at the bottom
			const spacing = puzzle.viewBox.width / (puzzle.pieces.length + 1);
			const pieces: PuzzlePiece[] = puzzle.pieces.map((pieceDef, index) => ({
				id: pieceDef.id,
				x: spacing * (index + 1),
				y: puzzle.viewBox.height - 80,
				rotation: 0,
				flipH: false,
				flipV: false
			}));

			playerState.puzzleState.pieces = pieces;
			playerState.puzzleState.isComplete = false;
		});
	},

	async updatePiecePosition(pieceId: string, x: number, y: number) {
		await kmClient.transact([playerStore], ([playerState]) => {
			const piece = playerState.puzzleState.pieces.find(
				(p) => p.id === pieceId
			);
			if (piece) {
				piece.x = x;
				piece.y = y;
			}
		});
	},

	async rotatePiece(pieceId: string) {
		await kmClient.transact([playerStore], ([playerState]) => {
			const piece = playerState.puzzleState.pieces.find(
				(p) => p.id === pieceId
			);
			if (piece) {
				piece.rotation = (piece.rotation + 90) % 360;
			}
		});
	},

	async flipPiece(pieceId: string, axis: 'horizontal' | 'vertical') {
		await kmClient.transact([playerStore], ([playerState]) => {
			const piece = playerState.puzzleState.pieces.find(
				(p) => p.id === pieceId
			);
			if (piece) {
				if (axis === 'horizontal') {
					piece.flipH = !piece.flipH;
				} else {
					piece.flipV = !piece.flipV;
				}
			}
		});
	},

	validatePuzzle(puzzleId: string, pieces: PuzzlePiece[]): boolean {
		return this.validatePuzzleWithDetails(puzzleId, pieces).isValid;
	},

	validatePuzzleWithDetails(
		puzzleId: string,
		pieces: PuzzlePiece[]
	): { isValid: boolean; errors: Array<{ pieceId: string; message: string }> } {
		const puzzle = getPuzzleById(puzzleId);
		if (!puzzle)
			return {
				isValid: false,
				errors: [{ pieceId: 'unknown', message: 'Puzzle not found' }]
			};

		const tolerance = 30; // pixels
		const errors: Array<{ pieceId: string; message: string }> = [];

		// Check if all pieces are in correct position
		for (const piece of pieces) {
			const pieceDef = puzzle.pieces.find((p) => p.id === piece.id);
			if (!pieceDef) continue;

			const xMatch = Math.abs(piece.x - pieceDef.correctX) <= tolerance;
			const yMatch = Math.abs(piece.y - pieceDef.correctY) <= tolerance;
			const rotationMatch = piece.rotation === pieceDef.correctRotation;
			const flipHMatch = piece.flipH === pieceDef.correctFlipH;
			const flipVMatch = piece.flipV === pieceDef.correctFlipV;

			if (!xMatch || !yMatch || !rotationMatch || !flipHMatch || !flipVMatch) {
				const issues: string[] = [];

				if (!rotationMatch) {
					issues.push(
						`rotate to ${pieceDef.correctRotation}° (currently ${piece.rotation}°)`
					);
				}
				if (!xMatch || !yMatch) {
					issues.push('move to correct position');
				}

				errors.push({
					pieceId: piece.id,
					message: issues.join(', ')
				});

				const xDiff = Math.abs(piece.x - pieceDef.correctX);
				const yDiff = Math.abs(piece.y - pieceDef.correctY);
				console.log(`❌ Piece ${piece.id} FAILED:`, {
					position: {
						current: `(${piece.x.toFixed(1)}, ${piece.y.toFixed(1)})`,
						correct: `(${pieceDef.correctX}, ${pieceDef.correctY})`,
						distance: `x: ${xDiff.toFixed(1)}px ${xMatch ? '✓' : `✗ (need ≤30)`}, y: ${yDiff.toFixed(1)}px ${yMatch ? '✓' : `✗ (need ≤30)`}`
					},
					rotation: `${piece.rotation}° ${rotationMatch ? '✓' : `✗ (need ${pieceDef.correctRotation}°)`}`,
					flips: `H:${piece.flipH ? 'yes' : 'no'}${flipHMatch ? '✓' : '✗'} V:${piece.flipV ? 'yes' : 'no'}${flipVMatch ? '✓' : '✗'}`
				});
			}
		}

		if (errors.length === 0) {
			console.log(
				'✅ Puzzle validation PASSED! All pieces correctly positioned.'
			);
			return { isValid: true, errors: [] };
		}

		return { isValid: false, errors };
	},

	async markPuzzleComplete() {
		await kmClient.transact([playerStore], ([playerState]) => {
			playerState.puzzleState.isComplete = true;
		});
	}
};
