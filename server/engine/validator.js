const commandSchemas = {

    SCAN_PORTS: {
        required: [
            "ip"
        ]
    },

    GET_REQUEST: {
        required: [
            "ip",
            "path"
        ]
    },

    POST_REQUEST: {
        required: [
            "ip",
            "path",
            "body"
        ]
    },

    BRUTE_FORCE: {
        required: [
            "ip",
            "username",
            "passwords"
        ]
    },

    LOGIN_ATTEMPT: {
        required: [
            "ip",
            "username",
            "password"
        ]
    },

    EXPLOIT_SQLI: {
        required: [
            "ip",
            "path"
        ]
    },

    ENUMERATE_ROUTES: {
        required: [
            "ip"
        ]
    },

    DOWNLOAD_FILE: {
        required: [
            "ip",
            "file"
        ]
    },

    CHANGE_IP: {
        required: [
            "newIp"
        ]
    },

    INSPECT_LOGS: {
        required: []
    },

    BAN_IP: {
        required: [
            "ip"
        ]
    },

    PATCH_ROUTE: {
        required: [
            "path",
            "vulnerability"
        ]
    },

    ENABLE_WAF: {
        required: []
    },

    CLOSE_PORT: {
        required: [
            "port"
        ]
    },

    TRACE_SESSION: {
        required: [
            "token"
        ]
    }
};

function validateCommand(
    command
) {

    if (
        typeof command !==
        "object"
    ) {

        return {
            valid: false,
            error:
                "Command must be object"
        };
    }

    if (
        typeof command.type !==
        "string"
    ) {

        return {
            valid: false,
            error:
                "Missing type"
        };
    }

    const schema =
        commandSchemas[
            command.type
            ];

    if (!schema) {

        return {
            valid: false,
            error:
                "Unknown command"
        };
    }

    for (
        const field
        of schema.required
        ) {

        if (
            command[field] ===
            undefined
        ) {

            return {
                valid: false,
                error:
                    `Missing field ${field}`
            };
        }
    }

    return {
        valid: true
    };
}

function validateCommands(
    commands
) {

    if (
        !Array.isArray(
            commands
        )
    ) {

        return {
            valid: false,
            error:
                "Commands must be array"
        };
    }

    for (
        const command
        of commands
        ) {

        const result =
            validateCommand(
                command
            );

        if (!result.valid) {

            return result;
        }
    }

    return {
        valid: true
    };
}

module.exports = {

    validateCommand,

    validateCommands,

    commandSchemas
};