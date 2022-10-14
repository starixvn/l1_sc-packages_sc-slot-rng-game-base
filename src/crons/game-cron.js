import { Table } from "sc-game-base";

export default class GameCron extends Table.Crons.TableGameCron {
    async proceed() {
        const { durations, luckyRoundDuration } = this.definition;
        const { wholeRound, placingBets } = durations;
        const { remainingTime, disabled, ischeckGameStatus } = this.gameData;

        if (!ischeckGameStatus && remainingTime >= wholeRound) {
            this.gameData.ischeckGameStatus = true;
            await this.checkGameStatus();
        }

        if (!disabled) {
            this.gameData.remainingTime--;
        }

        if (this.isStartingTime(remainingTime, durations)) {
            this.resetForNewRound();
            this.bot && (await this.bot.reset());
        }

        if (remainingTime < 0) {
            this.gameData.ischeckGameStatus = false;
            const result = await this.settleGameRoundConsumer.generateResult();
            const { numberOfLuckyRounds } = this.gameData;
            const extendedLuckyTime = numberOfLuckyRounds > 0 ? numberOfLuckyRounds * luckyRoundDuration : 0;
            this.gameData.remainingTime = wholeRound + extendedLuckyTime;
            await this.settleGameRoundConsumer.settleRound(result);
        } else if (remainingTime < placingBets) {
            this.bot && (await this.bot.run());
            this.runningRoundInfoPublisher.publish();
        }
    }
}
