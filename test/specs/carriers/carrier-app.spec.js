"use strict";

const { CarrierApp } = require("../../../");
const sdkManifest = require("../../../package.json");
const pojo = require("../../utils/pojo");
const { expect } = require("chai");
const path = require("path");

describe("CarrierApp", () => {
  it("should create a CarrierApp with the minimum required fields", () => {
    let app = new CarrierApp({
      id: "12345678-1234-1234-1234-123456789012",
      name: "My carrier",
      websiteURL: "https://my-carrier.com/",
      logo: path.resolve("logo.svg"),
      connectionForm: pojo.form(),
      deliveryServices: [pojo.deliveryService()],
      connect () {},
      manifest: {
        name: "@company/carrier",
        version: "1.0.0"
      },
    });

    expect(app).to.deep.equal({
      id: "12345678-1234-1234-1234-123456789012",
      name: "My carrier",
      description: "",
      websiteURL: new URL("https://my-carrier.com/"),
      logo: path.resolve("logo.svg"),
      manifestLocations: undefined,
      manifestShipments: undefined,
      connectionForm: app.connectionForm,
      settingsForm: undefined,
      deliveryServices: [app.deliveryServices[0]],
      pickupServices: [],
      createShipment: undefined,
      cancelShipments: undefined,
      rateShipment: undefined,
      trackShipment: undefined,
      createManifest: undefined,
      schedulePickup: undefined,
      cancelPickups: undefined,
      sdkVersion: parseFloat(sdkManifest.version),
      manifest: {
        name: "@company/carrier",
        version: "1.0.0",
        description: "",
        dependencies: {},
        devDependencies: {},
      },
    });
  });

  it("should create a CarrierApp with all possible fields", () => {
    let app = new CarrierApp({
      id: "12345678-1234-1234-1234-123456789012",
      name: "My carrier",
      description: "My carrier description",
      websiteURL: "https://my-carrier.com/",
      logo: path.resolve("logo.svg"),
      manifestLocations: "single_location",
      manifestShipments: "explicit_shipments",
      connectionForm: pojo.form(),
      settingsForm: pojo.form(),
      deliveryServices: [pojo.deliveryService()],
      pickupServices: [pojo.pickupService()],
      localization: {
        es: { name: "Nombre de la compañía" },
      },
      connect () {},
      createShipment () {},
      cancelShipments () {},
      rateShipment () {},
      trackShipment () {},
      createManifest () {},
      schedulePickup () {},
      cancelPickups () {},
      manifest: {
        name: "@my-company/my-carrier",
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
      id: "12345678-1234-1234-1234-123456789012",
      name: "My carrier",
      description: "My carrier description",
      websiteURL: new URL("https://my-carrier.com/"),
      logo: path.resolve("logo.svg"),
      manifestLocations: "single_location",
      manifestShipments: "explicit_shipments",
      connectionForm: app.connectionForm,
      settingsForm: app.settingsForm,
      deliveryServices: [app.deliveryServices[0]],
      pickupServices: [app.pickupServices[0]],
      sdkVersion: parseFloat(sdkManifest.version),
      manifest: {
        name: "@my-company/my-carrier",
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
    let app = new CarrierApp({
      id: "12345678-1234-1234-1234-123456789012",
      name: "My carrier",
      description: "",
      websiteURL: "https://my-carrier.com/",
      logo: path.resolve("logo.svg"),
      connectionForm: pojo.form(),
      deliveryServices: [pojo.deliveryService()],
      connect () {},
      manifest: {
        name: "@company/carrier",
        version: "1.0.0",
        description: "",
      },
    });

    expect(app).to.deep.equal({
      id: "12345678-1234-1234-1234-123456789012",
      name: "My carrier",
      description: "",
      websiteURL: new URL("https://my-carrier.com/"),
      logo: path.resolve("logo.svg"),
      manifestLocations: undefined,
      manifestShipments: undefined,
      connectionForm: app.connectionForm,
      settingsForm: undefined,
      deliveryServices: [app.deliveryServices[0]],
      pickupServices: [],
      createShipment: undefined,
      cancelShipments: undefined,
      rateShipment: undefined,
      trackShipment: undefined,
      createManifest: undefined,
      schedulePickup: undefined,
      cancelPickups: undefined,
      sdkVersion: parseFloat(sdkManifest.version),
      manifest: {
        name: "@company/carrier",
        version: "1.0.0",
        description: "",
        dependencies: {},
        devDependencies: {},
      },
    });
  });

  describe("Failure tests", () => {

    it("should throw an error if the pojo is the wrong type", () => {
      expect(() => new CarrierApp(12345)).to.throw(
        "Invalid ShipEngine Integration Platform carrier app: \n" +
        "  value must be of type object"
      );
    });

    it("should throw an error if the ID is not a UUID", () => {
      expect(() => new CarrierApp({
        id: "12345",
        name: "My carrier",
        websiteURL: "https://my-carrier.com/",
        logo: path.resolve("logo.svg"),
        deliveryServices: [pojo.deliveryService()],
        manifest: {
          name: "@company/carrier",
          version: "1.0.0"
        }
      })
      ).to.throw(
        "Invalid ShipEngine Integration Platform carrier app: \n" +
        "  id must be a valid GUID"
      );
    });

    it("should throw an error if the name contains illegal characters", () => {
      expect(() => new CarrierApp({
        id: "12345678-1234-1234-1234-123456789012",
        name: "  My \nCarrier  ",
        websiteURL: "https://my-carrier.com/",
        logo: path.resolve("logo.svg"),
        deliveryServices: [pojo.deliveryService()],
        manifest: {
          name: "@company/carrier",
          version: "1.0.0"
        }
      })
      ).to.throw(
        "Invalid ShipEngine Integration Platform carrier app: \n" +
        "  name must not have leading or trailing whitespace \n" +
        "  name cannot contain newlines or tabs"
      );
    });

    it("should throw an error if the description is the wrong type", () => {
      expect(() => new CarrierApp({
        id: "12345678-1234-1234-1234-123456789012",
        name: "My carrier",
        websiteURL: "https://my-carrier.com/",
        logo: path.resolve("logo.svg"),
        deliveryServices: [pojo.deliveryService()],
        description: 12345,
        manifest: {
          name: "@company/carrier",
          version: "1.0.0"
        }
      })
      ).to.throw(
        "Invalid ShipEngine Integration Platform carrier app: \n" +
        "  description must be a string"
      );
    });

    it("should throw an error if the logo is not an absolute path", () => {
      expect(() => new CarrierApp({
        id: "12345678-1234-1234-1234-123456789012",
        name: "My carrier",
        websiteURL: "https://my-carrier.com/",
        logo: "logo.svg",
        deliveryServices: [pojo.deliveryService()],
        manifest: {
          name: "@company/carrier",
          version: "1.0.0"
        }
      })
      ).to.throw(
        "Invalid ShipEngine Integration Platform carrier app: \n" +
        "  logo must be an absolute file path"
      );
    });

    it("should throw an error if the logo is not an SVG", () => {
      expect(() => new CarrierApp({
        id: "12345678-1234-1234-1234-123456789012",
        name: "My carrier",
        websiteURL: "https://my-carrier.com/",
        logo: path.resolve("logo.jpg"),
        deliveryServices: [pojo.deliveryService()],
        manifest: {
          name: "@company/carrier",
          version: "1.0.0"
        }
      })
      ).to.throw(
        "Invalid ShipEngine Integration Platform carrier app: \n" +
        "  logo must be a .svg file"
      );
    });

  });
});
