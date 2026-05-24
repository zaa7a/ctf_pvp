module.exports =
    async function (
        state,
        command
    ) {

        state.server.wafEnabled =
            true;

        state.logs.push(
            `[DEFENDER] WAF enabled`
        );

        return {
            success: true,
            action: "WAF_ENABLED"
        };
    };