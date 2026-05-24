function extractJson(text) {

    const cleaned =
        text
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

    const start =
        cleaned.indexOf("{");

    const end =
        cleaned.lastIndexOf("}");

    if (
        start === -1 ||
        end === -1
    ) {
        throw new Error(
            "JSON not found"
        );
    }

    const jsonText =
        cleaned.slice(
            start,
            end + 1
        );

    return JSON.parse(jsonText);
}

module.exports = {
    extractJson
};