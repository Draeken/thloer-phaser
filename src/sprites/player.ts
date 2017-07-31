import * as Phaser from 'phaser-ce';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { KeyState } from '../utils/key.state';

enum Move {
  Left = -1,
  Idle = 0,
  Right = 1
};

export class Player extends Phaser.Sprite {
  private movementState = new BehaviorSubject<Move>(0);
  private leftKeys = [Phaser.KeyCode.Q, Phaser.KeyCode.LEFT];
  private rightKeys = [Phaser.KeyCode.D, Phaser.KeyCode.RIGHT];
  private jumpKeys = [Phaser.KeyCode.Z, Phaser.KeyCode.UP];
  private shootKeys = [Phaser.KeyCode.SPACEBAR];
  private moveSpeed = 150;

  constructor(game: Phaser.Game, x: number, y: number, asset: string, frame: string | number) {
    super(game, x, y, asset, frame);
    this.name = 'Player';
    this.game.physics.enable(this, Phaser.Physics.ARCADE);
    this.initPhysics(this.body);
    this.animations.add('move', [0, 1, 2, 3, 4], 13, true);
    KeyState.ofKeys(this.leftKeys.concat(this.rightKeys, this.jumpKeys, this.shootKeys))
      .subscribe(this.handleKeyState.bind(this));
    this.movementState.subscribe(this.handleMovementState.bind(this));
  }

  update() {
  }

  private handleMovementState(state: Move): void {
    if (state === Move.Idle && this.body.velocity.x !== 0) {
      this.body.velocity.x = 0;
    } else if (this.body.velocity.x * state <= 0) {
      this.body.velocity.x = state * this.moveSpeed;
    }
  }

  private handleKeyState(state: Set<number>): void {
    let move: Move = Move.Idle;
    if (this.leftKeys.some(key => state.has(key))) { move -= 1; }
    if (this.rightKeys.some(key => state.has(key))) { move += 1; }
    this.movementState.next(move);
  }

  private initPhysics(body: any) {
    body.bounce.y = 0.2;
    body.gravity.y = 1000;
    body.maxVelocity = new Phaser.Point(150, 500);
  }
}
