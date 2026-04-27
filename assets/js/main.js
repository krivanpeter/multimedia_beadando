"use strict";

import GameScene from './GameScene.js';

const game = new GameScene("canvas", "assets/imgs/scifi_tilesheet.png");
let lastTime = 0;
let isPaused = true;

function loop(currentTime) {
    if (isPaused) return;

    if (!lastTime) lastTime = currentTime;
    const dt = (currentTime - lastTime) / 1000;
    lastTime = currentTime;

    game.update(Math.min(dt, 0.1));
    game.render();

    requestAnimationFrame(loop);
}

$("#startGameBtn").on("click", () => {
    $("#mainMenu").fadeOut(300);
    $("#startGameBtn").hide();
    $("#resumeBtn").show();

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