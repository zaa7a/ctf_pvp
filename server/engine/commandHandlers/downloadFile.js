// engine/commandHandlers/downloadFile.js

const {

    getFile

} = require(
    "../fileManager"
);

const {

    validateSession,

    getSession

} = require(
    "../sessionManager"
);

module.exports =
    function (
        state,
        command
    ) {

        const file =
            getFile(

                state,

                command.fileName
            );

        if (!file) {

            return {

                success: false,

                message:
                    "File not found"
            };
        }

        let session = null;

        if (
            command.sessionToken
        ) {

            if (

                validateSession(

                    state,

                    command.sessionToken
                )
            ) {

                session =
                    getSession(

                        state,

                        command.sessionToken
                    );
            }
        }

        if (
            file.requiresAdmin
        ) {

            if (
                !session ||
                session.role !==
                "admin"
            ) {

                return {

                    success: false,

                    message:
                        "Admin required"
                };
            }
        }

        if (
            file.content.includes(
                "FLAG{"
            )
        ) {

            state.game.ended =
                true;

            state.game.winner =
                "ATTACKER";
        }

        return {

            success: true,

            file:
            file.name,

            content:
            file.content
        };
    };