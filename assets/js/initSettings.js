"use strict";

export const RES_W = 1600;
export const RES_H = 832;

export const ACTION_POINTS = 10;

export const BASE_HP = 100;

export const WORKER_SPEED = 2;
export const WORKER_HP = 30;

export const ROCK_MINING_AMOUNT = 10;
export const IRON_MINING_AMOUNT = 5;
export const URANIUM_MINING_AMOUNT = 1;

export const TANK_SPEED = 5;
export const TANK_HP = 45;
export const TANK_AD = 15;

export const PLAYERS = [
    { name:"Peti", id: 1, x: 2, y: 6 },
    { name:"A vesztes", id: 2, x: 22, y: 6 },
];

export const RESOURCES = [
    { id: "rr1", x: 5, y: 8, type: "rock" },
    { id: "rr2", x: 6, y: 5, type: "rock" },
    { id: "rr3", x: 4, y: 3, type: "rock" },
    { id: "ri1", x: 8, y: 9, type: "iron" },
    { id: "ri2", x: 3, y: 10, type: "iron" },
    { id: "ru1", x: 12, y: 6, type: "uranium" },
    { id: "rr4", x: 18, y: 8, type: "rock" },
    { id: "rr5", x: 17, y: 5, type: "rock" },
    { id: "rr6", x: 19, y: 3, type: "rock" },
    { id: "ri3", x: 15, y: 9, type: "iron" },
    { id: "ri4", x: 20, y: 10, type: "iron" },
];

export const TILE_SIZE = 64;

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