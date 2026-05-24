module.exports =
    async function (
        state,
        command
    ) {

        const user =
            state.server.users.find(
                function (u) {

                    return (
                        u.username ===
                        command.username
                    );
                }
            );

        if (!user) {

            return {
                success: false
            };
        }

        let found = false;

        for (
            const password
            of command.passwords
            ) {

            state.logs.push(
                `[AUTH] Brute force ${command.username} with ${password}`
            );

            if (
                user.password ===
                password
            ) {

                found = true;

                return {
                    success: true,
                    password
                };
            }
        }

        return {
            success: false
        };
    };