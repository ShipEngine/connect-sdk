import { ono } from "@jsdevtools/ono";
import callsites from "callsites";
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

  const callPath = callsites()[1].getFileName();
  if (!callPath) {
    throw new Error(`Unable to find app config: ${callPath}`);
  }
  // TODO: Figure out why require.resolve isn't working and remove callsites
  // const reqPath = require.resolve(moduleId);
  const pathToModule = path.join(callPath, "..", appPath);
  const moduleDir = path.parse(pathToModule).dir;

  let manifest = await readManifest(moduleDir);
  let config = await readConfig<AppConfig>(pathToModule);

  switch (config.type) {
    case "shipping_provider":
      config = await ShippingProviderApp.readConfig(config, moduleDir);
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
