class GameScene {
    constructor(canvasId, spriteSheetSrc) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext("2d");

        this.spriteSheet = new Image();
        this.spriteSheet.src = spriteSheetSrc;

        this.players = [];
        this.resources = [];
        this.map = null;

        this.selectedUnit = null;
    }

    start(callback) {
        this.spriteSheet.onload = () => {
            this.init();
            this.setupInputs();
            callback();
        };
    }

    init() {
        this.map = new Background(worldMap, TILE_SIZE, RES_W, RES_H);

        PLAYERS.forEach(p => this.players.push(new Player(p.id, p.x, p.y)));
        RESOURCES.forEach(res => this.resources.push(new Resource(res.id, res.x, res.y, res.type)));
    }

    setupInputs() {
        this.canvas.addEventListener("mousedown", (e) => this.handleMouseDown(e));
    }

    handleMouseDown(e) {
        const mouseX = e.clientX;
        const mouseY = e.clientY;

        this.handleMouseDownForUnits(mouseX, mouseY);

        if (this.selectedUnit) {
            this.handleMouseDownForResources(mouseX, mouseY);
        }
    }

    handleMouseDownForUnits(mouseX, mouseY) {
        this.players.forEach(player => {
            player.entities.forEach(entity => {
                if (entity.contains(mouseX, mouseY)) {
                    this.selectedUnit = entity;
                    entity.onClick();
                }
            });
        });
    }

    handleMouseDownForResources(mouseX, mouseY) {
        this.resources.forEach(res => {
            if (res.contains(mouseX, mouseY)) {
                this.selectedUnit.setTarget(res);
            }
        });
    }

    update(dt) {
        this.players.forEach(p => {
            p.entities.forEach(e => {
                if (e.update) e.update(dt);
            });
        });
    }

    render() {
        this.map.draw(this.ctx, this.spriteSheet);
        this.resources.forEach(r => r.draw(this.ctx, this.spriteSheet));
        this.players.forEach(p => p.draw(this.ctx, this.spriteSheet));
    }
}