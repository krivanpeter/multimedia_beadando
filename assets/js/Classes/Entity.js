class Entity {
    constructor(id, x, y, assetKey, playerId) {
        this.id = id;
        this.gridX = x;
        this.gridY = y;
        this.x = x * TILE_SIZE;
        this.y = y * TILE_SIZE;
        this.asset = ASSETS_MAP[assetKey];
        this.playerId = playerId;
        this.clickable = true;
        this.clicked = false;
    }

    draw(ctx, spriteSheet) {
        if (!this.asset || !ctx || !spriteSheet) return;

        ctx.drawImage(
            spriteSheet,
            this.asset.x, this.asset.y, this.asset.w, this.asset.h,
            this.x, this.y, TILE_SIZE, TILE_SIZE
        );
    }

    contains(mouseX, mouseY) {
        return (
            mouseX >= this.x && mouseX <= this.x + TILE_SIZE &&
            mouseY >= this.y && mouseY <= this.y + TILE_SIZE
        );
    }
}