import * as Phaser from 'phaser-ce';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/mapTo';
import 'rxjs/add/operator/combineLatest';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/timer';
import 'rxjs/add/observable/of';

import { KeyState } from '../utils/key.state';

enum Move {
  Left = -1,
  Idle = 0,
  Right = 1
};

interface MovementState {
  move: Move;
  jumpCount: number;
  jump: boolean;
}

interface JumpState {
  jumpCount: number;
  jump: boolean;
}

export class Player extends Phaser.Sprite {
  private movementState = new BehaviorSubject<MovementState>({ move: 0, jumpCount: 0, jump: false });
  private jumpState = new BehaviorSubject<JumpState>({ jumpCount: 0, jump: false });
  private isOnFloorObs = new Subject<boolean>();
  private leftKeys = [Phaser.KeyCode.Q, Phaser.KeyCode.LEFT];
  private rightKeys = [Phaser.KeyCode.D, Phaser.KeyCode.RIGHT];
  private jumpKeys = [Phaser.KeyCode.Z, Phaser.KeyCode.UP];
  private shootKeys = [Phaser.KeyCode.SPACEBAR];
  private moveSpeed = 150;
  private jumpSpeed = 800;
  private maxJumpCount = 2;
  private maxJumpTime = 2000;

  constructor(game: Phaser.Game, x: number, y: number, asset: string, frame: string | number) {
    super(game, x, y, asset, frame);
    this.name = 'Player';
    this.game.physics.enable(this, Phaser.Physics.ARCADE);
    this.initPhysics(this.body);
    this.animations.add('move', [0, 1, 2, 3, 4], 13, true);
    const keyState = KeyState.ofKeys(this.leftKeys.concat(this.rightKeys, this.jumpKeys, this.shootKeys));
    keyState.subscribe(this.updateMoveState.bind(this));
    keyState
      .map((state) => this.jumpKeys.some(key => state.has(key)))
      .switchMap(this.handleJumpKey.bind(this))
      .distinctUntilChanged()
      .combineLatest(this.isOnFloorObs.distinctUntilChanged())
      .subscribe(this.updateJumpState.bind(this));
    this.movementState.subscribe(this.handleMovementState.bind(this));
    this.jumpState.subscribe(this.handleJumpState.bind(this));
  }

  update() {
    this.isOnFloorObs.next(this.body.onFloor());
  }

  private handleMovementState(state: MovementState): void {
    if (state.move === Move.Idle && this.body.velocity.x !== 0) {
      this.body.velocity.x = 0;
    } else if (this.body.velocity.x * state.move <= 0) {
      this.body.velocity.x = state.move * this.moveSpeed;
    }
  }

  private updateMoveState(state: Set<number>): void {
    let move: Move = Move.Idle;
    if (this.leftKeys.some(key => state.has(key))) { move -= 1; }
    if (this.rightKeys.some(key => state.has(key))) { move += 1; }

    this.movementState.next(Object.assign({}, this.movementState.value, { move }));
  }

  private handleJumpKey(isKeyPressed: boolean): Observable<boolean> {
    if (isKeyPressed) {
      return Observable.timer(this.maxJumpTime).mapTo(false).startWith(true);
    }
    return Observable.of(false);
  }

  private updateJumpState([isJumping, isOnFloor]: [boolean, boolean]): void {
    const jumpState: JumpState = this.jumpState.value;
    const jumpCount = isOnFloor ? 0 : isJumping ? jumpState.jumpCount + 1 : jumpState.jumpCount;
    const jump = isJumping;
    this.jumpState.next(Object.assign({}, jumpState, { jump }, { jumpCount }));
  }

  private handleJumpState(state: JumpState): void {
    console.log("jump state", state);
    if (state.jump && state.jumpCount <= this.maxJumpCount) {
      this.body.velocity.y = -this.jumpSpeed;
    } else if (!state.jump && this.body.velocity.y <= 0) {
      this.body.velocity.y = 0;
    }
  }

  private initPhysics(body: any) {
    body.bounce.y = 0.2;
    body.gravity.y = 1000;
    body.maxVelocity = new Phaser.Point(150, 500);
    body.onCollide = new Phaser.Signal();
  }
}
