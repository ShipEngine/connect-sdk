"use strict";

const fs = require("fs");
const path = require("path");
const namedExports = require("../../");
const { default: defaultExport } = require("../../");
const { expect } = require("chai");
const { readdirSync } = require("@jsdevtools/readdir-enhanced");

describe("package exports", () => {
  it("should not have a default ESM export", () => {
    expect(defaultExport).to.equal(undefined);
    expect(namedExports).not.to.include.key("default");
  });

  it("should only export enumerations and classes", () => {
    for (let [name, namedExport] of Object.entries(namedExports)) {
      expect(name).to.match(/^[A-Z][a-z]+/, "all exported classes/enumerations must start with a capital letter");

      if (typeof namedExport === "object") {
        // Verify that this is an enumeration
        for (let value of Object.values(namedExport)) {
          expect(value).to.be.a("string", `${name} is not an enumeration or class`);
        }
      }
      else {
        // Verify that this is a class
        expect(namedExport).to.be.a("function", `${name} is not an enumeration or class`);
        expect(namedExport.name).to.equal(name, `${name} is not an enumeration or class`);
      }
    }
  });

  it("should export everything in public/common", () => {
    assertFileExports("src/public/common", true);
  });

  it("should export everything in public/carriers", () => {
    assertFileExports("src/public/carriers", true);
  });

  it("should export everything in public/orders", () => {
    assertFileExports("src/public/orders", true);
  });

  it("should export everything in public/products", () => {
    assertFileExports("src/public/products", true);
  });

  it("should export everything in internal/common", () => {
    assertFileExports("src/internal/common", true);
  });

  it("should export everything in internal/carriers", () => {
    assertFileExports("src/internal/carriers", true);
  });

  it("should export everything in internal/orders", () => {
    assertFileExports("src/internal/orders", true);
  });

  it("should export everything in internal/products", () => {
    assertFileExports("src/internal/products", true);
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
    let shouldBeExported = !exceptions.some((ex) => file.startsWith(ex));

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
