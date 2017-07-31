import * as Phaser from 'phaser-ce';
import { centerGameObjects } from '../utils';

export class SplashState extends Phaser.State {
  private loaderBg: Phaser.Sprite;
  private loaderBar: Phaser.Sprite;

  init () {}

  preload () {
    this.loaderBg = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBg');
    this.loaderBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBar');
    centerGameObjects([this.loaderBg, this.loaderBar]);

    this.load.setPreloadSprite(this.loaderBar);
    this.load.image('mushroom', 'assets/images/mushroom2.png');
    this.load.image('battery', 'assets/images/battery.png');
    this.load.spritesheet('bulletsheet', 'assets/images/bulletsheet.png', 8, 8);
    this.load.spritesheet('eggbot', 'assets/images/player.png', 32, 48);
    this.load.image('xplosion', 'assets/images/Shitty_xplozion.png');

    this.load.tilemap('level0', 'assets/levels/level0.json', undefined, Phaser.Tilemap.TILED_JSON);
    this.load.image('tiles', 'assets/tilesheets/tiles.png')

    this.load.audio('music', ['assets/music/music.ogg']);

    this.load.audio('battery', ['assets/sounds/battery.ogg']);
    this.load.audio('death', ['assets/sounds/death.ogg']);
    this.load.audio('hit1', ['assets/sounds/hit1.ogg']);
    this.load.audio('hit2', ['assets/sounds/hit2.ogg']);
    this.load.audio('jump', ['assets/sounds/jump.ogg']);
    this.load.audio('shoot1', ['assets/sounds/shoot1.ogg']);
  }

  create () {
    this.state.start('Game');
  }
}
