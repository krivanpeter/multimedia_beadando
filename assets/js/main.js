"use strict";

let resources = [];
let players = [];
let map;
let intervalID;

spriteSheet.onload = function () {
    main();
};

function initResources() {
    resources = [];
    RESOURCES.forEach(res => {
        resources.push(new Resource(res.id, res.x, res.y, res.type));
    });
}

function initPlayers() {
    players = [];
    PLAYERS.forEach(p => {
        players.push(new Player(p.id, p.x, p.y));
    });
}

function init() {
    map = new Background(worldMap, TILE_SIZE, 1280, 1080, spriteSheet);
    initPlayers();
    initResources();
}

function main() {
    init();
    intervalID = setInterval(animate, 17);
}

function animate() {
    update();

    map.draw();
    resources.forEach(res => {
        res.draw();
    });
    players.forEach(player => {
        player.draw();
    });
}

function update() {
    players.forEach(player => {
        player.entities.forEach(entity => {
            if (entity.update) entity.update();
        });
    });
}

canvas.addEventListener("mousedown", (e) => {
    const rect = canvas.getBoundingClientRect();

    const mouseX = (e.clientX - rect.left);
    const mouseY = (e.clientY - rect.top);

    // 3. Átváltás GRID koordinátára (KEREKÍTÉSSEL!)
    // A Math.floor biztosítja, hogy pontosan a csempe bal felső sarkát célozzuk
    const gridX = Math.floor(mouseX / TILE_SIZE);
    const gridY = Math.floor(mouseY / TILE_SIZE);

    console.log(`Célpont rácson: ${gridX}, ${gridY}`);

    // Teszt: Az első játékos első egységének mozgatása
    if (players[0] && players[0].entities[1]) {
        // Fontos: a Unit.setTarget-ed most grid vagy pixel koordinátát vár?
        // Ha az előző Unit.js javításomat használod, ott PIXELT várt a setTarget.
        // Ebben az esetben így hívd:
        const targetPixelX = gridX * TILE_SIZE;
        const targetPixelY = gridY * TILE_SIZE;
        players[0].entities[1].setTarget(targetPixelX, targetPixelY);
    }
});