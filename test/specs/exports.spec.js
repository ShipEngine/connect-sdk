"use strict";

const commonJSExport = require("../../");
const { createTemplate: namedExport } = require("../../");
const { expect } = require("chai");

describe("ipaas package exports", () => {

  it("should export the createTemplate() function as a named export", () => {
    expect(namedExport).to.be.a("function");
    expect(namedExport).to.equal(commonJSExport.createTemplate);
  });

  it("should not export anything else", () => {
    expect(commonJSExport).to.have.same.keys(
      "createTemplate",
    );
  });

});
