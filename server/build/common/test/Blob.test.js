"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Blob_1 = __importDefault(require("../Blob"));
describe('blobInstanceOK', () => {
    const blob = new Blob_1.default(0, 20, 15, 'blue');
    it('shouldreturnBlob ', function () {
        expect(blob != null);
    });
    it('shouldreturn0 ', function () {
        expect(blob.id == 0);
    });
});
//# sourceMappingURL=Blob.test.js.map