// engine/commandHandlers/enumerateRoutes.js

const {

    getVisibleRoutes,

    getHiddenRoutes

} = require(
    "../routeManager"
);

module.exports =
    function (
        state,
        command
    ) {

        const visible =
            getVisibleRoutes(
                state
            );

        const hidden =
            getHiddenRoutes(
                state
            );

        const discovered = [

            ...visible
        ];

        for (
            const route
            of hidden
            ) {

            const chance =
                Math.random();

            if (
                chance > 0.7
            ) {

                discovered.push(
                    route
                );
            }
        }

        return {

            success: true,

            routes:
                discovered.map(

                    function (
                        route
                    ) {

                        return {

                            path:
                            route.path,

                            methods:
                            route.methods
                        };
                    }
                )
        };
    };