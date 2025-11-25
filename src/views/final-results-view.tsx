import { config } from '@/config';
import { globalStore } from '@/state/stores/global-store';
import { cn } from '@/utils/cn';
import { KmConfettiProvider, KmPodiumTable } from '@kokimoki/shared';
import * as React from 'react';
import { useSnapshot } from 'valtio';

export const FinalResultsView: React.FC = () => {
	const { players } = useSnapshot(globalStore.proxy);

	// Sort players by total score
	const sortedPlayers = React.useMemo(() => {
		return Object.entries(players)
			.map(([clientId, player]) => ({
				clientId,
				name: player.name,
				totalScore: player.totalScore,
				roundScores: player.roundScores
			}))
			.sort((a, b) => b.totalScore - a.totalScore);
	}, [players]);

	const topThree = sortedPlayers.slice(0, 3);

	return (
		<KmConfettiProvider>
			<div className="flex h-full w-full flex-col gap-6 p-4">
				<div className="text-center">
					<h2 className="text-3xl font-bold">{config.finalResultsTitle}</h2>
					<p className="text-gray-600">{config.congratulations}</p>
				</div>

				{/* Podium for Top 3 */}
				{topThree.length > 0 && (
					<div className="flex justify-center">
						<KmPodiumTable
							entries={topThree.map((player, index) => ({
								id: player.clientId,
								name: player.name,
								value: player.totalScore.toString(),
								points: player.totalScore,
								rank: index + 1
							}))}
						/>
					</div>
				)}

				{/* Full Leaderboard */}
				<div className="flex-1 overflow-auto">
					<div className="rounded-lg border border-gray-200 bg-white shadow-md">
						<div className="border-b bg-gray-50 px-4 py-3">
							<h3 className="text-lg font-semibold">
								{config.fullLeaderboard}
							</h3>
						</div>
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
											index === 0 && 'bg-yellow-50',
											index === 1 && 'bg-gray-50',
											index === 2 && 'bg-orange-50'
										)}
									>
										<td className="px-4 py-3">
											<div className="flex items-center gap-2">
												{index === 0 && <span className="text-2xl">🥇</span>}
												{index === 1 && <span className="text-2xl">🥈</span>}
												{index === 2 && <span className="text-2xl">🥉</span>}
												<span className="text-sm font-medium">{index + 1}</span>
											</div>
										</td>
										<td className="px-4 py-3 text-sm font-medium">
											{player.name}
										</td>
										<td className="px-4 py-3 text-right text-lg font-bold">
											{player.totalScore}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>

				{/* Round Scores Breakdown */}
				<div className="text-center text-sm text-gray-500">
					{config.gameComplete}
				</div>
			</div>
		</KmConfettiProvider>
	);
};
