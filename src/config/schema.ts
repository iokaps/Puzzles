import { z } from 'zod/v4';

export const schema = z.object({
	// translations
	title: z.string().default('Puzzle Game'),

	gameLobbyMd: z
		.string()
		.default(
			'# Waiting for game to start...\nThe game will start once the host presses the start button.'
		),
	connectionsMd: z.string().default('# Connections example'),
	sharedStateMd: z.string().default('# Shared State example'),

	players: z.string().default('Players'),
	timeElapsed: z.string().default('Time elapsed'),
	timeRemaining: z.string().default('Time Remaining'),
	startButton: z.string().default('Start Game'),
	stopButton: z.string().default('Stop Game'),
	resetButton: z.string().default('Reset Game'),
	loading: z.string().default('Loading...'),

	menuTitle: z.string().default('Menu'),
	menuConnections: z.string().default('Connections'),
	menuGameLobby: z.string().default('Lobby'),

	playerNameTitle: z.string().default('Enter Your Name'),
	playerNamePlaceholder: z.string().default('Your name...'),
	playerNameLabel: z.string().default('Name:'),
	playerNameButton: z.string().default('Continue'),

	hostLabel: z.string().default('Host'),
	presenterLabel: z.string().default('Presenter'),

	gameLinksTitle: z.string().default('Game Links'),
	playerLinkLabel: z.string().default('Player Link'),
	presenterLinkLabel: z.string().default('Presenter Link'),

	menuAriaLabel: z.string().default('Open menu drawer'),

	// Puzzle game specific
	puzzleInstructions: z
		.string()
		.default('Drag and rotate pieces to match the shape above'),
	rotateButton: z.string().default('Rotate'),

	// Game settings
	gameSettings: z.string().default('Game Settings'),
	numberOfRounds: z.string().default('Number of Rounds'),
	rounds: z.string().default('Rounds'),
	round: z.string().default('Round'),
	of: z.string().default('of'),
	startingDifficulty: z.string().default('Starting Difficulty'),
	easy: z.string().default('Easy (3 pieces)'),
	medium: z.string().default('Medium (4 pieces)'),
	hard: z.string().default('Hard (5 pieces)'),
	expert: z.string().default('Expert (8+ pieces)'),

	// Game status
	gameStatus: z.string().default('Game Status'),
	phase: z.string().default('Phase'),
	difficulty: z.string().default('Difficulty'),
	playerProgress: z.string().default('Player Progress'),
	playerName: z.string().default('Player Name'),
	status: z.string().default('Status'),
	online: z.string().default('Online'),
	offline: z.string().default('Offline'),
	completed: z.string().default('Completed'),
	playing: z.string().default('Playing'),

	// Scoring
	points: z.string().default('points'),
	totalScore: z.string().default('Total Score'),
	roundScore: z.string().default('Round Score'),
	rank: z.string().default('Rank'),

	// Results
	roundResultsTitle: z.string().default('Round Results'),
	finalResultsTitle: z.string().default('Final Results'),
	roundWinner: z.string().default('Round Winner'),
	congratulations: z.string().default('Congratulations!'),
	fullLeaderboard: z.string().default('Full Leaderboard'),
	gameComplete: z.string().default('Game Complete'),
	nextRoundStarting: z.string().default('Next round starting...'),
	viewingFinalResults: z.string().default('Viewing final results'),

	// Presenter
	joinGameTitle: z.string().default('Join the Game!'),
	scanToJoin: z.string().default('Scan QR code to join'),
	leaderboard: z.string().default('Leaderboard')
});

export type Config = z.infer<typeof schema>;
