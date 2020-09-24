"use strict";

const { OrderApp } = require("../../../lib/internal");
const pojo = require("../../utils/pojo");
const { expect, assert } = require("chai");

describe("shipmentCreated", () => {

  it("should not return anything", async () => {
    let app = new OrderApp(pojo.orderApp({
      shipmentCreated() {
        return "Hello world!";
      }
    }));

    let result = await app.shipmentCreated(pojo.transaction(), pojo.salesOrderShipment());

    expect(result).to.equal(undefined);
  });

  describe("Failure tests", () => {

    it("should throw an error if called with no arguments", async () => {
      let app = new OrderApp(pojo.orderApp({
        shipmentCreated() { }
      }));

      try {
        await app.shipmentCreated();
        assert.fail("An error should have been thrown");
      }
      catch (error) {
        expect(error.message).to.equal("Invalid input to the shipmentCreated method. Invalid transaction: A value is required");
      }
    });

    it("should throw an error if called without a shipment", async () => {
      let app = new OrderApp(pojo.orderApp({
        shipmentCreated() { }
      }));

      try {
        await app.shipmentCreated(pojo.transaction());
        assert.fail("An error should have been thrown");
      }
      catch (error) {
        expect(error.message).to.equal("Invalid input to the shipmentCreated method. Invalid shipment: A value is required");
      }
    });

    it("should throw an error if called with an invalid shipment", async () => {
      let app = new OrderApp(pojo.orderApp({
        shipmentCreated() { }
      }));

      try {
        await app.shipmentCreated(pojo.transaction(), {
          trackingNumber: 12345,
          identifiers: true,
          contents: [],
        });
        assert.fail("An error should have been thrown");
      }
      catch (error) {
        expect(error.message).to.equal("Invalid input to the shipmentCreated method. Invalid shipment: trackingNumber must be a string, identifiers must be of type object, salesOrder is required, shipTo is required, shipDateTime is required, contents must contain at least 1 items");
      }
    });
  });
});
