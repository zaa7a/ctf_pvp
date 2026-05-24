// server.js

const express =
    require("express");

const path =
    require("path");

const {

    loadState,

    saveState

} = require(
    "./engine/stateManager"
);

const {

    buildAttackerView,

    buildDefenderView

} = require(
    "./engine/viewBuilder"
);

const {

    processTurn

} = require(
    "./engine/turnEngine"
);

const {

    switchPhase

} = require(
    "./engine/phaseManager"
);

const app =
    express();

const PORT =
    3000;

app.use(
    express.json()
);

app.use(
    express.static(
        path.join(
            __dirname,
            "public"
        )
    )
);

function randomChoice(
    array
) {

    return array[
        Math.floor(
            Math.random() *
            array.length
        )
        ];
}

function generatePublicIp() {

    while (true) {

        const a =
            Math.floor(
                Math.random() * 223
            ) + 1;

        const b =
            Math.floor(
                Math.random() * 256
            );

        const c =
            Math.floor(
                Math.random() * 256
            );

        const d =
            Math.floor(
                Math.random() * 256
            );

        if (
            a === 10
        ) {

            continue;
        }

        if (
            a === 192 &&
            b === 168
        ) {

            continue;
        }

        if (
            a === 172 &&
            b >= 16 &&
            b <= 31
        ) {

            continue;
        }

        return `${a}.${b}.${c}.${d}`;
    }
}

function generateAttackerIps() {

    const ips = [];

    while (
        ips.length < 5
        ) {

        const ip =
            generatePublicIp();

        if (
            !ips.includes(ip)
        ) {

            ips.push(ip);
        }
    }

    return ips;
}

function generatePorts() {

    const common = [

        80,
        443,
        8080,
        3000,
        5000,
        8888
    ];

    const ports = [];

    const count =
        Math.floor(
            Math.random() * 4
        ) + 2;

    while (
        ports.length < count
        ) {

        const port =
            randomChoice(
                common
            );

        if (
            !ports.includes(
                port
            )
        ) {

            ports.push(
                port
            );
        }
    }

    return ports;
}

