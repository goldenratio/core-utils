export function chunk_array<T>(array: ReadonlyArray<T>, size: number): ReadonlyArray<ReadonlyArray<T>> {
  if (!array.length) {
    return [];
  }
  const head = array.slice(0, size);
  const tail = array.slice(size);

  return [head, ...chunk_array(tail, size)];
}
