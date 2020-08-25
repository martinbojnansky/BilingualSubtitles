export class Store<TState> {
  protected _state: TState;

  public get state(): TState {
    return this._state;
  }

  constructor(initialState?: Partial<TState>) {
    this._state = <TState>(initialState ? initialState : {});
  }

  public patch(patch: Partial<TState>): void {
    this._state = <TState>{ ...(<any>this._state), ...(<any>patch) };
  }
}
