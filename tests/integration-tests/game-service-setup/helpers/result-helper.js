import { ResultGenerator } from "sc-slot-rng-generator";

const betChoiceTable = {
    choices: [
        {
            name: "bar100",
            odds: 100,
            count: 4,
            canBet: true,
            relatedChoices: ["bar50", "bar25"],
        },
        {
            name: "bar50",
            odds: 50,
            count: 8,
            canBet: false,
            relatedChoices: [],
        },
        {
            name: "bar25",
            odds: 25,
            count: 16,
            canBet: false,
            relatedChoices: [],
        },
        {
            name: "77",
            odds: 40,
            count: 15,
            canBet: true,
            relatedChoices: ["77x3"],
        },
        {
            name: "77x3",
            odds: 3,
            count: 200,
            canBet: false,
            relatedChoices: [],
        },
        {
            name: "star",
            odds: 30,
            count: 20,
            canBet: true,
            relatedChoices: ["starx3"],
        },
        {
            name: "starx3",
            odds: 3,
            count: 200,
            canBet: false,
            relatedChoices: [],
        },
        {
            name: "watermelon",
            odds: 20,
            count: 30,
            canBet: true,
            relatedChoices: ["watermelonx3"],
        },
        {
            name: "watermelonx3",
            odds: 3,
            count: 200,
            canBet: false,
            relatedChoices: [],
        },
        {
            name: "bell",
            odds: 20,
            count: 30,
            canBet: true,
            relatedChoices: ["bellx3"],
        },
        {
            name: "bellx3",
            odds: 3,
            count: 200,
            canBet: false,
            relatedChoices: [],
        },
        {
            name: "lemon",
            odds: 15,
            count: 40,
            canBet: true,
            relatedChoices: ["lemonx3"],
        },
        {
            name: "lemonx3",
            odds: 3,
            count: 200,
            canBet: false,
            relatedChoices: [],
        },
        {
            name: "orange",
            odds: 10,
            count: 60,
            canBet: true,
            relatedChoices: ["orangex3"],
        },
        {
            name: "orangex3",
            odds: 3,
            count: 200,
            canBet: false,
            relatedChoices: [],
        },
        {
            name: "cherry",
            odds: 5,
            count: 120,
            canBet: true,
            relatedChoices: ["cherryx3"],
        },
        {
            name: "cherryx3",
            odds: 3,
            count: 200,
            canBet: false,
            relatedChoices: [],
        },
    ],
};

const generateResult = (ratio, extraMin, extraMax) => {
    const generator = new ResultGenerator(betChoiceTable, { ratio, extraMin, extraMax });
    const result = generator.generate();
    return { symbol: result, number: 8 };
};

const settlementRuleEntries = Object.entries({});

const getSettlementResult = (roundResult) => {
    return {
        bar: false,
        bar25: false,
        bar50: false,
        tripleSeven: false,
        tripleSeven3: false,
        watermelon: false,
        watermelon3: false,
        star: false,
        star3: false,
        bell: false,
        bell3: false,
        orange: false,
        orange3: false,
        lemon: false,
        lemon3: false,
        cherry: false,
        cherry3: false,
        lucky: false,
        big: true,
        small: false,
    };
    // return roundResult;
};

export { generateResult, getSettlementResult };
