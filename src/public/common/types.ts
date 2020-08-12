/**
 * A UUID string
 */
export type UUID = string;

/**
 * A URL string
 */
export type URLString = string;

/**
 * Path to JSON or YAML file containing the definition of a ShipEngine Connect app
 */
export type FilePath = string;

/**
 * A JavaScript module that is dynamically imported via `import()`
 */
export type DynamicImport<T> = Promise<EcmaScriptModule<T>>;

/**
 * An ECMAScript module
 */
export interface EcmaScriptModule<T = unknown> {
  default: T;
  [key: string]: unknown;
}

/**
 * A single value that can be provided multiple different ways:
 *
 * - directly inline
 * - referenced via an external JSON/YAML file
 * - dynamically imported via `require()` or `import()`
 */
export type InlineOrReference<T> = T | FilePath | DynamicImport<T>;

/**
 * An array of values. The array itself, and/or each item in the array can be specified multiple ways:
 *
 * - directly inline
 * - referenced via an external JSON/YAML file
 * - dynamically imported via `require()` or `import()`
 */
export type InlineOrReferenceArray<T> = ReadonlyArray<InlineOrReference<T>> | FilePath | DynamicImport<ReadonlyArray<InlineOrReference<T>>>;
