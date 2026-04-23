"use strict";
export const GAME_SPEED = 20;

export const CHEAT_ON = true;

export const RES_W = 1600;
export const RES_H = 832;

export const TILE_SIZE = 64;

export const HEALTH = {
    Y_OFFSET: 5,
    WIDTH: TILE_SIZE - 5,
    HEIGHT: 16
};

export const ACTION_POINTS = 100;

export const BASE_HP = 100;

export const UNIT_DATA = {
    WORKER: {
        HP: 30, ASSET: "WORKER", MINING_AMOUNT: {
            rock: 10, iron: 5, uranium: 1
        }, COST: { "type": "Rock", "unit": 5 },
        SOUNDS: {
            move: "./assets/sounds/wu_move.wav"
        }
    },
    TRUCK: {
        HP: 35, ASSET: "TRUCK", MINING_AMOUNT: {
            rock: 15, iron: 7, uranium: 2
        }, COST: { "type": "Rock", "unit": 20 },
        SOUNDS: {
            move: "./assets/sounds/truck_move.wav"
        }
    },
    TANK: {
        HP: 45, ASSET: "TANK", DAMAGE: 15, RANGE: 5, COST: { "type": "Iron", "unit": 15 },
        SOUNDS: {
            move: "./assets/sounds/tank_move.wav"
        }
    }
};

export const PLAYERS = [
    { name: "Peti", id: 1, color: "blue", x: 2, y: 6 },
    { name: "A vesztes", id: 2, color: "green", x: 22, y: 6 },
];

export const RESOURCES = [
    { x: 6, y: 8, type: "rock" },
    { x: 7, y: 5, type: "rock" },
    { x: 5, y: 3, type: "rock" },
    { x: 9, y: 9, type: "iron" },
    { x: 4, y: 10, type: "iron" },
    { x: 12, y: 6, type: "uranium" },
    { x: 18, y: 8, type: "rock" },
    { x: 17, y: 5, type: "rock" },
    { x: 19, y: 3, type: "rock" },
    { x: 15, y: 9, type: "iron" },
    { x: 20, y: 10, type: "iron" },
];

export const ASSETS_MAP = {
    DIRT: { x: 0, y: 0, w: TILE_SIZE, h: TILE_SIZE },
    TREE: { x: 2 * TILE_SIZE, y: TILE_SIZE, w: TILE_SIZE, h: TILE_SIZE },
    ROAD_VER_END: { x: 8 * TILE_SIZE, y: 2 * TILE_SIZE, w: TILE_SIZE, h: TILE_SIZE },
    ROAD_VER: { x: 4 * TILE_SIZE, y: 0, w: TILE_SIZE, h: TILE_SIZE },
    ROAD_HOR: { x: 5 * TILE_SIZE, y: 0, w: TILE_SIZE, h: TILE_SIZE },
    CROSS_4: { x: 6 * TILE_SIZE, y: 0, w: TILE_SIZE, h: TILE_SIZE },
    BASE: { x: 14 * TILE_SIZE, y: TILE_SIZE, w: TILE_SIZE, h: TILE_SIZE },

    ROCK: { x: 3 * TILE_SIZE, y: 4 * TILE_SIZE, w: TILE_SIZE, h: TILE_SIZE },
    IRON: { x: 3 * TILE_SIZE, y: 5 * TILE_SIZE, w: TILE_SIZE, h: TILE_SIZE },
    URANIUM: { x: 5 * TILE_SIZE, y: 6 * TILE_SIZE, w: TILE_SIZE, h: TILE_SIZE },

    WORKER_BLUE: { x: 8 * TILE_SIZE, y: 3 * TILE_SIZE, w: TILE_SIZE, h: TILE_SIZE },
    WORKER_GREEN: { x: 8 * TILE_SIZE, y: 5 * TILE_SIZE, w: TILE_SIZE, h: TILE_SIZE },

    TRUCK_BLUE: { x: 13 * TILE_SIZE, y: 3 * TILE_SIZE, w: TILE_SIZE, h: TILE_SIZE },
    TRUCK_GREEN: { x: 13 * TILE_SIZE, y: 5 * TILE_SIZE, w: TILE_SIZE, h: TILE_SIZE },

    TANK_BLUE: { x: 15 * TILE_SIZE, y: 3 * TILE_SIZE, w: TILE_SIZE, h: TILE_SIZE },
    TANK_GREEN: { x: 15 * TILE_SIZE, y: 5 * TILE_SIZE, w: TILE_SIZE, h: TILE_SIZE },
};

export const shortHands = {
    'T': { name: "TREE", background: true, rotate: 0 },
    '.': { name: "DIRT", background: true, rotate: 0 },
    'O': { name: "ROAD_VER_END", background: true, rotate: 0 },
    'o': { name: "ROAD_VER_END", background: true, rotate: Math.PI },
    '|': { name: "ROAD_VER", background: true, rotate: 0 },
    '-': { name: "ROAD_HOR", background: true, rotate: 0 },
    '+': { name: "CROSS_4", background: true, rotate: 0 }
};

export const mapBlueprint = [
    "TTTTTTTTTTTTTTTTTTTTTTTTT",
    "T.......................T",
    "T.......................T",
    "T.......................T",
    "T.......................T",
    "T.......................T",
    "T.......................T",
    "T.......................T",
    "T.......................T",
    "T.......................T",
    "T.......................T",
    "T.......................T",
    "TTTTTTTTTTTTTTTTTTTTTTTTT"
];

export const WORLD_MAP = mapBlueprint.map(row =>
    row.split('').map(char => {
        return shortHands[char] || shortHands['.'];
    })
);

$("#canvas").attr({
    "width": RES_W,
    "height": RES_H
});