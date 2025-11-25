import { config } from '@/config';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useGlobalController } from '@/hooks/useGlobalController';
import { useServerTimer } from '@/hooks/useServerTime';
import { generateLink } from '@/kit/generate-link';
import { HostPresenterLayout } from '@/layouts/host-presenter';
import { kmClient } from '@/services/km-client';
import { globalActions } from '@/state/actions/global-actions';
import { type Difficulty, globalStore } from '@/state/stores/global-store';
import { cn } from '@/utils/cn';
import { KmQrCode, KmTimeCountdown } from '@kokimoki/shared';
import * as React from 'react';
import { useSnapshot } from 'valtio';

const App: React.FC = () => {
	useGlobalController();
	const { title } = config;
	useDocumentTitle(title);

	const serverTime = useServerTimer();
	const {
		started,
		gamePhase,
		currentRound,
		totalRounds,
		roundStartTime,
		roundDuration,
		difficulty,
		players
	} = useSnapshot(globalStore.proxy);

	const onlineClientIds = useSnapshot(globalStore.connections).clientIds;

	const [selectedRounds, setSelectedRounds] = React.useState(3);
	const [selectedDifficulty, setSelectedDifficulty] =
		React.useState<Difficulty>('easy');

	if (kmClient.clientContext.mode !== 'host') {
		throw new Error('App host rendered in non-host mode');
	}

	const playerLink = generateLink(kmClient.clientContext.playerCode, {
		mode: 'player'
	});

	const presenterLink = generateLink(kmClient.clientContext.presenterCode, {
		mode: 'presenter',
		playerCode: kmClient.clientContext.playerCode
	});

	const handleStartGame = () => {
		globalActions.startGame(selectedRounds, selectedDifficulty);
	};

	const handleStopGame = () => {
		globalActions.stopGame();
	};

	const handleResetGame = () => {
		globalActions.resetGame();
	};

	const remainingTime =
		gamePhase === 'playing'
			? Math.max(0, roundDuration - (serverTime - roundStartTime))
			: 0;

	// Get player list with status
	const playersList = React.useMemo(() => {
		return Object.entries(players).map(([clientId, player]) => ({
			clientId,
			name: player.name,
			isOnline: onlineClientIds.has(clientId),
			isComplete: !!player.completedAt && player.completedAt > 0,
			totalScore: player.totalScore
		}));
	}, [players, onlineClientIds]);

	return (
		<HostPresenterLayout.Root>
			<HostPresenterLayout.Header>
				<div className="flex items-center justify-between">
					<div className="text-sm opacity-70">{config.hostLabel}</div>
					{started && gamePhase === 'playing' && (
						<div className="text-lg font-bold">
							{config.round} {currentRound} {config.of} {totalRounds}
						</div>
					)}
				</div>
			</HostPresenterLayout.Header>

			<HostPresenterLayout.Main>
				{/* Game Links */}
				<div className="rounded-lg border border-gray-200 bg-white shadow-md">
					<div className="flex flex-col gap-2 p-6">
						<h2 className="text-xl font-bold">{config.gameLinksTitle}</h2>
						<KmQrCode data={playerLink} size={200} interactive={false} />
						<div className="flex gap-2">
							<a
								href={playerLink}
								target="_blank"
								rel="noreferrer"
								className="break-all text-blue-600 underline hover:text-blue-700"
							>
								{config.playerLinkLabel}
							</a>
							|
							<a
								href={presenterLink}
								target="_blank"
								rel="noreferrer"
								className="break-all text-blue-600 underline hover:text-blue-700"
							>
								{config.presenterLinkLabel}
							</a>
						</div>
					</div>
				</div>

				{/* Game Controls */}
				{!started && (
					<div className="rounded-lg border border-gray-200 bg-white p-6 shadow-md">
						<h2 className="mb-4 text-xl font-bold">{config.gameSettings}</h2>

						<div className="flex flex-col gap-4">
							<div>
								<label className="mb-2 block text-sm font-semibold">
									{config.numberOfRounds}
								</label>
								<select
									value={selectedRounds}
									onChange={(e) => setSelectedRounds(Number(e.target.value))}
									className="w-full rounded border border-gray-300 px-4 py-2"
								>
									<option value={3}>3 {config.rounds}</option>
									<option value={5}>5 {config.rounds}</option>
									<option value={7}>7 {config.rounds}</option>
								</select>
							</div>

							<div>
								<label className="mb-2 block text-sm font-semibold">
									{config.startingDifficulty}
								</label>
								<select
									value={selectedDifficulty}
									onChange={(e) =>
										setSelectedDifficulty(e.target.value as Difficulty)
									}
									className="w-full rounded border border-gray-300 px-4 py-2"
								>
									<option value="easy">{config.easy}</option>
									<option value="medium">{config.medium}</option>
									<option value="hard">{config.hard}</option>
								</select>
							</div>

							<button
								onClick={handleStartGame}
								className="w-full rounded-lg bg-green-600 py-3 text-lg font-bold text-white hover:bg-green-700"
								disabled={playersList.length === 0}
							>
								{config.startButton}
							</button>
						</div>
					</div>
				)}

				{started && (
					<>
						{/* Game Status */}
						<div className="rounded-lg border border-gray-200 bg-white p-6 shadow-md">
							<h2 className="mb-4 text-xl font-bold">{config.gameStatus}</h2>

							<div className="flex flex-col gap-3">
								<div className="flex justify-between">
									<span className="font-semibold">{config.phase}:</span>
									<span className="capitalize">{gamePhase}</span>
								</div>
								<div className="flex justify-between">
									<span className="font-semibold">{config.difficulty}:</span>
									<span className="capitalize">{difficulty}</span>
								</div>
								{gamePhase === 'playing' && (
									<div className="flex justify-between">
										<span className="font-semibold">
											{config.timeRemaining}:
										</span>
										<span className="font-mono text-lg">
											<KmTimeCountdown ms={remainingTime} />
										</span>
									</div>
								)}
							</div>

							<div className="mt-4 flex gap-2">
								<button
									onClick={handleStopGame}
									className="flex-1 rounded-lg bg-red-600 py-2 text-white hover:bg-red-700"
								>
									{config.stopButton}
								</button>
								<button
									onClick={handleResetGame}
									className="flex-1 rounded-lg bg-gray-600 py-2 text-white hover:bg-gray-700"
								>
									{config.resetButton}
								</button>
							</div>
						</div>

						{/* Player Progress */}
						<div className="rounded-lg border border-gray-200 bg-white p-6 shadow-md">
							<h2 className="mb-4 text-xl font-bold">
								{config.playerProgress}
							</h2>

							<div className="overflow-auto">
								<table className="w-full">
									<thead className="border-b">
										<tr>
											<th className="px-4 py-2 text-left text-sm font-semibold">
												{config.playerName}
											</th>
											<th className="px-4 py-2 text-center text-sm font-semibold">
												{config.status}
											</th>
											<th className="px-4 py-2 text-right text-sm font-semibold">
												{config.totalScore}
											</th>
										</tr>
									</thead>
									<tbody>
										{playersList.map((player) => (
											<tr key={player.clientId} className="border-b">
												<td className="px-4 py-2 text-sm">
													{player.name}
													{!player.isOnline && (
														<span className="ml-2 text-xs text-gray-400">
															({config.offline})
														</span>
													)}
												</td>
												<td className="px-4 py-2 text-center text-sm">
													{gamePhase === 'playing' ? (
														player.isComplete ? (
															<span className="rounded bg-green-100 px-2 py-1 text-xs font-semibold text-green-800">
																{config.completed}
															</span>
														) : (
															<span className="rounded bg-yellow-100 px-2 py-1 text-xs font-semibold text-yellow-800">
																{config.playing}
															</span>
														)
													) : (
														<span className="text-gray-400">-</span>
													)}
												</td>
												<td className="px-4 py-2 text-right text-sm font-bold">
													{player.totalScore}
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>
					</>
				)}

				{/* Players List (Lobby) */}
				{!started && playersList.length > 0 && (
					<div className="rounded-lg border border-gray-200 bg-white p-6 shadow-md">
						<h2 className="mb-4 text-xl font-bold">
							{config.players} ({playersList.length})
						</h2>
						<ul className="space-y-2">
							{playersList.map((player) => (
								<li
									key={player.clientId}
									className="flex items-center justify-between rounded border p-3"
								>
									<span className="font-medium">{player.name}</span>
									<span
										className={cn(
											'text-xs font-semibold',
											player.isOnline ? 'text-green-600' : 'text-gray-400'
										)}
									>
										{player.isOnline ? config.online : config.offline}
									</span>
								</li>
							))}
						</ul>
					</div>
				)}
			</HostPresenterLayout.Main>
		</HostPresenterLayout.Root>
	);
};

export default App;
