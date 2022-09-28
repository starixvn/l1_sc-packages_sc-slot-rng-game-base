import { TableGameData } from "sc-game-base/src/table";

export default class GameData extends TableGameData {
    constructor(remainingTime) {
        super(remainingTime);

        this.numberOfLuckyRounds = 0;
        this.ischeckGameStatus = false;
    }
}
