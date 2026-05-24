// engine/routeManager.js

function getRoute(
    state,
    path
) {

    return state.server.routes.find(

        function (
            route
        ) {

            return (
                route.path ===
                path
            );
        }
    );
}

function routeExists(
    state,
    path
) {

    return !!getRoute(
        state,
        path
    );
}

function methodAllowed(
    route,
    method
) {

    if (!route) {

        return false;
    }

    return route.methods.includes(
        method
    );
}

function routeRequiresAuth(
    route
) {

    if (!route) {

        return false;
    }

    return (
        route.authRequired ===
        true
    );
}

function getVisibleRoutes(
    state
) {

    return state.server.routes.filter(

        function (
            route
        ) {

            return (
                !route.hidden
            );
        }
    );
}

function getHiddenRoutes(
    state
) {

    return state.server.routes.filter(

        function (
            route
        ) {

            return (
                route.hidden
            );
        }
    );
}

module.exports = {

    getRoute,

    routeExists,

    methodAllowed,

    routeRequiresAuth,

    getVisibleRoutes,

    getHiddenRoutes
};