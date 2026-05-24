module.exports =
    async function (
        state,
        command
    ) {

        state.server.openPorts =
            state.server.openPorts.filter(
                function (p) {

                    return (
                        p !==
                        command.port
                    );
                }
            );

        state.logs.push(
            `[DEFENDER] Closed port ${command.port}`
        );

        return {
            success: true
        };
    };