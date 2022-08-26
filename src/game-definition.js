import { Core } from "sc-game-base";

export default class GameDefinition extends Core.GameDefinition {
    constructor(
        {
            id = 0,
            name = "",
            durations = {},
            choices = [],
            choicesMapper = {},
            hedgeBetGroups = [],
            numberOfRoundHistory = 100,
            historyPageSize = 8,
            luckySymbolAnimationTime = 2,
            luckyRoundDuration = 2,
            ratioModes = {},
            symbolBetChoiceTable = [],
            initialSettlement = {},
        },
        generateResult,
        settle
    ) {
        super(
            { id, name, durations, choices, choicesMapper, hedgeBetGroups, numberOfRoundHistory, historyPageSize },
            generateResult,
            settle
        );
        this.luckySymbolAnimationTime = luckySymbolAnimationTime;
        this.luckyRoundDuration = luckyRoundDuration;
        this.ratioModes = ratioModes;
        this.symbolBetChoiceTable = symbolBetChoiceTable;
        this.initialSettlement = initialSettlement;
    }
}
