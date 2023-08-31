"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GameMap_1 = __importDefault(require("../GameMap"));
const Player_1 = __importDefault(require("../Player"));
describe('GameMapInstanceOK', () => {
    const gameMap = new GameMap_1.default(3000, 1700);
    it('shouldreturnGameMap ', function () {
        expect(gameMap != null);
    });
    describe('GameMapInstanceOK', () => {
        it('shouldreturn3000', function () {
            expect(gameMap.width == 3000);
        });
    });
});
describe('GameplayOK', () => {
    const gameMap = new GameMap_1.default(3000, 1700);
    const jean = new Player_1.default('test', 'jean', 20, 20, 2);
    const numberOfBlobs = gameMap.blobs.length;
    describe('RemoveBlobOK', () => {
        it('shouldHaveOneBlobLess', function () {
            expect(1 == numberOfBlobs - gameMap.blobs.length);
        });
    });
    const alice = new Player_1.default('test2', 'alice', 20, 20, 2);
    const numberOfPlayers = gameMap.players.length;
    describe('RemovePlayerOK', () => {
        it('shouldHaveOnePlayerLess', function () {
            expect(1 == numberOfPlayers - gameMap.players.length);
        });
    });
});
//# sourceMappingURL=GameMap.test.js.map