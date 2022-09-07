import { ResultGenerator, BigSmallResultGenerator } from "sc-slot-rng-generator";

const luckySymbol = "lucky";
const generateResult = (symbolBetChoiceTable, ratio, extraMin, extraMax, mode = 1) => {
    const symbolGenerator = new ResultGenerator(symbolBetChoiceTable, { ratio, extraMin, extraMax }, mode);
    const bigSmallGenerator = new BigSmallResultGenerator(mode);
    const { isLucky, choices } = symbolGenerator.generate();

    return { result: { isLucky, symbols: choices, bigSmall: bigSmallGenerator.generate() } };
};

const getSettlementResult = (roundResult, defaultSettlementResult) => {
    const settlement = { ...defaultSettlementResult };
    roundResult.symbols.forEach((symbol) => (settlement[symbol] = true));
    settlement[roundResult.bigSmall.choice] = true;
    settlement[luckySymbol] = roundResult.isLucky;

    return settlement;
};

export { generateResult, getSettlementResult, luckySymbol };
