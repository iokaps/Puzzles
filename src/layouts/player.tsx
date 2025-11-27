import { config } from '@/config';
import { cn } from '@/utils/cn';
import * as React from 'react';

interface LayoutProps {
	children?: React.ReactNode;
	className?: string;
}

const PlayerRoot: React.FC<LayoutProps> = ({ children, className }) => (
	<div
		className={cn(
			'grid h-dvh grid-rows-[auto_1fr_auto] overflow-hidden bg-slate-100',
			className
		)}
	>
		{children}
	</div>
);

const PlayerHeader: React.FC<LayoutProps> = ({ children, className }) => (
	<header
		className={cn('sticky top-0 z-10 bg-white py-2 shadow-sm', className)}
	>
		<div className="container mx-auto flex flex-wrap items-center justify-between px-4">
			<div className="font-bold">{config.title}</div>

			{children}
		</div>
	</header>
);

const PlayerMain: React.FC<LayoutProps> = ({ children, className }) => (
	<main
		className={cn(
			'container mx-auto flex min-h-0 items-center justify-center p-2',
			className
		)}
	>
		{children}
	</main>
);

const PlayerFooter: React.FC<LayoutProps> = ({ children, className }) => (
	<footer
		className={cn('sticky bottom-0 z-10 bg-white p-2 text-gray-900', className)}
	>
		{children}
	</footer>
);

/**
 * Layout components for the 'player' mode
 */
export const PlayerLayout = {
	Root: PlayerRoot,
	Header: PlayerHeader,
	Main: PlayerMain,
	Footer: PlayerFooter
};
