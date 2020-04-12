"use strict";

const fs = require("fs");
const path = require("path");
const namedExports = require("../../");
const { default: defaultExport } = require("../../");
const { expect } = require("chai");
const { readdirSync } = require("@jsdevtools/readdir-enhanced");

describe("@shipengine/ipaas package exports", () => {

  it("should not have a default ESM export", () => {
    expect(defaultExport).to.equal(undefined);
    expect(namedExports).not.to.include.key("default");
  });

  it("should only export enumerations and classes", () => {
    for (let [name, namedExport] of Object.entries(namedExports)) {
      expect(name).to.match(/^[A-Z][a-z]+/, "all exported classes & enumerations must start with a capital letter");

      if (typeof namedExport === "function") {
        // This export is a class
        expect(namedExport).to.be.a("function");
        expect(namedExport.name).to.equal(name);
        expect(namedExport.prototype).to.be.an("object");
        expect(namedExport.prototype.constructor).to.equal(namedExport);
      }
      else {
        // This export is an enumeration
        expect(namedExport).to.be.an("object");
        for (let value of Object.values(namedExport)) {
          expect(value).to.be.a("string", "enumerations should only contain string values");
        }
      }
    }
  });

  it("should export all root files", () => {
    let exceptions = ["app.ts", "assert.ts", "reference-map.ts"];
    assertFileExports("src", false, exceptions);
  });

  it("should export all config files", () => {
    assertFileExports("src/config");
  });

  it("should export all shipping-provider files", () => {
    let exceptions = ["utils.ts"];
    assertFileExports("src/shipping-provider", true, exceptions);
  });

});

function assertFileExports (dir, deep = false, exceptions = []) {
  // Always exclude these files.
  exceptions.push("index.ts", ".DS_STORE", "Thumbs.db");

  let indexPath = path.join(dir, "index.ts");
  let exports = fs.readFileSync(indexPath, "utf8");
  let files = readdirSync(dir, { deep, sep: "/", filter: (item) => item.isFile() });
  let missingFiles = [], extraFiles = [];

  for (let file of files) {
    let moduleName = path.posix.join(path.dirname(file), path.basename(file, ".ts"));
    let isExported = exports.includes(`from "./${moduleName}"`);
    let shouldBeExported = !exceptions.includes(file);

    if (isExported && !shouldBeExported) {
      extraFiles.push(file);
    }
    else if (!isExported && shouldBeExported) {
      missingFiles.push(file);
    }
  }

  if (missingFiles.length > 0 || extraFiles.length > 0) {
    let messages = [];

    if (missingFiles.length > 0) {
      messages.push(
        `${indexPath} is missing the following exports:\n` +
        "  - " + missingFiles.join("\n  - ")
      );
    }

    if (extraFiles.length > 0) {
      messages.push(
        `${indexPath} should NOT export these files:\n` +
        "  - " + extraFiles.join("\n  - ")
      );
    }

    throw new Error(`\n\n${messages.join("\n\n")}\n\n`);
  }
}
