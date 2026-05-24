// engine/fileManager.js

function getFile(
    state,
    fileName
) {

    return state.server.files.find(

        function (
            file
        ) {

            return (
                file.name ===
                fileName
            );
        }
    );
}

function listFiles(
    state
) {

    return state.server.files;
}

module.exports = {

    getFile,

    listFiles
};