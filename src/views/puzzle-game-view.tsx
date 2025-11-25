import { getPuzzleById } from '@/assets/puzzles';
import { config } from '@/config';
import { useServerTimer } from '@/hooks/useServerTime';
import { kmClient } from '@/services/km-client';
import { globalActions } from '@/state/actions/global-actions';
import { playerActions } from '@/state/actions/player-actions';
import { globalStore } from '@/state/stores/global-store';
import { playerStore } from '@/state/stores/player-store';
import { KmTimeCountdown } from '@kokimoki/shared';
import { RotateCw } from 'lucide-react';

import * as React from 'react';
import { useSnapshot } from 'valtio';

export const PuzzleGameView: React.FC = () => {
	const serverTime = useServerTimer();
	const { puzzleId, roundStartTime, roundDuration } = useSnapshot(
		globalStore.proxy
	);
	const { pieces } = useSnapshot(playerStore.proxy.puzzleState);

	const [draggedPiece, setDraggedPiece] = React.useState<string | null>(null);
	const [dragOffset, setDragOffset] = React.useState({ x: 0, y: 0 });
	const [localPiecePosition, setLocalPiecePosition] = React.useState<{
		x: number;
		y: number;
	} | null>(null);
	const svgRef = React.useRef<SVGSVGElement>(null);

	const puzzle = React.useMemo(() => getPuzzleById(puzzleId), [puzzleId]);

	const remainingTime = Math.max(
		0,
		roundDuration - (serverTime - roundStartTime)
	);

	// Initialize puzzle pieces on mount
	React.useEffect(() => {
		if (puzzleId && pieces.length === 0) {
			playerActions.initializePuzzle(puzzleId);
		}
	}, [puzzleId, pieces.length]);

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
			// Save final position to store
			playerActions.updatePiecePosition(
				draggedPiece,
				localPiecePosition.x,
				localPiecePosition.y
			);
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
		<div className="flex h-full w-full flex-col gap-4">
			{/* Timer */}
			<div className="text-center">
				<div className="text-lg font-bold">{config.timeRemaining}</div>
				<div className="font-mono text-2xl">
					<KmTimeCountdown ms={remainingTime} />
				</div>
			</div>

			{/* SVG Canvas */}
			<div className="flex-1 overflow-hidden">
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
					</defs>
					<rect width="100%" height="100%" fill="url(#grid)" />

					{/* Target shape outline */}
					<path
						d={puzzle.targetShape}
						fill="none"
						stroke="#3b82f6"
						strokeWidth="3"
						strokeDasharray="8,4"
						opacity="0.7"
					/>

					{/* Puzzle pieces */}
					{pieces.map((piece, index) => {
						const pieceDef = puzzle.pieces.find(
							(p: { id: string }) => p.id === piece.id
						);
						if (!pieceDef) return null;

						// Use local position during drag, store position otherwise
						const isDragging = draggedPiece === piece.id;
						const displayX =
							isDragging && localPiecePosition ? localPiecePosition.x : piece.x;
						const displayY =
							isDragging && localPiecePosition ? localPiecePosition.y : piece.y;
						const transform = `translate(${displayX}, ${displayY}) rotate(${piece.rotation}) scale(${piece.flipH ? -1 : 1}, ${piece.flipV ? -1 : 1})`;
						const pieceNumber = index + 1;
						return (
							<g
								key={piece.id}
								onPointerDown={(e) => handlePointerStart(e, piece.id)}
								style={{
									cursor: draggedPiece === piece.id ? 'grabbing' : 'grab'
								}}
							>
								<path
									d={pieceDef.path}
									fill="#3b82f6"
									stroke="#1e40af"
									strokeWidth="2"
									transform={transform}
									opacity={draggedPiece === piece.id ? 0.7 : 1}
								/>
								{/* Show correct position indicator */}
								<circle
									cx={pieceDef.correctX}
									cy={pieceDef.correctY}
									r="5"
									fill="rgba(34, 197, 94, 0.3)"
									stroke="#22c55e"
									strokeWidth="2"
									pointerEvents="none"
								/>
								<text
									x={piece.x + 15}
									y={piece.y + 15}
									fill="white"
									fontSize="24"
									fontWeight="bold"
									stroke="#1e40af"
									strokeWidth="1"
									pointerEvents="none"
									style={{ userSelect: 'none' }}
								>
									{pieceNumber}
								</text>
								{/* Rotation indicator */}
								<text
									x={piece.x + 15}
									y={piece.y + 35}
									fill="#6b7280"
									fontSize="12"
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

			{/* Controls */}
			<div className="flex flex-col gap-2 px-4 pb-4">
				<div className="text-center text-sm text-gray-600">
					{config.puzzleInstructions}
				</div>

				{/* Rotation Controls */}
				<div className="grid grid-cols-3 gap-2">
					{pieces.map((piece, index) => {
						const pieceNumber = index + 1;
						return (
							<button
								key={piece.id}
								onClick={() => handleRotate(piece.id)}
								className="flex flex-col items-center gap-1 rounded-lg border bg-blue-500 p-2 text-white active:bg-blue-600"
								aria-label={`${config.rotateButton} ${pieceNumber}`}
							>
								<RotateCw className="h-5 w-5" />
								<span className="text-xs font-bold">Piece {pieceNumber}</span>
							</button>
						);
					})}
				</div>
			</div>
		</div>
	);
};
