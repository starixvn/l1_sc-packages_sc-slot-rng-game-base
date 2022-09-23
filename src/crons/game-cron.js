import { Table } from "sc-game-base";

export default class GameCron extends Table.Crons.TableGameCron {
    async proceed() {
        const { durations, luckySymbolAnimationTime, luckyRoundDuration } = this.definition;
        const { wholeRound, placingBets } = durations;
        const { numberOfLuckyRounds, remainingTime, disabled } = this.gameData;

        if (remainingTime === wholeRound) {
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
            const extendedLuckyTime = numberOfLuckyRounds > 0 ? luckySymbolAnimationTime + numberOfLuckyRounds * luckyRoundDuration : 0;
            this.gameData.remainingTime = wholeRound + extendedLuckyTime;
            await this.settleGameRoundConsumer.settleRound();
        } else if (remainingTime < placingBets) {
            this.bot && (await this.bot.run());
            this.runningRoundInfoPublisher.publish();
        }
    }
}
