import { ResultGenerator, BigSmallResultGenerator } from "sc-slot-rng-generator";

const generateResult = (symbolBetChoiceTable, ratio, extraMin, extraMax, mode = 1) => {
    const symbolGenerator = new ResultGenerator(symbolBetChoiceTable, { ratio, extraMin, extraMax }, mode);
    const symbolResult = symbolGenerator.generate();

    const bigSmallGenerator = new BigSmallResultGenerator(mode);
    const bigSmallResult = bigSmallGenerator.generate();

    return { result: { symbols: symbolResult, bigSmall: bigSmallResult } };
};

const getSettlementResult = (roundResult, initialSettlement) => {
    roundResult.symbols.forEach((symbol) => (initialSettlement[symbol] = true));
    initialSettlement[roundResult.bigSmall.choice] = true;

    return initialSettlement;
};

export { generateResult, getSettlementResult };
