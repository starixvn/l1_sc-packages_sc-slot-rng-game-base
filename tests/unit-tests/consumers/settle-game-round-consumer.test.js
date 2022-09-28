import { Core } from "sc-game-base";
import { stubMongoose, stub } from "jest-micro-auto-stub";
import mongoose from "mongoose";
import SettleGameRoundConsumer from "../../../src/consumers/settle-game-round-consumer";
import { gameConfig } from "../../integration-tests/stubs/test-data";
import gameSettings from "../../integration-tests/game-service-setup/game-settings";
import { GameDefinition } from "../../../src";

jest.mock("sc-game-base/src/core/event-publishers/round-result-publisher");
jest.mock("sc-game-base/src/core/event-publishers/user-bet-result-publisher");
let gameData, definition, consumer;
const gameName = "FruitSlot";
const endGame = jest.fn();
definition = new GameDefinition(gameSettings, jest.fn(), jest.fn());
gameData = new Core.GameData();
gameData.gameConfigs = gameConfig;
gameData.exchangeRates.exId = 10;

const roundsRepository = stubMongoose(mongoose.Model);
const betsRepository = stubMongoose(mongoose.Model);

const roundResultPublisher = new Core.BaseEventPublishers.RoundResultPublisher(gameName, gameData);
const userBetResultPublisher = new Core.BaseEventPublishers.UserBetResultPublisher(gameName, gameData);

beforeEach(() => {
    jest.clearAllMocks();

    consumer = new SettleGameRoundConsumer({
        definition,
        gameData,
        roundResultPublisher,
        userBetResultPublisher,
        endGame,
        roundsRepository,
        betsRepository,
    });
});

describe("SettleGameRoundConsumer test", () => {
    it("should inherit base SettleGameRoundConsumer", () => {
        expect(SettleGameRoundConsumer instanceof Core.BaseEventConsumers.SettleGameRoundConsumer);
    });
});

