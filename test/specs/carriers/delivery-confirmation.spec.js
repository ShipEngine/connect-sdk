"use strict";

const { CarrierApp } = require("../../..");
const pojo = require("../../utils/pojo");
const { expect } = require("chai");

describe("DeliveryConfirmation", () => {

  function createDeliveryConfirmation (deliveryConfirmation) {
    let app = new CarrierApp(pojo.carrierApp({
      carrier: pojo.carrier({
        deliveryServices: [
          pojo.deliveryService({
            deliveryConfirmations: [deliveryConfirmation],
          })
        ],
      }),
    }));
    return app.carrier.deliveryServices[0].deliveryConfirmations[0];
  }

  it("should create a DeliveryConfirmation with the minimum required fields", () => {
    let confirmation = createDeliveryConfirmation({
      id: "12345678-1234-1234-1234-123456789012",
      name: "Handshake",
      type: "signature",
    });

    expect(confirmation).to.deep.equal({
      id: "12345678-1234-1234-1234-123456789012",
      identifiers: {},
      name: "Handshake",
      type: "signature",
      description: "",
    });
  });

  it("should create a DeliveryConfirmation with all possible fields", () => {
    let confirmation = createDeliveryConfirmation({
      id: "12345678-1234-1234-1234-123456789012",
      name: "Handshake",
      type: "signature",
      description: "A firm handshake"
    });

    expect(confirmation).to.deep.equal({
      id: "12345678-1234-1234-1234-123456789012",
      identifiers: {},
      name: "Handshake",
      type: "signature",
      description: "A firm handshake",
    });
  });

  it("should allow an empty description", () => {
    let confirmation = createDeliveryConfirmation({
      id: "12345678-1234-1234-1234-123456789012",
      name: "Handshake",
      type: "signature",
      description: "",
    });

    expect(confirmation).to.deep.equal({
      id: "12345678-1234-1234-1234-123456789012",
      identifiers: {},
      name: "Handshake",
      type: "signature",
      description: "",
    });
  });

  describe("Failure tests", () => {

    it("should throw an error if the pojo is the wrong type", () => {
      expect(() => createDeliveryConfirmation(12345)).to.throw(
        "Invalid ShipEngine Integration Platform carrier app: \n" +
        "  carrier.deliveryServices[0].deliveryConfirmations[0] must be of type object"
      );
    });

    it("should throw an error if the ID is not a UUID", () => {
      expect(() => createDeliveryConfirmation({
        id: "12345",
        name: "test",
        type: "signature",
      })
      ).to.throw(
        "Invalid ShipEngine Integration Platform carrier app: \n" +
        "  carrier.deliveryServices[0].deliveryConfirmations[0].id must be a valid GUID"
      );
    });

    it("should throw an error if the name contains illegal characters", () => {
      expect(() => createDeliveryConfirmation({
        id: "12345678-1234-1234-1234-123456789012",
        name: "  My \nConfirmation  ",
        type: "signature"
      })
      ).to.throw(
        "Invalid ShipEngine Integration Platform carrier app: \n" +
        "  carrier.deliveryServices[0].deliveryConfirmations[0].name must not have leading or trailing whitespace \n" +
        "  carrier.deliveryServices[0].deliveryConfirmations[0].name cannot contain newlines or tabs"
      );
    });

    it("should throw an error if the description is the wrong type", () => {
      expect(() => createDeliveryConfirmation({
        id: "12345678-1234-1234-1234-123456789012",
        name: "My Confirmation",
        type: "signature",
        description: 12345,
      })
      ).to.throw(
        "Invalid ShipEngine Integration Platform carrier app: \n" +
        "  carrier.deliveryServices[0].deliveryConfirmations[0].description must be a string"
      );
    });

    it("should throw an error if the type is invalid", () => {
      expect(() => createDeliveryConfirmation({
        id: "12345678-1234-1234-1234-123456789012",
        name: "My Confirmation",
        type: "handshake"
      })
      ).to.throw(
        "Invalid ShipEngine Integration Platform carrier app: \n" +
        "  carrier.deliveryServices[0].deliveryConfirmations[0].type must be one of delivery, signature, adult_signature, direct_signature"
      );
    });

  });
});
