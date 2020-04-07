// import callsites from "callsites";
// import * as path from "path";
// import { ShippingProviderConfig } from ".";
// import { ShippingProviderApp } from "./shipping-provider";

// /**
//  * Compile an IPaaS Integration into a single exported POJO
//  *
//  * @returns - Options
//  */
// export async function ipaasLoader(moduleId: string): Promise<ShippingProviderApp /** | OrderSourceApp  */> {

//   const callPath = callsites()[1].getFileName();
//   if (!callPath) {
//     throw new Error(`Unable to find app config: ${callPath}`);
//   }
//   // TODO: Figure out why require.resolve isn't working and remove callsites
//   // const reqPath = require.resolve(moduleId);
//   const pathToModule = path.join(callPath as string, "..", moduleId);
//   const manifestDir = path.parse(pathToModule).dir;

//   try {
//     let module = await import(pathToModule) as ShippingProviderConfig;

//     switch (module.type) {
//       case "shipping_provider":

//         const config = await ShippingProviderApp.readConfig(pathToModule);
//         const manifest = await ShippingProviderApp.readManifest(manifestDir);

//         return new ShippingProviderApp(manifest, config);

//       // case "order_source":
//       //   return OrderSourceApp.import(module);

//       default:
//         throw new TypeError(`Invalid IPaaS app type: ${module.type}`);
//     }
//   }
//   catch (e) {
//     let error = e as Error;
//     throw new Error(`Error loading IPaaS app: ${error.message}`);
//   }
// }