describe("calculateBetResult test", () => {
    const testCases = [
        {
            roundResult: { symbols: ["lemon"], symbolPositons: [1], number: 6, isLucky: false },
            settlementResult: {
                bar: false,
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
                lemon: true,
                lemon3: false,
                cherry: false,
                cherry3: false,
                lucky: false,
                big: false,
                small: true,
            },
            bet: {
                bar: 50,
                tripleSeven: 0,
                watermelon: 0,
                star: 0,
                bell: 0,
                orange: 0,
                lemon: 0,
                cherry: 0,
                big: 125,
                small: 0,
            },
            expectResult: {
                totalBetAmount: 175,
                totalWin: 0,
                netWin: 0,
                totalLost: 175,
                winningByChoices: {
                    bar: 0,
                    tripleSeven: 0,
                    watermelon: 0,
                    star: 0,
                    bell: 0,
                    orange: 0,
                    lemon: 0,
                    cherry: 0,
                    big: 0,
                    small: 0,
                },
            },
        },
        {
            roundResult: { symbols: ["bar"], symbolPositons: [1], number: 6, isLucky: false },
            settlementResult: {
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
                big: false,
                small: true,
            },
            bet: {
                bar: 10,
                tripleSeven: 0,
                watermelon: 0,
                star: 0,
                bell: 0,
                orange: 0,
                lemon: 0,
                cherry: 0,
                big: 50,
                small: 0,
            },
            expectResult: {
                totalBetAmount: 60,
                totalWin: 1000,
                netWin: 990,
                totalLost: 50,
                winningByChoices: {
                    bar: 1000,
                    tripleSeven: 0,
                    watermelon: 0,
                    star: 0,
                    bell: 0,
                    orange: 0,
                    lemon: 0,
                    cherry: 0,
                    big: 0,
                    small: 0,
                },
            },
        },
        {
            roundResult: { symbols: ["bar50"], symbolPositons: [1], number: 6, isLucky: false },
            settlementResult: {
                bar: false,
                bar50: true,
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
                big: false,
                small: true,
            },
            bet: {
                bar: 10,
                tripleSeven: 0,
                watermelon: 0,
                star: 0,
                bell: 0,
                orange: 0,
                lemon: 0,
                cherry: 0,
                big: 0,
                small: 0,
            },
            expectResult: {
                totalBetAmount: 10,
                totalWin: 500,
                netWin: 490,
                totalLost: 0,
                winningByChoices: {
                    bar: 500,
                    tripleSeven: 0,
                    watermelon: 0,
                    star: 0,
                    bell: 0,
                    orange: 0,
                    lemon: 0,
                    cherry: 0,
                    big: 0,
                    small: 0,
                },
            },
        },
        {
            roundResult: { symbols: ["bar50", "bar"], symbolPositons: [10, 2, 3], number: 6, isLucky: true },
            settlementResult: {
                bar: true,
                bar50: true,
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
                lucky: true,
                big: false,
                small: true,
            },
            bet: {
                bar: 10,
                tripleSeven: 0,
                watermelon: 0,
                star: 0,
                bell: 0,
                orange: 0,
                lemon: 0,
                cherry: 0,
                big: 0,
                small: 0,
            },
            expectResult: {
                totalBetAmount: 10,
                totalWin: 1500,
                netWin: 1490,
                totalLost: 0,
                winningByChoices: {
                    bar: 1500,
                    tripleSeven: 0,
                    watermelon: 0,
                    star: 0,
                    bell: 0,
                    orange: 0,
                    lemon: 0,
                    cherry: 0,
                    big: 0,
                    small: 0,
                },
            },
        },
        {
            roundResult: { symbols: ["bar50", "bar"], symbolPositons: [10, 2, 3], number: 6, isLucky: true },
            settlementResult: {
                bar: true,
                bar50: true,
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
                lucky: true,
                big: false,
                small: true,
            },
            bet: {
                bar: 10,
                tripleSeven: 0,
                watermelon: 0,
                star: 0,
                bell: 0,
                orange: 0,
                lemon: 0,
                cherry: 0,
                big: 50,
                small: 0,
            },
            expectResult: {
                totalBetAmount: 60,
                totalWin: 1500,
                netWin: 1490,
                totalLost: 50,
                winningByChoices: {
                    bar: 1500,
                    tripleSeven: 0,
                    watermelon: 0,
                    star: 0,
                    bell: 0,
                    orange: 0,
                    lemon: 0,
                    cherry: 0,
                    big: 0,
                    small: 0,
                },
            },
        },
        {
            roundResult: { symbols: ["lemon3", "bar"], symbolPositons: [10, 2, 3], number: 6, isLucky: true },
            settlementResult: {
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
                lemon3: true,
                cherry: false,
                cherry3: false,
                lucky: true,
                big: false,
                small: true,
            },
            bet: {
                bar: 10,
                tripleSeven: 0,
                watermelon: 0,
                star: 0,
                bell: 0,
                orange: 0,
                lemon: 10,
                cherry: 0,
                big: 50,
                small: 0,
            },
            expectResult: {
                totalBetAmount: 70,
                totalWin: 1030,
                netWin: 1010,
                totalLost: 50,
                winningByChoices: {
                    bar: 1000,
                    tripleSeven: 0,
                    watermelon: 0,
                    star: 0,
                    bell: 0,
                    orange: 0,
                    lemon: 30,
                    cherry: 0,
                    big: 0,
                    small: 0,
                },
            },
        },
    ];

    it.each(testCases)("should return correct result", ({ settlementResult, bet, roundResult, expectResult }) => {
        const actualResult = consumer.calculateBetResult(settlementResult, bet, gameData.gameConfigs.odds, roundResult);

        expect(actualResult).toEqual(expectResult);
    });
});

describe("settleRound", () => {
    const result = { symbols: ["lemon"], bigSmall: { value: 6 }, isLucky: false };
    const settlementResult = {
        bar: false,
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
        lemon: true,
        lemon3: false,
        cherry: false,
        cherry3: false,
        big: false,
        small: true,
    };

    const defaultSettlementResult = {
        bar: false,
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
        big: false,
        small: false,
    };
    const mockDate = new Date();
    const createRoundResult = { id: 1, result, settlementResult, time: mockDate };

    beforeEach(() => {
        gameData.result = result;
        definition.generateResult.mockReturnValueOnce({ result });
        definition.settle.mockReturnValueOnce(settlementResult);

        jest.spyOn(global, "Date").mockImplementation(() => mockDate);
        roundsRepository.create.mockReturnValueOnce(createRoundResult);
        consumer = new SettleGameRoundConsumer({
            definition,
            gameData,
            roundResultPublisher,
            userBetResultPublisher,
            endGame,
            roundsRepository,
            betsRepository,
        });
        consumer.settleBets = jest.fn();
    });

    it("should call settle with generated result", async () => {
        // Act
        await consumer.settleRound(result);

        // Assert
        expect(definition.settle).toHaveBeenCalledWith(result, defaultSettlementResult);
    });

    it("should create new round", async () => {
        // Act
        await consumer.settleRound(result);

        // Assert
        expect(roundsRepository.create).toHaveBeenCalledWith({
            id: 2,
            result: { symbols: ["lemon"], number: 6, isLucky: false },
            settlementResult,
            time: mockDate,
            exchangeRateId: gameData.exchangeRates.exId,
        });
    });

    describe("when create new round successfully", () => {
        it("should increase roundId", async () => {
            // Act
            await consumer.settleRound(result);

            // Assert
            expect(gameData.roundId).toBe(createRoundResult.id + 1);
        });

        it("should call settle bets", async () => {
            // Act
            await consumer.settleRound(result);

            // Assert
            expect(consumer.settleBets).toHaveBeenCalledWith({
                settlementResult,
                result,
                roundId: createRoundResult.id,
                time: createRoundResult.time,
            });
        });
    });

    describe("when failed to create new round", () => {
        beforeEach(() => {
            roundsRepository.create.mockRestore();
            roundsRepository.create.mockReturnValueOnce(undefined);
        });

        it("should not increase roundId", async () => {
            // Arrange
            const currentRoundId = 1;
            gameData.roundId = currentRoundId;

            // Act
            await consumer.settleRound(result);

            // Assert
            expect(gameData.roundId).toBe(currentRoundId);
        });

        it("should not call settle bets", async () => {
            // Act
            await consumer.settleRound(result);

            // Assert
            expect(consumer.settleBets).not.toHaveBeenCalled();
        });
    });
});

