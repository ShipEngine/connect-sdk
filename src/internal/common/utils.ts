/**
 * Fields that should only be accessed within the ShipEngine Connect SDK
 */
export const _internal = Symbol("internal fields");


/**
 * Regular expression patterns
 */
export const regex = {
  isoDateTime: /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?)([+-]\d{2}:\d{2}|Z)?$/,
  utcOffset: /^[+-]([01][0-9]|2[0-3]):[0-5][0-9]$/,
  appName: /^(@[a-z0-9-~][a-z0-9-._~]*\/)[a-z0-9-~][a-z0-9-._~]*$/,
  semver: /^\d+\.\d+\.\d+/,
  money: /^-?\d+(\.\d+)?$/,
  protocol: /^https?:\/\//,
  locale: /^[a-z]{2}(-[A-Z]{2})?$/,
};


/**
 * Hides private/internal symbol fields, freezes all object/function fields,
 * and makes everything read-only.
 *
 * NOTE: This function is NOT recursive
 */
export function hideAndFreeze<T extends object>(pojo: T, ...omit: Array<keyof T>): void {
  for (const [key, value] of Object.entries(pojo)) {
    if (omit.includes(key as keyof T)) {
      // Don't hide/freeze this field
      continue;
    }

    // Freeze object/function fields
    const type = typeof value;
    if (type === "object" || type === "function") {
      // It's not currently possible to make buffers read-only
      // https://github.com/nodejs/node/issues/27080
      if (!(value instanceof Buffer)) {
        Object.freeze(value);
      }
    }
  }

  // Hides private/internal symbol fields by making them non-enumerable
  for (const symbol of Object.getOwnPropertySymbols(pojo)) {
    Object.defineProperty(pojo, symbol, { writable: false, enumerable: false });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
    Object.freeze((pojo as any)[symbol]);
  }

  // Freeze the root object
  Object.freeze(pojo);
}
