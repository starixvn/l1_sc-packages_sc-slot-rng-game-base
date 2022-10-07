jest.mock("sc-game-base", () => {
    return {
        Core: {
            Crons: {
                BaseGameCron: class BaseClass {
                    resetForNewRound() {}
                },
                ProcessBetQueue: class BaseClass {
                    resetForNewRound() {}
                },
            },
            BaseEventConsumers: {
                InGameConsumer: class BaseClass {},
                SettleGameRoundConsumer: class BaseClass {},
                AdminMonitorConsumer: class BaseClass {},
                PlaceBetConsumer: class BaseClass {},
            },
            BaseEventPublishers: {
                BaseEventPublisher: class BaseClass {},
                RunningRoundInfoPublisher: class BaseClass {},
            },
            GameDefinition: class BaseClass {},
            QueryApis: {
                RoundQuery: class BaseClass {},
                HistoryQuery: class BaseClass {},
            },
            GameData: class BaseClass {},
        },
        Table: {
            Crons: {
                TableGameCron: class BaseClass {
                    resetForNewRound() {}
                },
                TableProcessBetQueue: class BaseClass {
                    resetForNewRound() {}
                },
            },
            EventConsumers: {
                TableSettleGameRoundConsumer: class BaseClass {},
            },
        },
    };
});

import { Crons } from "../../../src";
let gameCron;

describe("proceed", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        gameCron = new Crons.GameCron();
    });

    describe("when isNewRound", () => {
        it("should checkGameStatus", async () => {
            //Arrange
            gameCron = buildGameCon(
                gameCron,
                {
                    luckyRoundDuration: 2,
                    luckySymbolAnimationTime: 2,
                    durations: {
                        wholeRound: 42,
                        placingBets: 30,
                    },
                },
                {
                    remainingTime: 42,
                    disabled: true,
                }
            );

            gameCron.isStartingTime = jest.fn(() => true);

            // Act
            await gameCron.proceed();

            // Assert
            expect(gameCron.checkGameStatus).toHaveBeenCalled();
        });
    });

    describe("when isStartingTime true", () => {
        beforeEach(async () => {
            //Arrange
            gameCron = buildGameCon(
                gameCron,
                {
                    luckyRoundDuration: 2,
                    luckySymbolAnimationTime: 2,
                    durations: {
                        placingBets: 5,
                        wholeRound: 8,
                    },
                },
                {
                    remainingTime: 5,
                    disabled: true,
                }
            );

            gameCron.isStartingTime = jest.fn(() => true);

            // Act
            await gameCron.proceed();
        });

        it("should call resetForNewRound", async () => {
            // Assert
            expect(gameCron.resetForNewRound).toHaveBeenCalled();
        });

        it("should call bot reset", async () => {
            // Act
            await gameCron.proceed();

            // Assert
            expect(gameCron.bot.reset).toHaveBeenCalled();
        });
    });

    describe("when remainingTime < 0", () => {
        beforeEach(async () => {
            //Arrange
            gameCron = buildGameCon(
                gameCron,
                {
                    luckyRoundDuration: 2,
                    luckySymbolAnimationTime: 2,
                    durations: {
                        placingBets: 5,
                        wholeRound: 8,
                    },
                },
                {
                    remainingTime: -1,
                    disabled: true,
                    numberOfLuckyRounds: 2,
                }
            );

            // Act
            await gameCron.proceed();
        });

        it("should call settleRound", async () => {
            // Assert
            expect(gameCron.settleGameRoundConsumer.settleRound).toHaveBeenCalled();
        });

        it("should plus extra time in lucky case ", async () => {
            // Assert
            expect(gameCron.gameData.remainingTime).toBe(14);
        });
    });

    describe("remainingTime < placingBets", () => {
        beforeEach(async () => {
            //Arrange
            gameCron = buildGameCon(
                gameCron,
                {
                    luckyRoundDuration: 2,
                    luckySymbolAnimationTime: 2,
                    durations: {
                        placingBets: 5,
                        wholeRound: 8,
                    },
                },
                {
                    remainingTime: 4,
                    disabled: true,
                }
            );

            // Act
            await gameCron.proceed();
        });

        it("should call bot run", async () => {
            // Assert
            expect(gameCron.bot.run).toHaveBeenCalled();
        });

        it("should call runningRoundInfoPublisher publish", async () => {
            // Assert
            expect(gameCron.runningRoundInfoPublisher.publish).toHaveBeenCalled();
        });
    });
});

const buildGameCon = (gameCron, definition, gameData) => {
    gameCron.gameData = gameData;
    gameCron.definition = definition;
    gameCron.checkGameStatus = jest.fn();
    gameCron.isStartingTime = jest.fn(() => false);
    gameCron.settleGameRoundConsumer = {
        settleRound: jest.fn(),
        generateResult: jest.fn(),
    };
    gameCron.bot = {
        reset: jest.fn(),
        run: jest.fn(),
    };
    gameCron.runningRoundInfoPublisher = {
        publish: jest.fn(),
    };
    gameCron.resetForNewRound = jest.fn();
    return gameCron;
};