describe("calculateBetResult", () => {
    const settlementResult = {
        bar: false,
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
        lemon: true,
        lemon3: false,
        cherry: false,
        cherry3: false,
        big: false,
        small: true,
    };
    const odds = gameData.gameConfigs.odds;

    describe("when bet result is win", () => {
        const choice = "lemon";
        const bet = { [choice]: 100 };

        it("should return result with correct net win", () => {
            // Act
            const actualResult = consumer.calculateBetResult(settlementResult, bet, odds);

            // Assert
            expect(actualResult.netWin).toBe(900);
        });

        it("should return with correct total bet amount", () => {
            // Act
            const actualResult = consumer.calculateBetResult(settlementResult, bet, odds);

            // Assert
            expect(actualResult.totalBetAmount).toBe(100);
        });

        it("should return result with total win includes net win and total bet", () => {
            // Act
            const actualResult = consumer.calculateBetResult(settlementResult, bet, odds);

            // Assert
            expect(actualResult.totalWin).toBe(1000);
        });

        it("should return result with total lost is zero", () => {
            // Act
            const actualResult = consumer.calculateBetResult(settlementResult, bet, odds);

            // Assert
            expect(actualResult.totalLost).toBe(0);
        });

        it("should return correct choice winning", () => {
            // Act
            const actualResult = consumer.calculateBetResult(settlementResult, bet, odds);

            // Assert
            expect(actualResult.winningByChoices).toStrictEqual({
                bar: 0,
                tripleSeven: 0,
                watermelon: 0,
                star: 0,
                bell: 0,
                orange: 0,
                lemon: 1000,
                cherry: 0,
                big: 0,
                small: 0,
            });
        });
    });

    describe("when bet result is lose", () => {
        const bet = { bar: 500 };

        it("should return result with net win is 0", () => {
            // Act
            const actualResult = consumer.calculateBetResult(settlementResult, bet, odds);

            // Assert
            expect(actualResult.netWin).toBe(0);
        });

        it("should return result with total win is 0", () => {
            // Act
            const actualResult = consumer.calculateBetResult(settlementResult, bet, odds);

            // Assert
            expect(actualResult.totalWin).toBe(0);
        });

        it("should return result with total lost is bet amount", () => {
            // Act
            const actualResult = consumer.calculateBetResult(settlementResult, bet, odds);

            // Assert
            expect(actualResult.totalLost).toBe(500);
        });

        it("should return correct choice winning", () => {
            // Act
            const actualResult = consumer.calculateBetResult(settlementResult, bet, odds);

            // Assert
            expect(actualResult.winningByChoices).toStrictEqual({
                bar: 0,
                tripleSeven: 0,
                watermelon: 0,
                star: 0,
                bell: 0,
                orange: 0,
                lemon: 0,
                cherry: 0,
                big: 0,
                small: 0,
            });
        });
    });
});

describe("calculateWinningByGroupChoice", () => {
    const settlementResult = {
        bar: false,
        bar50: true,
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
        big: false,
        small: true,
    };
    const odds = gameData.gameConfigs.odds;

    const testCases = [
        {
            groupChoices: ["bar", "bar25", "bar50"],
            expectedResult: {
                totalWinOdds: 50,
                isWinning: true,
            },
        },
        {
            groupChoices: ["lemon", "lemon3", "lemon30"],
            expectedResult: {
                totalWinOdds: 0,
                isWinning: false,
            },
        },
    ];

    it.each(testCases)("should return correct group choice winning", ({ groupChoices, expectedResult }) => {
        // Act
        const actualResult = consumer.calculateWinningByGroupChoice(groupChoices, odds, settlementResult);

        // Assert
        expect(actualResult).toStrictEqual(expectedResult);
    });
});

beforeEach(() => {
    jest.clearAllMocks();
});
