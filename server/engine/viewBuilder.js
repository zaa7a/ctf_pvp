// engine/viewBuilder.js

function buildAttackerView(
    state
) {

    return {

        turn:
        state.turn,

        currentPhase:
        state.currentPhase,


        attacker: {

            currentIp:
            state.attacker.currentIp,

            availableIps:
            state.attacker.availableIps,

            lastResults:
            state.attacker.lastResults
        }
    };
}

function buildDefenderView(state) {

    return {

        turn: state.turn,
        currentPhase: state.currentPhase,

        logs: state.logs
            .map(log => {

                // ラベル除去
                return log
                    .replace("[ATTACKER] ", "")
                    .replace("[NOISE] ", "");
            })
            .filter(log =>
                log.includes("GET") ||
                log.includes("POST") ||
                log.includes("LOGIN") ||
                log.startsWith("[SYSTEM]")
            )
            .slice(-50),

        defender: {
            lastResults: state.defender.lastResults
        },

        server: {
            openPorts: state.server.openPorts,
            wafEnabled: state.server.wafEnabled,
            bannedIps: state.server.bannedIps,
            banner: state.server.banner,

            // routesは削る（重要）
            routes: state.server.routes.map(r => ({
                path: r.path,
                methods: r.methods,
                hidden: r.hidden
            }))
        }
    };
}

module.exports = {

    buildAttackerView,

    buildDefenderView
};