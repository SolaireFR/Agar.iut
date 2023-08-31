"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Player_1 = __importDefault(require("../Player"));
describe('playerInstanceOK', () => {
    it('shouldreturnJean ', function () {
        const jean = new Player_1.default('test', 'jean', 25, 20, 2);
        expect(jean.name == 'jean');
    });
    describe('playerSetNameOK', () => {
        it('shouldreturnLucie ', function () {
            const jean = new Player_1.default('test', 'jean', 25, 20, 2);
            jean.setName('lucie');
            expect(jean.name == 'lucie');
        });
    });
    describe('playerSetImageOK', () => {
        it('shouldreturn5 ', function () {
            const jean = new Player_1.default('test', 'jean', 25, 20, 2);
            jean.setImageID(5);
            expect(jean.imageID == 5);
        });
    });
});
//# sourceMappingURL=Player.test.js.map