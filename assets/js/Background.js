import { ASSETS_MAP, TILE_SIZE } from './initSettings.js';

export default class Background {
    constructor(grid, tileSize, width, height) {
        this.grid = grid;
        this.tileSize = tileSize;
        this.width = width;
        this.height = height;
    }

    draw(ctx, spriteSheet) {
        this.grid.forEach((row, rowIndex) => {
            row.forEach((tileData, colIndex) => {
                const asset = ASSETS_MAP[tileData.name];
                if (!asset) return;

                const dx = colIndex * TILE_SIZE;
                const dy = rowIndex * TILE_SIZE;

                if (!tileData.background) {
                    this.drawDirt(ctx, spriteSheet, dx, dy);
                }
                if (tileData.rotate !== 0) {
                    this.drawRotated(ctx, spriteSheet, asset, dx, dy, tileData.rotate);
                } else {
                    ctx.drawImage(
                        spriteSheet,
                        asset.x, asset.y, asset.w, asset.h,
                        dx, dy, TILE_SIZE, TILE_SIZE
                    );
                }
            });
        });
    }

    drawDirt(ctx, spriteSheet, dx, dy) {
        ctx.drawImage(
            spriteSheet,
            ASSETS_MAP.DIRT.x, ASSETS_MAP.DIRT.y, ASSETS_MAP.DIRT.w, ASSETS_MAP.DIRT.h,
            dx, dy, TILE_SIZE, TILE_SIZE
        );
    }

    drawRotated(ctx, spriteSheet, asset, dx, dy, rotateAngle) {
        ctx.save();
        ctx.translate(dx + TILE_SIZE / 2, dy + TILE_SIZE / 2);
        ctx.rotate(rotateAngle);
        ctx.drawImage(
            spriteSheet,
            asset.x, asset.y, asset.w, asset.h,
            -TILE_SIZE / 2, -TILE_SIZE / 2, TILE_SIZE, TILE_SIZE
        );
        ctx.restore();
    }
}
