export interface EventEmitterLike {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  addEventListener(event: any, listener: any, options?: any): void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  removeEventListener(event: any, listener: any, options?: any): void;
}

export interface EventEmitterOnOffLike {
  on(event: string | symbol, listener: Function): this;
  off(event: string | symbol, listener?: Function): this;
}

