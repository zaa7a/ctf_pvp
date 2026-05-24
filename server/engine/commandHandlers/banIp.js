//banIp.js
module.exports = async (state, command) => {

    const ip =
        command?.params?.ip ??
        command?.ip ??
        command?.targetIp;

    if (!ip) {
        return {
            success: false,
            error: "Missing field ip"
        };
    }

    if (!state.fakeIpList) {
        state.fakeIpList = [];
    }

    if (!state.server.bannedIps) {
        state.server.bannedIps = [];
    }

    // 攻撃者IPか判定
    const isAttackerIp =
        state.attacker.availableIps.includes(ip);

    // 一般ユーザーIPか判定
    const isFakeIp =
        state.fakeIpList.includes(ip);

    if (!state.server.bannedIps.includes(ip)) {
        state.server.bannedIps.push(ip);
    }

    let resultType = "UNKNOWN";

    if (isAttackerIp) {
        resultType = "VALID";
    }

    if (isFakeIp) {
        resultType = "FALSE_POSITIVE";
    }

    state.logs.push(
        `[SYSTEM] IP BANNED: ${ip} (${resultType})`
    );

    return {
        success: true,
        banned: ip,
        valid: isAttackerIp,
        falsePositive: isFakeIp
    };
};