import JeuView from './JeuView';
import { images } from './Image';
import { Popup } from './Popup';
import Score from '../../common/Score';
import { writeFileSync, readFileSync } from 'fs';
/* SCENARIOS CLIENT JEU */

const JSON_PATH: string = 'server/res/alltime.json';

const jv: JeuView = new JeuView(1500, 700);

function handlePlayButton(event: Event) {
	jv.initGame(1500, 700);

	event.preventDefault();
}

const imageForm: HTMLFormElement = document.querySelector(
	'input.imageForm'
) as HTMLFormElement;

const colorForm: HTMLFormElement = document.querySelector(
	'input.colorForm'
) as HTMLFormElement;

const image: HTMLImageElement = document.querySelector(
	'.skin'
) as HTMLImageElement;

image.src = images[imageForm.value].image.src;

imageForm.addEventListener('change', (event: Event) => {
	const { target } = event;
	image.src = images[(target as HTMLFormElement).value].image.src;
});

const buttonPlay: HTMLButtonElement = document.querySelector(
	'.jouer'
) as HTMLButtonElement;

buttonPlay.addEventListener('click', handlePlayButton);

const creditsPopup: Popup = new Popup('.credits.popup');
const creditsButton: HTMLElement = document.querySelector('.creditsButton')!;

creditsButton.addEventListener('click', event => {
	event.preventDefault();
	creditsPopup.open();
});

const closeButton = document.querySelector('.closeButton');
closeButton!.addEventListener('click', event => {
	event.preventDefault();
	creditsPopup.close();
});

const alltimePopup: Popup = new Popup('.alltime.popup');
const alltimeButton: HTMLElement = document.querySelector('.alltimeButton')!;

alltimeButton.addEventListener('click', event => {
	event.preventDefault();
	loadBestScores();
	alltimePopup.open();
});

const alltimeCloseButton = document.querySelector('.alltime.closeButton')!;
alltimeCloseButton.addEventListener('click', event => {
	event.preventDefault();
	alltimePopup.close();
});

const bestScoresHtml = document.querySelector('.bestScores')!;

async function loadBestScores() {
	let bestScores: Score[] = await Score.getBestScoresFromJson();
	bestScores = bestScores.slice(0, 10);
	let newInnerHtml: string = '';
	bestScores.forEach(element => {
		newInnerHtml += `<li>
		<mark>${element.playerName}</mark>
		<small>${element.playerScore}</small>
		</li>`;
	});
	bestScoresHtml.innerHTML = newInnerHtml;
}
