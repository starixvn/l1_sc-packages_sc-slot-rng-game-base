import { Table } from "sc-game-base";

export default class SettleGameRoundConsumer extends Table.EventConsumers.TableSettleGameRoundConsumer {
    constructor({
        definition,
        gameData,
        roundResultPublisher,
        userBetResultPublisher,
        endGame,
        roundsRepository,
        betsRepository,
        tempBetsRepository,
    }) {
        super({
            definition,
            gameData,
            roundResultPublisher,
            userBetResultPublisher,
            endGame,
            roundsRepository,
            betsRepository,
            tempBetsRepository,
        });
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
                const betAmount = bet[mainChoice.name] ?? 0;
                const winAmount = choiceGroupResult.isWinning ? betAmount * choiceGroupResult.totalWinOdds : 0;
                result.totalWin += winAmount;

                result.winningByChoices[mainChoice.name] = winAmount;
                result.totalBetAmount += betAmount;

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

    async generateResult() {
        const { generateResult, ratioModes, symbolBetChoiceTable, symbolPositionsMapper } = this.definition;
        const { gameConfigs, settlementResultFromAdmin } = this.gameData;
        const { randomMode, slotRNGConfig } = gameConfigs;
        const { luckySpinFrom, luckySpinTo, mode } = slotRNGConfig;

        const { result } =
            this.gameData.roundId === settlementResultFromAdmin.roundId
                ? settlementResultFromAdmin
                : generateResult(symbolBetChoiceTable, symbolPositionsMapper, ratioModes[mode], luckySpinFrom, luckySpinTo, randomMode);

        const numberOfSymbols = result.symbols.length;
        this.gameData.numberOfLuckyRounds = numberOfSymbols === 1 ? 0 : numberOfSymbols - 1;

        return result;
    }

    async settleRound(result) {
        const { settle, defaultSettlementResult } = this.definition;
        const { isLucky, symbols, bigSmall, symbolPositions } = result;

        const settlementResult = settle(result, defaultSettlementResult);
        const { roundId, exchangeRates } = this.gameData;

        const newRound = await this.roundsRepository.create({
            id: roundId,
            result: {
                symbols,
                symbolPositions,
                number: bigSmall.value,
                isLucky,
            },
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
