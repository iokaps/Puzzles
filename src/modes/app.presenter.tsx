import { config } from '@/config';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useGlobalController } from '@/hooks/useGlobalController';
import { useServerTimer } from '@/hooks/useServerTime';
import { generateLink } from '@/kit/generate-link';
import { HostPresenterLayout } from '@/layouts/host-presenter';
import { kmClient } from '@/services/km-client';
import { globalStore } from '@/state/stores/global-store';
import { cn } from '@/utils/cn';
import { KmQrCode, KmTimeCountdown } from '@kokimoki/shared';
import * as React from 'react';
import { useSnapshot } from 'valtio';

const App: React.FC = () => {
	const { title } = config;

	useGlobalController();
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

	if (kmClient.clientContext.mode !== 'presenter') {
		throw new Error('App presenter rendered in non-presenter mode');
	}

	const playerLink = generateLink(kmClient.clientContext.playerCode, {
		mode: 'player'
	});

	const remainingTime =
		gamePhase === 'playing'
			? Math.max(0, roundDuration - (serverTime - roundStartTime))
			: 0;

	// Get sorted player list
	const sortedPlayers = React.useMemo(() => {
		return Object.entries(players)
			.map(([clientId, player]) => ({
				clientId,
				name: player.name,
				totalScore: player.totalScore,
				isComplete: !!player.completedAt && player.completedAt > 0
			}))
			.sort((a, b) => b.totalScore - a.totalScore);
	}, [players]);

	return (
		<HostPresenterLayout.Root>
			<HostPresenterLayout.Header>
				<div className="flex items-center justify-between">
					<div className="text-2xl font-bold">{title}</div>
					<div className="text-sm opacity-70">{config.presenterLabel}</div>
				</div>
			</HostPresenterLayout.Header>

			<HostPresenterLayout.Main>
				{/* Lobby View - Show QR Code */}
				{!started && (
					<div className="rounded-lg border border-gray-200 bg-white shadow-md">
						<div className="flex flex-col items-center gap-6 p-8">
							<h2 className="text-3xl font-bold">{config.joinGameTitle}</h2>
							<KmQrCode data={playerLink} size={300} interactive={false} />
							<p className="text-xl text-gray-600">{config.scanToJoin}</p>
							<div className="text-lg">
								{config.players}: {sortedPlayers.length}
							</div>
						</div>
					</div>
				)}

				{/* Playing View - Show Timer and Leaderboard */}
				{started && gamePhase === 'playing' && (
					<>
						<div className="rounded-lg border border-gray-200 bg-white p-8 shadow-md">
							<div className="text-center">
								<h2 className="mb-4 text-4xl font-bold">
									{config.round} {currentRound} {config.of} {totalRounds}
								</h2>
								<div className="mb-2 text-2xl font-semibold">
									{config.difficulty}:{' '}
									<span className="capitalize">{difficulty}</span>
								</div>
								<div className="font-mono text-6xl font-bold text-blue-600">
									<KmTimeCountdown ms={remainingTime} />
								</div>
							</div>
						</div>

						<div className="rounded-lg border border-gray-200 bg-white p-6 shadow-md">
							<h3 className="mb-4 text-2xl font-bold">{config.leaderboard}</h3>
							<div className="overflow-auto">
								<table className="w-full">
									<thead className="border-b">
										<tr>
											<th className="px-6 py-3 text-left text-lg font-semibold">
												{config.rank}
											</th>
											<th className="px-6 py-3 text-left text-lg font-semibold">
												{config.playerName}
											</th>
											<th className="px-6 py-3 text-center text-lg font-semibold">
												{config.status}
											</th>
											<th className="px-6 py-3 text-right text-lg font-semibold">
												{config.totalScore}
											</th>
										</tr>
									</thead>
									<tbody>
										{sortedPlayers.map((player, index) => (
											<tr
												key={player.clientId}
												className={cn('border-b', index < 3 && 'bg-yellow-50')}
											>
												<td className="px-6 py-4 text-lg font-medium">
													{index + 1}
												</td>
												<td className="px-6 py-4 text-lg font-medium">
													{player.name}
												</td>
												<td className="px-6 py-4 text-center">
													{player.isComplete ? (
														<span className="rounded bg-green-100 px-3 py-1 text-sm font-semibold text-green-800">
															{config.completed}
														</span>
													) : (
														<span className="rounded bg-yellow-100 px-3 py-1 text-sm font-semibold text-yellow-800">
															{config.playing}
														</span>
													)}
												</td>
												<td className="px-6 py-4 text-right text-xl font-bold">
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

				{/* Round Results View */}
				{started && gamePhase === 'roundResults' && (
					<div className="rounded-lg border border-gray-200 bg-white p-8 shadow-md">
						<h2 className="mb-6 text-center text-4xl font-bold">
							{config.roundResultsTitle} {currentRound}
						</h2>

						<div className="overflow-auto">
							<table className="w-full">
								<thead className="border-b">
									<tr>
										<th className="px-6 py-3 text-left text-lg font-semibold">
											{config.rank}
										</th>
										<th className="px-6 py-3 text-left text-lg font-semibold">
											{config.playerName}
										</th>
										<th className="px-6 py-3 text-right text-lg font-semibold">
											{config.totalScore}
										</th>
									</tr>
								</thead>
								<tbody>
									{sortedPlayers.map((player, index) => (
										<tr
											key={player.clientId}
											className={cn('border-b', index < 3 && 'bg-yellow-50')}
										>
											<td className="px-6 py-4 text-xl font-bold">
												{index === 0 && '🥇'}
												{index === 1 && '🥈'}
												{index === 2 && '🥉'}
												{index > 2 && index + 1}
											</td>
											<td className="px-6 py-4 text-xl font-medium">
												{player.name}
											</td>
											<td className="px-6 py-4 text-right text-2xl font-bold">
												{player.totalScore}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				)}

				{/* Final Results View */}
				{started && gamePhase === 'finalResults' && (
					<div className="rounded-lg border border-gray-200 bg-white p-8 shadow-md">
						<h2 className="mb-8 text-center text-5xl font-bold">
							{config.finalResultsTitle}
						</h2>

						{sortedPlayers[0] && (
							<div className="mb-8 text-center">
								<div className="mb-4 text-6xl">🏆</div>
								<div className="text-4xl font-bold">
									{sortedPlayers[0].name}
								</div>
								<div className="text-3xl font-bold text-blue-600">
									{sortedPlayers[0].totalScore} {config.points}
								</div>
							</div>
						)}

						<div className="overflow-auto">
							<table className="w-full">
								<thead className="border-b">
									<tr>
										<th className="px-6 py-3 text-left text-lg font-semibold">
											{config.rank}
										</th>
										<th className="px-6 py-3 text-left text-lg font-semibold">
											{config.playerName}
										</th>
										<th className="px-6 py-3 text-right text-lg font-semibold">
											{config.totalScore}
										</th>
									</tr>
								</thead>
								<tbody>
									{sortedPlayers.map((player, index) => (
										<tr
											key={player.clientId}
											className={cn(
												'border-b',
												index === 0 && 'bg-yellow-100',
												index === 1 && 'bg-gray-100',
												index === 2 && 'bg-orange-100'
											)}
										>
											<td className="px-6 py-4 text-xl font-bold">
												{index === 0 && '🥇'}
												{index === 1 && '🥈'}
												{index === 2 && '🥉'}
												{index > 2 && index + 1}
											</td>
											<td className="px-6 py-4 text-xl font-medium">
												{player.name}
											</td>
											<td className="px-6 py-4 text-right text-2xl font-bold">
												{player.totalScore}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				)}
			</HostPresenterLayout.Main>
		</HostPresenterLayout.Root>
	);
};

export default App;
