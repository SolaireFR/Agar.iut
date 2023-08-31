import Player from '../Player';

describe('playerInstanceOK', () => {
	it('shouldreturnJean ', function () {
		const jean = new Player('test', 'jean', 25, 20, 2);
		expect(jean.name == 'jean');
	});

	describe('playerSetNameOK', () => {
		it('shouldreturnLucie ', function () {
			const jean = new Player('test', 'jean', 25, 20, 2);
			jean.setName('lucie');
			expect(jean.name == 'lucie');
		});
	});

	describe('playerSetImageOK', () => {
		it('shouldreturn5 ', function () {
			const jean = new Player('test', 'jean', 25, 20, 2);
			jean.setImageID(5);
			expect(jean.imageID == 5);
		});
	});
});
