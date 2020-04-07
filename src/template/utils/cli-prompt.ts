// import inquirer, { Answers, QuestionCollection } from "inquirer";

// /**
//  * Request user input via the CLI.
//  */
// export async function cliPrompt(questions: QuestionCollection): Promise<Answers> {
//   let answers;
//   try {
//     answers = await inquirer.prompt(questions);
//   }
//   catch (e) {
//     let error = e as Error;
//     throw new Error(`Error retrieving input from the terminal: ${error.message}`);
//   }

//   return answers;
// }
