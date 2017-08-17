import * as Phaser from 'phaser-ce';

enum Move {
  Left = -1,
  Idle = 0,
  Right = 1
};

interface MoveKeys {
  right: Phaser.Key;
  left: Phaser.Key;
  jump: Phaser.Key;
}

export class Player extends Phaser.Sprite {
  private readonly leftKey = Phaser.KeyCode.Q;
  private readonly rightKey = Phaser.KeyCode.D;
  private readonly jumpKey = Phaser.KeyCode.Z;
  private readonly shootKey = Phaser.KeyCode.SPACEBAR;
  private jumpTimer = 0;
  private moveSpeed = 150;
  private moveKeys: MoveKeys;

  constructor(game: Phaser.Game, x: number, y: number, asset: string, frame: string | number) {
    super(game, x, y, asset, frame);
    this.name = 'Player';
    this.game.physics.enable(this, Phaser.Physics.ARCADE);
    this.initPhysics(this.body);
    this.animations.add('move', [0, 1, 2, 3, 4], 13, true);
    this.moveKeys = game.input.keyboard.addKeys({
      'right': this.rightKey,
      'left': this.leftKey,
      'jump': this.jumpKey,
    });
  }

  update() {
    this.updateXVelocity();
    this.handleMoveKeys();
  }

  private updateXVelocity(): void {
    this.body.velocity.x = this.body.onFloor() ? this.body.velocity.x * 0.88 : this.body.velocity.x * 0.96;
    if (Math.abs(this.body.velocity.x) < 10) {
        this.body.velocity.x = 0;
    }
  }

  private handleMoveKeys(): void {
    if (this.moveKeys.left.isDown) {
        this.body.velocity.x = this.body.onFloor() ? -150 : -250;
        this.playMoveAnim();
    } else if (this.moveKeys.right.isDown) {
        this.body.velocity.x = this.body.onFloor() ? 150 : 250;
        this.playMoveAnim();
    } else {
        this.stopMoveAnim();
    }

    if (this.moveKeys.jump.isDown && this.body.onFloor() && this.game.time.now > this.jumpTimer)
    {
        this.body.velocity.y = -800;
        this.jumpTimer = this.game.time.now + 750;
    }
  }

  private playMoveAnim(): void {
    if (!this.animations.currentAnim || this.animations.currentAnim.name !== 'move') {
      this.animations.play('move');
    }
  }

  private stopMoveAnim(): void {
    if (this.animations.currentAnim && this.animations.currentAnim.name === 'move') {
      this.animations.stop();
    }
  }

  private initPhysics(body: any): void {
    body.bounce.y = 0.2;
    body.gravity.y = 1000;
    body.maxVelocity = new Phaser.Point(150, 500);
  }
}
