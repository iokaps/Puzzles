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
			// Initialize pieces in a grid layout at the bottom
			const gap = 15;
			const padding = 15;
			const maxWidth = puzzle.viewBox.width - padding * 2;

			// Calculate layout
			let currentX = 0;
			let currentY = 0;
			let currentRowHeight = 0;
			const positions: { x: number; y: number }[] = [];

			for (const pieceDef of puzzle.pieces) {
				const w = pieceDef.width || 30;
				const h = pieceDef.height || 30;

				if (currentX + w > maxWidth) {
					currentX = 0;
					currentY += currentRowHeight + gap;
					currentRowHeight = 0;
				}

				positions.push({ x: currentX, y: currentY });
				currentRowHeight = Math.max(currentRowHeight, h);
				currentX += w + gap;
			}

			const totalHeight = currentY + currentRowHeight;
			const startY = puzzle.viewBox.height - totalHeight - padding;

			const pieces: PuzzlePiece[] = puzzle.pieces.map((pieceDef, index) => {
				const pos = positions[index];
				return {
					id: pieceDef.id,
					x: pos.x + padding,
					y: pos.y + startY,
					rotation: 0,
					color: pieceDef.color
				};
			});

			playerState.puzzleState.pieces = pieces;
			playerState.puzzleState.isComplete = false;
			playerState.puzzleState.currentPuzzleId = puzzleId;
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

	validatePuzzle(puzzleId: string, pieces: PuzzlePiece[]): boolean {
		const puzzle = getPuzzleById(puzzleId);
		if (!puzzle) return false;

		// Check if every solution piece has a matching player piece in the correct position
		for (const solPiece of puzzle.pieces) {
			// Find a piece in player's pieces that matches this solution piece
			const match = pieces.find((p) => {
				// Check position (snapped)
				const x = Math.round(p.x / 30) * 30;
				const y = Math.round(p.y / 30) * 30;

				if (x !== solPiece.correctX || y !== solPiece.correctY) return false;
				if (p.rotation !== solPiece.correctRotation) return false;

				// Check if it's the "same" piece (by properties)
				// We look up the definition of the player's piece to compare properties
				const pDef = puzzle.pieces.find((def) => def.id === p.id);
				if (!pDef) return false;

				// Compare shape and color
				return pDef.path === solPiece.path && pDef.color === solPiece.color;
			});

			if (!match) return false;
		}

		return true;
	},

	async markPuzzleComplete() {
		await kmClient.transact([playerStore], ([playerState]) => {
			playerState.puzzleState.isComplete = true;
		});
	}
};
