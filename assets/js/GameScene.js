import Background from './Background.js';
import Player from './Player.js';
import Resource from './Resource.js';
import { WORLD_MAP, TILE_SIZE, RES_W, RES_H, ACTION_POINTS, PLAYERS, RESOURCES } from './initSettings.js';

export default class GameScene {
    constructor(canvasId, spriteSheetSrc) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext("2d");

        this.spriteSheet = new Image();
        this.spriteSheet.src = spriteSheetSrc;

        this.players = [];
        this.resources = [];
        this.map = null;

        this.selectedUnit = null;
        this.currentPlayer = null;
    }

    start(callback) {
        this.spriteSheet.onload = () => {
            this.init();
            this.setupInputs();
            callback();
        };
    }

    init() {
        this.map = new Background(WORLD_MAP, TILE_SIZE, RES_W, RES_H);

        PLAYERS.forEach(p => this.players.push(new Player(p.name, p.id, p.x, p.y)));
        RESOURCES.forEach(res => this.resources.push(new Resource(res.id, res.x, res.y, res.type)));
        this.currentPlayer = this.players[0];
        console.log(this.currentPlayer);
        $("#currentPlayer").text(this.currentPlayer.name);
        $("#currentPlayer").css("color", "blue");
    }

    setupInputs() {
        this.canvas.addEventListener("mousedown", (e) => this.handleMouseDown(e));
    }

    handleMouseDown(e) {
        const rect = this.canvas.getBoundingClientRect();

        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        this.handleMouseDownForUnits(mouseX, mouseY);

        if (this.selectedUnit) {
            this.handleMouseDownForResources(mouseX, mouseY);
        }
    }

    handleMouseDownForUnits(mouseX, mouseY) {
        this.currentPlayer.entities.forEach(entity => {
            if (entity.contains(mouseX, mouseY)) {
                this.selectedUnit = entity;
                entity.onClick();
            }
        });
    }

    handleMouseDownForResources(mouseX, mouseY) {
        this.resources.forEach(res => {
            if (res.contains(mouseX, mouseY) && this.selectedUnit.state === "idle") {
                this.selectedUnit.setTarget(res);
            }
        });
    }

    update(dt) {
        this.currentPlayer.entities.forEach(e => {
            if (e.update) e.update(dt);
        });
    }

    render() {
        this.map.draw(this.ctx, this.spriteSheet);
        this.resources.forEach(r => r.draw(this.ctx, this.spriteSheet));
        this.players.forEach(p => p.draw(this.ctx, this.spriteSheet));
    }
}