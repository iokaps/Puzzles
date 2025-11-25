import { PlayerMenu } from '@/components/player/menu';
import { NameLabel } from '@/components/player/name-label';
import { config } from '@/config';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useGlobalController } from '@/hooks/useGlobalController';
import { PlayerLayout } from '@/layouts/player';
import { playerActions } from '@/state/actions/player-actions';
import { globalStore } from '@/state/stores/global-store';
import { playerStore } from '@/state/stores/player-store';
import { ConnectionsView } from '@/views/connections-view';
import { CreateProfileView } from '@/views/create-profile-view';
import { FinalResultsView } from '@/views/final-results-view';
import { GameLobbyView } from '@/views/game-lobby-view';
import { PuzzleGameView } from '@/views/puzzle-game-view';
import { RoundResultsView } from '@/views/round-results-view';
import { KmModalProvider } from '@kokimoki/shared';
import * as React from 'react';
import { useSnapshot } from 'valtio';

const App: React.FC = () => {
	const { title } = config;
	const { name, currentView } = useSnapshot(playerStore.proxy);
	const { started, gamePhase } = useSnapshot(globalStore.proxy);

	useGlobalController();
	useDocumentTitle(title);

	React.useEffect(() => {
		// Route based on game phase
		if (started) {
			if (gamePhase === 'playing') {
				playerActions.setCurrentView('puzzle');
			} else if (gamePhase === 'roundResults') {
				playerActions.setCurrentView('roundResults');
			} else if (gamePhase === 'finalResults') {
				playerActions.setCurrentView('finalResults');
			}
		} else {
			playerActions.setCurrentView('lobby');
		}
	}, [started, gamePhase]);

	if (!name) {
		return (
			<PlayerLayout.Root>
				<PlayerLayout.Header />
				<PlayerLayout.Main>
					<CreateProfileView />
				</PlayerLayout.Main>
			</PlayerLayout.Root>
		);
	}

	if (!started) {
		return (
			<KmModalProvider>
				<PlayerLayout.Root>
					<PlayerLayout.Header>
						<PlayerMenu />
					</PlayerLayout.Header>

					<PlayerLayout.Main>
						{currentView === 'lobby' && <GameLobbyView />}
						{currentView === 'connections' && <ConnectionsView />}
					</PlayerLayout.Main>

					<PlayerLayout.Footer>
						<NameLabel name={name} />
					</PlayerLayout.Footer>
				</PlayerLayout.Root>
			</KmModalProvider>
		);
	}

	return (
		<PlayerLayout.Root>
			<PlayerLayout.Header />

			<PlayerLayout.Main>
				{currentView === 'puzzle' && <PuzzleGameView />}
				{currentView === 'roundResults' && <RoundResultsView />}
				{currentView === 'finalResults' && <FinalResultsView />}
			</PlayerLayout.Main>

			<PlayerLayout.Footer>
				<NameLabel name={name} />
			</PlayerLayout.Footer>
		</PlayerLayout.Root>
	);
};

export default App;
