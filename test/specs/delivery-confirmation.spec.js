"use strict";

const { expect } = require("chai");
const create = require("../utils/create");

describe("DeliveryConfirmation", () => {

  function createDeliveryConfirmation (deliveryConfirmation) {
    let provider = create.carrier({
      deliveryServices: [{
        deliveryConfirmations: [deliveryConfirmation],
      }]
    });

    return provider.deliveryServices[0].deliveryConfirmations[0];
  }

  it("should create a DeliveryConfirmation with the minimum required fields", () => {
    let confirmation = createDeliveryConfirmation({
      id: "12345678-1234-1234-1234-123456789012",
      name: "Handshake",
      class: "signature",
    });

    expect(confirmation).to.deep.equal({
      id: "12345678-1234-1234-1234-123456789012",
      name: "Handshake",
      class: "signature",
      description: "",
    });
  });

  it("should create a DeliveryConfirmation with all possible fields", () => {
    let confirmation = createDeliveryConfirmation({
      id: "12345678-1234-1234-1234-123456789012",
      name: "Handshake",
      class: "signature",
      description: "A firm handshake"
    });

    expect(confirmation).to.deep.equal({
      id: "12345678-1234-1234-1234-123456789012",
      name: "Handshake",
      class: "signature",
      description: "A firm handshake",
    });
  });

  it("should allow an empty description", () => {
    let confirmation = createDeliveryConfirmation({
      id: "12345678-1234-1234-1234-123456789012",
      name: "Handshake",
      class: "signature",
      description: "",
    });

    expect(confirmation).to.deep.equal({
      id: "12345678-1234-1234-1234-123456789012",
      name: "Handshake",
      class: "signature",
      description: "",
    });
  });

  describe("Failure tests", () => {

    it("should throw an error if called with an invalid pojo", () => {
      expect(() => createDeliveryConfirmation(12345)).to.throw(
        "Invalid carrier: \n" +
        "  deliveryServices[0].deliveryConfirmations[0] must be of type object"
      );
    });

    it("should throw an error if called with an invalid ID", () => {
      expect(() => createDeliveryConfirmation({
        id: "12345",
        name: "test",
        class: "signature",
      })
      ).to.throw(
        "Invalid carrier: \n" +
        "  deliveryServices[0].deliveryConfirmations[0].id must be a valid GUID"
      );
    });

    it("should throw an error if called with an invalid name", () => {
      expect(() => createDeliveryConfirmation({
        id: "12345678-1234-1234-1234-123456789012",
        name: "  My \nConfirmation  ",
        class: "signature"
      })
      ).to.throw(
        "Invalid carrier: \n" +
        "  deliveryServices[0].deliveryConfirmations[0].name must not have leading or trailing whitespace \n" +
        "  deliveryServices[0].deliveryConfirmations[0].name cannot contain newlines or tabs"
      );
    });

    it("should throw an error if called with an invalid description", () => {
      expect(() => createDeliveryConfirmation({
        id: "12345678-1234-1234-1234-123456789012",
        name: "My Confirmation",
        class: "signature",
        description: 12345,
      })
      ).to.throw(
        "Invalid carrier: \n" +
        "  deliveryServices[0].deliveryConfirmations[0].description must be a string"
      );
    });

    it("should throw an error if called with an invalid class", () => {
      expect(() => createDeliveryConfirmation({
        id: "12345678-1234-1234-1234-123456789012",
        name: "My Confirmation",
        class: "handshake"
      })
      ).to.throw(
        "Invalid carrier: \n" +
        "  deliveryServices[0].deliveryConfirmations[0].class must be one of delivery, signature, adult_signature, direct_signature"
      );
    });

  });
});
