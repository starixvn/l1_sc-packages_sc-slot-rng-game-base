import { ResultHelper } from "../../../src";
import gameSettings from "../../integration-tests/game-service-setup/game-settings";
import { symbolPositonsMapper } from "../../integration-tests/game-service-setup/constants";

const fakeSymbolResult = {
    isLucky: false,
    choices: ["bar"],
};

const fakeBigSmallResult = {
    value: 8,
    choice: "big",
};

const fakeRoundResult = {
    result: {
        isLucky: fakeSymbolResult.isLucky,
        symbols: fakeSymbolResult.choices,
        bigSmall: fakeBigSmallResult,
        symbolPositons: [5],
    },
};

jest.mock("sc-slot-rng-generator", () => {
    return {
        ResultGenerator: class BaseClass {
            generate() {
                return fakeSymbolResult;
            }
        },
        BigSmallResultGenerator: class BaseClass {
            generate() {
                return fakeBigSmallResult;
            }
        },
    };
});

describe("generateResult", () => {
    it("should return correct result", async () => {
        //Act
        const actualResult = ResultHelper.generateResult([], symbolPositonsMapper, 2, 1, 2, 1);

        // Assert
        expect(actualResult).toEqual(fakeRoundResult);
    });
});

describe("getSettlementResult", () => {
    it("should return correct settlement", async () => {
        //Arrange
        const expectedResult = {
            bar: true,
            bar50: false,
            bar25: false,
            tripleSeven: false,
            tripleSeven3: false,
            watermelon: false,
            watermelon3: false,
            star: false,
            star3: false,
            bell: false,
            bell3: false,
            orange: false,
            orange3: false,
            lemon: false,
            lemon3: false,
            cherry: false,
            cherry3: false,
            lucky: false,
            big: true,
            small: false,
        };

        //Act
        const actualResult = ResultHelper.getSettlementResult(fakeRoundResult.result, gameSettings.defaultSettlementResult);

        // Assert
        expect(actualResult).toEqual(expectedResult);
    });
});
