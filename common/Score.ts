import fetch from 'node-fetch';
export const JSON_PATH: string = 'http://localhost:8000/res/alltime.json';

export default class Score {
	playerName: string;
	playerScore: number;

	constructor(playerName: string, playerScore: number) {
		this.playerName = playerName;
		this.playerScore = playerScore;
	}

	static async getBestScoresFromJson(): Promise<Score[]> {
		try {
			const response = await fetch(JSON_PATH);
			const data: Score[] = await response.json();
			return data;
		} catch (error) {
			throw error;
		}
	}
}
