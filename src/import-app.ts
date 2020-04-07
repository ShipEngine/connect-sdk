import { ono } from "@jsdevtools/ono";
import * as path from "path";
import { ShippingProviderConfig } from "./config";
import { readConfig } from "./read-config";
import { ShippingProviderApp } from "./shipping-provider";

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
type App = ShippingProviderApp; // | OrderSourceApp

type AppConfig = ShippingProviderConfig; // | OrderSourceConfig

/**
 * Imports a ShipEngine IPaaS shipping provider app
 */
export async function importApp(appPath: string): Promise<App> {
  let manifest = await readManifest(appPath);
  let config = await readConfig<AppConfig>(appPath);

  switch (config.type) {
    case "shipping_provider":
      config = await ShippingProviderApp.readConfig(config);
      return new ShippingProviderApp(manifest, config);

    default:
      throw new Error(``);
  }
}

/**
 * Reads the ShipEngine IPaaS shipping provider app manifest (package.json file)
 */
async function readManifest(appPath: string): Promise <AppManifest> {
  let manifestPath = path.join(appPath, "package.json");

  try {
    return await readConfig<AppManifest>(manifestPath, "package.json");
  }
  catch (error) {
    throw ono(error, `Error reading the ShipEngine IPaaS app: ${manifestPath}`);
  }
}
