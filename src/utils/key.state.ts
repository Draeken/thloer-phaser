import { Keyboard } from 'phaser-ce';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/map';

export class KeyState {
  static readonly instance = new KeyState();

  private keyObs: Subject<[number, number]> = new Subject();
  private keyState: BehaviorSubject<Set<number>> = new BehaviorSubject(new Set());

  static ofKeys(keys: number[]): Observable<Set<number>> {
    return KeyState.instance.state.map(set => {
      return new Set(Array.from(set).filter(key => keys.some(k => k == key)));
    }).distinctUntilChanged((a, b) => {
      if (a.size !== b.size) { return false; }
      for (let key of a) { if (!b.has(key)) { return false; }}
      return true;
    })
  }

  private constructor() {
    this.keyObs
      .distinctUntilChanged(([a1, b1], [a2, b2]) => a1 === a2 && b1 === b2)
      .subscribe(this.handleKeyObs.bind(this));
  }

  registerKeyboard(keyboard: Keyboard): void {
    keyboard.addCallbacks(this, this.keyDownCBToObs, this.keyUpCBToObs);
  }

  get state(): Observable<Set<number>> {
    return this.keyState;
  }

  private handleKeyObs([key, press]: [number, number]): void {
    const set = this.keyState.value;
    if (press === 0) {
      if (set.has(key)) { return; }
      this.keyState.next(set.add(key));
    } else {
      if (!set.delete(key)) { return; }
      this.keyState.next(set);
    }
  }

  private keyDownCBToObs(key: KeyboardEvent): void {
    this.keyObs.next([key.keyCode, 0]);
  }

  private keyUpCBToObs(key: KeyboardEvent): void {
    this.keyObs.next([key.keyCode, 1]);
  }
}
