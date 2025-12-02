export type FixedLenArray<T, L extends number> = T[] & { length: L };

export type Mutable<T> = {
  -readonly [P in keyof T]: T[P] extends ReadonlyArray<infer U> ? U[] : T[P];
};

export type DeepMutable<T> = T extends (...args: any[]) => any
  ? T
  :
  T extends any[]
  ? DeepMutableArray<T[number]>
  : T extends object
  ? DeepMutableObject<T>
  : T;

export type DeepMutableArray<T> = Array<DeepMutable<Mutable<T>>>;

export declare type DeepMutableObject<T> = {
  [P in keyof T]-?: DeepMutable<Mutable<T[P]>>;
};

export type Clazz<T = unknown> = new (...args: any[]) => T;

export type Public<T> = { [P in keyof T]: T[P] };

export type RequiredKeys<T> = {
  [K in keyof T]-?: {} extends { [P in K]: T[K] } ? never : K;
}[keyof T];

export type RequiredProps<T> = Pick<T, RequiredKeys<T>>;

export type OptionalKeys<T> = {
  [K in keyof T]-?: {} extends { [P in K]: T[K] } ? K : never;
}[keyof T];

export type DefaultValues<T> = Required<Pick<T, OptionalKeys<T>>>;

export type DeepReadonly<T> = T extends (infer R)[]
  ? DeepReadonlyArray<R>
  : T extends Function
  ? T
  : T extends object
  ? DeepReadonlyObject<T>
  : T;

export interface DeepReadonlyArray<T> extends ReadonlyArray<DeepReadonly<T>> { }

export type DeepReadonlyObject<T> = {
  readonly [P in keyof T]: DeepReadonly<T[P]>;
};

export interface EventEmitterLike {
  addEventListener(event: any, listener: any, options?: any): void;
  removeEventListener(event: any, listener: any, options?: any): void;
}

export interface EventEmitterOnOffLike {
  on(event: string | symbol, listener: Function): this;
  off(event: string | symbol, listener?: Function): this;
}

