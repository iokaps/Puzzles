import { kmClient } from '@/services/km-client';
import { globalActions } from '@/state/actions/global-actions';
import { globalStore } from '@/state/stores/global-store';
import { useEffect } from 'react';
import { useSnapshot } from 'valtio';
import { useServerTimer } from './useServerTime';

export function useGlobalController() {
	const { controllerConnectionId } = useSnapshot(globalStore.proxy);
	const connections = useSnapshot(globalStore.connections);
	const connectionIds = connections.connectionIds;
	const isGlobalController = controllerConnectionId === kmClient.connectionId;
	const serverTime = useServerTimer(1000); // tick every second

	// Maintain connection that is assigned to be the global controller
	useEffect(() => {
		// Check if global controller is online
		if (connectionIds.has(controllerConnectionId)) {
			return;
		}

		// Select new host, sorting by connection id
		kmClient
			.transact([globalStore], ([globalState]) => {
				const connectionIdsArray = Array.from(connectionIds);
				connectionIdsArray.sort();
				globalState.controllerConnectionId = connectionIdsArray[0] || '';
			})
			.then(() => {})
			.catch(() => {});
	}, [connectionIds, controllerConnectionId]);

	// Run global controller-specific logic
	useEffect(() => {
		if (!isGlobalController) {
			return;
		}

		const handleRoundLogic = async () => {
			const {
				gamePhase,
				roundStartTime,
				roundDuration,
				currentRound,
				totalRounds
			} = globalStore.proxy;

			// Auto-end round when time expires
			if (gamePhase === 'playing') {
				const elapsed = serverTime - roundStartTime;
				if (elapsed >= roundDuration) {
					await globalActions.endRound();
				}
			}
		};

		handleRoundLogic().catch(console.error);
	}, [isGlobalController, serverTime]);

	// Auto-advance from round results to next round
	useEffect(() => {
		if (!isGlobalController) {
			return;
		}

		const { gamePhase } = globalStore.proxy;

		if (gamePhase === 'roundResults') {
			// Wait 10 seconds before advancing
			const timer = setTimeout(() => {
				globalActions.nextRound().catch(console.error);
			}, 10000);

			return () => clearTimeout(timer);
		}
	}, [isGlobalController, globalStore.proxy.gamePhase]);

	return isGlobalController;
}
