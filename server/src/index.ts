import { Namespace, Server as IOServer, Socket } from 'socket.io';
import Player from '../../common/Player';
import MousePos from '../../common/MousePos';
import Score from '../../common/Score';
import { JSON_PATH } from '../../common/Score';
import PlayGame from './PlayGame';

const fs = require('fs');

import { ClientToServerEvents, ServerToClientEvents } from '../../serveurEvent';
import { Server } from 'socket.io';
import http from 'http';
import express from 'express';
import addWebpackMiddleware from '../addWebpackMiddleware';
import { writeFileSync, readFileSync } from 'fs';

// SERVEUR DU JEU -----------------------------------------------------------------------

const app = express();

addWebpackMiddleware(app); // compilation js client
app.use(express.static('client/public')); // fichiers statiques (html, css, js)
app.use(express.static('server')); // fichier json

const httpServer = http.createServer(app);

const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer);

// CONNECTION DE SOCKET ----------------------------------------------------------------

let id = 1;

console.log('Generation index');

io.on('connection', (socket: Socket) => {
	console.log(`Nouvelle connexion du client ${socket.id}`);

	socket.on('disconnect', () => {
		const players: Player[] = PlayGame.getGameMap().players;
		let deadPlayer: Player = new Player();

		PlayGame.getGameMap().removePlayer(socket.id, true);
		console.log(`Déconnexion du client ${socket.id}`);
	});

	// Modification de la position de la souris
	socket.on('setMousePos', (mousePos: MousePos) => {
		PlayGame.getGameMap().players.forEach((player: Player) => {
			if (player.id == socket.id) {
				player.mousePos = mousePos;
			}
			if (player.id == socket.id.split('split')[0]) {
				player.mousePos = mousePos;
			}
		});
	});

	socket.emit('message', '' + PlayGame.getGameMap().players);

	// Envoie de la map au nouveau connecter
	socket.emit('refreshMap', PlayGame.getGameMap());

	socket.on('image', (imageID: number) => {
		PlayGame.getGameMap().setImageID(socket.id, imageID);
	});

	socket.on('newName', (value: string) => {
		let name: string = '';
		if (value == '') {
			name = 'player' + id;
			id++;
		} else {
			name = value;
		}

		// Recoit l'id et le nom pour la creation d'un joueur
		let player = new Player(
			socket.id,
			name,
			getRandomIntBtw(50, PlayGame.width - 50),
			getRandomIntBtw(50, PlayGame.height - 50),
			1
		);

		PlayGame.getGameMap().addPlayer(player);
	});

	socket.on(
		'getWindow',
		(window: { innerWidth: number; innerHeight: number }) => {
			PlayGame.getGameMap().players.forEach((player: Player) => {
				if (player.id == socket.id) {
					player.innerWidth = window.innerWidth;
					player.innerHeight = window.innerHeight;
				}

				if (player.id == socket.id + 'split') {
					player.innerWidth = window.innerWidth;
					player.innerHeight = window.innerHeight;
				}
			});
		}
	);

	socket.on('split', () => {
		PlayGame.getGameMap().players.forEach((player: Player) => {
			if (player.id == socket.id) {
				PlayGame.getGameMap().split(player);
			}
		});
	});
});

// retourne un entier compris entre min inclus et max exclus
function getRandomIntBtw(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min) + min);
}

// retourne un entier compris entre 0 inclus et max exclus
function getRandomInt(max: number): number {
	return Math.floor(Math.random() * max);
}

const port = process.env.PORT || 8000;
httpServer.listen(port, () => {
	console.log(`Server running at http://localhost:${port}/`);
});

// JEUX ------------------------------------------------------------------------

// Actions joueur
const interval = setInterval(play, 1000 / 60);

function play() {
	PlayGame.play();
	// Refresh de la map pour tout les utilisateurs
	io.emit('refreshMap', PlayGame.getGameMap());
}

async function updateBestScores(player: Player) {
	let bestScores: Score[] = await Score.getBestScoresFromJson();
	let playerName: string = player.name,
		playerScore: number =
			player.nbBlobEat +
			player.nbBlobSteal +
			Math.round((Date.now() - player.startTime) / 1000);

	bestScores.push(new Score(playerName, playerScore));
	bestScores.sort((a: Score, b: Score) => b.playerScore - a.playerScore);
	bestScores.slice(0, 10);
	const url: string = 'server/' + JSON_PATH.split('http://localhost:8000/')[1];
	fs.readFile(url, 'utf8', (err: Error, data: string) => {
		if (err) {
			console.error(`Error reading -> ${JSON_PATH}: ${err}`);
		} else {
			writeFileSync(url, JSON.stringify(bestScores));
		}
	});
}
