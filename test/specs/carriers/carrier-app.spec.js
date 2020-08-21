"use strict";

const { CarrierApp } = require("../../../lib/internal");
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
      icon: path.resolve("logo.svg"),
      deliveryServices: [pojo.deliveryService()],
      connectionForm: pojo.form(),
      manifestType: "digital",
      manifest: {
        name: "@company/carrier",
        version: "1.0.0"
      },
    });

    expect(app).to.deep.equal({
      type: "carrier",
      id: "12345678-1234-1234-1234-123456789012",
      name: "My carrier",
      description: "",
      websiteURL: new URL("https://my-carrier.com/"),
      trackingURLTemplate: undefined,
      logo: path.resolve("logo.svg"),
      icon: path.resolve("logo.svg"),
      manifestLocations: undefined,
      manifestShipments: undefined,
      supportsReturns: false,
      connectionForm: app.connectionForm,
      manifestType: "digital",
      settingsForm: undefined,
      deliveryServices: [app.deliveryServices[0]],
      pickupServices: [],
      connect: undefined,
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
      icon: path.resolve("logo.svg"),
      manifestLocations: "single_location",
      manifestShipments: "explicit_shipments",
      manifestType: "digital",
      trackingURLTemplate: "http://trackingURLTemplate.com/{}",
      connectionForm: pojo.form(),
      settingsForm: pojo.form(),
      deliveryServices: [pojo.deliveryService()],
      pickupServices: [pojo.pickupService()],
      connect() { },
      createShipment() { },
      cancelShipments() { },
      rateShipment() { },
      trackShipment() { },
      createManifest() { },
      schedulePickup() { },
      cancelPickups() { },
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
      type: "carrier",
      id: "12345678-1234-1234-1234-123456789012",
      name: "My carrier",
      description: "My carrier description",
      websiteURL: new URL("https://my-carrier.com/"),
      logo: path.resolve("logo.svg"),
      icon: path.resolve("logo.svg"),
      manifestLocations: "single_location",
      manifestShipments: "explicit_shipments",
      manifestType: "digital",
      trackingURLTemplate: "http://trackingURLTemplate.com/{}",
      connectionForm: app.connectionForm,
      supportsReturns: false,
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
      icon: path.resolve("logo.svg"),
      logo: path.resolve("logo.svg"),
      connectionForm: pojo.form(),
      deliveryServices: [pojo.deliveryService()],
      manifestType: "digital",
      manifest: {
        name: "@company/carrier",
        version: "1.0.0",
        description: "",
      },
    });

    expect(app).to.deep.equal({
      type: "carrier",
      id: "12345678-1234-1234-1234-123456789012",
      name: "My carrier",
      description: "",
      websiteURL: new URL("https://my-carrier.com/"),
      icon: path.resolve("logo.svg"),
      logo: path.resolve("logo.svg"),
      trackingURLTemplate: undefined,
      manifestLocations: undefined,
      manifestShipments: undefined,
      manifestType: "digital",
      supportsReturns: false,
      connectionForm: app.connectionForm,
      settingsForm: undefined,
      deliveryServices: [app.deliveryServices[0]],
      pickupServices: [],
      connect: undefined,
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

  describe("Carrier app property accessors", () => {
    it("should return a distinct list of delivery confirmations", () => {
      let dcID = "12222222-2222-2222-2222-222222222222";
      let app = new CarrierApp({
        id: "12345678-1234-1234-1234-123456789012",
        name: "My carrier",
        websiteURL: "https://my-carrier.com/",
        icon: path.resolve("logo.svg"),
        logo: path.resolve("logo.svg"),
        manifestType: "digital",
        connectionForm: pojo.form(),
        deliveryServices: [
          pojo.deliveryService({ deliveryConfirmations: [pojo.deliveryConfirmation()] }),
          pojo.deliveryService({ deliveryConfirmations: [pojo.deliveryConfirmation()] }),
          pojo.deliveryService({ deliveryConfirmations: [pojo.deliveryConfirmation({ id: dcID })] })
        ],

        manifest: {
          name: "@company/carrier",
          version: "1.0.0"
        },
      });

      let ids = [];
      for (let dc of app.deliveryConfirmations) {
        ids.push(dc.id);
      }

      expect(app.deliveryConfirmations).to.have.lengthOf(2);
      expect(ids).to.have.members([dcID, "55555555-5555-5555-5555-555555555555"]);

    });

    it("should return a distinct list of packaging types", () => {
      let pkgID = "12222222-2222-2222-2222-222222222222";
      let app = new CarrierApp({
        id: "12345678-1234-1234-1234-123456789012",
        name: "My carrier",
        websiteURL: "https://my-carrier.com/",
        icon: path.resolve("logo.svg"),
        logo: path.resolve("logo.svg"),
        manifestType: "digital",
        connectionForm: pojo.form(),
        deliveryServices: [
          pojo.deliveryService(),
          pojo.deliveryService(),
          pojo.deliveryService({ packaging: [pojo.packaging({ id: pkgID })] })
        ],

        manifest: {
          name: "@company/carrier",
          version: "1.0.0"
        },
      });

      let ids = [];
      for (let pkg of app.packaging) {
        ids.push(pkg.id);
      }

      expect(app.packaging).to.have.lengthOf(2);
      expect(ids).to.have.members([pkgID, "44444444-4444-4444-4444-444444444444"]);

    });

    it("should return a distinct list of label formats", () => {
      let app = new CarrierApp({
        id: "12345678-1234-1234-1234-123456789012",
        name: "My carrier",
        websiteURL: "https://my-carrier.com/",
        icon: path.resolve("logo.svg"),
        logo: path.resolve("logo.svg"),
        connectionForm: pojo.form(),
        manifestType: "digital",

        deliveryServices: [
          pojo.deliveryService({ labelFormats: ["pdf"] }),
          pojo.deliveryService({ labelFormats: ["pdf", "zpl"] }),
          pojo.deliveryService({ labelFormats: ["zpl"] }),
        ],

        manifest: {
          name: "@company/carrier",
          version: "1.0.0"
        },
      });

      expect(app.labelFormats).to.have.lengthOf(2);
      expect(app.labelFormats).to.have.members(["pdf", "zpl"]);
      expect(app.labelFormats).to.not.have.members(["png"]);
    });

    it("should return a distinct list of label sizes", () => {
      let app = new CarrierApp({
        id: "12345678-1234-1234-1234-123456789012",
        name: "My carrier",
        websiteURL: "https://my-carrier.com/",
        icon: path.resolve("logo.svg"),
        logo: path.resolve("logo.svg"),
        connectionForm: pojo.form(),
        manifestType: "digital",

        deliveryServices: [
          pojo.deliveryService({ labelSizes: ["A4", "letter", "A6"] }),
          pojo.deliveryService({ labelSizes: ["A4", "4x6"] }),
          pojo.deliveryService({ labelSizes: ["4x6", "letter"] }),
        ],

        manifest: {
          name: "@company/carrier",
          version: "1.0.0"
        },
      });

      expect(app.labelSizes).to.have.lengthOf(4);
      expect(app.labelSizes).to.have.members(["A4", "letter", "4x6", "A6"]);
      expect(app.labelSizes).to.not.have.members(["4x8"]);
    });

    it("should return a distinct list of countries", () => {
      let app = new CarrierApp({
        id: "12345678-1234-1234-1234-123456789012",
        name: "My carrier",
        websiteURL: "https://my-carrier.com/",
        icon: path.resolve("logo.svg"),
        logo: path.resolve("logo.svg"),
        connectionForm: pojo.form(),
        manifestType: "digital",

        deliveryServices: [
          pojo.deliveryService({ originCountries: ["US"], destinationCountries: ["CN", "CA"] }),
          pojo.deliveryService({ originCountries: ["US", "MX"], destinationCountries: ["CN"] }),
          pojo.deliveryService({ originCountries: ["FR"] }),
        ],

        manifest: {
          name: "@company/carrier",
          version: "1.0.0"
        },
      });

      expect(app.countries).to.have.lengthOf(5);
      expect(app.countries).to.have.members(["US", "MX", "FR", "CN", "CA"]);
    });

    it("should return a distinct list of origin countries", () => {
      let app = new CarrierApp({
        id: "12345678-1234-1234-1234-123456789012",
        name: "My carrier",
        websiteURL: "https://my-carrier.com/",
        icon: path.resolve("logo.svg"),
        logo: path.resolve("logo.svg"),
        connectionForm: pojo.form(),
        manifestType: "digital",

        deliveryServices: [
          pojo.deliveryService({ originCountries: ["US"], destinationCountries: ["CN", "CA"] }),
          pojo.deliveryService({ originCountries: ["US", "MX"], destinationCountries: ["CN"] }),
          pojo.deliveryService({ originCountries: ["FR"] }),
        ],

        manifest: {
          name: "@company/carrier",
          version: "1.0.0"
        },
      });

      expect(app.originCountries).to.have.lengthOf(3);
      expect(app.originCountries).to.have.members(["US", "MX", "FR"]);
      expect(app.originCountries).to.not.have.members(["CN", "CA"]);

    });

    it("should return a distinct list of destination countries", () => {
      let app = new CarrierApp({
        id: "12345678-1234-1234-1234-123456789012",
        name: "My carrier",
        websiteURL: "https://my-carrier.com/",
        icon: path.resolve("logo.svg"),
        logo: path.resolve("logo.svg"),
        connectionForm: pojo.form(),
        manifestType: "digital",
        deliveryServices: [
          pojo.deliveryService({ originCountries: ["US"], destinationCountries: ["CN", "CA"] }),
          pojo.deliveryService({ originCountries: ["US", "MX"], destinationCountries: ["CN"] }),
          pojo.deliveryService({ originCountries: ["FR"] }),
        ],

        manifest: {
          name: "@company/carrier",
          version: "1.0.0"
        },
      });

      expect(app.destinationCountries).to.have.lengthOf(3);
      expect(app.destinationCountries).to.have.members(["CN", "CA", "US"]);
      expect(app.destinationCountries).to.not.have.members(["MX", "FR"]);
    });

    it("supportsReturns should be false if no delivery services support shipment returns", () => {
      let app = new CarrierApp({
        id: "12345678-1234-1234-1234-123456789012",
        name: "My carrier",
        websiteURL: "https://my-carrier.com/",
        icon: path.resolve("logo.svg"),
        logo: path.resolve("logo.svg"),
        connectionForm: pojo.form(),
        manifestType: "digital",
        deliveryServices: [
          pojo.deliveryService({ originCountries: ["US"], destinationCountries: ["CN", "CA"] }),
          pojo.deliveryService({ originCountries: ["US", "MX"], destinationCountries: ["CN"] }),
          pojo.deliveryService({ originCountries: ["FR"] }),
        ],

        manifest: {
          name: "@company/carrier",
          version: "1.0.0"
        },
      });

      expect(app.supportsReturns).to.equal(false);
    });

    it("supportsReturns should be true if a delivery service support shipment returns", () => {
      let app = new CarrierApp({
        id: "12345678-1234-1234-1234-123456789012",
        name: "My carrier",
        websiteURL: "https://my-carrier.com/",
        icon: path.resolve("logo.svg"),
        logo: path.resolve("logo.svg"),
        connectionForm: pojo.form(),
        manifestType: "digital",
        deliveryServices: [
          pojo.deliveryService({ originCountries: ["US"], destinationCountries: ["CN", "CA"] }),
          pojo.deliveryService({ originCountries: ["US", "MX"], destinationCountries: ["CN"] }),
          pojo.deliveryService({ originCountries: ["FR"], supportsReturns: true }),
        ],

        manifest: {
          name: "@company/carrier",
          version: "1.0.0"
        },
      });

      expect(app.supportsReturns).to.equal(true);
    });
  });


  describe("Carrier app's Delivery Service property accessors", () => {
    it("should return a distinct list of  countries", () => {
      let app = new CarrierApp({
        id: "12345678-1234-1234-1234-123456789012",
        name: "My carrier",
        websiteURL: "https://my-carrier.com/",
        icon: path.resolve("logo.svg"),
        logo: path.resolve("logo.svg"),
        manifestType: "digital",
        connectionForm: pojo.form(),
        deliveryServices: [
          pojo.deliveryService({ originCountries: ["US"], destinationCountries: ["CN", "CA"] }),
        ],

        manifest: {
          name: "@company/carrier",
          version: "1.0.0"
        },
      });

      expect(app.deliveryServices[0].countries).to.have.lengthOf(3);
      expect(app.deliveryServices[0].countries).to.have.members(["CN", "CA", "US"]);
    });
  });


  describe("Failure tests", () => {

    it("should throw an error if the pojo is the wrong type", () => {
      expect(() => new CarrierApp(12345)).to.throw(
        "Invalid ShipEngine Connect carrier app: \n" +
        "  value must be of type object"
      );
    });

    it("should throw an error if the ID is not a UUID", () => {
      expect(() => new CarrierApp({
        id: "12345",
        name: "My carrier",
        websiteURL: "https://my-carrier.com/",
        icon: path.resolve("logo.svg"),
        logo: path.resolve("logo.svg"),
        deliveryServices: [pojo.deliveryService()],
        manifest: {
          name: "@company/carrier",
          version: "1.0.0"
        }
      })
      ).to.throw(
        "Invalid ShipEngine Connect carrier app: \n" +
        "  id must be a valid GUID"
      );
    });

    it("should throw an error if the name contains illegal characters", () => {
      expect(() => new CarrierApp({
        id: "12345678-1234-1234-1234-123456789012",
        name: "  My \nCarrier  ",
        websiteURL: "https://my-carrier.com/",
        icon: path.resolve("logo.svg"),
        logo: path.resolve("logo.svg"),
        deliveryServices: [pojo.deliveryService()],
        manifest: {
          name: "@company/carrier",
          version: "1.0.0"
        }
      })
      ).to.throw(
        "Invalid ShipEngine Connect carrier app: \n" +
        "  name must not have leading or trailing whitespace \n" +
        "  name cannot contain newlines or tabs"
      );
    });

    it("should throw an error if the description is the wrong type", () => {
      expect(() => new CarrierApp({
        id: "12345678-1234-1234-1234-123456789012",
        name: "My carrier",
        websiteURL: "https://my-carrier.com/",
        icon: path.resolve("logo.svg"),
        logo: path.resolve("logo.svg"),
        deliveryServices: [pojo.deliveryService()],
        description: 12345,
        manifest: {
          name: "@company/carrier",
          version: "1.0.0"
        }
      })
      ).to.throw(
        "Invalid ShipEngine Connect carrier app: \n" +
        "  description must be a string"
      );
    });

    it("should throw an error if the logo is not an absolute path", () => {
      expect(() => new CarrierApp({
        id: "12345678-1234-1234-1234-123456789012",
        name: "My carrier",
        websiteURL: "https://my-carrier.com/",
        icon: path.resolve("logo.svg"),
        logo: "logo.svg",
        deliveryServices: [pojo.deliveryService()],
        manifest: {
          name: "@company/carrier",
          version: "1.0.0"
        }
      })
      ).to.throw(
        "Invalid ShipEngine Connect carrier app: \n" +
        "  logo must be an absolute file path"
      );
    });

    it("should throw an error if the trackingURLTemplate is not formatted correctly", () => {
      expect(() => new CarrierApp({
        id: "12345678-1234-1234-1234-123456789012",
        name: "My carrier",
        websiteURL: "https://my-carrier.com/",
        icon: path.resolve("logo.svg"),
        logo: path.resolve("logo.svg"),
        trackingURLTemplate: "https://tracking.com",
        deliveryServices: [pojo.deliveryService()],
        connectionForm: pojo.form(),
        manifestType: "digital",
        manifest: {
          name: "@company/carrier",
          version: "1.0.0"
        }
      })
      ).to.throw(
        "Invalid ShipEngine Connect carrier app: \n" +
        "  trackingURLTemplate with value https://tracking.com fails to match the required pattern: /{}/"
      );
    });

    it("should throw an error if the logo is not an SVG", () => {
      expect(() => new CarrierApp({
        id: "12345678-1234-1234-1234-123456789012",
        name: "My carrier",
        websiteURL: "https://my-carrier.com/",
        icon: path.resolve("logo.svg"),
        logo: path.resolve("logo.jpg"),
        deliveryServices: [pojo.deliveryService()],
        manifest: {
          name: "@company/carrier",
          version: "1.0.0"
        }
      })
      ).to.throw(
        "Invalid ShipEngine Connect carrier app: \n" +
        "  logo must be a .svg file"
      );
    });

    it("should throw an error if the icon is not an SVG", () => {
      expect(() => new CarrierApp({
        id: "12345678-1234-1234-1234-123456789012",
        name: "My carrier",
        websiteURL: "https://my-carrier.com/",
        icon: path.resolve("icon.png"),
        logo: path.resolve("logo.svg"),
        deliveryServices: [pojo.deliveryService()],
        manifest: {
          name: "@company/carrier",
          version: "1.0.0"
        }
      })
      ).to.throw(
        "Invalid ShipEngine Connect carrier app: \n" +
        "  icon must be a .svg file"
      );
    });

    it("should throw an error if the icon is not an absolute path", () => {
      expect(() => new CarrierApp({
        id: "12345678-1234-1234-1234-123456789012",
        name: "My carrier",
        websiteURL: "https://my-carrier.com/",
        logo: path.resolve("logo.svg"),
        icon: "logo.svg",
        deliveryServices: [pojo.deliveryService()],
        manifest: {
          name: "@company/carrier",
          version: "1.0.0"
        }
      })
      ).to.throw(
        "Invalid ShipEngine Connect carrier app: \n" +
        "  icon must be an absolute file path"
      );
    });


    it("should throw an error if a delivery service code is not specified", () => {
      const carrierAppObj = {
        id: "12345678-1234-1234-1234-123456789012",
        name: "My carrier",
        websiteURL: "https://my-carrier.com/",
        logo: path.resolve("logo.svg"),
        icon: path.resolve("logo.svg"),
        connectionForm: pojo.form(),
        deliveryServices: [pojo.deliveryService()],
        manifest: {
          name: "@company/carrier",
          version: "1.0.0"
        }
      };

      delete carrierAppObj.deliveryServices[0].code;

      expect(() => new CarrierApp(carrierAppObj)
      ).to.throw(
        "Invalid ShipEngine Connect carrier app: \n" +
        "  deliveryServices[0].code is required"
      );
    });

  });
});
