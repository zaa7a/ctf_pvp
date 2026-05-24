module.exports =
    async function (
        state,
        command
    ) {

        const ip =
            command.ip;

        if (!ip) {

            return {
                success: false,
                error: "Missing field ip"
            };
        }

        const sessions =
            state.server.sessions.filter(
                function (s) {

                    return s.ip === ip;
                }
            );

        return {
            success: true,
            sessions
        };
    };