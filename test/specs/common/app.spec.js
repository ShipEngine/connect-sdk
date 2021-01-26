"use strict";

const { CarrierApp } = require("../../../lib/internal");
const { regex } = require("../../../lib/internal/common/utils");
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

  it("should allow all possible valid characters for NPM scope and NPM package name", () => {
    let npmScopeAndPackageName = "@company-name~test_se.connect/app-name_connect~carrier.app";
    expect(npmScopeAndPackageName).to.match(regex.appName);
  });
});
