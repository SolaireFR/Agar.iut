import { Socket, io } from 'socket.io-client';
import GameMap from '../../common/GameMap';
import { images } from './Image';
import Player from '../../common/Player';
import Blob from '../../common/Blob';
import {
	ClientToServerEvents,
	ServerToClientEvents,
} from '../../common/serveurEvent.js';
import MousePos from '../../common/MousePos';

export default class JeuView {
	canvas: HTMLCanvasElement;
	context: CanvasRenderingContext2D;
	map: GameMap;
	socket: Socket<ServerToClientEvents, ClientToServerEvents>;
	start: boolean = false;
	mousePos: MousePos = new MousePos(
		window.innerWidth / 2,
		window.innerHeight / 2
	);
	scoreBoard: HTMLElement;
	xPlayer: number = 0;
	yPlayer: number = 0;
	death: boolean = false;
	wasAlive: boolean = false;
	isStart: boolean = false;
	startTime: number = 0;
	finalTime: number = 0;
	nbBlobEat: number = 0;
	dead = false;

	//ne servent que pour les audios
	nbBlackBlobEat: number = 0;
	nbPlayerEat: number = 0;

	static music: HTMLAudioElement;

	constructor(canvasWidth: number, canvasHeight: number) {
		this.canvas = document.querySelector('canvas') as HTMLCanvasElement;
		this.canvas.width = canvasWidth;
		this.canvas.height = canvasHeight;

		this.context = this.canvas.getContext('2d') as CanvasRenderingContext2D;

		this.map = new GameMap(canvasWidth, canvasHeight);

		this.socket = this.initSocket();

		this.scoreBoard = document.querySelector('.scoreboard') as HTMLElement;

		console.log('construction affichage');

		// Affichage
		requestAnimationFrame(this.render.bind(this));
	}

	initGame(canvasWidth: number, canvasHeight: number): void {
		this.canvas = this.initCanvas(canvasWidth, canvasHeight);
		this.context = this.canvas.getContext('2d') as CanvasRenderingContext2D;
		this.start = true;
		this.scoreBoard = this.initScoreBoard();
		this.initMusic();

		const form: HTMLTextAreaElement = document.querySelector(
			'.pseudoForm textarea[name=pseudo]'
		) as HTMLTextAreaElement;
		this.socket.emit('newName', form.value);
		const imageForm: HTMLInputElement = document.querySelector(
			'input.imageForm'
		) as HTMLInputElement;
		this.socket.emit('image', parseInt(imageForm.value));
		this.socket.emit('getWindow', {
			innerWidth: window.innerWidth,
			innerHeight: window.innerHeight,
		});

		this.canvas.addEventListener('mousemove', event => {
			this.mousePos.x = event.clientX;
			this.mousePos.y = event.clientY;
			this.socket.emit('setMousePos', this.mousePos);
		});

		this.blockSpaceBar();
	}

	getSocket(): Socket<ServerToClientEvents, ClientToServerEvents> {
		return this.socket;
	}

	render(): void {
		// Nettoyage du canvas
		this.context.clearRect(
			-this.canvas.width,
			-this.canvas.height,
			this.map.width * 2,
			this.map.height * 2
		);

		this.showLimit();
		this.showScoreboard();
		this.showBlobs();
		this.showPlayers();

		requestAnimationFrame(this.render.bind(this));
	}

