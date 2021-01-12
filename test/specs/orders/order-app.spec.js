"use strict";

const { OrderApp } = require("../../../lib/internal");
const sdkManifest = require("../../../package.json");
const { expect } = require("chai");
const path = require("path");
const pojo = require("../../utils/pojo");

describe("OrderApp", () => {
  it("should create an OrderApp with the minimum required fields", () => {
    let app = new OrderApp({
      id: "12345678-1234-1234-1234-123456789012",
      name: "My order",
      websiteURL: "https://my-order.com/",
      logo: path.resolve("logo.svg"),
      icon: path.resolve("logo.svg"),
      connectionForm: pojo.form(),
      manifest: {
        name: "@company/order",
        version: "1.0.0"
      },
    });

    expect(app).to.deep.equal({
      type: "order",
      id: "12345678-1234-1234-1234-123456789012",
      providerId: "",
      name: "My order",
      description: "",
      websiteURL: new URL("https://my-order.com/"),
      logo: path.resolve("logo.svg"),
      icon: path.resolve("logo.svg"),
      oauthConfig: undefined,
      connectionForm: app.connectionForm,
      sendMail: false,
      hasCustomMappings: false,
      canConfigureTimeZone: false,
      settingsForm: undefined,
      connect: undefined,
      getSalesOrdersByDate: undefined,
      shipmentCreated: undefined,
      acknowledgeOrders: undefined,
      sdkVersion: parseFloat(sdkManifest.version),
      manifest: {
        name: "@company/order",
        version: "1.0.0",
        description: "",
        dependencies: {},
        devDependencies: {},
      },
    });
  });

  it("should create an OrderApp with all possible fields", () => {
    let app = new OrderApp({
      id: "12345678-1234-1234-1234-123456789012",
      providerId: "12345678-1234-1234-1234-123456789012",
      name: "My order",
      description: "My order description",
      websiteURL: "https://my-order.com/",
      logo: path.resolve("logo.svg"),
      icon: path.resolve("logo.svg"),
      oauthConfig: pojo.oauthConfig(),
      connectionForm: pojo.form(),
      settingsForm: pojo.form(),
      sendMail: true,
      hasCustomMappings: true,
      canConfigureTimeZone: true,
      connect() { },
      getSalesOrdersByDate() { },
      shipmentCreated() { },
      acknowledgeOrders() { },
      manifest: {
        name: "@my-company/my-order",
        version: "123.45.678",
        description: "This is the description of my app",
        foo: "bar",
        main: "file.js",
        dependencies: {
          "@some/dependency": "^4.5.6",
          "another-dependency": ">= 1.2.3-beta.4",
        },
        devDependencies: {}
      },
    });

    expect(app).to.deep.equal({
      type: "order",
      id: "12345678-1234-1234-1234-123456789012",
      providerId: "12345678-1234-1234-1234-123456789012",
      name: "My order",
      description: "My order description",
      websiteURL: new URL("https://my-order.com/"),
      logo: path.resolve("logo.svg"),
      icon: path.resolve("logo.svg"),
      oauthConfig: pojo.oauthConfig(),
      connectionForm: app.connectionForm,
      settingsForm: app.settingsForm,
      sdkVersion: parseFloat(sdkManifest.version),
      sendMail: true,
      hasCustomMappings: true,
      canConfigureTimeZone: true,
      manifest: {
        name: "@my-company/my-order",
        version: "123.45.678",
        description: "This is the description of my app",
        foo: "bar",
        main: "file.js",
        dependencies: {
          "@some/dependency": "^4.5.6",
          "another-dependency": ">= 1.2.3-beta.4",
        },
        devDependencies: {}
      },
    });
  });

  it("should allow an empty description", () => {
    let app = new OrderApp({
      id: "12345678-1234-1234-1234-123456789012",
      name: "My order",
      description: "",
      websiteURL: "https://my-order.com/",
      logo: path.resolve("logo.svg"),
      icon: path.resolve("logo.svg"),
      connectionForm: pojo.form(),
      connect() { },
      getSalesOrdersByDate() { },
      manifest: {
        name: "@company/order",
        version: "1.0.0",
        description: "",
      },
    });

    expect(app).to.deep.equal({
      type: "order",
      id: "12345678-1234-1234-1234-123456789012",
      providerId: "",
      name: "My order",
      description: "",
      websiteURL: new URL("https://my-order.com/"),
      logo: path.resolve("logo.svg"),
      icon: path.resolve("logo.svg"),
      connectionForm: app.connectionForm,
      oauthConfig: undefined,
      settingsForm: undefined,
      shipmentCreated: undefined,
      acknowledgeOrders: undefined,
      sdkVersion: parseFloat(sdkManifest.version),
      sendMail: false,
      hasCustomMappings: false,
      canConfigureTimeZone: false,
      manifest: {
        name: "@company/order",
        version: "1.0.0",
        description: "",
        dependencies: {},
        devDependencies: {},
      },
    });
  });

  describe("Failure tests", () => {

    it("should throw an error if the pojo is the wrong type", () => {
      expect(() => new OrderApp(12345)).to.throw("Invalid ShipEngine Connect order app: value must be of type object");
    });

    it("should throw an error if the ID is not a UUID", () => {
      expect(() => new OrderApp({
        id: "12345",
        name: "My order",
        websiteURL: "https://my-order.com/",
        logo: path.resolve("logo.svg"),
        icon: path.resolve("logo.svg"),
        getSalesOrdersByDate() { },
        manifest: {
          name: "@company/order",
          version: "1.0.0"
        }
      })
      ).to.throw("Invalid ShipEngine Connect order app: id must be a valid GUID, connectionForm is required");
    });

    it("should throw an error if the name contains illegal characters", () => {
      expect(() => new OrderApp({
        id: "12345678-1234-1234-1234-123456789012",
        name: "  My \nOrder  ",
        websiteURL: "https://my-order.com/",
        logo: path.resolve("logo.svg"),
        icon: path.resolve("logo.svg"),
        getSalesOrdersByDate() { },
        manifest: {
          name: "@company/order",
          version: "1.0.0"
        }
      })
      ).to.throw("Invalid ShipEngine Connect order app: name must not have leading or trailing whitespace, name cannot contain newlines or tabs, connectionForm is required");
    });

    it("should throw an error if the description is the wrong type", () => {
      expect(() => new OrderApp({
        id: "12345678-1234-1234-1234-123456789012",
        name: "My order",
        websiteURL: "https://my-order.com/",
        logo: path.resolve("logo.svg"),
        icon: path.resolve("logo.svg"),
        getSalesOrdersByDate() { },
        description: 12345,
        manifest: {
          name: "@company/order",
          version: "1.0.0"
        }
      })
      ).to.throw("Invalid ShipEngine Connect order app: description must be a string, connectionForm is required");
    });

    it("should throw an error if the logo is not an absolute path", () => {
      expect(() => new OrderApp({
        id: "12345678-1234-1234-1234-123456789012",
        name: "My order",
        websiteURL: "https://my-order.com/",
        icon: path.resolve("logo.svg"),
        logo: "logo.svg",
        getSalesOrdersByDate() { },
        manifest: {
          name: "@company/order",
          version: "1.0.0"
        }
      })
      ).to.throw("Invalid ShipEngine Connect order app: logo must be an absolute file path, connectionForm is required");
    });

    it("should throw an error if the logo is not an SVG", () => {
      expect(() => new OrderApp({
        id: "12345678-1234-1234-1234-123456789012",
        name: "My order",
        websiteURL: "https://my-order.com/",
        logo: path.resolve("logo.jpg"),
        icon: path.resolve("logo.svg"),
        getSalesOrdersByDate() { },
        manifest: {
          name: "@company/order",
          version: "1.0.0"
        }
      })
      ).to.throw("Invalid ShipEngine Connect order app: logo must be a .svg file, connectionForm is required");
    });

    it("should throw an error if the icon is not an SVG", () => {
      expect(() => new OrderApp({
        id: "12345678-1234-1234-1234-123456789012",
        name: "My order",
        websiteURL: "https://my-order.com/",
        logo: path.resolve("logo.svg"),
        icon: path.resolve("logo.jpg"),
        getSalesOrdersByDate() { },
        manifest: {
          name: "@company/order",
          version: "1.0.0"
        }
      })
      ).to.throw("Invalid ShipEngine Connect order app: icon must be a .svg file, connectionForm is required");
    });

  });
});
