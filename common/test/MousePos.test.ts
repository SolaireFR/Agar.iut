import MousePos from '../MousePos';

describe('mousePosInstanceOK', () => {
	const mousePos = new MousePos(5, 5);
	it('shouldreturnMousePos ', function () {
		expect(mousePos != null);
	});
	it('shouldreturn5 ', function () {
		expect(mousePos.x == 5);
	});
});
