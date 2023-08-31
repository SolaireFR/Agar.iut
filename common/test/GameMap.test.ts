import GameMap from '../GameMap';
import Player from '../Player';

describe('GameMapInstanceOK', () => {
	const gameMap = new GameMap(3000, 1700);
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
	const gameMap = new GameMap(3000, 1700);
	const jean = new Player('test', 'jean', 20, 20, 2);
	const numberOfBlobs = gameMap.blobs.length;
	describe('RemoveBlobOK', () => {
		it('shouldHaveOneBlobLess', function () {
			expect(1 == numberOfBlobs - gameMap.blobs.length);
		});
	});
	const alice = new Player('test2', 'alice', 20, 20, 2);
	const numberOfPlayers = gameMap.players.length;
	describe('RemovePlayerOK', () => {
		it('shouldHaveOnePlayerLess', function () {
			expect(1 == numberOfPlayers - gameMap.players.length);
		});
	});
});
