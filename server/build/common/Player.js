"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const MousePos_1 = __importDefault(require("./MousePos"));
class Player {
    constructor(id = '', name = '', x = 0, y = 0, imageID = 0, parent = null, invincibilite = true) {
        this.startTime = Date.now();
        this.nbBlobEat = 0;
        this.nbBlobSteal = 0;
        //ces variables ne servent que pour les audios
        this.nbBlackBlobEat = 0;
        this.nbPlayerEat = 0;
        this.id = id;
        this.name = name;
        this.x = x;
        this.y = y;
        this.imageID = imageID;
        this.speed = 1;
        this.mousePos = new MousePos_1.default(x, y);
        this.innerWidth = 0;
        this.innerHeight = 0;
        this.directionX = 0;
        this.directionY = 0;
        this.parent = parent;
        this.invincibilite = invincibilite;
    }
    setName(name) {
        this.name = name;
    }
    setImageID(imageID) {
        this.imageID = imageID;
    }
    size() {
        return Math.log(this.nbBlobEat + this.nbBlobSteal + 21) * 40 - 95;
    }
}
exports.default = Player;
//# sourceMappingURL=Player.js.map