/**
 * Fields that should only be accessed within the ShipEngine Integration Platform SDK
 * @internal
 */
export const _internal = Symbol("internal fields");

/**
 * Hides private/internal symbol fields and freezes all object/function fields.
 *
 * NOTE: This function is NOT recursive, since most objects in this SDK are immutable.
 *       In some cases, it may be necessary to call this function on nested objects explicitly.
 */
export function hideAndFreeze(obj: object): void {
  // Freeze all object/function fields
  for (let value of Object.values(obj)) {
    let type = typeof value;
    if (type === "object" || type === "function") {
      Object.freeze(value);
    }
  }

  // Hides private/internal symbol fields by making them non-enumerable
  for (let symbol of Object.getOwnPropertySymbols(obj)) {
    Object.defineProperty(obj, symbol, { enumerable: false });
    Object.freeze((obj as any)[symbol]);  // tslint:disable-line: no-any
  }

  // Freeze the top-level object
  Object.freeze(obj);
}
