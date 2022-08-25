import { Core } from "sc-game-base";

export default class RoundResultPublisher extends Core.BaseEventPublishers.BaseEventPublisher {
    publishRoundResult(roundResult) {
        const payload = { finish: roundResult };

        this.publishToAllUsers(payload);
        this.publishToAllAdmins(payload);
    }
}
