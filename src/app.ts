import { assert } from "./assert";

const versionNumberPattern = /^\d+\.\d+\.\d+/;
versionNumberPattern.example = "1.23.456";

/**
 * A ShipEngine IPaaS app manifest (package.json file)
 */
export interface AppManifest {
  name?: string;
  description?: string;
  version?: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  [key: string]: unknown;
}

/**
 * A ShipEngine IPaaS app
 */
export abstract class App {
  /**
   * The ShipEngine IPaaS shipping provider app version number.
   * This is a semantic version number (e.g. "1.23.456")
   */
  public readonly version: string;

  /**
   * Creates a ShipEngine IPaaS app from a manifest object.
   */
  public constructor(manifest: AppManifest) {
    assert.type.object(manifest, "app manifest");
    this.version = assert.string.pattern(manifest.version, versionNumberPattern, "app version number");
  }
}
