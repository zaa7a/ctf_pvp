// public/app.js

const state = {
    spectatorState: null,
    roleState: null
};

async function loadStates() {

    const [stateRes, promptRes] = await Promise.all([
        fetch("/api/state"),
        fetch("/api/prompt")
    ]);

    state.spectatorState = await stateRes.json();
    state.promptState = await promptRes.json();

    renderAll();
}

function renderAll() {
    renderTurnInfo();
    renderLogs();
    renderHistory();
    renderState();
    renderPrompt();
    renderThoughts();
    renderResults();
}

function renderTurnInfo() {

    const gameState =
        state.spectatorState;

    document.getElementById("turnValue").textContent =
        gameState.turn;

    document.getElementById("phaseValue").textContent =
        gameState.currentPhase;

    if (gameState.game && gameState.game.winner) {

        document.getElementById("winnerValue").textContent =
            gameState.game.winner;

    } else {

        document.getElementById("winnerValue").textContent =
            "NONE";
    }
}

function renderLogs() {

    const logsBox =
        document.getElementById("logsBox");

    logsBox.innerHTML = "";

    const logs =
        state.spectatorState.logs || [];

    for (const log of logs.slice().reverse()) {

        const div =
            document.createElement("div");

        div.className =
            "logEntry";

        div.textContent =
            log;

        logsBox.appendChild(div);
    }
}

function renderHistory() {

    const historyBox =
        document.getElementById("historyBox");

    historyBox.innerHTML = "";

    const history =
        state.spectatorState.history || [];

    for (const entry of history.slice().reverse()) {

        const div =
            document.createElement("div");

        div.className =
            "historyEntry";

        div.textContent =
            JSON.stringify(entry, null, 2);

        historyBox.appendChild(div);
    }
}

function renderState() {

    const stateBox =
        document.getElementById("stateBox");

    stateBox.textContent =
        JSON.stringify(state.spectatorState, null, 2);
}

function renderPrompt() {

    const promptBox =
        document.getElementById("promptBox");

    const promptState =
        state.promptState;

    if (!promptState) return;

    let prompt = "";

    prompt += `ROLE: ${promptState.role}\n\n`;
    prompt += "Current State:\n";
    prompt += JSON.stringify(promptState.prompt, null, 2);

    prompt += "\n\nRespond ONLY in JSON format.\n";

    prompt += `Example:
{
  "thoughts": [],
  "commands": []
}`;

    promptBox.value = prompt;
}

function renderThoughts() {

    const thoughtsBox =
        document.getElementById("thoughtsBox");

    thoughtsBox.innerHTML = "";

    const s = state.spectatorState;

    if (!s || !s.history) {
        thoughtsBox.textContent = "No thoughts yet.";
        return;
    }

    const history = s.history;

    if (history.length === 0) {
        thoughtsBox.textContent = "No thoughts yet.";
        return;
    }

    const latest = history[history.length - 1];

    if (!latest.thoughts) {
        thoughtsBox.textContent = "No thoughts stored.";
        return;
    }

    thoughtsBox.textContent =
        latest.thoughts.join("\n");
}

function renderResults() {

    const resultsBox =
        document.getElementById("resultsBox");

    const s = state.spectatorState;

    if (!s) return;

    const phase = s.currentPhase;

    let results = [];

    if (phase === "ATTACKER") {
        results = s.attacker?.lastResults || [];
    } else {
        results = s.defender?.lastResults || [];
    }

    resultsBox.textContent =
        JSON.stringify(results, null, 2);
}

async function submitAIResponse() {

    const input =
        document.getElementById("responseInput").value;

    let parsed;

    try {
        parsed = JSON.parse(input);
    } catch {
        alert("Invalid JSON");
        return;
    }

    const response =
        await fetch("/api/turn", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(parsed)
        });

    await response.json();

    document.getElementById("responseInput").value = "";

    await loadStates();
}

function copyPrompt() {

    const promptBox =
        document.getElementById("promptBox");

    navigator.clipboard.writeText(promptBox.value);
}

async function resetGame() {

    await fetch("/api/reset", {
        method: "POST"
    });

    await loadStates();
}

function setupEvents() {

    document.getElementById("submitResponseButton")
        .addEventListener("click", submitAIResponse);

    document.getElementById("copyPromptButton")
        .addEventListener("click", copyPrompt);

    document.getElementById("refreshButton")
        .addEventListener("click", loadStates);

    document.getElementById("resetButton")
        .addEventListener("click", resetGame);
}

setupEvents();
loadStates();