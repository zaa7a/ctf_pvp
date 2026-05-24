const io = require("socket.io-client");
// サーバーのポート9050へ接続
const socket = io("http://localhost:9050");

let myRole = null;
let currentPhase = null;

// 初期状態の受け取り
socket.on("init_state", (data) => {
    updateUI(data.gameState);
    updatePlayerStatus(data.players);
});

socket.on("role_assigned", (role) => {
    myRole = role;
    document.getElementById("myRoleDisplay").innerText = `あなたのロール: ${role}`;
    document.getElementById("roleSelection").style.display = "none";
});

socket.on("role_taken", (msg) => {
    alert(msg);
});

socket.on("players_changed", (players) => {
    console.log("Players updated:", players);
});

socket.on("game_state_updated", (gameState) => {
    updateUI(gameState);
});

socket.on("error", (msg) => {
    alert(msg);
});

function selectRole(role) {
    socket.emit("choose_role", role);
}

function updateUI(state) {
    currentPhase = state.currentPhase;
    document.getElementById("turnDisplay").innerText = `現在のターン: ${state.turn} (フェーズ: ${state.currentPhase})`;

    // ログエリアの更新
    const logArea = document.getElementById("logArea");
    logArea.innerHTML = state.logs.map(log => `<div>${log}</div>`).join("");
    logArea.scrollTop = logArea.scrollHeight;

    // 自分のターンであれば送信ボタンを有効化
    const isMyTurn = (myRole === currentPhase);
    document.getElementById("submitBtn").disabled = !isMyTurn;
}

function sendTurnData() {
    const thoughts = document.getElementById("thoughtsInput").value;
    const commandsRaw = document.getElementById("commandsInput").value;

    let commands = [];
    try {
        commands = JSON.parse(commandsRaw || "[]");
    } catch(e) {
        alert("コマンドのJSONフォーマットが正しくありません。");
        return;
    }

    // サーバーへターンアクションを送信
    socket.emit("submit_commands", {
        role: myRole,
        thoughts: thoughts,
        commands: commands
    });

    // 入力欄をクリア
    document.getElementById("thoughtsInput").value = "";
    document.getElementById("commandsInput").value = "";
}

function resetGame() {
    socket.emit("reset_game");
}