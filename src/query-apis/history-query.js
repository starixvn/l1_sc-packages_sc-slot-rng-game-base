import { HistoryQuery as BaseHistoryQuery } from "sc-game-base/src/core/query-apis";

export default class HistoryQuery extends BaseHistoryQuery {
    getBetLogDetails(player, roundId) {
        return this.betLogsRepository
            .find(
                { roundId, uid: player.UID },
                { _id: false, time: true, choice: true, amount: true, select: true, bet: true, subChoices: true },
                { sort: { _id: -1 } }
            )
            .lean()
            .exec();
    }
}
