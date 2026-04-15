import Background from './Background.js';
import Player from './Player.js';
import Resource from './Resource.js';
import Unit from './Units/Unit.js';
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

        const clickedUnit = this.currentPlayer.entities.find(entity =>
            entity instanceof Unit && entity.contains(mouseX, mouseY)
        );

        if (clickedUnit) {
            this.selectUnit(clickedUnit);
            return;
        }

        if (this.selectedUnit && this.selectedUnit.state === "idle") {
            this.issueCommand(mouseX, mouseY);
        }
    }

    selectUnit(unit) {
        if (this.selectedUnit) {
            this.selectedUnit.isHighlighted = false;
        }

        if (this.selectedUnit === unit) {
            this.selectedUnit = null;
        } else {
            this.selectedUnit = unit;
            this.selectedUnit.onClick();
        }
    }

    issueCommand(mouseX, mouseY) {
        const clickedResource = this.resources.find(res => res.contains(mouseX, mouseY));

        if (clickedResource) {
            this.selectedUnit.setTarget("res", clickedResource);
        } else {
            this.selectedUnit.setTarget("pos", this.getGridPos(mouseX, mouseY));
        }
        this.selectedUnit.isHighlighted = false;
        this.selectedUnit = null;
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

    getGridPos(mouseX, mouseY) {
        const gridX = Math.floor(mouseX / TILE_SIZE);
        const gridY = Math.floor(mouseY / TILE_SIZE);

        return { gridX, gridY };
    }
}