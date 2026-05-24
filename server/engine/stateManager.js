const fs =
    require("fs");

const path =
    require("path");

const statePath =
    path.join(
        __dirname,
        "../data/gameState.json"
    );

function loadState() {

    const raw =
        fs.readFileSync(
            statePath,
            "utf8"
        );

    return JSON.parse(raw);
}

function saveState(
    state
) {

    fs.writeFileSync(
        statePath,

        JSON.stringify(
            state,
            null,
            2
        )
    );
}

module.exports = {

    loadState,

    saveState
};