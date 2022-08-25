import { GameClientDriver, normalUser, eventTypes } from "sc-game-service-integration-utils";
import { socketOptions } from "./stubs/test-data";
import { initUserSession } from "./init-user-session";
import gameSettings from "./game-service-setup/game-settings";

export const settleTest = () => {
    describe("when settle", () => {
        const getTimeOutToBet = (remainingTime, durations) => {
            let timeout = 0;
            if (remainingTime <= durations.lockingBet) {
                timeout = durations.wholeRound - durations.placingBets + remainingTime + 2;
            } else if (remainingTime >= durations.placingBets) {
                timeout = remainingTime - durations.placingBets + 2;
            }

            return timeout;
        };

        it("should return settled status data", (done) => {
            // Arrange
            const client = new GameClientDriver(socketOptions, initUserSession(normalUser));
            client.handleSignedInEvent(() => {
                client.sendInGameEvent();
            });
            let receivedRemainingTime = false;

            // Act
            client.on(socketOptions.gameName, (inGameData) => {
                if (inGameData.remainingTime && !receivedRemainingTime) {
                    receivedRemainingTime = true;
                    setTimeout(() => {
                        console.log('eventTypes.bet, { betChoice: "big", amount: 10 }');
                        client.emit(eventTypes.bet, { betChoice: "big", amount: 10 });
                    }, getTimeOutToBet(inGameData.remainingTime, gameSettings.durations) * 1000);
                }
            });

            // Assert
            client.on(socketOptions.gameName, (data) => {
                console.log(data);
                if (data.status) {
                    expect(data.status.bet).toBeGreaterThan(0);

                    client.close();
                    done();
                }
            });
        });

        it("should return settled finish data", (done) => {
            // Arrange & Act
            const client = new GameClientDriver(socketOptions, initUserSession(normalUser));
            client.handleSignedInEvent(() => {
                client.sendInGameEvent();
            });

            // Assert
            client.on(socketOptions.gameName, (data) => {
                console.log(data);
                if (data.finish) {
                    client.close();
                    done();
                }
            });
        });
    });
};