	showPlayers(): void {
		this.death = true;
		let passed = false;
		this.map.players.forEach((player: Player) => {
			// Si joueur principale au départ...
			if (player.id == this.socket.id) {
				if (!passed) {
					this.death = false;
					passed = true;
					if (!this.wasAlive) {
						this.wasAlive = true;
					}
					if (this.start) {
						this.startTime = player.startTime;

						this.context.clearRect(
							-this.canvas.width,
							-this.canvas.height,
							this.map.width * 2,
							this.map.height * 2
						);

						this.context.translate(
							this.canvas.width / 2,
							this.canvas.height / 2
						);

						this.context.transform(1, 0, 0, 1, 0, 0);
						this.context.scale(1.6, 1.6);
						this.start = false;
					}
					let nbBlob = this.nbBlobEat;
					let nbBlackBlob = this.nbBlackBlobEat;
					let nbPlayer = this.nbPlayerEat;

					this.nbBlobEat = player.nbBlobEat;
					this.nbBlackBlobEat = player.nbBlackBlobEat;
					this.nbPlayerEat = player.nbPlayerEat;

					//les audios

					if (this.nbBlackBlobEat - nbBlackBlob == 1) {
						const boom = new Audio('sounds/boom.mp3');
						boom.volume = 0.3;
						boom.autoplay = true;
					} else if (this.nbBlobEat - nbBlob == 1) {
						const poink = new Audio('sounds/poink.mp3');
						poink.volume = 0.2;
						poink.autoplay = true;
					}

					if (this.nbPlayerEat - nbPlayer == 1) {
						const bonk = new Audio('sounds/bonk.mp3');
						bonk.volume = 0.3;
						bonk.autoplay = true;
					}

					// Je crois translate suivie joueur
					if (
						(player.x != this.xPlayer || player.y != this.yPlayer) &&
						this.wasAlive
					) {
						this.context.translate(
							this.xPlayer - player.x,
							this.yPlayer - player.y
						);
						this.xPlayer = player.x;
						this.yPlayer = player.y;
					}
				}
			}

			this.drawPlayer(player);
		});
	}

	drawPlayer(player: Player) {
		const playerSize =
			Math.log(player.nbBlobEat + player.nbBlobSteal + 21) * 40 - 95;
		this.context.save();
		this.context.beginPath();
		this.context.arc(player.x, player.y, playerSize, 25, 90, false);
		this.context.fill();
		this.context.stroke();
		this.context.save();
		this.context.beginPath();
		//           arc(x       , y       , rayon      , startAngle, endAngle, sensHoraire);
		this.context.arc(player.x, player.y, playerSize, 25, 90, false);
		this.context.strokeStyle = '#2465D3';
		this.context.stroke();

		this.context.clip();
		this.context.drawImage(
			images[player.imageID].image,
			player.x - playerSize,
			player.y - playerSize,
			playerSize * 2,
			playerSize * 2
		);

		this.context.restore();
		if (player.id == this.socket.id) {
			if (player.parent != null) {
				this.context.shadowBlur = 10;
				this.context.shadowColor = 'blue';
			} else {
				this.context.shadowBlur = 0;
			}
			if (player.invincibilite) {
				this.context.shadowBlur = 10;
				this.context.shadowColor = 'yellow';
			} else {
				this.context.shadowBlur = 0;
			}
		} else {
			if (player.parent != null) {
				this.context.arc(player.x, player.y, playerSize + 1, 25, 90, false);
				this.context.strokeStyle = 'blue';
				this.context.stroke();
			}
			if (player.invincibilite) {
				this.context.arc(player.x, player.y, playerSize + 1, 25, 90, false);
				this.context.strokeStyle = 'yellow';
				this.context.stroke();
			}
		}

		this.context.font = '18px Arial';
		this.context.textAlign = 'center';
		this.context.fillStyle = 'white';
		this.context.strokeStyle = 'black';
		this.context.fillText(player.name, player.x, player.y + 2, playerSize * 2);
	}

	showBlobs(): void {
		// Parcours la liste des blobs
		this.map.blobs.forEach((blob: Blob) => {
			this.context.fillStyle = blob.color;
			this.context.beginPath();
			this.context.arc(blob.x, blob.y, 5, 25, 90, false);
			this.context.fill();
			this.context.stroke();
		});
	}

	score(player: Player): number {
		return (
			player.nbBlobEat +
			player.nbBlobSteal +
			Math.round((Date.now() - player.startTime) / 1000)
		);
	}

