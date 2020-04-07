import { getCwd, isFilePath, loadConfigOrModuleFiles } from "./file-utils";
import { InlineOrReference, InlineOrReferenceArray } from "./types";

/**
 * Reads an ShipEngine IPaaS config that is expected to be a single value.
 * The config can be any of:
 *
 *    - an inline value
 *    - a YAML file path
 *    - a JSON file path
 *    - a JavaScript file path
 *    - a TypeScript file path
 *    - a dynamic import via `require()` or `import()`
 */
export async function readConfig<T>(config: InlineOrReference<T>, fieldName = "config", cwd = "."): Promise<T> {

  if (typeof config === "string" && isFilePath(config)) {
    let object = await loadConfigOrModuleFiles<T>(config, cwd);

    if (typeof object === "object") {
      return object as T;
    }
  }

  return config as T;
}

/**
 * Reads an ShipEngine IPaaS config that is expected to be an array of values or other configs.
 * Each config can be any of:
 *
 *    - an inline value
 *    - a YAML file path
 *    - a JSON file path
 *    - a JavaScript file path
 *    - a TypeScript file path
 *    - a dynamic import via `require()` or `import()`
 */
export async function readArrayConfig<T>(config: InlineOrReferenceArray<T>, fieldName = "config list", cwd = "."): Promise<T[]> {

  const arrayCwd = getCwd(config, cwd);

  if (typeof config === "string" && isFilePath(config)) {
    let array = await loadConfigOrModuleFiles(config, cwd);
    if (Array.isArray(array)) {
      const resolvedArray = [];
      for (let item of array) {
        const resolvedItem = await readConfig(item, undefined, arrayCwd);
        resolvedArray.push(resolvedItem);
      }

      return resolvedArray as T[];
    }
  }

  return config as T[];
}
