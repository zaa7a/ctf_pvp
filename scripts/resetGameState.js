const fs =
    require("fs");

const path =
    require("path");

const initialState = {

    turn: 1,

    currentPhase:
        "ATTACKER",

    logs: [],

    history: [],

    game: {

        ended: false,

        winner: null
    },

    attacker: {

        currentIp:
            "10.0.0.5",

        availableIps: [

            "10.0.0.5",
            "10.0.0.6",
            "10.0.0.7",
            "10.0.0.8",
            "10.0.0.9"
        ],

        lastResults: []
    },

    defender: {

        lastResults: []
    },

    server: {

        openPorts: [
            80,
            443,
            8080
        ],

        wafEnabled: false,

        bannedIps: [],

        sessions: [],

        users: [

            {
                username:
                    "admin",

                password:
                    "admin123",

                role:
                    "admin"
            },

            {
                username:
                    "guest",

                password:
                    "guest",

                role:
                    "user"
            }
        ],

        routes: [],

        files: []
    }
};

const outputPath =
    path.join(
        __dirname,
        "../data/gameState.json"
    );

fs.writeFileSync(

    outputPath,

    JSON.stringify(
        initialState,
        null,
        2
    )
);

console.log(
    "gameState reset complete"
);