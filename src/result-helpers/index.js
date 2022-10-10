import { ResultGenerator, BigSmallResultGenerator } from "sc-slot-rng-generator";
import Chance from "chance";

const luckySymbol = "lucky";
const generateResult = (symbolBetChoiceTable, symbolPositionsMapper, ratio, min, max, mode = 1) => {
    const chance = new Chance();
    const symbolGenerator = new ResultGenerator(symbolBetChoiceTable, { ratio, min, max }, mode);
    const bigSmallGenerator = new BigSmallResultGenerator(mode);
    const { isLucky, choices } = symbolGenerator.generate();

    const symbolPositions = choices.map((choice) => {
        return chance.pickone(symbolPositionsMapper[choice]);
    });

    return {
        result: {
            isLucky,
            symbols: choices,
            symbolPositions: isLucky ? [chance.pickone(symbolPositionsMapper[luckySymbol])].concat(symbolPositions) : symbolPositions,
            bigSmall: bigSmallGenerator.generate(),
        },
    };
};

const getSettlementResult = (roundResult, defaultSettlementResult) => {
    const { isLucky, symbols, bigSmall } = roundResult;
    const settlement = { ...defaultSettlementResult };
    symbols.forEach((symbol) => (settlement[symbol] = true));
    settlement[bigSmall.choice] = true;
    settlement[luckySymbol] = isLucky;

    return settlement;
};

export { generateResult, getSettlementResult };
