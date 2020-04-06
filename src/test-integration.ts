import * as fs from "fs";
import * as path from "path";

/**
 * Test a ShipEngine IPaaS integration
 */
export async function testIntegration(cwd?: string): Promise<void> {

  const projectCwd = cwd || process.cwd();

  const packageJSONPath = path.join(projectCwd, "package.json");

  let exportPath;
  // Verify Project Stucture

  if (fs.existsSync(packageJSONPath)) {

    const packageContents = fs.readFileSync(packageJSONPath, "utf-8");

    exportPath = JSON.parse(packageContents).main as string;
  }

  if (!exportPath) {
    throw new Error("Specify the entry point for your app via the 'main' propery in your integration\'s package.json file");
  }

  // Verify that the project exports a module
  //TODO: replace this with fs.promises.access
  if (!fs.existsSync(exportPath)) {
    throw new Error("Location specified by the main property in package.json does not exist. Please update location or build project");
  }

  const integrationModule = await import(path.join(projectCwd, exportPath));

  if (!integrationModule) {
    throw new Error("Integration module not found, make sure it is being exported correctly");
  }

  const integrationErrors: string[] = [];


  const validIntegrationTypes = ["carrier", "order-source"];

  // Verify that the module has the expected webhooks


}
