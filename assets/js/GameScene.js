import Background from './Background.js';
import Entity from './Entity.js';
import Player from './Player.js';
import Resource from './Resource.js';
import Unit from './Units/Unit.js';
import WorkerUnit from './Units/WorkerUnit.js';
import { WORLD_MAP, TILE_SIZE, RES_W, RES_H, PLAYERS, ACTION_POINTS, RESOURCES } from './initSettings.js';

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

        this.hoveredGrid = null;
        this.currentPath = [];
        this.pathDistance = 0;

        this.savedState = { players: [], currentPlayerId: null };
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

        PLAYERS.forEach(p => this.players.push(new Player(p.name, p.id, p.color, p.x, p.y)));
        RESOURCES.forEach(res => this.resources.push(new Resource(res.id, res.x, res.y, res.type)));
        this.currentPlayer = this.players[0];
        this.initEmitListeners();
        $("#currentPlayer").text(this.currentPlayer.name);
        $("#currentPlayer").css("color", this.currentPlayer.color);

        this.saveState();
    }

    initEmitListeners() {
        this.players.forEach(player => {
            player.on('updateAp', () => {
                this.updateApUI();
            });
            player.on('updateRes', (res) => {
                this.updateResUI(res);
            });
        });
    }

    setupInputs() {
        $("#canvas").on("mousedown", (e) => this.handleMouseDown(e));
        $("#canvas").on("mousemove", (e) => this.handleMouseMove(e));
        $("#endTurnBtn").on("click", () => this.endTurn());
        $("#resetBtn").on("click", () => this.loadState());
    }

    endTurn() {
        this.currentPlayer.ap = ACTION_POINTS;
        if (this.currentPlayer.selectedUnit) {
            this.currentPlayer.selectedUnit.isHighlighted = false;
            this.currentPlayer.selectedUnit = null;
        }
        this.currentPath = [];
        this.pathDistance = 0;
        this.hoveredGrid = null;

        this.currentPlayer = (this.currentPlayer.id == 1) ? this.players[1] : this.players[0];

        this.saveState();
        this.updateRoundUI();
    }

    saveState() {
        this.savedState.players = [];
        this.savedState.currentPlayerId = this.currentPlayer.id;
        this.players.map(player => this.savedState.players.push(player.clone()));
        console.log("SAVE DONE");
    }

    loadState() {
        this.players = this.savedState.players.map(p => p.clone());
        this.currentPlayer = this.players.find(e => e.id == this.savedState.currentPlayerId);
        this.initEmitListeners();
        this.updateApUI();
        this.updateResUI(this.currentPlayer.resources);
        this.updateRoundUI();
        console.log("LOAD DONE");
    }

    handleMouseDown(e) {
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const gridPos = this.getGridPos(mouseX, mouseY);

        if (!this.isValidGridPos(gridPos.gridX, gridPos.gridY)) return;

        const clickedEntity =
            this.players.flatMap(p => p.entities).find(en => en.contains(mouseX, mouseY)) ||
            this.resources.find(res => res.contains(mouseX, mouseY));

        this.currentPlayer.handleInteraction(clickedEntity, gridPos);

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

        if (selected && selected.state === "idle" && this.isValidGridPos(gridPos.gridX, gridPos.gridY)) {
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
        } else {
            this.pathDistance = 0;
        }
    }

    update(dt) {
        this.currentPlayer.entities.forEach(e => {
            if (e.update) e.update(dt);
        });

        const isMoving = this.currentPlayer.entities.some(e =>
            e instanceof Unit && e.state !== "idle"
        );
        $("#endTurnBtn").prop('disabled', isMoving);
        $("#resetBtn").prop('disabled', isMoving);
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

    isValidGridPos(gridX, gridY) {
        const mapWidth = WORLD_MAP[0].length;
        const mapHeight = WORLD_MAP.length;

        return gridX > 0 && gridX < mapWidth - 1 &&
            gridY > 0 && gridY < mapHeight - 1;
    }

    updateApUI() {
        $("#ap").text(this.currentPlayer.ap);
    }

    updateResUI(res) {
        const entries = Object.entries(res);
        for (let i = 0; i < entries.length; i++) {
            $("#" + entries[i][0] + this.currentPlayer.id).text(entries[i][1]);
        }
    }

    updateRoundUI() {
        $("#currentPlayer").text(this.currentPlayer.name);
        $("#currentPlayer").css("color", this.currentPlayer.color);
        $("#currentPlayer").fadeOut(100).fadeIn(100);

        this.updateApUI();
    }
}
