module.exports =
    async function (
        state,
        command
    ) {

        const openPorts =
            state.server.openPorts;

        state.logs.push(
            `[ATTACKER] ${command.ip} scanned ports`
        );

        return {
            success: true,
            openPorts
        };
    };