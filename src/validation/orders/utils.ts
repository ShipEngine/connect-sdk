/**
 * Returns an async iterable, wrapping a synchronous iterable if necessary
 *
 */
export function getAsyncIterable<T>(iterable: Iterable<T> | AsyncIterable<T>): AsyncIterable<T> | undefined {
  let syncIterable = iterable as Iterable<T>;
  let asyncIterable = iterable as AsyncIterable<T>;

  if (iterable) {
    if (typeof asyncIterable[Symbol.asyncIterator] === "function") {
      // It's already an async iterable, so just return it as-is
      return asyncIterable;
    }
    else if (typeof syncIterable[Symbol.iterator] === "function") {
      // Wrap the synchronous iterable in an async wrapper
      return {
        [Symbol.asyncIterator]() {
          let iterator = syncIterable[Symbol.iterator]();

          return {
            async next() {
              return iterator.next();
            }
          };
        }
      };
    }
  }
}