	showScoreboard() {
		const classement: Player[] = this.map.players.sort(
			(player1: Player, player2: Player) => {
				if (this.score(player1) > this.score(player2)) {
					return -1;
				} else if (this.score(player1) < this.score(player2)) {
					return 1;
				} else {
					return 0;
				}
			}
		);

		this.scoreBoard.innerHTML = '<h2>Score Board</h2>';
		classement.forEach(player => {
			if (player.parent == null) {
				this.scoreBoard.innerHTML += `
				<li>
					${player.name}
					<em>${
						player.nbBlobEat +
						player.nbBlobSteal +
						Math.round((Date.now() - player.startTime) / 1000)
					}</em>
					</li> 
				`;
			}
		});
	}

	showLimit(): void {
		this.context.beginPath();
		this.context.moveTo(0, 0);
		this.context.lineTo(this.map.width, 0);
		this.context.lineTo(this.map.width, this.map.height);
		this.context.lineTo(0, this.map.height);
		this.context.lineTo(0, 0);

		// Cadrillage horizontale
		for (let i: number = 1; i < 40; i++) {
			let y: number = (this.map.height / 40) * i;
			this.context.moveTo(0, y);
			this.context.lineTo(this.map.width, y);
		}

		// Cadrillage verticale
		for (let i = 1; i < 60; i++) {
			let x = (this.map.width / 60) * i;
			this.context.moveTo(x, 0);
			this.context.lineTo(x, this.map.height);
		}
		this.context.stroke();
	}

	initMusic() {
		JeuView.music = new Audio('sounds/lostwoods.mp3');
		JeuView.music.loop = true;
		JeuView.music.volume = 0.1;
		JeuView.music.autoplay = true;
	}

	blockSpaceBar(): void {
		window.addEventListener('keydown', event => {
			if (event.code == 'Space') {
				event.preventDefault();
				this.socket.emit('split');
			}
		});
	}

	initCanvas(canvasWidth: number, canvasHeight: number): HTMLCanvasElement {
		// Bug
		const canvas: HTMLCanvasElement = document.querySelector(
			'canvas'
		) as HTMLCanvasElement;

		canvas.style.zIndex = '1';
		canvas.width = canvasWidth;
		canvas.height = canvasHeight;

		return canvas;
	}

	initSocket(): Socket {
		//this.canvas = new HTMLCanvasElement();
		const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io();

		socket.on('message', (message: string) => {
			console.log(message);
		});

		socket.on('refreshMap', newMap => {
			this.map = newMap;
			this.verifDeath();
		});

		return socket;
	}

	verifDeath() {
		if (this.death && this.wasAlive) {
			if (!this.dead) {
				const gameover = new Audio('sounds/gameover.mp3');
				gameover.volume = 0.2;
				gameover.autoplay = true;
				this.dead = true;
			}
			JeuView.music.autoplay = false;

			this.canvas.setAttribute('hidden', 'hidden');

			const replayArticle: HTMLElement = document.querySelector(
				'.replay'
			) as HTMLElement;
			replayArticle.removeAttribute('hidden');

			const welcomeArticle: HTMLElement = document.querySelector(
				'.accueil'
			) as HTMLElement;
			welcomeArticle.setAttribute('hidden', 'hidden');

			const timer: HTMLElement = replayArticle.querySelector(
				'.time>p'
			) as HTMLElement;
			if (this.finalTime == 0) {
				this.finalTime = Date.now();
			}
			timer.innerHTML =
				'' + (this.finalTime - this.startTime) / 1000 + ' secondes';
			const eat: HTMLElement = replayArticle.querySelector(
				'.eat>p'
			) as HTMLElement;
			eat.innerHTML = '' + this.nbBlobEat;
		}
	}

	initScoreBoard(): HTMLElement {
		document.querySelector('.scoreboardDiv')?.removeAttribute('hidden');
		return document.querySelector('.scoreboard') as HTMLElement;
	}
}
