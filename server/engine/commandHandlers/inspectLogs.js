const {
    analyzeSuspiciousActivity
} = require(
    "../detectionManager"
);

module.exports =
    async function (
        state,
        command
    ) {

        const suspiciousAnalysis =
            analyzeSuspiciousActivity(
                state
            );

        return {

            success: true,

            logs:
                state.logs.slice(-30),

            suspiciousAnalysis
        };
    };