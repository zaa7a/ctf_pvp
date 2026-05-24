const {
    simulateRequest
} = require(
    "../requestSimulator"
);

module.exports =
    async function (
        state,
        command
    ) {

        const request = {

            ip:
            command.ip,

            method: "GET",

            path:
            command.path,

            headers:
                command.headers || {},

            body: ""
        };

        const response =
            simulateRequest(
                state,
                request
            );

        state.logs.push(
            `[ATTACKER] ${command.ip} GET ${command.path}`
        );

        return {
            success: true,
            response
        };
    };