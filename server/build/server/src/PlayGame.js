"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _PlayGame_gameMap;
Object.defineProperty(exports, "__esModule", { value: true });
const GameMap_1 = __importDefault(require("../../common/GameMap"));
const Score_1 = __importDefault(require("../../common/Score"));
const Score_2 = require("../../common/Score");
const fs_1 = require("fs");
const fs = require('fs');
console.log('Generation PlayGame');
class PlayGame {
    static getGameMap() {
        return __classPrivateFieldGet(PlayGame, _a, "f", _PlayGame_gameMap);
    }
    // Parcours la liste des joueurs
    static play() {
        __classPrivateFieldGet(PlayGame, _a, "f", _PlayGame_gameMap).players.forEach((player) => {
            PlayGame.move(player);
            PlayGame.eatBlob(player);
            PlayGame.eatByOtherPlayer(player);
        });
    }
    static eatBlob(player) {
        __classPrivateFieldGet(PlayGame, _a, "f", _PlayGame_gameMap).blobs.forEach((blob) => {
            if (Math.sqrt(Math.pow(player.x - blob.x, 2) + Math.pow(player.y - blob.y, 2)) < player.size()) {
                player.invincibilite = false;
                //Le blob disparait
                __classPrivateFieldGet(PlayGame, _a, "f", _PlayGame_gameMap).eatBlob(player.id, blob.id);
            }
        });
    }
    static eatByOtherPlayer(player) {
        if (!player.invincibilite) {
            __classPrivateFieldGet(PlayGame, _a, "f", _PlayGame_gameMap).players.forEach((other) => {
                if (!other.invincibilite) {
                    if (other.parent == player) {
                        if (Math.sqrt(Math.pow(other.x - player.x, 2) +
                            Math.pow(other.y - player.y, 2)) < other.size())
                            __classPrivateFieldGet(PlayGame, _a, "f", _PlayGame_gameMap).eatPlayer(other.id, player.id);
                    }
                    else if (other.id != player.id) {
                        if (other.size() > player.size() + other.size() * 0.1) {
                            if (Math.sqrt(Math.pow(other.x - player.x, 2) +
                                Math.pow(other.y - player.y, 2)) < other.size()) {
                                other.invincibilite = false;
                                __classPrivateFieldGet(PlayGame, _a, "f", _PlayGame_gameMap).eatPlayer(other.id, player.id);
                                this.updateBestScores(player);
                            }
                        }
                    }
                }
            });
        }
    }
    static move(player) {
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
        }
        else {
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
    static limitDirection(player) {
        if (player.x + player.size() + player.directionX >=
            __classPrivateFieldGet(PlayGame, _a, "f", _PlayGame_gameMap).width) {
            player.directionX = PlayGame.force;
        }
        else if (player.x - player.size() + player.directionX <= 0) {
            player.directionX = -PlayGame.force;
        }
        else if (player.directionX > PlayGame.limitation) {
            player.directionX = PlayGame.limitation + player.directionX * 0.05;
        }
        else if (player.directionX < -3) {
            player.directionX = -PlayGame.limitation + player.directionX * 0.05;
        }
        // Limite Vertical mur et vitesse
        if (player.y + player.size() + player.directionY >=
            __classPrivateFieldGet(PlayGame, _a, "f", _PlayGame_gameMap).height) {
            player.directionY = PlayGame.force;
        }
        else if (player.y - player.size() + player.directionY <= 0) {
            player.directionY = -PlayGame.force;
        }
        else if (player.directionY > PlayGame.limitation) {
            player.directionY = PlayGame.limitation + player.directionY * 0.05;
        }
        else if (player.directionY < -PlayGame.limitation) {
            player.directionY = -PlayGame.limitation + player.directionY * 0.05;
        }
    }
    static updateBestScores(player) {
        return __awaiter(this, void 0, void 0, function* () {
            let bestScores = yield Score_1.default.getBestScoresFromJson();
            console.log(bestScores);
            let playerName = player.name, playerScore = player.nbBlobEat +
                player.nbBlobSteal +
                Math.round((Date.now() - player.startTime) / 1000);
            bestScores.push(new Score_1.default(playerName, playerScore));
            bestScores.sort((a, b) => b.playerScore - a.playerScore);
            bestScores.slice(0, 10);
            console.log(bestScores);
            const url = 'server/' + Score_2.JSON_PATH.split('http://localhost:8000/')[1];
            fs.readFile(url, 'utf8', (err, data) => {
                if (err) {
                    console.error(`Error reading -> ${Score_2.JSON_PATH}: ${err}`);
                }
                else {
                    (0, fs_1.writeFileSync)(url, JSON.stringify(bestScores));
                }
            });
        });
    }
}
_a = PlayGame;
PlayGame.width = 3000;
PlayGame.height = 1700;
_PlayGame_gameMap = { value: new GameMap_1.default(PlayGame.width, PlayGame.height) };
// Force de la repousse du mur
PlayGame.force = 0.5;
// Limite de la vitesse max
PlayGame.limitation = 3;
exports.default = PlayGame;
//# sourceMappingURL=PlayGame.js.map