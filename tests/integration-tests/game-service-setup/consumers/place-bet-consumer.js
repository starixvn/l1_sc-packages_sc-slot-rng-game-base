import BasePlaceBetConsumer from "sc-game-base/src/core/event-consumers/place-bet-consumer";
import { helpers } from "sc-common";

export default class PlaceBetConsumer extends BasePlaceBetConsumer {
    composeBettingTimeValidationCriteria(roundId) {
        const configs = this.gameData.gameConfigs;

        return [
            {
                failure: !configs.enabled,
                notice: this.getNoticeObj(helpers.noticeHelper.placeBetNextRound),
            },
            {
                failure: roundId !== this.gameData.roundId,
                notice: this.getNoticeObj(helpers.noticeHelper.invalidBet, { gameRoundId: roundId }),
            },
        ];
    }
}
