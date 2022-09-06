import { choiceNames, defaultSettlementResult, choicesMapper, hedgeBetGroups, symbolBetChoiceTable } from "./constants";

export default {
    id: 59,
    name: "FruitSlot",
    durations: {
        wholeRound: 47,
        placingBets: 35,
        lockingBet: 5,
    },
    choices: Object.values(choiceNames),
    choicesMapper,
    hedgeBetGroups,
    numberOfRoundHistory: 100,
    luckySymbolAnimationTime: 2,
    luckyRoundDuration: 2,
    defaultSettlementResult,
    symbolBetChoiceTable,
    ratioModes: {
        1: 0.24,
        2: 0.21,
        3: 0.18,
    },
};
