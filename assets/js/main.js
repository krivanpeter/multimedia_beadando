"use strict";

import GameScene from './GameScene.js';

let game;
let lastTime = 0;
let isPaused = true;

function initGame() {
    game = new GameScene("canvas", "assets/imgs/scifi_tilesheet.png");

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
    const dt = (currentTime - lastTime) / 1000;
    lastTime = currentTime;

    game.update(Math.min(dt, 0.1));
    game.render();

    requestAnimationFrame(loop);
}

$("#startGameBtn, #newGameBtn").on("click", () => {
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
