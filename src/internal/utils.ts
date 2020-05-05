/**
 * Fields that should only be accessed within the ShipEngine Integration Platform SDK
 * @internal
 */
export const _internal = Symbol("internal fields");

/**
 * Regular expression patterns
 * @internal
 */
export const regex = {
  isoDateTime: /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?)([+-]\d{2}:\d{2}|Z)?$/,
  utcOffset: /^[+-]([01][0-9]|2[0-3]):[0-5][0-9]$/,
  appName: /^\@[a-z][a-z0-9]*(-[a-z0-9]+)*\/[a-z][a-z0-9]*(-[a-z0-9]+)*$/,
  semver: /^\d+\.\d+\.\d+/,
  money: /^\d+(\.\d+)?$/,
  protocol: /^https?:\/\//,
  locale: /^[a-z]{2}(-[A-Z]{2})?$/,
};

/**
 * Hides private/internal symbol fields and freezes all object/function fields.
 *
 * NOTE: This function is NOT recursive, since most objects in this SDK are immutable.
 *       In some cases, it may be necessary to call this function on nested objects explicitly.
 *
 * @internal
 */
export function hideAndFreeze(obj: object): void {
  // Freeze all object/function fields
  for (let value of Object.values(obj)) {
    let type = typeof value;
    if (type === "object" || type === "function") {
      // It's not currently possible to make buffers read-only
      // https://github.com/nodejs/node/issues/27080
      if (!(value instanceof Buffer)) {
        Object.freeze(value);
      }
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
