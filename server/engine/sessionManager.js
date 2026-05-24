// engine/sessionManager.js

const crypto =
    require("crypto");

function generateSessionToken() {

    return crypto
        .randomBytes(24)
        .toString("hex");
}

function createSession(
    state,
    user,
    ip
) {

    const token =
        generateSessionToken();

    const session = {

        token,

        username:
        user.username,

        role:
        user.role,

        ip,

        createdAt:
            Date.now()
    };

    state.server.sessions.push(
        session
    );

    return session;
}

function validateSession(
    state,
    token
) {

    return !!state.server.sessions.find(

        function (
            session
        ) {

            return (
                session.token ===
                token
            );
        }
    );
}

function getSession(
    state,
    token
) {

    return state.server.sessions.find(

        function (
            session
        ) {

            return (
                session.token ===
                token
            );
        }
    );
}

function destroySession(
    state,
    token
) {

    state.server.sessions =
        state.server.sessions.filter(

            function (
                session
            ) {

                return (
                    session.token !==
                    token
                );
            }
        );
}

module.exports = {

    createSession,

    validateSession,

    getSession,

    destroySession
};