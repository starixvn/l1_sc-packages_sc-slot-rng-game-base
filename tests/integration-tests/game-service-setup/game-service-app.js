import { Core } from "sc-game-base";
import { initAPIStub, stubUserService } from "sc-game-service-integration-utils";

import appConfigs from "../../../src/app-configs.IGT";
import gameSettings from "./game-settings";
import ContainerRegistry from "./container-registry";
import { GameDefinition, GameData, ResultHelper } from "../../../src";

export const run = async () => {
    initAPIStub(appConfigs.apiSettings.apiUrl);
    stubUserService(appConfigs);

    const definition = new GameDefinition(gameSettings, ResultHelper.generateResult, ResultHelper.getSettlementResult);
    const gameData = new GameData(gameSettings.durations.wholeRound);
    const container = new ContainerRegistry().register(appConfigs, definition, gameData);
    const app = new Core.BaseGameApp("Fruit Slot", appConfigs);
    await app.run();
    await app.startGame(container);
};

run();
