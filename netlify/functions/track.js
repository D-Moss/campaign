export async function handler(event) {
    try {
        if (event.httpMethod !== "POST") {
            return {
                statusCode: 405, body: "Method Not Allowed"
            };
        }

        const data = JSON.parse(event.body || "{}");

        if (!data.event || !data.ts || !data.path) {

            return {
                statusCode: 400, body: "Bad Request"
            };
        }

        console.log("TRACK_EVENT", JSON.stringify(data));

        return {
            statusCode: 200, body: "ok"
        };
    } catch (err) {
        console.error("TRACK_ERROR", err);
        return {
            statusCode: 200, body: "ok"
        };
    }
}