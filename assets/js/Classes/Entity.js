class Entity {
    constructor(id, x, y, assetKey, playerId) {
        this.id = id;
        this.gridX = x;
        this.gridY = y;
        this.x = x * TILE_SIZE;
        this.y = y * TILE_SIZE;
        this.assetKey = assetKey;
        this.playerId = playerId;
    }

    draw() {
        const spriteData = ASSETS_MAP[this.assetKey];

        if (!spriteData) return;

        ctx.drawImage(
            spriteSheet,
            spriteData.x, spriteData.y, spriteData.w, spriteData.h,
            this.x, this.y, TILE_SIZE, TILE_SIZE
        );

    }
}