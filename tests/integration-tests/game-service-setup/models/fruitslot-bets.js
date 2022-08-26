import mongoose from "mongoose";

const temptBetSchema = {
    uid: { type: String, required: true },
    name: { type: String, required: true },
    roundId: { type: Number, required: true },
    phien: { type: Number, required: true },

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

    thanhtoan: { type: Boolean, default: false },
    paid: { type: Boolean, default: false },
    betwin: { type: Number, default: 0 },
    time: { type: Date },
    odds: { type: Object },

    memberId: { type: Number },
    playerId: { type: Number },
    siteId: { type: String },
    freeBet: { type: Boolean, default: false },
};

const fruitSlotBets = mongoose.model(
    "fruitslot_bets",
    new mongoose.Schema({
        ...temptBetSchema,
        currency: { type: String, require: true },
        rate: { type: Number, require: true },
        operatorId: { type: String, require: true },
        partnerId: { type: String, require: true },
    })
);

const betLogsSchema = {
    uid: { type: String, required: true },
    name: { type: String, required: true },
    roundId: { type: Number, required: true },

    choice: { type: String, default: 0 },
    subChoices: { type: Object },
    time: { type: Date },
    clientSentTime: { type: Date },
    receivedTime: { type: Date },
    odds: { type: Object },

    playerId: { type: Number },
    operatorId: { type: String, require: true },
    siteId: { type: String },
    freeBet: { type: Boolean, default: false },
};

const fruitSlotTemptBets = mongoose.model("fruitslot_tempbets", new mongoose.Schema(temptBetSchema));
const fruitSlotBetLogs = mongoose.model("fruitslot_betlogs", betLogsSchema);

export { fruitSlotTemptBets, fruitSlotBets, fruitSlotBetLogs };
