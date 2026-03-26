"use strict";

let game = new GameScene("canvas", "assets/imgs/scifi_tilesheet.png");
let lastTime = 0;

function loop(currentTime) {
    if (!lastTime) lastTime = currentTime;
    const dt = (currentTime - lastTime) / 1000;
    lastTime = currentTime;

    game.update(Math.min(dt, 0.1)); 
    game.render();

    requestAnimationFrame(loop);
}

game.start(() => {
    requestAnimationFrame(loop);
});