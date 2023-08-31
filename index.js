'use strict';
var __awaiter =
	(this && this.__awaiter) ||
	function (thisArg, _arguments, P, generator) {
		function adopt(value) {
			return value instanceof P
				? value
				: new P(function (resolve) {
						resolve(value);
				  });
		}
		return new (P || (P = Promise))(function (resolve, reject) {
			function fulfilled(value) {
				try {
					step(generator.next(value));
				} catch (e) {
					reject(e);
				}
			}
			function rejected(value) {
				try {
					step(generator['throw'](value));
				} catch (e) {
					reject(e);
				}
			}
			function step(result) {
				result.done
					? resolve(result.value)
					: adopt(result.value).then(fulfilled, rejected);
			}
			step((generator = generator.apply(thisArg, _arguments || [])).next());
		});
	};
var __importDefault =
	(this && this.__importDefault) ||
	function (mod) {
		return mod && mod.__esModule ? mod : { default: mod };
	};
Object.defineProperty(exports, '__esModule', { value: true });
const Player_1 = __importDefault(require('./server/build/common/Player'));
const Score_1 = __importDefault(require('./server/build/common/Score'));
const Score_2 = require('./server/build/common/Score');
const PlayGame_1 = __importDefault(
	require('./server/build/server/src/PlayGame')
);
const fs = require('fs');
const socket_io_1 = require('socket.io');
const http_1 = __importDefault(require('http'));
const express_1 = __importDefault(require('express'));
const addWebpackMiddleware_1 = __importDefault(
	require('./server/build/server/addWebpackMiddleware')
);
const fs_1 = require('fs');
// SERVEUR DU JEU -----------------------------------------------------------------------
const app = (0, express_1.default)();
(0, addWebpackMiddleware_1.default)(app); // compilation js client
app.use(express_1.default.static('client/public')); // fichiers statiques (html, css, js)
app.use(express_1.default.static('server')); // fichier json
const httpServer = http_1.default.createServer(app);
const io = new socket_io_1.Server(httpServer);
// CONNECTION DE SOCKET ----------------------------------------------------------------
let id = 1;
console.log('Generation index');
io.on('connection', socket => {
	console.log(`Nouvelle connexion du client ${socket.id}`);
	socket.on('disconnect', () => {
		const players = PlayGame_1.default.getGameMap().players;
		let deadPlayer = new Player_1.default();
		PlayGame_1.default.getGameMap().removePlayer(socket.id, true);
		console.log(`Déconnexion du client ${socket.id}`);
	});
	// Modification de la position de la souris
	socket.on('setMousePos', mousePos => {
		PlayGame_1.default.getGameMap().players.forEach(player => {
			if (player.id == socket.id) {
				player.mousePos = mousePos;
			}
			if (player.id == socket.id.split('split')[0]) {
				player.mousePos = mousePos;
			}
		});
	});
	socket.emit('message', '' + PlayGame_1.default.getGameMap().players);
	// Envoie de la map au nouveau connecter
	socket.emit('refreshMap', PlayGame_1.default.getGameMap());
	socket.on('image', imageID => {
		PlayGame_1.default.getGameMap().setImageID(socket.id, imageID);
	});
	socket.on('newName', value => {
		let name = '';
		if (value == '') {
			name = 'player' + id;
			id++;
		} else {
			name = value;
		}
		// Recoit l'id et le nom pour la creation d'un joueur
		let player = new Player_1.default(
			socket.id,
			name,
			getRandomIntBtw(50, PlayGame_1.default.width - 50),
			getRandomIntBtw(50, PlayGame_1.default.height - 50),
			1
		);
		PlayGame_1.default.getGameMap().addPlayer(player);
	});
	socket.on('getWindow', window => {
		PlayGame_1.default.getGameMap().players.forEach(player => {
			if (player.id == socket.id) {
				player.innerWidth = window.innerWidth;
				player.innerHeight = window.innerHeight;
			}
			if (player.id == socket.id + 'split') {
				player.innerWidth = window.innerWidth;
				player.innerHeight = window.innerHeight;
			}
		});
	});
	socket.on('split', () => {
		PlayGame_1.default.getGameMap().players.forEach(player => {
			if (player.id == socket.id) {
				PlayGame_1.default.getGameMap().split(player);
			}
		});
	});
});
// retourne un entier compris entre min inclus et max exclus
function getRandomIntBtw(min, max) {
	return Math.floor(Math.random() * (max - min) + min);
}
// retourne un entier compris entre 0 inclus et max exclus
function getRandomInt(max) {
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
	PlayGame_1.default.play();
	// Refresh de la map pour tout les utilisateurs
	io.emit('refreshMap', PlayGame_1.default.getGameMap());
}
function updateBestScores(player) {
	return __awaiter(this, void 0, void 0, function* () {
		let bestScores = yield Score_1.default.getBestScoresFromJson();
		let playerName = player.name,
			playerScore =
				player.nbBlobEat +
				player.nbBlobSteal +
				Math.round((Date.now() - player.startTime) / 1000);
		bestScores.push(new Score_1.default(playerName, playerScore));
		bestScores.sort((a, b) => b.playerScore - a.playerScore);
		bestScores.slice(0, 10);
		const url =
			'server/' + Score_2.JSON_PATH.split('http://localhost:8000/')[1];
		fs.readFile(url, 'utf8', (err, data) => {
			if (err) {
				console.error(`Error reading -> ${Score_2.JSON_PATH}: ${err}`);
			} else {
				(0, fs_1.writeFileSync)(url, JSON.stringify(bestScores));
			}
		});
	});
}
//# sourceMappingURL=index.js.map
