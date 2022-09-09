import { Core } from "sc-game-base";

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
        const { symbolBetChoiceTable, hedgeBetGroups } = this.definition;
        const mainChoices = symbolBetChoiceTable
            .filter((choice) => choice.relatedChoices?.length > 0)
            .concat(
                hedgeBetGroups.map((choice) => {
                    return { name: choice };
                })
            );

        const betResult = mainChoices.reduce(
            (result, mainChoice) => {
                const choiceGroup = [mainChoice.name].concat([...(mainChoice?.relatedChoices || [])]);
                const choiceGroupResult = this.calculateWinningByGroupChoice(choiceGroup, odds, settlementResult);
                const betAmount = bet[mainChoice.name];
                const winAmount = choiceGroupResult.isWinning ? betAmount * choiceGroupResult.totalWinOdds : 0;
                result.totalWin += winAmount;

                result.winningByChoices[mainChoice.name] = winAmount;
                result.totalAmount += betAmount;

                if (winAmount > 0) {
                    result.netWin += winAmount - betAmount;
                } else {
                    result.totalLost += betAmount;
                }

                return result;
            },
            {
                totalAmount: 0,
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
        const { isLucky, symbols, bigSmall } = result;

        const settlementResult = settle(result, defaultSettlementResult);
        const { roundId, exchangeRates } = this.gameData;

        const newRound = await this.roundsRepository.create({
            id: roundId,
            result: { symbols, number: bigSmall.value, isLucky },
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

    calculateWinningByGroupChoice(choiceGroup, odds, settlementResult) {
        return choiceGroup.reduce(
            (result, choice) => {
                if (settlementResult[choice]) {
                    result.totalWinOdds += odds[choice] || 1;
                    result.isWinning = true;
                }

                return result;
            },
            { totalWinOdds: 0, isWinning: false }
        );
    }
}
