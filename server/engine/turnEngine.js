const {
    processCommands
} = require(
    "./commandProcessor"
);

const {
    validateCommands
} = require(
    "./validator"
);

const {
} = require(
    "./phaseManager"
);

async function processTurn(
    state,
    aiOutput
) {

    const validatedCommands = [];

    const invalidResults = [];

    for (
        const command
        of aiOutput.commands
        ) {

        const validation =
            validateCommands([command]);

        if (!validation.valid) {

            state.logs.push(
                `[SYSTEM] Invalid command ${command.type || "UNKNOWN"}`
            );

            invalidResults.push({

                command,

                result: {
                    success: false,
                    error: validation.error
                }
            });

            continue;
        }

        validatedCommands.push(command);
    }

    if (
        validatedCommands.length === 0
    ) {

        return {

            success: false,

            results:
            invalidResults
        };
    }

    const noiseLogCount = Math.floor(Math.random() * 7) + 1;
    for (let i = 0; i < noiseLogCount; i++) {
        const Log = generateNoiseLog(state);
        state.logs.push(Log);
        if (Math.floor(Math.random() * 20) === 0) {
            for (let j = 0; j < 3 * noiseLogCount; j++) {
                state.logs.push(Log)
            }
        }
    }

    const commandResults =
        await processCommands(
            state,
            validatedCommands
        );

    const results = [

        ...invalidResults,

        ...commandResults
    ];




    return {

        success: true,

        results
    };
}

const noiseRoutes = {
    browse: ["/", "/home", "/about", "/products", "/contact"],
    auth: ["/login", "/signin", "/auth"],
    api: ["/api/status", "/api/info"],
    search: ["/search?q=test"]
};

const userBehaviors = [
    "browse",
    "auth",
    "api",
    "search"
];

function generateNoiseLog(state) {

    let ip =
        `${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`;

    // ★追加：fakeIpListに登録
    if (!state.fakeIpList) {
        state.fakeIpList = [];
    }
    const rad = Math.floor(Math.random() * 10);
    if (state.fakeIpList.length > 0 && rad < 5) {
        ip = state.fakeIpList[Math.floor(Math.random() * (state.fakeIpList.length))];
    }
    else if (!state.fakeIpList.includes(ip)) {
        state.fakeIpList.push(ip);
    }


    let behavior =
        userBehaviors[Math.floor(Math.random() * userBehaviors.length)];

    if (Math.floor(Math.random() * 50) === 0) {
        behavior = "admin";
    }

    const method =
        Math.random() < 0.2 ? "POST" : "GET";

    let path;

    if (behavior === "browse") {
        path = noiseRoutes.browse[Math.floor(Math.random() * noiseRoutes.browse.length)];
    }

    if (behavior === "auth") {
        path = noiseRoutes.auth[Math.floor(Math.random() * noiseRoutes.auth.length)];
    }

    if (behavior === "api") {
        path = noiseRoutes.api[Math.floor(Math.random() * noiseRoutes.api.length)];
    }

    if (behavior === "search") {
        path = noiseRoutes.search[Math.floor(Math.random() * noiseRoutes.search.length)];
    }
    if (behavior === "admin") {
        path = "admin";
    }

    return `${ip} ${method} ${path}`;
}

module.exports = {
    processTurn
};