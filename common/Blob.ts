export default class Blob {
	id: number;
	x: number;
	y: number;
	color: string;
	static readonly value: number = 0.5;

	constructor(id: number, x: number, y: number, color: string) {
		this.id = id;
		this.x = x;
		this.y = y;
		this.color = color;
	}
}
