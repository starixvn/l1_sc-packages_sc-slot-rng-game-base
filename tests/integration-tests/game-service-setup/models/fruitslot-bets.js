import mongoose from "mongoose";

const temptBetSchema = {
    uid: { type: String, required: true },
    name: { type: String, required: true },
    roundId: { type: Number, required: true },

    bar: { type: Number, default: 0 },
    tripleSeven: { type: Number, default: 0 },
    watermelon: { type: Number, default: 0 },
    star: { type: Number, default: 0 },
    bell: { type: Number, default: 0 },
    orange: { type: Number, default: 0 },
    lemon: { type: Number, default: 0 },
    cherry: { type: Number, default: 0 },
    big: { type: Number, default: 0 },
    small: { type: Number, default: 0 },

    totalAmount: { type: Number, default: 0 },
    thanhtoan: { type: Boolean, default: false },
    paid: { type: Boolean, default: false },
    betwin: { type: Number, default: 0 },
    time: { type: Date },
    odds: { type: Object, required: true },
};

const fruitSlotBets = mongoose.model(
    "fruitslot_bets",
    new mongoose.Schema({
        ...temptBetSchema,
        currency: { type: String, required: true },
        rate: { type: Number, required: true },
        operatorId: { type: String, required: true },
        playerId: { type: Number, required: true },
        siteId: { type: String, required: true },
        freeBet: { type: Boolean, default: false },
    })
);

const betLogsSchema = {
    uid: { type: String, required: true },
    name: { type: String, required: true },
    roundId: { type: Number, required: true },

    amount: { type: Number, default: 0, required: true },
    choice: { type: String, required: true },
    subChoices: { type: Array, required: true },
    time: { type: Date },
    clientSentTime: { type: Date },
    receivedTime: { type: Date },

    playerId: { type: Number, required: true },
    operatorId: { type: String, required: true },
    siteId: { type: String, required: true },
    freeBet: { type: Boolean },
};

const fruitSlotTemptBets = mongoose.model("fruitslot_tmpbets", new mongoose.Schema(temptBetSchema));
const fruitSlotBetLogs = mongoose.model("fruitslot_betlogs", betLogsSchema);

export { fruitSlotTemptBets, fruitSlotBets, fruitSlotBetLogs };
