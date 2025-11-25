import { getPuzzleByDifficulty } from '@/assets/puzzles';
import { kmClient } from '@/services/km-client';
import type { Difficulty } from '../stores/global-store';
import { globalStore } from '../stores/global-store';

export const globalActions = {
	async startGame(totalRounds: number = 3, difficulty: Difficulty = 'easy') {
		const puzzle = getPuzzleByDifficulty(difficulty, []);
		await kmClient.transact([globalStore], ([globalState]) => {
			globalState.started = true;
			globalState.startTimestamp = kmClient.serverTimestamp();
			globalState.gamePhase = 'playing';
			globalState.currentRound = 1;
			globalState.totalRounds = totalRounds;
			globalState.roundStartTime = kmClient.serverTimestamp();
			globalState.difficulty = difficulty;
			globalState.puzzleId = puzzle.id;
			globalState.usedPuzzleIds = [puzzle.id];

			// Reset all player scores and completion times
			for (const clientId in globalState.players) {
				globalState.players[clientId].totalScore = 0;
				globalState.players[clientId].roundScores = [];
				delete globalState.players[clientId].completedAt;
			}
		});
	},

	async startRound(difficulty: Difficulty) {
		const puzzle = getPuzzleByDifficulty(
			difficulty,
			globalStore.proxy.usedPuzzleIds
		);
		await kmClient.transact([globalStore], ([globalState]) => {
			globalState.gamePhase = 'playing';
			globalState.roundStartTime = kmClient.serverTimestamp();
			globalState.difficulty = difficulty;
			globalState.puzzleId = puzzle.id;
			globalState.usedPuzzleIds.push(puzzle.id);

			// Clear completion times for new round
			for (const clientId in globalState.players) {
				delete globalState.players[clientId].completedAt;
			}
		});
	},

	async endRound() {
		await kmClient.transact([globalStore], ([globalState]) => {
			const serverTime = kmClient.serverTimestamp();

			// Calculate scores for all players
			for (const clientId in globalState.players) {
				const player = globalState.players[clientId];
				let roundScore = 0;

				if (player.completedAt && player.completedAt > 0) {
					const completionTimeMs =
						player.completedAt - globalState.roundStartTime;
					const completionTimeSec = Math.floor(completionTimeMs / 1000);
					roundScore = Math.max(0, 1000 - completionTimeSec * 10);
				}

				player.roundScores.push(roundScore);
				player.totalScore += roundScore;
			}

			globalState.gamePhase = 'roundResults';
		});
	},

	async nextRound() {
		await kmClient.transact([globalStore], ([globalState]) => {
			globalState.currentRound += 1;

			if (globalState.currentRound > globalState.totalRounds) {
				globalState.gamePhase = 'finalResults';
				globalState.started = false;
			} else {
				// Start next round with random difficulty
				const difficulties: Difficulty[] = ['easy', 'medium', 'hard'];
				const randomDifficulty =
					difficulties[Math.floor(Math.random() * difficulties.length)];
				const puzzle = getPuzzleByDifficulty(
					randomDifficulty,
					globalState.usedPuzzleIds
				);

				globalState.gamePhase = 'playing';
				globalState.roundStartTime = kmClient.serverTimestamp();
				globalState.difficulty = randomDifficulty;
				globalState.puzzleId = puzzle.id;
				globalState.usedPuzzleIds.push(puzzle.id);

				// Clear completion times for new round
				for (const clientId in globalState.players) {
					delete globalState.players[clientId].completedAt;
				}
			}
		});
	},

	async submitPuzzleCompletion(clientId: string) {
		await kmClient.transact([globalStore], ([globalState]) => {
			if (
				globalState.players[clientId] &&
				!globalState.players[clientId].completedAt
			) {
				globalState.players[clientId].completedAt = kmClient.serverTimestamp();
			}
		});
	},

	async resetGame() {
		await kmClient.transact([globalStore], ([globalState]) => {
			globalState.started = false;
			globalState.startTimestamp = 0;
			globalState.gamePhase = 'lobby';
			globalState.currentRound = 0;
			globalState.roundStartTime = 0;
			globalState.puzzleId = '';
			globalState.usedPuzzleIds = [];

			// Reset all player scores
			for (const clientId in globalState.players) {
				globalState.players[clientId].totalScore = 0;
				globalState.players[clientId].roundScores = [];
				delete globalState.players[clientId].completedAt;
			}
		});
	},

	async stopGame() {
		await kmClient.transact([globalStore], ([globalState]) => {
			globalState.started = false;
			globalState.startTimestamp = 0;
			globalState.gamePhase = 'lobby';
		});
	}
};
