/**
 * Creates a debounced version of `fn` that delays invocation until `delay` ms have
 * elapsed since the last call.
 *
 * Each call resets the debounce timer. Only the most recent call’s arguments and
 * `this` binding are used when `fn` finally runs.
 *
 * If an {@link AbortSignal} is provided, debouncing is **disabled after abort**:
 * pending work is cancelled and future calls become no-ops.
 *
 * @typeParam T - The function type being debounced.
 *
 * @param fn - The function to debounce.
 * @param delay - The debounce window in milliseconds.
 * @param options - Optional configuration.
 * @param options.signal - Abort signal used to cancel pending work and ignore future calls.
 *
 * @returns A debounced function with the same parameters as `fn`.
 *
 * @example
 * ```ts
 * const onResize = debounce(() => console.log("resized"), 200);
 * window.addEventListener("resize", onResize);
 * ```
 *
 * @example
 * ```ts
 * const controller = new AbortController();
 * const debounced = debounce((q: string) => search(q), 300, { signal: controller.signal });
 *
 * debounced("hel");
 * debounced("hell");
 * debounced("hello"); // only "hello" would run...
 *
 * controller.abort(); // ...unless aborted; pending call is cancelled and future calls do nothing
 * debounced("ignored");
 * ```
 */
export function debounce<T extends (...args: Parameters<T>) => void>(
  fn: T,
  delay: number,
  options?: { readonly signal?: AbortSignal },
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof globalThis.setTimeout> | undefined = undefined;

  const on_abort = (): void => {
    if (timer !== undefined) {
      globalThis.clearTimeout(timer);
    }
    timer = undefined;
  };

  if (options?.signal) {
    if (options.signal.aborted) {
      on_abort();
    } else {
      options.signal.addEventListener("abort", on_abort, { once: true });
    }
  }

  return function(this: ThisParameterType<T>, ...args: Parameters<T>) {
    if (options?.signal?.aborted) {
      return;
    }

    if (timer !== undefined) {
      globalThis.clearTimeout(timer);
    }

    timer = globalThis.setTimeout(() => {
      timer = undefined;
      if (options?.signal?.aborted) {
        return;
      }
      fn.apply(this, args);
    }, delay);
  };
}
