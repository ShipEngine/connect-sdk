/**
 * Hides private fields (name starts with an underscore) on the given object by making them non-enumerable.
 * @internal
 */
export function hidePrivateFields(obj: object): void {
  for (let key of Object.keys(obj)) {
    if (key.startsWith("_")) {
      Object.defineProperty(obj, key, { enumerable: false });
    }
  }
}
