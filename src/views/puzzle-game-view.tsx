import { getPuzzleById } from '@/assets/puzzles';
import { config } from '@/config';
import { useServerTimer } from '@/hooks/useServerTime';
import { kmClient } from '@/services/km-client';
import { globalActions } from '@/state/actions/global-actions';
import { playerActions } from '@/state/actions/player-actions';
import { globalStore } from '@/state/stores/global-store';
import { playerStore } from '@/state/stores/player-store';
import { KmTimeCountdown } from '@kokimoki/shared';

import * as React from 'react';
import { useSnapshot } from 'valtio';

export const PuzzleGameView: React.FC = () => {
	const serverTime = useServerTimer();
	const { puzzleId, roundStartTime, roundDuration } = useSnapshot(
		globalStore.proxy
	);
	const { pieces, currentPuzzleId } = useSnapshot(
		playerStore.proxy.puzzleState
	);

	const [draggedPiece, setDraggedPiece] = React.useState<string | null>(null);
	const [dragOffset, setDragOffset] = React.useState({ x: 0, y: 0 });
	const [localPiecePosition, setLocalPiecePosition] = React.useState<{
		x: number;
		y: number;
	} | null>(null);
	const svgRef = React.useRef<SVGSVGElement>(null);
	const lastTapRef = React.useRef<{ id: string; time: number } | null>(null);

	const puzzle = React.useMemo(() => getPuzzleById(puzzleId), [puzzleId]);

	const remainingTime = Math.max(
		0,
		roundDuration - (serverTime - roundStartTime)
	);

	// Initialize puzzle pieces on mount
	React.useEffect(() => {
		if (puzzleId && (pieces.length === 0 || currentPuzzleId !== puzzleId)) {
			playerActions.initializePuzzle(puzzleId);
		}
	}, [puzzleId, pieces.length, currentPuzzleId]);

	// Auto-validate when pieces change position
	React.useEffect(() => {
		if (pieces.length === 0 || !puzzleId) return;

		const isValid = playerActions.validatePuzzle(puzzleId, pieces);
		if (isValid) {
			// Puzzle is complete! Mark it and submit
			playerActions.markPuzzleComplete();
			globalActions.submitPuzzleCompletion(kmClient.id);
		}
	}, [pieces, puzzleId]);

	// Auto-submit when time expires
	React.useEffect(() => {
		if (remainingTime <= 0) {
			// Time expired - puzzle is incomplete (0 points)
			// No need to submit, controller will handle scoring
		}
	}, [remainingTime]);

	const handlePointerStart = (
		e: React.PointerEvent<SVGGElement>,
		pieceId: string
	) => {
		e.preventDefault();

		// Double-tap detection for rotation
		const now = Date.now();
		if (
			lastTapRef.current &&
			lastTapRef.current.id === pieceId &&
			now - lastTapRef.current.time < 300
		) {
			handleRotate(pieceId);
			lastTapRef.current = null;
			// Add haptic feedback for rotation
			if (navigator.vibrate) navigator.vibrate(10);
			return;
		}
		lastTapRef.current = { id: pieceId, time: now };

		const svg = svgRef.current;
		if (!svg) return;

		const point = svg.createSVGPoint();
		point.x = e.clientX;
		point.y = e.clientY;
		const svgPoint = point.matrixTransform(svg.getScreenCTM()?.inverse());

		const piece = pieces.find((p) => p.id === pieceId);
		if (piece) {
			setDraggedPiece(pieceId);
			setDragOffset({
				x: svgPoint.x - piece.x,
				y: svgPoint.y - piece.y
			});
			// Capture pointer for consistent drag behavior
			(e.target as SVGElement).setPointerCapture(e.pointerId);
		}
	};

	const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
		if (!draggedPiece) return;
		e.preventDefault();

		const svg = svgRef.current;
		if (!svg) return;

		const point = svg.createSVGPoint();
		point.x = e.clientX;
		point.y = e.clientY;
		const svgPoint = point.matrixTransform(svg.getScreenCTM()?.inverse());

		// Update local state during drag to avoid transaction spam
		setLocalPiecePosition({
			x: svgPoint.x - dragOffset.x,
			y: svgPoint.y - dragOffset.y
		});
	};

	const handlePointerEnd = () => {
		if (draggedPiece && localPiecePosition) {
			// Snap to grid (30px)
			const GRID_SIZE = 30;
			const snappedX = Math.round(localPiecePosition.x / GRID_SIZE) * GRID_SIZE;
			const snappedY = Math.round(localPiecePosition.y / GRID_SIZE) * GRID_SIZE;

			// Save final position to store
			playerActions.updatePiecePosition(draggedPiece, snappedX, snappedY);

			// Haptic feedback on drop
			if (navigator.vibrate) navigator.vibrate(20);
		}
		setDraggedPiece(null);
		setLocalPiecePosition(null);
	};

	const handleRotate = (pieceId: string) => {
		playerActions.rotatePiece(pieceId);
	};

	if (!puzzle) {
		return (
			<div className="flex h-full items-center justify-center">
				<p>{config.loading}</p>
			</div>
		);
	}

	return (
		<div className="flex h-full w-full flex-col gap-2">
			{/* Header Info */}
			<div className="flex items-center justify-between px-2">
				<div className="text-sm text-gray-600">
					{config.puzzleInstructions} (Double-tap to rotate)
				</div>
				<div className="flex items-center gap-2 font-mono font-bold">
					<span className="text-xs text-gray-500">{config.timeRemaining}:</span>
					<KmTimeCountdown ms={remainingTime} />
				</div>
			</div>

			{/* SVG Canvas */}
			<div className="flex-1 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-inner">
				<svg
					ref={svgRef}
					viewBox={`0 0 ${puzzle.viewBox.width} ${puzzle.viewBox.height}`}
					className="h-full w-full touch-none"
					onPointerMove={handlePointerMove}
					onPointerUp={handlePointerEnd}
					onPointerCancel={handlePointerEnd}
				>
					{/* Grid background */}
					<defs>
						<pattern
							id="grid"
							width="30"
							height="30"
							patternUnits="userSpaceOnUse"
						>
							<path
								d="M 30 0 L 0 0 0 30"
								fill="none"
								stroke="#e2e8f0"
								strokeWidth="1"
							/>
						</pattern>
						<filter id="shadow">
							<feDropShadow dx="3" dy="3" stdDeviation="3" floodOpacity="0.3" />
						</filter>
						<filter id="inner-shadow">
							<feOffset dx="2" dy="2" />
							<feGaussianBlur stdDeviation="2" result="offset-blur" />
							<feComposite
								operator="out"
								in="SourceGraphic"
								in2="offset-blur"
								result="inverse"
							/>
							<feFlood floodColor="black" floodOpacity="0.2" result="color" />
							<feComposite
								operator="in"
								in="color"
								in2="inverse"
								result="shadow"
							/>
							<feComposite operator="over" in="shadow" in2="SourceGraphic" />
						</filter>
					</defs>
					<rect width="100%" height="100%" fill="url(#grid)" />

					{/* Target shape outline - Recessed look */}
					<path
						d={puzzle.targetShape}
						fill="rgba(0,0,0,0.05)"
						stroke="#cbd5e1"
						strokeWidth="2"
						filter="url(#inner-shadow)"
					/>

					{/* Puzzle pieces */}
					{[...pieces]
						.sort((a, b) =>
							a.id === draggedPiece ? 1 : b.id === draggedPiece ? -1 : 0
						)
						.map((piece) => {
							const pieceDef = puzzle.pieces.find(
								(p: { id: string }) => p.id === piece.id
							);
							if (!pieceDef) return null;
							const index = puzzle.pieces.findIndex((p) => p.id === piece.id);

							// Use local position during drag, store position otherwise
							const isDragging = draggedPiece === piece.id;
							const displayX =
								isDragging && localPiecePosition
									? localPiecePosition.x
									: piece.x;
							const displayY =
								isDragging && localPiecePosition
									? localPiecePosition.y
									: piece.y;
							const transform = `translate(${displayX}, ${displayY}) rotate(${piece.rotation})`;
							const pieceNumber = index + 1;
							return (
								<g
									key={piece.id}
									onPointerDown={(e) => handlePointerStart(e, piece.id)}
									transform={transform}
									style={{
										cursor: draggedPiece === piece.id ? 'grabbing' : 'grab',
										opacity: draggedPiece === piece.id ? 0.9 : 1,
										transition:
											draggedPiece === piece.id
												? 'none'
												: 'transform 0.1s ease-out',
										filter: draggedPiece === piece.id ? 'url(#shadow)' : 'none',
										zIndex: draggedPiece === piece.id ? 10 : 1
									}}
								>
									<path
										d={pieceDef.path}
										fill={piece.color || '#3b82f6'}
										stroke="rgba(0,0,0,0.2)"
										strokeWidth="1"
										vectorEffect="non-scaling-stroke"
									/>
									{/* Bevel effect highlight */}
									<path
										d={pieceDef.path}
										fill="none"
										stroke="white"
										strokeWidth="2"
										strokeOpacity="0.3"
										style={{ pointerEvents: 'none' }}
									/>

									<text
										x={15}
										y={20}
										fill="white"
										fontSize="16"
										fontWeight="bold"
										textAnchor="middle"
										pointerEvents="none"
										style={{
											userSelect: 'none',
											textShadow: '0 1px 2px rgba(0,0,0,0.5)'
										}}
									>
										{pieceNumber}
									</text>
									{/* Rotation indicator */}
									<text
										x={15}
										y={35}
										fill="rgba(255,255,255,0.8)"
										fontSize="10"
										fontWeight="normal"
										textAnchor="middle"
										pointerEvents="none"
										style={{ userSelect: 'none' }}
									>
										{piece.rotation}°
									</text>
								</g>
							);
						})}
				</svg>
			</div>
		</div>
	);
};
