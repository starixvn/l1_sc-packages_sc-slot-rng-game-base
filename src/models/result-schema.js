import mongoose from "mongoose";

const resultSchema = new mongoose.Schema({
    time: { type: Date, default: new Date() },
});

export default resultSchema;
