"use strict";

import GameScene from './GameScene.js';
import { GAME_SPEED, setGameSpeed, ROUND_TIME, setRoundTime, UNIT_DATA } from './initSettings.js';

let game;
let lastTime = 0;
let isPaused = true;
let timerValue = ROUND_TIME;

let settings = { GAME_SPEED: GAME_SPEED, ROUND_TIME: ROUND_TIME };

function initGame() {
    game = new GameScene("canvas", "assets/imgs/scifi_tilesheet.png");

    game.on("turnEnded", () => {
        timerValue = settings.ROUND_TIME;
    });

    game.on("gameOver", (winner) => {
        console.log(winner);
        isPaused = true;

        $("#winnerText").text(`The winner is: ${winner.name}`);
        $("#gameOverMenu").fadeIn(300);
    });
}

function loop(currentTime) {
    if (isPaused) return;

    if (!lastTime) lastTime = currentTime;
    const dt = ((currentTime - lastTime) / 1000);
    lastTime = currentTime;

    setRemainingTime(dt);

    game.update(Math.min(dt, 0.1));
    game.render();

    requestAnimationFrame(loop);
}

function setRemainingTime(dt) {
    if (timerValue > 0) {
        timerValue -= dt;
        if (timerValue <= 0) {
            game.endTurn();
            timerValue = settings.ROUND_TIME;
        }
        $("#remainingTime").text(Math.ceil(timerValue));
    }
}

$("#startGameBtn, #newGameBtn").on("click", function () {
    $(this).hide();
    $("#gameOverMenu").hide();
    $("#mainMenu").hide();
    $("#resumeBtn").show();

    initGame();

    isPaused = false;

    game.start(() => {
        lastTime = performance.now();
        requestAnimationFrame(loop);
    });
});

$("#menuBtn").on("click", function () {
    isPaused = true;
    $("#menuTitle").text("PAUSE");
    $("#mainMenu").fadeIn(300);
});

$("#resumeBtn").on("click", function () {
    $("#mainMenu").fadeOut(300);

    isPaused = false;
    lastTime = performance.now();
    requestAnimationFrame(loop);
});

$("#settingsBtn").on("click", function () {
    $("#mainMenu").hide();
    setSettingValues();
    $("#settingsMenu").fadeIn(300);
});

$("#backFromSettingsBtn").on("click", function () {
    $("#settingsMenu").fadeOut(300, () => {
        setSettingTexts();
        $("#mainMenu").show();
    });
});

$("#saveSettingsBtn").on("click", function () {
    $("#settingsMenu").fadeOut(300, () => {
        setSettingValues();
        $("#mainMenu").show();
    });
});

$("#gameSpeedSlider").on("input", function () {
    const val = $(this).val();
    $("#speedValue").text(val);
});

$("#roundTimerSlider").on("input", function () {
    const val = $(this).val();
    $("#roundTimer").text(val);
});

function setSettingTexts() {
    $("#speedValue").text(settings.GAME_SPEED);
    $("#roundTimer").text(settings.ROUND_TIME);
}

function setSettingValues() {
    settings.GAME_SPEED = $("#gameSpeedSlider").val();
    setGameSpeed(settings.GAME_SPEED);
    settings.ROUND_TIME = $("#roundTimerSlider").val();
    setRoundTime(settings.ROUND_TIME);
}

$("#tutorialBtn").on("click", function () {
    $("#mainMenu").hide();

    $("#tutorialContent").load("tutorial.html", function (response, status, xhr) {
        if (status == "error") {
            $("#tutorialContent").html("<p>Error loading tutorial: " + xhr.statusText + "</p>");
        }
        const workerRes = UNIT_DATA.WORKER.MINING_AMOUNT;
        $("#tut-worker-rock").text(workerRes.rock);
        $("#tut-worker-iron").text(workerRes.iron);
        $("#tut-worker-uranium").text(workerRes.uranium);
        const truckRes = UNIT_DATA.TRUCK.MINING_AMOUNT;
        $("#tut-truck-rock").text(truckRes.rock);
        $("#tut-truck-iron").text(truckRes.iron);
        $("#tut-truck-uranium").text(truckRes.uranium);
    });

    $("#tutorialMenu").fadeIn(300);
});

$("#backFromTutorialBtn").on("click", function () {
    $("#tutorialMenu").fadeOut(300, () => {
        $("#mainMenu").show();
    });
});