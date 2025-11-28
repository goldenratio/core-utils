import type { EventEmitterLike, EventEmitterOnOffLike } from "./types.js";

/**
 * Represents an object that can be disposed.
 */
export interface Disposable {
  /**
   * Releases internal resources or subscriptions.
   */
  dispose(): void;
}

export type DisposeCallback = () => void;

/**
 * Tells if the object is Disposable or not
 */
export function is_disposable(object: unknown): object is Disposable {
  return (
    typeof object === "object"
    && object !== null
    && "dispose" in object
    && typeof (object as { dispose?: unknown }).dispose === "function"
  );
}

/**
 * Utility class for event subscription and Disposable instances
 */
export class DisposeBag implements Disposable {
  private readonly list = new Set<DisposeCallback>();
  private is_disposed = false;

  add(item: DisposeCallback | Disposable): void {
    if (this.is_disposed) {
      throw new Error("DisposeBag is already disposed, create new instance");
    }
    if (typeof item === "function") {
      this.list.add(() => item());
    } else if (is_disposable(item)) {
      this.list.add(() => item.dispose());
    } else {
      throw new Error(`${item as string} doesn't contain dispose method`);
    }
  }

  from_event<TEvent = unknown>(
    emitter: EventEmitterLike | EventEmitterOnOffLike,
    eventType: string,
    listener: (event: TEvent) => void,
  ): void {
    if (this.is_disposed) {
      throw new Error("DisposeBag is already disposed, create new instance");
    }
    const wrappedListener = (event: TEvent): void => {
      listener(event);
    };

    if ("on" in emitter) {
      emitter.on(eventType, wrappedListener);
      this.add(() => emitter.off(eventType, wrappedListener));
    } else {
      emitter.addEventListener(eventType, wrappedListener);
      this.add(() => emitter.removeEventListener(eventType, wrappedListener));
    }
  }

  dispose(): void {
    this.list.forEach(cb => cb());
    this.list.clear();
    this.is_disposed = true;
  }
}
