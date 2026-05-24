// engine/requestSimulator.js

const {

    getRoute,

    routeExists,

    methodAllowed,

    routeRequiresAuth

} = require(
    "./routeManager"
);

const {

    validateSession,

    getSession

} = require(
    "./sessionManager"
);

function extractSessionToken(
    request
) {

    if (
        request.sessionToken
    ) {

        return request.sessionToken;
    }

    if (
        request.headers &&
        request.headers.cookie
    ) {

        const cookie =
            request.headers.cookie;

        const parts =
            cookie.split("=");

        if (
            parts[0] ===
            "session"
        ) {

            return parts[1];
        }
    }

    return null;
}

function simulateRequest(
    state,
    request
) {

    const response = {

        status: 500,

        body: "",

        headers: {},

        cookies: [],

        responseTime:
            Math.floor(
                Math.random() * 200
            ) + 20
    };

    response.headers.server =
        state.server.banner;

    if (
        state.server.bannedIps.includes(
            request.ip
        )
    ) {

        response.status = 403;

        response.body =
            "IP banned";

        return response;
    }

    const sessionToken =
        extractSessionToken(
            request
        );

    let session = null;

    if (
        sessionToken
    ) {

        if (

            validateSession(

                state,

                sessionToken
            )
        ) {

            session =
                getSession(

                    state,

                    sessionToken
                );
        }
    }

    const isAdmin =
        session &&
        session.role ===
        "admin";

    if (
        state.server.wafEnabled
    ) {

        if (
            request.path.includes(
                "'"
            )
        ) {

            response.status = 403;

            response.body =
                "Blocked by WAF";

            return response;
        }
    }

    if (
        !routeExists(
            state,
            request.path
        )
    ) {

        response.status = 404;

        response.body =
            "Not Found";

        return response;
    }

    const route =
        getRoute(
            state,
            request.path
        );

    if (
        !methodAllowed(
            route,
            request.method
        )
    ) {

        response.status = 405;

        response.body =
            "Method Not Allowed";

        return response;
    }

    if (
        routeRequiresAuth(
            route
        )
    ) {

        if (!session) {

            response.status = 401;

            response.body =
                "Authentication Required";

            return response;
        }
    }

    if (
        route.hidden &&
        !isAdmin
    ) {

        response.status = 403;

        response.body =
            "Admin Required";

        return response;
    }

    if (
        route.vulnerabilities.includes(
            "SQLI"
        )
    ) {

        if (
            request.body &&
            request.body.username &&
            request.body.username.includes(
                "' OR '1'='1"
            )
        ) {

            response.status = 200;

            response.body =
                "SQL Injection Success";

            response.sqli =
                true;

            return response;
        }
    }

    response.status = 200;

    response.body =
        `Page ${request.path}`;

    return response;
}

module.exports = {

    simulateRequest
};