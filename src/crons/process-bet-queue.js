import { Core } from "sc-game-base";

export default class ProcessBetQueue extends Core.Crons.ProcessBetQueue {
    async insertBetLog(player, roundId, bet, rate) {
        const subChoices = this.definition.symbolBetChoiceTable.find((choice) => choice.name === bet.betChoice)?.relatedChoices;

        const newBetLog = {
            uid: player.UID,
            name: player.profile.name,
            phien: roundId,
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
            newBetLog.memberId = player.session.memberId;
            newBetLog.siteId = player.session.siteId;
            newBetLog.partnerId = player.session.partnerId;
            newBetLog.currency = player.session.currencyName;
            newBetLog.rate = rate;

            newBetLog.operatorId = player.session.partnerId;
            newBetLog.playerId = player.session.memberId;
        }

        await this.betLogsRepository.create(newBetLog);
    }
}
