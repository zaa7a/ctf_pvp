module.exports =
    async function (
        state,
        command
    ) {

        const route =
            state.server.routes.find(
                function (r) {

                    return (
                        r.path ===
                        command.path
                    );
                }
            );

        if (!route) {

            return {
                success: false
            };
        }

        route.vulnerabilities =
            route.vulnerabilities.filter(
                function (v) {

                    return (
                        v !==
                        command.vulnerability
                    );
                }
            );

        state.logs.push(
            `[DEFENDER] Patched ${command.vulnerability} on ${command.path}`
        );

        return {
            success: true
        };
    };