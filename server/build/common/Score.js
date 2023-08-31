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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JSON_PATH = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
exports.JSON_PATH = 'http://localhost:8000/res/alltime.json';
class Score {
    constructor(playerName, playerScore) {
        this.playerName = playerName;
        this.playerScore = playerScore;
    }
    static getBestScoresFromJson() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield (0, node_fetch_1.default)(exports.JSON_PATH);
                const data = yield response.json();
                return data;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = Score;
//# sourceMappingURL=Score.js.map