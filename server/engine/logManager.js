function addAccessLog(
    state,
    line
) {

    state.logs.push(
        line
    );

    if (
        state.logs.length > 300
    ) {

        state.logs.shift();
    }
}

module.exports = {
    addAccessLog
};