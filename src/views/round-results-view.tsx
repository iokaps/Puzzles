import { config } from '@/config';
import { globalStore } from '@/state/stores/global-store';
import { cn } from '@/utils/cn';
import * as React from 'react';
import { useSnapshot } from 'valtio';

export const RoundResultsView: React.FC = () => {
	const { players, currentRound, totalRounds } = useSnapshot(globalStore.proxy);

	// Sort players by round score
	const sortedPlayers = React.useMemo(() => {
		return Object.entries(players)
			.map(([clientId, player]) => ({
				clientId,
				name: player.name,
				roundScore: player.roundScores[player.roundScores.length - 1] || 0,
				totalScore: player.totalScore
			}))
			.sort((a, b) => b.roundScore - a.roundScore);
	}, [players]);

	const winner = sortedPlayers[0];

	return (
		<div className="flex h-full w-full flex-col gap-6 p-4">
			<div className="text-center">
				<h2 className="text-2xl font-bold">
					{config.roundResultsTitle} {currentRound}
				</h2>
			</div>

			{/* Winner */}
			{winner && winner.roundScore > 0 && (
				<div className="rounded-lg bg-gradient-to-r from-yellow-400 to-orange-400 p-6 text-center shadow-lg">
					<div className="text-sm font-semibold text-white opacity-90">
						{config.roundWinner}
					</div>
					<div className="text-3xl font-bold text-white">{winner.name}</div>
					<div className="text-xl text-white">
						{winner.roundScore} {config.points}
					</div>
				</div>
			)}

			{/* Scores Table */}
			<div className="flex-1 overflow-auto">
				<div className="rounded-lg border border-gray-200 bg-white shadow-md">
					<table className="w-full">
						<thead className="border-b bg-gray-50">
							<tr>
								<th className="px-4 py-3 text-left text-sm font-semibold">
									{config.rank}
								</th>
								<th className="px-4 py-3 text-left text-sm font-semibold">
									{config.playerName}
								</th>
								<th className="px-4 py-3 text-right text-sm font-semibold">
									{config.roundScore}
								</th>
								<th className="px-4 py-3 text-right text-sm font-semibold">
									{config.totalScore}
								</th>
							</tr>
						</thead>
						<tbody>
							{sortedPlayers.map((player, index) => (
								<tr
									key={player.clientId}
									className={cn(
										'border-b last:border-b-0',
										index < 3 && 'bg-yellow-50'
									)}
								>
									<td className="px-4 py-3 text-sm font-medium">{index + 1}</td>
									<td className="px-4 py-3 text-sm">{player.name}</td>
									<td className="px-4 py-3 text-right text-sm font-semibold">
										+{player.roundScore}
									</td>
									<td className="px-4 py-3 text-right text-sm font-bold">
										{player.totalScore}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>

			{/* Next Round Info */}
			<div className="text-center">
				{currentRound < totalRounds ? (
					<>
						<div className="text-lg font-semibold">
							{config.nextRoundStarting}
						</div>
						<div className="text-sm text-gray-600">
							{config.round} {currentRound + 1} {config.of} {totalRounds}
						</div>
					</>
				) : (
					<div className="text-lg font-semibold">
						{config.viewingFinalResults}
					</div>
				)}
			</div>
		</div>
	);
};
