import Blob from '../Blob';

describe('blobInstanceOK', () => {
	const blob = new Blob(0, 20, 15, 'blue');
	it('shouldreturnBlob ', function () {
		expect(blob != null);
	});
	it('shouldreturn0 ', function () {
		expect(blob.id == 0);
	});
});
