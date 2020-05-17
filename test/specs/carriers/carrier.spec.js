"use strict";

const { CarrierApp } = require("../../../lib");
const pojo = require("../../utils/pojo");
const { expect } = require("chai");
const path = require("path");

describe("Carrier", () => {

  function createCarrier (carrier) {
    let app = new CarrierApp({ ...pojo.app(), carrier });
    return app.carrier;
  }

  it("should create a Carrier with the minimum required fields", () => {
    let carrier = createCarrier({
      id: "12345678-1234-1234-1234-123456789012",
      name: "My carrier",
      websiteURL: "https://my-carrier.com/",
      logo: path.resolve("logo.svg"),
      deliveryServices: [pojo.deliveryService()],
    });

    expect(carrier).to.deep.equal({
      id: "12345678-1234-1234-1234-123456789012",
      name: "My carrier",
      description: "",
      websiteURL: new URL("https://my-carrier.com/"),
      logo: path.resolve("logo.svg"),
      manifestLocations: undefined,
      manifestShipments: undefined,
      deliveryServices: [carrier.deliveryServices[0]],
      pickupServices: [],
      createShipment: undefined,
      cancelShipments: undefined,
      rateShipment: undefined,
      trackShipment: undefined,
      createManifest: undefined,
      schedulePickup: undefined,
      cancelPickups: undefined,
    });
  });

  it("should create a Carrier with all possible fields", () => {
    let carrier = createCarrier({
      id: "12345678-1234-1234-1234-123456789012",
      name: "My carrier",
      description: "My carrier description",
      websiteURL: "https://my-carrier.com/",
      logo: path.resolve("logo.svg"),
      manifestLocations: "single_location",
      manifestShipments: "explicit_shipments",
      deliveryServices: [pojo.deliveryService()],
      pickupServices: [pojo.pickupService()],
      localization: {
        es: { name: "Nombre de la compañía" },
      },
      createShipment () {},
      cancelShipments () {},
      rateShipment () {},
      trackShipment () {},
      createManifest () {},
      schedulePickup () {},
      cancelPickups () {},
    });

    expect(carrier).to.deep.equal({
      id: "12345678-1234-1234-1234-123456789012",
      name: "My carrier",
      description: "My carrier description",
      websiteURL: new URL("https://my-carrier.com/"),
      logo: path.resolve("logo.svg"),
      manifestLocations: "single_location",
      manifestShipments: "explicit_shipments",
      deliveryServices: [carrier.deliveryServices[0]],
      pickupServices: [carrier.pickupServices[0]],
    });
  });

  it("should allow an empty description", () => {
    let carrier = createCarrier({
      id: "12345678-1234-1234-1234-123456789012",
      name: "My carrier",
      description: "",
      websiteURL: "https://my-carrier.com/",
      logo: path.resolve("logo.svg"),
      deliveryServices: [pojo.deliveryService()],
    });

    expect(carrier).to.deep.equal({
      id: "12345678-1234-1234-1234-123456789012",
      name: "My carrier",
      description: "",
      websiteURL: new URL("https://my-carrier.com/"),
      logo: path.resolve("logo.svg"),
      manifestLocations: undefined,
      manifestShipments: undefined,
      deliveryServices: [carrier.deliveryServices[0]],
      pickupServices: [],
      createShipment: undefined,
      cancelShipments: undefined,
      rateShipment: undefined,
      trackShipment: undefined,
      createManifest: undefined,
      schedulePickup: undefined,
      cancelPickups: undefined,
    });
  });

  describe("Failure tests", () => {

    it("should throw an error if the pojo is the wrong type", () => {
      expect(() => createCarrier(12345)).to.throw(
        "Invalid ShipEngine Integration Platform carrier app: \n" +
        "  carrier must be of type object"
      );
    });

    it("should throw an error if the ID is not a UUID", () => {
      expect(() => createCarrier({
        id: "12345",
        name: "My carrier",
        websiteURL: "https://my-carrier.com/",
        logo: path.resolve("logo.svg"),
        deliveryServices: [pojo.deliveryService()],
      })
      ).to.throw(
        "Invalid ShipEngine Integration Platform carrier app: \n" +
        "  carrier.id must be a valid GUID"
      );
    });

    it("should throw an error if the name contains illegal characters", () => {
      expect(() => createCarrier({
        id: "12345678-1234-1234-1234-123456789012",
        name: "  My \nCarrier  ",
        websiteURL: "https://my-carrier.com/",
        logo: path.resolve("logo.svg"),
        deliveryServices: [pojo.deliveryService()],
      })
      ).to.throw(
        "Invalid ShipEngine Integration Platform carrier app: \n" +
        "  carrier.name must not have leading or trailing whitespace \n" +
        "  carrier.name cannot contain newlines or tabs"
      );
    });

    it("should throw an error if the description is the wrong type", () => {
      expect(() => createCarrier({
        id: "12345678-1234-1234-1234-123456789012",
        name: "My carrier",
        websiteURL: "https://my-carrier.com/",
        logo: path.resolve("logo.svg"),
        deliveryServices: [pojo.deliveryService()],
        description: 12345,
      })
      ).to.throw(
        "Invalid ShipEngine Integration Platform carrier app: \n" +
        "  carrier.description must be a string"
      );
    });

    it("should throw an error if the logo is not an absolute path", () => {
      expect(() => createCarrier({
        id: "12345678-1234-1234-1234-123456789012",
        name: "My carrier",
        websiteURL: "https://my-carrier.com/",
        logo: "logo.svg",
        deliveryServices: [pojo.deliveryService()],
      })
      ).to.throw(
        "Invalid ShipEngine Integration Platform carrier app: \n" +
        "  carrier.logo must be an absolute file path"
      );
    });

    it("should throw an error if the logo is not an SVG", () => {
      expect(() => createCarrier({
        id: "12345678-1234-1234-1234-123456789012",
        name: "My carrier",
        websiteURL: "https://my-carrier.com/",
        logo: path.resolve("logo.jpg"),
        deliveryServices: [pojo.deliveryService()],
      })
      ).to.throw(
        "Invalid ShipEngine Integration Platform carrier app: \n" +
        "  carrier.logo must be a .svg file"
      );
    });

  });
});
