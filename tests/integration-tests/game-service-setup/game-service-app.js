import { Core, Table } from "sc-game-base";
import { initAPIStub, stubUserService } from "sc-game-service-integration-utils";

import appConfigs from "./app-configs.IGT";
import gameSettings from "./game-settings";
import ContainerRegistry from "./container-registry";
import GameDefinition from "../../../src/game-definition";

export const run = async () => {
    initAPIStub(appConfigs.apiSettings.apiUrl);
    stubUserService(appConfigs);

    const definition = new GameDefinition(gameSettings, gameSettings.generateResult, gameSettings.settle);
    const gameData = new Table.TableGameData(gameSettings.durations.wholeRound);
    const container = new ContainerRegistry().register(appConfigs, definition, gameData);
    const app = new Core.BaseGameApp("Fruit Slot", appConfigs);
    await app.run();
    await app.startGame(container);
};

run();
