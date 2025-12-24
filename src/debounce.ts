/**
 * Wraps a given function into a debounce function
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
