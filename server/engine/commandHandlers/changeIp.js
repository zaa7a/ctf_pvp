module.exports =
    async function (
        state,
        command
    ) {

        const availableIps =
            state.attacker.availableIps;

        if (
            !availableIps.includes(
                command.newIp
            )
        ) {

            return {
                success: false,
                message:
                    "IP not owned"
            };
        }

        state.attacker.currentIp =
            command.newIp;

        state.logs.push(
            `[ATTACKER] Changed IP to ${command.newIp}`
        );

        return {
            success: true
        };
    };