const colors: string[] = [
	'blue',
	'green',
	'yellow',
	'purple',
	'cyan',
	'pink',
	'black',
];
import { randomInt } from 'crypto';
import Blob from './Blob';
import Player from './Player';
import { blob } from 'stream/consumers';
import { writeFileSync, readFileSync } from 'fs';

function getRandomInt(max: number): number {
	return Math.floor(Math.random() * max);
}

export default class GameMap {
	players: Player[] = [];
	blobs: Blob[] = [];
	width: number;
	height: number;
	static idx = 0;
	constructor(width: number, height: number) {
		this.players = [];
		this.blobs = [];
		this.width = width;
		this.height = height;

		// Affichage de 50 blobs supplémentaire aleatoirement sur la map
		for (var i = 0; i < 100; i++) {
			this.addBlob(
				new Blob(
					i,
					Math.random() * this.width,
					Math.random() * this.height,
					colors[Math.floor(Math.random() * colors.length)]
				)
			);
		}
	}

	addPlayer(player: Player): void {
		this.players.push(player);
	}

	removePlayer(id: string, withSplit: boolean = false): void {
		if (withSplit) {
			this.players = this.players.filter(
				player => player.id.split('split')[0] != id
			);
		} else {
			this.players.forEach(player => {
				if (player.id == id) {
					console.log('eatBlob: ' + player.nbBlobEat);
					console.log(
						'TIME SURVIVE: ' + (Date.now() - player.startTime) / 1000 + 's'
					);
				}
			});
			this.players = this.players.filter(player => player.id != id);
		}
	}

	getPlayer(id: string): Player | null {
		this.players.forEach(player => {
			if (player.id == id) return player;
		});
		return null;
	}

	getBlob(id: number): Blob | null {
		this.blobs.forEach(blob => {
			if (blob.id == id) return blob;
		});
		return null;
	}

	isTrap(blobID: number): boolean {
		let color: String = '';
		this.blobs.forEach(blob => {
			if (blob.id == blobID) color = blob.color;
		});
		return color == 'black';
	}

	addBlob(blob: Blob): void {
		this.blobs.push(blob);
	}

	removeBlob(id: number): void {
		this.blobs = this.blobs.filter(blob => blob.id != id);
		this.addBlob(
			new Blob(
				id,
				getRandomInt(this.width),
				getRandomInt(this.height),
				colors[Math.floor(Math.random() * colors.length)]
			)
		);
	}

	namePlayer(id: string, value: string) {
		this.players.forEach(player => {
			if (player.id == id) {
				player.setName(value);
			}
		});
	}

	setImageID(id: string, imageID: number) {
		this.players.forEach(player => {
			if (player.id == id) {
				player.setImageID(imageID);
			}
		});
	}

	eatBlob(playerID: string, blobID: number): boolean {
		let isTrap: boolean = this.isTrap(blobID);
		let multiplier: number = 1;
		if (isTrap) multiplier *= -1;
		this.removeBlob(blobID);
		let valid: boolean = false;
		this.players.forEach(player => {
			if (player.id == playerID) {
				if (isTrap) {
					player.nbBlackBlobEat++;
					player.nbBlobEat = Math.round(player.nbBlobEat * 0.95);
					player.nbBlobSteal = Math.round(player.nbBlobSteal * 0.95);
				} else {
					player.nbBlobEat += 1;
				}

				// Vitesse = maxSpeed / 3% newSize
				player.speed = 1 / ((player.size() / 100) * 3);

				valid = true;
			}
		});
		return valid;
	}

	eatPlayer(eaterID: string, eatenID: string): void {
		// Récupération du nombre de blob du joueur mangé
		let eater: Player = new Player();
		let eaten: Player = new Player();

		this.players.forEach(player => {
			if (player.id == eaterID) eater = player;
			else if (player.id == eatenID) eaten = player;
		});

		if (eater != null && eaten != null) {
			// Suppression mangé SI ce n'est pas par son propre split
			if (eatenID != eaterID.split('split')[0]) {
				this.removePlayer(eatenID);
				eater.nbBlobSteal += eaten.nbBlobEat + eaten.nbBlobSteal;
				// Vitesse = maxSpeed / 3% newSize
				eater.speed = 1 / ((eater.size() / 100) * 3);
				eater.nbPlayerEat += 1;
			} else {
				// récupére son split
				this.removePlayer(eaterID);
				eaten.nbBlobSteal += eater.nbBlobSteal;
				eaten.nbBlobEat += eater.nbBlobEat;
				// Vitesse = maxSpeed / 3% newSize
				eaten.speed = 1 / ((eaten.size() / 100) * 3);
			}
		}
	}

	split(player: Player) {
		if (player.size() >= 50) {
			const playerSplit: Player = new Player(
				player.id + 'split' + GameMap.idx,
				player.name,
				player.x + -player.directionX * player.size(),
				player.y + -player.directionY * player.size(),
				player.imageID,
				player,
				false
			);
			playerSplit.nbBlobEat = player.nbBlobEat / 2;
			playerSplit.nbBlobSteal = player.nbBlobSteal / 2;
			GameMap.idx++;
			this.addPlayer(playerSplit);
			player.nbBlobEat = player.nbBlobEat / 2;
			player.nbBlobSteal = player.nbBlobSteal / 2;
		}
	}
}
