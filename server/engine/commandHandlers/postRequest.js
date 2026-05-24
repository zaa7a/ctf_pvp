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

            method: "POST",

            path:
            command.path,

            headers:
                command.headers || {},

            body:
                command.body || {}
        };

        const response =
            simulateRequest(
                state,
                request
            );

        state.logs.push(
            `[ATTACKER] ${command.ip} POST ${command.path}`
        );

        return {
            success: true,
            response
        };
    };