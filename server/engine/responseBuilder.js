function buildAiResponse(
    response
) {

    return {

        status:
        response.status,

        bodyPreview:
            response.body.slice(
                0,
                120
            ),

        responseTime:
        response.responseTime
    };
}

module.exports = {
    buildAiResponse
};