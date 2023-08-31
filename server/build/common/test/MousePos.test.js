"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const MousePos_1 = __importDefault(require("../MousePos"));
describe('mousePosInstanceOK', () => {
    const mousePos = new MousePos_1.default(5, 5);
    it('shouldreturnMousePos ', function () {
        expect(mousePos != null);
    });
    it('shouldreturn5 ', function () {
        expect(mousePos.x == 5);
    });
});
//# sourceMappingURL=MousePos.test.js.map