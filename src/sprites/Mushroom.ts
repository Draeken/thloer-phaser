import * as Phaser from 'phaser-ce'

export class MushroomSprite extends Phaser.Sprite {
  constructor (config: { game: Phaser.Game, x: number, y: number, asset: string }) {
    super(config.game, config.x, config.y, config.asset);
    this.anchor.setTo(0.5)
  }

  update () {
    this.angle += 1
  }
}
