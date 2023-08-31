export class Popup {
	htmlElement: HTMLElement;

	constructor(cssSelector: string) {
		this.htmlElement = document.querySelector(cssSelector)!;
	}

	open() {
		this.htmlElement.classList.add('visible');
	}

	close() {
		this.htmlElement.classList.remove('visible');
	}
}
