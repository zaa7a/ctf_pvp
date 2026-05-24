// engine/phaseManager.js

function switchPhase(
    state
) {

    if (
        state.currentPhase ===
        "ATTACKER"
    ) {

        state.currentPhase =
            "DEFENDER";

    } else {

        state.currentPhase =
            "ATTACKER";

        state.turn += 1;
    }
}

module.exports = {

    switchPhase
};