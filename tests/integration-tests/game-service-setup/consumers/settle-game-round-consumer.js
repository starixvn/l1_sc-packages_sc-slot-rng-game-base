import { Consumers } from "../../../../src";

export default class SettleGameRoundConsumer extends Consumers.TableSettleGameRoundConsumer {
    calculateBetResult(settlementResult, bet, odds) {
        const betResult = Object.entries(settlementResult).reduce(
            (result, [choice, win]) => {
                if (choice !== "lucky") {
                    const betAmount = bet[choice];
                    const originalOdds = odds[choice] || 1;
                    const winAmount = win ? betAmount * originalOdds : 0;

                    result.totalBetAmount += betAmount;
                    result.totalWin += winAmount;
                    result.winningByChoices[choice] = winAmount;

                    if (winAmount > 0) {
                        result.netWin += winAmount - betAmount;
                    } else {
                        result.totalLost += betAmount;
                    }

                    return result;
                } else {
                    // TO DO: add extra round
                    return { totalBetAmount: 0, totalWin: 0, netWin: 0, totalLost: 0, winningByChoices: {} };
                }
            },
            {
                totalBetAmount: 0,
                totalWin: 0,
                netWin: 0,
                totalLost: 0,
                winningByChoices: {},
            }
        );

        betResult.totalWin = parseFloat(betResult.totalWin.toFixed(2));
        betResult.netWin = parseFloat(betResult.netWin.toFixed(2));

        return betResult;
    }

    async settleRound() {
        try {
            const result = await this.generateResult();

            const settlementResult = this.definition.settle(result);
            const { roundId, exchangeRates } = this.gameData;
            const newRound = await this.roundsRepository.create({
                id: roundId,
                result,
                settlementResult,
                time: new Date(),
                exchangeRateId: exchangeRates.exId,
            });

            if (newRound) {
                const finish = {
                    settlementResult,
                    result,
                    roundId: newRound.id,
                    time: newRound.time,
                };

                this.gameData.roundId = finish.roundId + 1;

                await this.settleBets(finish);
            }
        } catch (error) {
            console.log(error);
        }
    }

    async generateResult() {
        const { result } = this.definition.generateResult(0.5, 1, 2);
        return result;
    }
}
