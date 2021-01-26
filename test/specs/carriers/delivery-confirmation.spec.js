"use strict";

const { CarrierApp } = require("../../../lib/internal");
const pojo = require("../../utils/pojo");
const { expect } = require("chai");

describe("DeliveryConfirmation", () => {

  function createDeliveryConfirmation(deliveryConfirmation) {
    let app = new CarrierApp(pojo.carrierApp({
      deliveryServices: [
        pojo.deliveryService({
          deliveryConfirmations: [deliveryConfirmation],
        })
      ],
    }));
    return app.deliveryServices[0].deliveryConfirmations[0];
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
      code: ""
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
      code: ""
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
      code: ""
    });
  });
});
