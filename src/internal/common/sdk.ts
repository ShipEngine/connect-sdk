import { AppManifestPOJO } from "../../public";

// NOTE: We can't use `import` syntax here because package.json is outside the TypeScript root dir
// tslint:disable-next-line: no-var-requires no-require-imports
const manifest = require("../../../package.json");

/**
 * The SDK manifest (package.json)
 */
export const sdk = manifest as AppManifestPOJO;
