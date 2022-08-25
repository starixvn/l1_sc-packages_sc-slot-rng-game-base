export default class RoundResultConsumer {
    constructor(gameData, definition, roundResultPublisher, resultsRepository, logService) {
        this.gameData = gameData;
        this.definition = definition;
        this.roundResultPublisher = roundResultPublisher;
        this.resultsRepository = resultsRepository;
        this.logService = logService;
    }

    generateResult() {
        return this.definition.generateResult(0.5, 1, 2);
    }

    getResultFromAdmin() {
        return [];
    }
}
