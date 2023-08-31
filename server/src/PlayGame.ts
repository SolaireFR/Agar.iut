import GameMap from '../../common/GameMap';
import Player from '../../common/Player';
import Blob from '../../common/Blob';
import Score from '../../common/Score';
import { id } from './jest.config.cjs';
import { isVariableDeclaration } from 'typescript';
import { JSON_PATH } from '../../common/Score';
import { writeFileSync, readFileSync } from 'fs';
import { Socket } from 'socket.io';

const fs = require('fs');

console.log('Generation PlayGame');

export default class PlayGame {
	static width: number = 3000;
	static height: number = 1700;
	static #gameMap: GameMap = new GameMap(PlayGame.width, PlayGame.height);

	// Force de la repousse du mur
	static force: number = 0.5;
	// Limite de la vitesse max
	static limitation: number = 3;

	static getGameMap(): GameMap {
		return PlayGame.#gameMap;
	}

	// Parcours la liste des joueurs
	static play() {
		PlayGame.#gameMap.players.forEach((player: Player) => {
			PlayGame.move(player);

			PlayGame.eatBlob(player);

			PlayGame.eatByOtherPlayer(player);
		});
	}

	static eatBlob(player: Player): void {
		PlayGame.#gameMap.blobs.forEach((blob: Blob) => {
			if (
				Math.sqrt(
					Math.pow(player.x - blob.x, 2) + Math.pow(player.y - blob.y, 2)
				) < player.size()
			) {
				player.invincibilite = false;
				//Le blob disparait
				PlayGame.#gameMap.eatBlob(player.id, blob.id);
			}
		});
	}

	static eatByOtherPlayer(player: Player): void {
		if (!player.invincibilite) {
			PlayGame.#gameMap.players.forEach((other: Player) => {
				if (!other.invincibilite) {
					if (other.parent == player) {
						if (
							Math.sqrt(
								Math.pow(other.x - player.x, 2) +
									Math.pow(other.y - player.y, 2)
							) < other.size()
						)
							PlayGame.#gameMap.eatPlayer(other.id, player.id);
					} else if (other.id != player.id) {
						if (other.size() > player.size() + other.size() * 0.1) {
							if (
								Math.sqrt(
									Math.pow(other.x - player.x, 2) +
										Math.pow(other.y - player.y, 2)
								) < other.size()
							) {
								other.invincibilite = false;
								PlayGame.#gameMap.eatPlayer(other.id, player.id);
								this.updateBestScores(player);
							}
						}
					}
				}
			});
		}
	}

	static move(player: Player): void {
		if (player.parent == null) {
			// 1% de la distance entre la souris et le blob
			player.directionX =
				(player.innerWidth / 2 - player.mousePos.x) * (0.01 * player.speed);
			player.directionY =
				(player.innerHeight / 2 - player.mousePos.y) * (0.01 * player.speed);

			PlayGame.limitDirection(player);

			// Mise à jour de la position du joueur

			player.x -= player.directionX;
			player.y -= player.directionY;
		} else {
			// 1% de la distance entre la souris et le blob
			player.directionX =
				(player.parent.innerWidth / 2 - player.parent.mousePos.x) *
				(0.01 * player.parent.speed);
			player.directionY =
				(player.parent.innerHeight / 2 - player.parent.mousePos.y) *
				(0.01 * player.parent.speed);

			// Limitation vitesse avec le calcul (v > 3) <==> (limitation + 5%v)
			//                                ou (v < 3) <==> (-limitation + 5%v)
			// Limite Horizontale mur et vitesse
			PlayGame.limitDirection(player);

			// Mise à jour de la position du joueur

			player.x -= player.directionX;
			player.y -= player.directionY;
		}
	}

	// Limitation vitesse avec le calcul (v > 3) <==> (limitation + 5%v)
	//                                ou (v < 3) <==> (-limitation + 5%v)
	// Limite Horizontale mur et vitesse
	private static limitDirection(player: Player) {
		if (
			player.x + player.size() + player.directionX >=
			PlayGame.#gameMap.width
		) {
			player.directionX = PlayGame.force;
		} else if (player.x - player.size() + player.directionX <= 0) {
			player.directionX = -PlayGame.force;
		} else if (player.directionX > PlayGame.limitation) {
			player.directionX = PlayGame.limitation + player.directionX * 0.05;
		} else if (player.directionX < -3) {
			player.directionX = -PlayGame.limitation + player.directionX * 0.05;
		}

		// Limite Vertical mur et vitesse
		if (
			player.y + player.size() + player.directionY >=
			PlayGame.#gameMap.height
		) {
			player.directionY = PlayGame.force;
		} else if (player.y - player.size() + player.directionY <= 0) {
			player.directionY = -PlayGame.force;
		} else if (player.directionY > PlayGame.limitation) {
			player.directionY = PlayGame.limitation + player.directionY * 0.05;
		} else if (player.directionY < -PlayGame.limitation) {
			player.directionY = -PlayGame.limitation + player.directionY * 0.05;
		}
	}

	static async updateBestScores(player: Player) {
		let bestScores: Score[] = await Score.getBestScoresFromJson();
		console.log(bestScores);
		let playerName: string = player.name,
			playerScore: number =
				player.nbBlobEat +
				player.nbBlobSteal +
				Math.round((Date.now() - player.startTime) / 1000);

		bestScores.push(new Score(playerName, playerScore));
		bestScores.sort((a: Score, b: Score) => b.playerScore - a.playerScore);
		bestScores.slice(0, 10);
		console.log(bestScores);
		const url: string =
			'server/' + JSON_PATH.split('http://localhost:8000/')[1];
		fs.readFile(url, 'utf8', (err: Error, data: string) => {
			if (err) {
				console.error(`Error reading -> ${JSON_PATH}: ${err}`);
			} else {
				writeFileSync(url, JSON.stringify(bestScores));
			}
		});
	}
}
