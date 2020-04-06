import { assert } from "./assert";
import { InlineOrReference, InlineOrReferenceArray } from "./types";

/**
 * Reads an ShipEngine IPaaS config that is expected to be a single value.
 * The canfig can be any of:
 *
 *    - an inline value
 *    - a YAML file path
 *    - a JSON file path
 *    - a JavaScript file path
 *    - a TypeScript file path
 *    - a dynamic import via `require()` or `import()`
 */
export async function readConfig<T>(config: InlineOrReference<T>, fieldName = "config"): Promise<T> {
  let value = (await config) as T;
  assert.value(value, fieldName);
  return value;
}

/**
 * Reads an ShipEngine IPaaS config that is expected to be an array of values or other configs.
 * Each canfig can be any of:
 *
 *    - an inline value
 *    - a YAML file path
 *    - a JSON file path
 *    - a JavaScript file path
 *    - a TypeScript file path
 *    - a dynamic import via `require()` or `import()`
 */
export async function readArrayConfig<T>(config: InlineOrReferenceArray<T>, fieldName = "config list"): Promise<T[]> {
  let values = (await config) as T[];
  assert.type.array(values, fieldName);
  values = await Promise.all(values.map((conf) => readConfig(conf)));
  return values;
}
