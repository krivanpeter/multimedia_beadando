class Base extends Building {
    constructor(id, x, y, playerId) {
        const assetKey = "BASE";
        super(id, x, y, assetKey, playerId, BASE_HP);
    }

    draw() {
        super.draw();
        ctx.fillStyle = (this.playerId === 1) ? "blue" : "green";
        ctx.fillRect(this.gridX * TILE_SIZE, this.gridY * TILE_SIZE + TILE_SIZE / 2, TILE_SIZE, TILE_SIZE / 4);
    }
}