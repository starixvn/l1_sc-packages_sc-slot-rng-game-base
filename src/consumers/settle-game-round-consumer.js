import { Core } from "sc-game-base";

const luckyChoice = "lucky";
export default class SettleGameRoundConsumer extends Core.BaseEventConsumers.SettleGameRoundConsumer {
    constructor({ definition, gameData, roundResultPublisher, userBetResultPublisher, endGame, roundsRepository, betsRepository }) {
        super({ definition, gameData, roundResultPublisher, userBetResultPublisher, endGame, roundsRepository, betsRepository });
    }

    async generateResult() {
        const { gameConfigs } = this.gameData;
        const { randomMode, slotRNGConfig } = gameConfigs;
        const { luckySpinFrom, luckySpinTo, mode } = slotRNGConfig;
        const { generateResult, ratioModes, symbolBetChoiceTable } = this.definition;

        const { result } = generateResult(symbolBetChoiceTable, ratioModes[mode], luckySpinFrom, luckySpinTo, randomMode);
        const numberOfSymbols = result.symbols.length;
        this.gameData.numberOfLuckyRounds = numberOfSymbols === 1 ? 0 : numberOfSymbols - 1;

        return result;
    }

    calculateBetResult(settlementResult, bet, odds) {
        const betResult = Object.entries(settlementResult).reduce(
            (result, [subChoice, win]) => {
                if (subChoice === luckyChoice) {
                    return result;
                }

                const mainChoice = this.getMainchoice(subChoice);
                const betAmount = bet[mainChoice];
                const originalOdds = odds[subChoice] || 1;
                const winAmount = win ? betAmount * originalOdds : 0;

                result.totalBetAmount += betAmount;
                result.totalWin += winAmount;
                result.winningByChoices[mainChoice] = winAmount;

                if (winAmount > 0) {
                    result.netWin += winAmount - betAmount;
                } else {
                    result.totalLost += betAmount;
                }

                return result;
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
        const { settle, defaultSettlementResult } = this.definition;
        const result = await this.generateResult();

        const settlementResult = settle(result, defaultSettlementResult);
        const { roundId, exchangeRates } = this.gameData;

        const newRound = await this.roundsRepository.create({
            id: roundId,
            result: { symbols: result.symbols, number: result.bigSmall.value },
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
    }

    getMainchoice(choiceName) {
        const subChoice = this.definition.symbolBetChoiceTable.find((choice) => choice.relatedChoices.includes(choiceName));
        return subChoice ? subChoice.name : choiceName;
    }
}
