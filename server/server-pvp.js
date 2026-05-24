// server-pvp.js
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" }
});

const PORT = 9050;

// 擬似的な初期ゲーム状態（既存のロジックに合わせて適宜差し替えてください）
function createInitialState() {
    return {
        turn: 1,
        currentPhase: "ATTACKER", // または "WAITING"
        logs: ["[SYSTEM] Game initialized. Waiting for players..."],
        history: [],
        game: { status: "active" },
        attacker: { availableIps: ["214.209.149.27", "45.219.45.144"] },
        defender: { bannedIps: [] }
    };
}

let gameState = createInitialState();
let players = {
    ATTACKER: null,
    DEFENDER: null
};

io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    // 現在のプレイヤーステータスとゲーム状態を送信
    socket.emit("init_state", { gameState, players });

    // ロール（役職）の選択
    socket.on("choose_role", (role) => {
        if (role !== "ATTACKER" && role !== "DEFENDER") return;

        if (!players[role]) {
            players[role] = socket.id;
            socket.join(role);
            socket.emit("role_assigned", role);
            io.emit("players_changed", players);
            console.log(`${socket.id} assigned to ${role}`);
        } else {
            socket.emit("role_taken", `${role} is already taken.`);
        }
    });

    // コマンドの送信受付
    socket.on("submit_commands", (data) => {
        const { role, commands, thoughts } = data;

        // 送信者が現在のターンのロールと一致しているかチェック
        if (players[role] !== socket.id || gameState.currentPhase !== role) {
            socket.emit("error", "It is not your turn or you do not own this role.");
            return;
        }

        console.log(`Received commands from ${role}:`, commands);

        // --- ここで既存のシミュレーターの実行・評価ロジックを呼び出す ---
        // 例: ログの追加、フェーズの切り替え、結果の反映など
        gameState.logs.push(`[${role}] Executed ${commands.length} commands.`);

        // 簡易ターン交代ロジック
        if (gameState.currentPhase === "ATTACKER") {
            gameState.currentPhase = "DEFENDER";
        } else {
            gameState.currentPhase = "ATTACKER";
            gameState.turn += 1;
        }
        // -------------------------------------------------------------

        // 全クライアントに最新のゲーム状態を同期
        io.emit("game_state_updated", gameState);
    });

    // リセット処理
    socket.on("reset_game", () => {
        gameState = createInitialState();
        io.emit("game_state_updated", gameState);
    });

    // 切断時の処理
    socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
        if (players.ATTACKER === socket.id) players.ATTACKER = null;
        if (players.DEFENDER === socket.id) players.DEFENDER = null;
        io.emit("players_changed", players);
    });
});

server.listen(PORT, () => {
    console.log(`PVP CTF Matchmaking Server running on ws://localhost:${PORT}`);
});