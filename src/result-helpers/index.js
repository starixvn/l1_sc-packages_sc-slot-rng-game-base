import { ResultGenerator, BigSmallResultGenerator } from "sc-slot-rng-generator";

const generateResult = (symbolBetChoiceTable, ratio, extraMin, extraMax, mode = 1) => {
    const symbolGenerator = new ResultGenerator(symbolBetChoiceTable, { ratio, extraMin, extraMax }, mode);
    const symbolResult = symbolGenerator.generate();

    const bigSmallGenerator = new BigSmallResultGenerator(mode);
    const bigSmallResult = bigSmallGenerator.generate();

    return { result: { symbols: symbolResult, bigSmall: bigSmallResult } };
};

const getSettlementResult = (roundResult, defaultSettlementResult) => {
    const settlement = { ...defaultSettlementResult };
    roundResult.symbols.forEach((symbol) => (settlement[symbol] = true));
    settlement[roundResult.bigSmall.choice] = true;

    return settlement;
};

export { generateResult, getSettlementResult };
