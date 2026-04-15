import Background from './Background.js';
import Player from './Player.js';
import Resource from './Resource.js';
import { WORLD_MAP, TILE_SIZE, RES_W, RES_H, PLAYERS, RESOURCES } from './initSettings.js';

export default class GameScene {
    constructor(canvasId, spriteSheetSrc) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext("2d");

        this.spriteSheet = new Image();
        this.spriteSheet.src = spriteSheetSrc;

        this.players = [];
        this.resources = [];
        this.map = null;

        this.currentPlayer = null;
        this.selectedUnit = null;

        this.hoveredGrid = null;
        this.currentPath = [];
        this.pathDistance = 0;
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
        this.canvas.addEventListener("mousemove", (e) => this.handleMouseMove(e));
    }

    handleMouseDown(e) {
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const gridPos = this.getGridPos(mouseX, mouseY);

        const clickedEntity =
            this.players.flatMap(p => p.entities).find(en => en.contains(mouseX, mouseY)) ||
            this.resources.find(res => res.contains(mouseX, mouseY));

        if (this.currentPlayer.ap >= this.pathDistance) {
            this.currentPlayer.handleInteraction(clickedEntity, gridPos, this.pathDistance);
        }
        this.currentPath = [];
        this.pathDistance = 0;
    }

    handleMouseMove(e) {
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const gridPos = this.getGridPos(mouseX, mouseY);

        this.hoveredGrid = gridPos;
        this.currentPath = [];

        const selected = this.currentPlayer.selectedUnit;

        if (selected && selected.state === "idle") {
            const startX = selected.gridX;
            const startY = selected.gridY;
            const endX = gridPos.gridX;
            const endY = gridPos.gridY;

            const xDir = Math.sign(endX - startX);
            for (let x = startX; x !== endX + xDir; x += xDir) {
                if (xDir === 0) break;
                this.currentPath.push({ gridX: x, gridY: startY });
            }

            const yDir = Math.sign(endY - startY);
            for (let y = startY + yDir; y !== endY + yDir; y += yDir) {
                if (yDir === 0) break;
                this.currentPath.push({ gridX: endX, gridY: y });
            }

            this.pathDistance = Math.abs(endX - startX) + Math.abs(endY - startY);
        }
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

        this.renderPath();
    }

    renderPath() {
        if (this.currentPath && this.currentPath.length > 0) {
            this.ctx.save();
            this.ctx.fillStyle = "rgba(43, 250, 205, 0.2)";

            this.currentPath.forEach(tile => {
                this.ctx.fillRect(
                    tile.gridX * TILE_SIZE,
                    tile.gridY * TILE_SIZE,
                    TILE_SIZE,
                    TILE_SIZE
                );
            });

            if (this.pathDistance > 0) {
                this.ctx.fillStyle = this.getFillStyleForAp();
                this.ctx.font = "bold 14px Arial";
                this.ctx.fillText(
                    `${this.pathDistance} AP`,
                    this.hoveredGrid.gridX * TILE_SIZE + TILE_SIZE / 4,
                    this.hoveredGrid.gridY * TILE_SIZE + TILE_SIZE / 2,
                );
            }
            this.ctx.restore();
        }
    }

    getFillStyleForAp() {
        if (this.pathDistance > this.currentPlayer.ap) {
            return "red";
        }
        return "white";
    }

    getGridPos(mouseX, mouseY) {
        const gridX = Math.floor(mouseX / TILE_SIZE);
        const gridY = Math.floor(mouseY / TILE_SIZE);

        return { gridX, gridY };
    }
}