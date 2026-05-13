"use strict";

import GameScene from './GameScene.js';
import { GAME_SPEED, setGameSpeed, ROUND_TIME, setRoundTime } from './initSettings.js';

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

$("#menuBtn").on("click", () => {
    isPaused = true;
    $("#menuTitle").text("PAUSE");
    $("#mainMenu").fadeIn(300);
});

$("#resumeBtn").on("click", () => {
    $("#mainMenu").fadeOut(300);

    isPaused = false;
    lastTime = performance.now();
    requestAnimationFrame(loop);
});

$("#settingsBtn").on("click", () => {
    $("#mainMenu").hide();
    setSettingValues();
    $("#settingsMenu").fadeIn(300);
});

$("#backFromSettingsBtn").on("click", () => {
    $("#settingsMenu").fadeOut(300, () => {
        setSettingTexts();
        $("#mainMenu").show();
    });
});

$("#saveSettingsBtn").on("click", () => {
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