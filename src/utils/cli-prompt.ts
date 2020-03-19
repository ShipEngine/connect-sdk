import inquirer, { Answers, QuestionCollection } from "inquirer";

/**
 * Request user input via the cli
 */
export async function cliPrompt(questions: QuestionCollection): Promise<Answers> {

  let answers;
  try {
    answers = await inquirer.prompt(questions);
  }
  catch (e) {
    // tslint:disable-next-line: no-unsafe-any
    throw new Error(e);
  }

  return answers;
}

