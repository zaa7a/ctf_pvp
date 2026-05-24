function analyzeSuspiciousActivity(
    state
) {

    const suspiciousIps = {};

    for (
        const log
        of state.logs
        ) {

        const parts =
            log.split(" ");

        const ip =
            parts[1];

        if (!ip) {

            continue;
        }

        if (
            !suspiciousIps[ip]
        ) {

            suspiciousIps[ip] = {
                requests: 0,
                bruteForce: 0,
                scans: 0
            };
        }

        suspiciousIps[ip]
            .requests += 1;

        if (
            log.includes(
                "Brute force"
            )
        ) {

            suspiciousIps[ip]
                .bruteForce += 1;
        }

        if (
            log.includes(
                "scanned ports"
            )
        ) {

            suspiciousIps[ip]
                .scans += 1;
        }
    }

    return suspiciousIps;
}

module.exports = {
    analyzeSuspiciousActivity
};