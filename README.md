Node.js TypeScript Template
===========================
This is a **template repo** for Node.js projects written in TypeScript. This template works for libraries and/or CLIs.



Step 1: Copy this repo
---------------------------------------------
Create a new git repo and copy the contents of this repo into it.



Step 2: Delete unneeded files
---------------------------------------------
If you **don't** need a CLI, then:
  - Delete the following files and directories:
    - `bin`
    - `src/cli`
    - `test/specs/cli.spec.js`
    - `test/utils/my-cli.js`
  - Delete the following fields in `package.json`:
    - `bin`
    - `files.bin`
    - `devDependencies.chai-exec`
    - `devDependencies.@types/command-line-args`
    - `dependencies.command-line-args`
  - Delete the `Run CLI` config from `.vscode/launch.json`



Step 3: Replace placeholders
---------------------------------------------
Replace all occurrences of the following placeholders in all files:

|Placeholder                        |Description
|:----------------------------------|:------------------------------------------------------------
|`ShipEngine`                      |The GitHub org for this repository, such as "JS-DevTools".
|`shipengine-ipaas`                     |The GitHub repo name
|`ShipEngineAPI`                 |The Twitter account associated with this project, such as "JSDevTools".
|`@shipengine`                    |The NPM scope that the package will be published to, such as "@jsdevtools".
|`ipaas`                  |The NPM package name. It should be kebab-cased.
|`my-cli`                           |The CLI command for this project, if any.
|`myLibrary`                        |The name of the library's default export, if any.  This should be a valid JavaScript identifier name.
|`ShipEngine IPaaS`                  |The human friendly name of the project that is used in the ReadMe, descriptions, and docs pages
|`Core functionality for creating, testing, and building an IPaaS integration.`    |A short, human friendly description of the project that is used in the ReadMe and package.json



Step 4: TODOs
---------------------------------------------
Find all "TODO" notes in the code and follow their instructions.



Step 5: ReadMe
---------------------------------------------
Delete this file and replace it with `README_md`.
