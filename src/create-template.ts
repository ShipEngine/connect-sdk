import * as fs from "fs";
import * as path from "path";

import * as fsExtra from "fs-extra";
import inquirer, { QuestionCollection } from "inquirer";

interface TemplateSettings {
  dirPath: string;
  folderName: string;
}

/**
 * Create a new shipengine ipaas integration template
 */
export async function createTemplate(): Promise<void> {

  let answers;

  try {
    answers = await inquirer.prompt({
      type: "input",
      name: "project-name",
      message: "What would you like to name your project?",
      default: "ipaas-integration"
    });
  }
  catch (e) {
    throw new Error(e);
  }

  const templatePath = path.join(__dirname, "template");
  const newProjectPath = path.join(process.cwd(), answers["project-name"]);

  if (!fs.existsSync(newProjectPath)) {
    fs.mkdirSync(newProjectPath);
    await fsExtra.copy(templatePath, newProjectPath);

    const data = fs.readFileSync(path.join(newProjectPath, "package.json"), "utf-8");
    const replacedData = data.replace(/<PROJECT_NAME>/g, answers["project-name"]);
    fs.writeFileSync(path.join(newProjectPath, "package.json"), replacedData, "utf-8");

    // TODO: uncomment this once the package is publicly available, there's some weird linking issues.
    // execSync("npm install", { cwd: newProjectPath });

  }
  else {
    throw new Error(`A project with the name ${answers["project-name"]} already exists`);
  }
}
