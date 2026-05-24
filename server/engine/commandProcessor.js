//commandProcessor.js
const scanPorts =
    require(
        "./commandHandlers/scanPorts"
    );

const getRequest =
    require(
        "./commandHandlers/getRequest"
    );

const postRequest =
    require(
        "./commandHandlers/postRequest"
    );

const bruteForce =
    require(
        "./commandHandlers/bruteForce"
    );

const loginAttempt =
    require(
        "./commandHandlers/loginAttempt"
    );

const exploitSqli =
    require(
        "./commandHandlers/exploitSqli"
    );

const enumerateRoutes =
    require(
        "./commandHandlers/enumerateRoutes"
    );

const downloadFile =
    require(
        "./commandHandlers/downloadFile"
    );

const changeIp =
    require(
        "./commandHandlers/changeIp"
    );

const inspectLogs =
    require(
        "./commandHandlers/inspectLogs"
    );

const banIp =
    require(
        "./commandHandlers/banIp"
    );

const patchRoute =
    require(
        "./commandHandlers/patchRoute"
    );

const enableWaf =
    require(
        "./commandHandlers/enableWaf"
    );

const closePort =
    require(
        "./commandHandlers/closePort"
    );

const traceSession =
    require(
        "./commandHandlers/traceSession"
    );

const handlers = {

    SCAN_PORTS:
    scanPorts,

    GET_REQUEST:
    getRequest,

    POST_REQUEST:
    postRequest,

    BRUTE_FORCE:
    bruteForce,

    LOGIN_ATTEMPT:
    loginAttempt,

    EXPLOIT_SQLI:
    exploitSqli,

    ENUMERATE_ROUTES:
    enumerateRoutes,

    DOWNLOAD_FILE:
    downloadFile,

    CHANGE_IP:
    changeIp,

    INSPECT_LOGS:
    inspectLogs,

    BAN_IP:
    banIp,

    PATCH_ROUTE:
    patchRoute,

    ENABLE_WAF:
    enableWaf,

    CLOSE_PORT:
    closePort,

    TRACE_SESSION:
    traceSession
};

async function processCommand(
    state,
    command
) {

    console.log("COMMAND RECEIVED:", command);

    const ip =
        command?.params?.ip ||
        command?.ip ||
        command?.newIp;



    const attackerCommands = [

        "SCAN_PORTS",
        "GET_REQUEST",
        "POST_REQUEST",
        "BRUTE_FORCE",
        "LOGIN_ATTEMPT",
        "EXPLOIT_SQLI",
        "ENUMERATE_ROUTES",
        "DOWNLOAD_FILE",
        "CHANGE_IP"
    ];

    if (
        attackerCommands.includes(command.type)
    ) {

        const isBanned =
            state.server.bannedIps?.includes(ip);

        if (isBanned) {

            state.logs.push(
                `[SYSTEM] BLOCKED BANNED IP: ${ip}`
            );

            return {
                success: false,
                error: "IP is banned"
            };
        }
    }


    if (
        typeof command !==
        "object"
    ) {

        return {
            success: false,
            error:
                "Command must be object"
        };
    }

    if (
        typeof command.type !==
        "string"
    ) {

        return {
            success: false,
            error:
                "Missing command type"
        };
    }

    const handler =
        handlers[
            command.type
            ];

    if (!handler) {

        state.logs.push(
            `[SYSTEM] Unknown command ${command.type}`
        );

        return {
            success: false,
            error:
                `Unknown command ${command.type}`
        };
    }

    try {

        const result =
            await handler(
                state,
                command
            );

        return result;

    } catch (error) {

        state.logs.push(
            `[ERROR] ${command.type} crashed`
        );

        state.logs.push(
            `[ERROR] ${error.message}`
        );

        return {
            success: false,
            error:
            error.message
        };
    }
}

async function processCommands(
    state,
    commands
) {

    if (!Array.isArray(commands)) {
        commands = [commands];
    }

    const results = [];

    if (
        !Array.isArray(
            commands
        )
    ) {

        return [
            {
                success: false,
                error:
                    "Commands must be array"
            }
        ];
    }

    for (
        const command
        of commands
        ) {

        const result =
            await processCommand(
                state,
                command
            );

        results.push({

            command,

            result
        });
    }

    return results;
}

module.exports = {

    processCommand,

    processCommands
};