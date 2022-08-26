import awilix from "awilix";
import { Table } from "sc-game-base";

import { fruitSlotRounds, fruitSlotTemptBets, fruitSlotBets, fruitSlotBetLogs } from "./models";
import Bot from "../game-service-setup/crons/bot";
import { Consumers, Crons } from "../../../src";
const { asClass, asValue } = awilix;

export default class ContainerRegistry extends Table.TableContainerRegistry {
    registerModels() {
        super.registerModels();

        this.container.register({
            roundsRepository: asValue(fruitSlotRounds),
            betsRepository: asValue(fruitSlotBets),
            betLogsRepository: asValue(fruitSlotBetLogs),
            tempBetsRepository: asValue(fruitSlotTemptBets),
        });
    }

    registerCrons() {
        super.registerCrons();

        this.container.register({
            bot: asClass(Bot).singleton(),
            gameCron: asClass(Crons.GameCron).singleton().proxy(),
            processBetQueue: asClass(Crons.ProcessBetQueue).singleton().proxy(),
        });
    }

    registerConsumers() {
        super.registerConsumers();

        this.container.register({
            settleGameRoundConsumer: asClass(Consumers.SettleGameRoundConsumer).singleton().proxy(),
        });
    }
}