function generateUsers() {

    const names = [

        "admin",
        "root",
        "system",
        "manager",
        "operator"
    ];

    const passwords = [

        "password",
        "123456",
        "admin123",
        "root",
        "qwerty",
        "letmein"
    ];

    return [

        {
            username:
                randomChoice(
                    names
                ),

            password:
                randomChoice(
                    passwords
                ),

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
    ];
}

function generateRoutes() {

    const loginRoutes = [

        "/login",
        "/signin",
        "/auth"
    ];

    const dashboardRoutes = [

        "/dashboard",
        "/home",
        "/profile"
    ];

    const adminRoutes = [

        "/admin",
        "/control",
        "/panel",
        "/manage",
        "/console"
    ];

    return {

        loginPath:
            randomChoice(
                loginRoutes
            ),

        dashboardPath:
            randomChoice(
                dashboardRoutes
            ),

        adminPath:
            randomChoice(
                adminRoutes
            )
    };
}

function generateFlag() {

    const chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    let result =
        "FLAG{";

    for (
        let i = 0;
        i < 16;
        i++
    ) {

        result +=
            chars[
                Math.floor(
                    Math.random() *
                    chars.length
                )
                ];
    }

    result += "}";

    return result;
}

function generateFiles() {

    const names = [

        "goal.data",
        "backup.zip",
        "admin.db",
        "users.db",
        "config.json"
    ];

    return [

        {
            name:
                randomChoice(
                    names
                ),

            content:
                generateFlag(),

            requiresAdmin:
                true,

            hidden:
                true
        }
    ];
}

function generateServerBanner() {

    return randomChoice([

        "Apache/2.4.54",

        "nginx/1.22.0",

        "IIS/10.0",

        "NodeJS/Express"
    ]);
}

function createInitialState() {

    const attackerIps =
        generateAttackerIps();

    const users =
        generateUsers();

    const routeData =
        generateRoutes();

    const files =
        generateFiles();

    return {

        turn: 1,

        currentPhase: "ATTACKER",

        logs: [
            "[SYSTEM] Game initialized",
            "[SYSTEM] Starting with attacker turn"
        ],

        history: [],

        game: {
            ended: false,
            winner: null
        },

        attacker: {
            currentIp: attackerIps[0],
            availableIps: attackerIps,
            lastResults: []
        },

        defender: {
            lastResults: []
        },

        server: {
            openPorts: generatePorts(),
            wafEnabled: Math.random() > 0.5,
            banner: generateServerBanner(),

            bannedIps: [],
            sessions: [],

            users,

            routes: [
                {
                    path: "/",
                    methods: ["GET"],
                    authRequired: false,
                    hidden: false,
                    vulnerabilities: []
                },
                {
                    path: routeData.loginPath,
                    methods: ["GET", "POST"],
                    authRequired: false,
                    hidden: false,
                    vulnerabilities: ["SQLI"]
                },
                {
                    path: routeData.dashboardPath,
                    methods: ["GET"],
                    authRequired: true,
                    hidden: false,
                    vulnerabilities: []
                },
                {
                    path: routeData.adminPath,
                    methods: ["GET"],
                    authRequired: true,
                    hidden: true,
                    vulnerabilities: []
                }
            ],

            files
        },

        fakeIpList: []
    };
}

function ensureStateStructure(
    state
) {

    if (!state.logs) {

        state.logs = [];
    }

    if (!state.history) {

        state.history = [];
    }

    if (!state.game) {

        state.game = {

            ended: false,

            winner: null
        };
    }

    if (!state.server) {

        state.server = {};
    }

    if (!state.server.bannedIps) {

        state.server.bannedIps = [];
    }

    if (!state.fakeIpList) {

        state.fakeIpList = [];
    }

    return state;
}

app.get("/api/state", (req, res) => {

    const state = loadState();

    res.json(state);
});

app.get("/api/prompt", (req, res) => {

    const state = loadState();

    if (state.currentPhase === "ATTACKER") {

        return res.json({

            role: "ATTACKER",

            prompt: buildAttackerView(state)
        });
    }

    return res.json({

        role: "DEFENDER",

        prompt: buildDefenderView(state)
    });
});

app.post(

    "/api/turn",

    async function (
        req,
        res
    ) {

        try {

            let state =
                loadState();

            state =
                ensureStateStructure(
                    state
                );

            if (
                state.game.ended
            ) {

                return res.json({

                    success: false,

                    message:
                        "Game already ended",

                    winner:
                    state.game.winner
                });
            }

            const aiResponse =
                req.body;

            const thoughts =
                aiResponse.thoughts || [];

            const commands =
                aiResponse.commands || [];

            const results =
                await processTurn(

                    state,

                    {

                        phase:
                        state.currentPhase,

                        thoughts,

                        commands
                    }
                );

            // =========================
            // ATTACK SUCCESS CHECK
            // =========================

            const downloadedAdminFile =
                results?.results?.some(entry => {

                    if (
                        !entry ||
                        !entry.command ||
                        !entry.result
                    ) {

                        return false;
                    }

                    if (
                        entry.command.type !==
                        "DOWNLOAD_FILE"
                    ) {

                        return false;
                    }

                    if (
                        entry.result.success !== true
                    ) {

                        return false;
                    }

                    return true;
                });

            if (
                downloadedAdminFile
            ) {

                state.game.ended =
                    true;

                state.game.winner =
                    "ATTACKER";

                state.logs.push(
                    "[SYSTEM] ATTACKER WON: Protected file downloaded"
                );
            }

            // =========================
            // FALSE BAN CHECK
            // =========================

            const falseBanCount =
                state.server.bannedIps.filter(ip =>

                    state.fakeIpList.includes(ip)

                ).length;

            if (
                falseBanCount >= 10
            ) {

                state.game.ended =
                    true;

                state.game.winner =
                    "ATTACKER";

                state.logs.push(
                    "[SYSTEM] ATTACKER WON: Too many false bans"
                );
            }

            // =========================
            // DEFENDER WIN CHECK
            // =========================

            const bannedAttackerCount =
                state.attacker.availableIps.filter(ip =>

                    state.server.bannedIps.includes(ip)

                ).length;

            if (
                bannedAttackerCount >=
                state.attacker.availableIps.length
            ) {

                state.game.ended =
                    true;

                state.game.winner =
                    "DEFENDER";

                state.logs.push(
                    "[SYSTEM] DEFENDER WON: All attacker IPs banned"
                );
            }

            state.history.push({

                turn:
                state.turn,

                phase:
                state.currentPhase,

                thoughts,

                commands,

                results
            });

            if (
                state.currentPhase ===
                "ATTACKER"
            ) {

                state.attacker.lastResults =
                    results;

            } else {

                state.defender.lastResults =
                    results;
            }

            console.log(
                "BEFORE SWITCH:",
                state.currentPhase
            );

            switchPhase(state);

            console.log(
                "AFTER SWITCH:",
                state.currentPhase
            );

            saveState(
                state
            );

            res.json({

                success: true,

                turn:
                state.turn,

                currentPhase:
                state.currentPhase,

                results,

                game: state.game
            });

        } catch (
            error
            ) {

            console.error(
                error
            );

            res.status(500).json({

                success: false,

                error:
                error.message
            });
        }
    }
);

app.post(

    "/api/reset",

    function (
        req,
        res
    ) {

        const initialState =
            createInitialState();

        saveState(
            initialState
        );

        res.json({

            success: true
        });
    }
);

const initialState =
    createInitialState();

saveState(
    initialState
);

app.listen(

    PORT,

    function () {

        console.log(
            `Server running on http://localhost:${PORT}`
        );
    }
);