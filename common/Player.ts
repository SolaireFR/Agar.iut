import MousePos from './MousePos';

export default class Player {
	id: string;
	name: string;
	x: number;
	y: number;
	imageID: number;
	speed: number;
	mousePos: MousePos;
	innerWidth: number;
	innerHeight: number;
	directionX: number;
	directionY: number;
	parent: Player | null;
	invincibilite: boolean;

	startTime: number = Date.now();
	nbBlobEat: number = 0;
	nbBlobSteal: number = 0;

	//ces variables ne servent que pour les audios
	nbBlackBlobEat: number = 0;
	nbPlayerEat: number = 0;

	constructor(
		id: string = '',
		name: string = '',
		x: number = 0,
		y: number = 0,
		imageID: number = 0,
		parent: Player | null = null,
		invincibilite = true
	) {
		this.id = id;
		this.name = name;
		this.x = x;
		this.y = y;
		this.imageID = imageID;
		this.speed = 1;
		this.mousePos = new MousePos(x, y);
		this.innerWidth = 0;
		this.innerHeight = 0;
		this.directionX = 0;
		this.directionY = 0;
		this.parent = parent;
		this.invincibilite = invincibilite;
	}

	setName(name: string) {
		this.name = name;
	}

	setImageID(imageID: number) {
		this.imageID = imageID;
	}

	size(): number {
		return Math.log(this.nbBlobEat + this.nbBlobSteal + 21) * 40 - 95;
	}
}
