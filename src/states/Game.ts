/* globals __DEV__ */
import * as Phaser from 'phaser-ce';
import { Player } from '../sprites/player';
import { KeyState } from '../utils/key.state';

export class GameState extends Phaser.State {
  private groupBot: Phaser.Group;
  private groupLevel: Phaser.Group;
//  private map: Phaser.Tilemap;
  private mapForgroundLayer: Phaser.TilemapLayer;

  init () {}
  preload () {}

  create () {
    KeyState.instance.registerKeyboard(this.game.input.keyboard);
    const map = this.handleTilemap();
    this.handleGroups();
    this.addObjectsFromMap(map);
    this.game.physics.arcade.gravity.y = 250;

  }

  render () {
    this.game.debug.bodyInfo(this.groupBot.getByName('Player'), 32, 32);
  }

  update() {
    this.game.physics.arcade.collide(this.groupBot, this.mapForgroundLayer);
  }

  private handleGroups() {
    this.groupBot = this.game.add.group(undefined, 'bots', false, true, Phaser.Physics.ARCADE);
  }

  private handleTilemap(): Phaser.Tilemap {
    const map = this.game.add.tilemap('level0');
    map.addTilesetImage('tiles');
    const layer1 = map.createLayer('Background');
    layer1.resizeWorld();
    this.mapForgroundLayer = map.createLayer('Walls');
    map.setCollisionByExclusion([0, 1], true, 'Walls');
    this.camera.focusOnXY(map.widthInPixels / 2, map.widthInPixels / 2 - map.tileHeight * 3);
    return map;
  }

  private addObjectsFromMap(map: Phaser.Tilemap): void {
    map.createFromObjects('Player', 'Player', 'eggbot', 2, true, false, this.groupBot, Player, true);
  }
}
