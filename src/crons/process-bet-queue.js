import { Table } from "sc-game-base";

export default class ProcessBetQueue extends Table.Crons.TableProcessBetQueue {
    async insertBetLog(player, roundId, bet, rate) {
        const subChoices = this.definition.symbolBetChoiceTable.find((choice) => choice.name === bet.betChoice)?.relatedChoices ?? [];

        const newBetLog = {
            uid: player.UID,
            name: player.profile.name,
            time: new Date(),
            choice: bet.betChoice,
            subChoices,
            amount: bet.amount,
            freeBet: bet.freeBet,
            clientSentTime: bet.clientSentTime,
            receivedTime: bet.receivedTime,
            roundId,
        };

        if (player.session) {
            newBetLog.siteId = player.session.siteId;
            newBetLog.currency = player.session.currencyName;
            newBetLog.rate = rate;
            newBetLog.operatorId = player.session.operatorId;
            newBetLog.playerId = player.session.playerId;
        }

        await this.betLogsRepository.create(newBetLog);
    }
}
