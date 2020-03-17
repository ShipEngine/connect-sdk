import { Options, Settings } from "./settings";

/**
 * Core functionality for creating, testing, and building an IPaaS integration.
 *
 * @returns - Options
 */
export function myLibrary(options?: Options): string {
  let settings = new Settings(options);

  if (settings.greeting === "Goodbye") {
    // Simulate a runtime error
    throw new Error("Cannot say goodbye");
  }

  return `${settings.greeting}, ${settings.subject}.`;
}
