"use strict";

const { ConnectionApp } = require("../../");
const create = require("../utils/create");
const { expect } = require("chai");

describe("App", () => {

  function createApp (pojo) {
    return new ConnectionApp(pojo, create.connection());
  }

  it("should create an app with the minimum required fields", () => {
    let app = createApp({
      name: "@company-name/app-name",
      version: "1.23.456",
    });

    expect(app).to.deep.equal({
      name: "@company-name/app-name",
      version: "1.23.456",
      description: "",
      type: "connection",
      connection: app.connection,
    });
  });

  it("should create an app with all possible fields", () => {
    let app = createApp({
      name: "@company-name/app-name",
      version: "1.23.456",
      description: "My ShipEngine app"
    });

    expect(app).to.deep.equal({
      name: "@company-name/app-name",
      version: "1.23.456",
      description: "My ShipEngine app",
      type: "connection",
      connection: app.connection,
    });
  });

  it("should allow an empty description", () => {
    let app = createApp({
      name: "@company-name/app-name",
      version: "1.23.456",
      description: "",
    });

    expect(app).to.deep.equal({
      name: "@company-name/app-name",
      version: "1.23.456",
      description: "",
      type: "connection",
      connection: app.connection,
    });
  });

  describe("Failure tests", () => {

    it("should throw an error if the pojo is the wrong type", () => {
      expect(() => createApp(12345)).to.throw(
        "Invalid ShipEngine Integration Platform connection app: \n" +
        "  value must be of type object"
      );
    });

    it("should throw an error if the name contains illegal characters", () => {
      expect(() => createApp({
        name: "My app",
        version: "1.23.456",
      })
      ).to.throw(
        "Invalid ShipEngine Integration Platform connection app: \n" +
        '  name must be a scoped NPM package name, like "@company-name/app-name"'
      );
    });

    it("should throw an error if the name is non-scoped", () => {
      expect(() => createApp({
        name: "my-app",
        version: "1.23.456",
      })
      ).to.throw(
        "Invalid ShipEngine Integration Platform connection app: \n" +
        '  name must be a scoped NPM package name, like "@company-name/app-name"'
      );
    });

    it("should throw an error if the name contains capital letters", () => {
      expect(() => createApp({
        name: "My-App",
        version: "1.23.456",
      })
      ).to.throw(
        "Invalid ShipEngine Integration Platform connection app: \n" +
        '  name must be a scoped NPM package name, like "@company-name/app-name"'
      );
    });

    it("should throw an error if the description is the wrong type", () => {
      expect(() => createApp({
        name: "@company-name/app-name",
        version: "1.23.456",
        description: 12345,
      })
      ).to.throw(
        "Invalid ShipEngine Integration Platform connection app: \n" +
        "  description must be a string"
      );
    });

  });
});
