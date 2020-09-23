"use strict";

const { CarrierApp } = require("../../../lib/internal");
const sdkManifest = require("../../../package.json");
const pojo = require("../../utils/pojo");
const { expect } = require("chai");

describe("App", () => {

  it("should create an app with the minimum required fields", () => {
    let app = new CarrierApp(pojo.carrierApp({
      id: "12345678-1234-1234-1234-123456789012",
      manifest: {
        name: "@company-name/app-name",
        version: "1.23.456",
      },
    }));

    expect(app).to.deep.equal({
      ...app,
      id: "12345678-1234-1234-1234-123456789012",
      sdkVersion: parseFloat(sdkManifest.version),
      manifest: {
        name: "@company-name/app-name",
        version: "1.23.456",
        description: "",
        dependencies: {},
        devDependencies: {},
      },
    });
  });

  it("should create an app with all possible fields", () => {
    let app = new CarrierApp(pojo.carrierApp({
      id: "12345678-1234-1234-1234-123456789012",
      manifest: {
        name: "@company-name/app-name",
        version: "1.23.456",
        description: "My ShipEngine app",
        main: "index.js",
        author: {
          name: "John Doe",
        },
        dependencies: {
          "@some/dependency": ">= 5.4.3",
          "another-dependency": "^0.0.1-beta.14",
        },
        devDependencies: {
          "@some/other-dependency": ">= 5.4.3",
          "yet-another-dependency": "^0.0.1-beta.14",
        },
      },
    }));

    expect(app).to.deep.equal({
      ...app,
      id: "12345678-1234-1234-1234-123456789012",
      sdkVersion: parseFloat(sdkManifest.version),
      manifest: {
        name: "@company-name/app-name",
        version: "1.23.456",
        description: "My ShipEngine app",
        main: "index.js",
        author: {
          name: "John Doe",
        },
        dependencies: {
          "@some/dependency": ">= 5.4.3",
          "another-dependency": "^0.0.1-beta.14",
        },
        devDependencies: {
          "@some/other-dependency": ">= 5.4.3",
          "yet-another-dependency": "^0.0.1-beta.14",
        },
      }
    });
  });

  it("should allow an empty description", () => {
    let app = new CarrierApp(pojo.carrierApp({
      id: "12345678-1234-1234-1234-123456789012",
      manifest: {
        name: "@company-name/app-name",
        version: "1.23.456",
        description: "",
      },
    }));

    expect(app).to.deep.equal({
      ...app,
      id: "12345678-1234-1234-1234-123456789012",
      sdkVersion: parseFloat(sdkManifest.version),
      manifest: {
        name: "@company-name/app-name",
        version: "1.23.456",
        description: "",
        dependencies: {},
        devDependencies: {},
      }
    });
  });

  describe("Failure tests", () => {

    it("should throw an error if the pojo is the wrong type", () => {
      expect(() => new CarrierApp(12345)).to.throw("Invalid ShipEngine Connect carrier app: value must be of type object");
    });

    it("should throw an error if the name contains illegal characters", () => {
      expect(() => new CarrierApp(pojo.carrierApp({
        manifest: {
          name: "My app",
          version: "1.23.456",
        }
      }))
      ).to.throw('Invalid ShipEngine Connect carrier app: manifest.name must be a scoped NPM package name, like "@company-name/app-name"');
    });

    it("should throw an error if the name is non-scoped", () => {
      expect(() => new CarrierApp(pojo.carrierApp({
        manifest: {
          name: "my-app",
          version: "1.23.456",
        },
      }))
      ).to.throw('Invalid ShipEngine Connect carrier app: manifest.name must be a scoped NPM package name, like "@company-name/app-name"');
    });

    it("should throw an error if the name contains capital letters", () => {
      expect(() => new CarrierApp(pojo.carrierApp({
        manifest: {
          name: "My-App",
          version: "1.23.456",
        },
      }))
      ).to.throw('Invalid ShipEngine Connect carrier app: manifest.name must be a scoped NPM package name, like "@company-name/app-name"');
    });

    it("should throw an error if the description is the wrong type", () => {
      expect(() => new CarrierApp(pojo.carrierApp({
        manifest: {
          name: "@company-name/app-name",
          version: "1.23.456",
          description: 12345,
        },
      }))
      ).to.throw('Invalid ShipEngine Connect carrier app: manifest.description must be a string');
    });

  });
});
