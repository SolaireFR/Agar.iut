import GameMap from './GameMap';
import MousePos from './MousePos';

export interface ServerToClientEvents {
	refreshMap: (newMap: GameMap) => void;
	showDeathScreen: () => void;
	message: (message: string) => void;
}

export interface ClientToServerEvents {
	playerMove: (elements: { x: number; y: number }) => void;
	blobEaten: (elements: { playerID: string; blobID: number }) => void;
	playerEaten: (elements: { eaterID: string; eatenID: string }) => void;
	image: (imageID: number) => void;
	newName: (name: string) => void;
	setMousePos: (mousePos: MousePos) => void;
	getWindow: (window: { innerWidth: number; innerHeight: number }) => void;
	split: () => void;
	update: () => void;
}
