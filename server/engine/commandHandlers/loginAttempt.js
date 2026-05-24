// engine/commandHandlers/loginAttempt.js

const {

    createSession

} = require(
    "../sessionManager"
);

module.exports =
    function (
        state,
        command
    ) {

        const user =
            state.server.users.find(

                function (
                    user
                ) {

                    return (

                        user.username ===
                        command.username &&

                        user.password ===
                        command.password
                    );
                }
            );

        if (!user) {

            state.logs.push(

                `[AUTH FAIL] ${command.username}`
            );

            return {

                success: false,

                message:
                    "Invalid credentials"
            };
        }

        const session =
            createSession(

                state,

                user,

                command.ip
            );

        state.logs.push(

            `[AUTH SUCCESS] ${user.username}`
        );

        return {

            success: true,

            token:
            session.token,

            role:
            session.role
        };
    };