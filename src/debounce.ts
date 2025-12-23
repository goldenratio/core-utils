/**
 * Wraps a given function into a debounce function
 */
export function debounce<T extends (...args: Parameters<T>) => void>(
  fn: T,
  delay: number = 100
): (...args: Parameters<T>) => void {
  let timer: number | undefined = undefined;

  return function(this: ThisParameterType<T>, ...args: Parameters<T>) {
    if (timer !== undefined) {
      clearTimeout(timer);
    }
    timer = window.setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}
