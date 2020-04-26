"use strict";

const { expect } = require("chai");
const { App } = require("../../");

describe("App", () => {

  it("should create an app with the minimum required fields", () => {
    let confirmation = new App({
      name: "@company-name/app-name",
      version: "1.23.456",
    });

    expect(confirmation).to.deep.equal({
      name: "@company-name/app-name",
      version: "1.23.456",
      description: "",
    });
  });

  it("should create an app with all possible fields", () => {
    let confirmation = new App({
      name: "@company-name/app-name",
      version: "1.23.456",
      description: "My ShipEngine app"
    });

    expect(confirmation).to.deep.equal({
      name: "@company-name/app-name",
      version: "1.23.456",
      description: "My ShipEngine app",
    });
  });

  it("should allow an empty description", () => {
    let confirmation = new App({
      name: "@company-name/app-name",
      version: "1.23.456",
      description: "",
    });

    expect(confirmation).to.deep.equal({
      name: "@company-name/app-name",
      version: "1.23.456",
      description: "",
    });
  });

  describe("Failure tests", () => {

    it("should throw an error if the pojo is the wrong type", () => {
      expect(() => new App(12345)).to.throw(
        "Invalid ShipEngine Integration Platform app: \n" +
        "  value must be of type object"
      );
    });

    it("should throw an error if the name contains illegal characters", () => {
      expect(() => new App({
        name: "My app",
        version: "1.23.456",
      })
      ).to.throw(
        "Invalid ShipEngine Integration Platform app: \n" +
        '  name must be a scoped NPM package name, like "@company-name/app-name"'
      );
    });

    it("should throw an error if the name is non-scoped", () => {
      expect(() => new App({
        name: "my-app",
        version: "1.23.456",
      })
      ).to.throw(
        "Invalid ShipEngine Integration Platform app: \n" +
        '  name must be a scoped NPM package name, like "@company-name/app-name"'
      );
    });

    it("should throw an error if the name contains capital letters", () => {
      expect(() => new App({
        name: "My-App",
        version: "1.23.456",
      })
      ).to.throw(
        "Invalid ShipEngine Integration Platform app: \n" +
        '  name must be a scoped NPM package name, like "@company-name/app-name"'
      );
    });

    it("should throw an error if the description is the wrong type", () => {
      expect(() => new App({
        name: "@company-name/app-name",
        version: "1.23.456",
        description: 12345,
      })
      ).to.throw(
        "Invalid ShipEngine Integration Platform app: \n" +
        "  description must be a string"
      );
    });

  });
});
