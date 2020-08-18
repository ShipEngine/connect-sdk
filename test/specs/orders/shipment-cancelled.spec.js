"use strict";

const { OrderApp } = require("../../../lib/internal");
const pojo = require("../../utils/pojo");
const { expect, assert } = require("chai");

describe("shipmentCancelled", () => {

  it("should not return anything", async () => {
    let app = new OrderApp(pojo.orderApp({
      shipmentCancelled () {
        return "Hello world!";
      }
    }));

    let result = await app.shipmentCancelled(pojo.transaction(), pojo.salesOrderShipment());

    expect(result).to.equal(undefined);
  });

  describe("Failure tests", () => {

    it("should throw an error if called with no arguments", async () => {
      let app = new OrderApp(pojo.orderApp({
        shipmentCancelled () {}
      }));

      try {
        await app.shipmentCancelled();
        assert.fail("An error should have been thrown");
      }
      catch (error) {
        expect(error.message).to.equal(
          "Invalid input to the shipmentCancelled method. \n" +
          "Invalid transaction: \n" +
          "  A value is required"
        );
      }
    });

    it("should throw an error if called without a shipment", async () => {
      let app = new OrderApp(pojo.orderApp({
        shipmentCancelled () {}
      }));

      try {
        await app.shipmentCancelled(pojo.transaction());
        assert.fail("An error should have been thrown");
      }
      catch (error) {
        expect(error.message).to.equal(
          "Invalid input to the shipmentCancelled method. \n" +
          "Invalid shipment: \n" +
          "  A value is required"
        );
      }
    });

    it("should throw an error if called with an invalid shipment", async () => {
      let app = new OrderApp(pojo.orderApp({
        shipmentCancelled () {}
      }));

      try {
        await app.shipmentCancelled(pojo.transaction(), {
          trackingNumber: 12345,
          identifiers: true,
          contents: [],
        });
        assert.fail("An error should have been thrown");
      }
      catch (error) {
        expect(error.message).to.equal(
          "Invalid input to the shipmentCancelled method. \n" +
          "Invalid shipment: \n" +
          "  trackingNumber must be a string \n" +
          "  identifiers must be of type object \n" +
          "  salesOrder is required \n" +
          "  shipTo is required \n" +
          "  shipDateTime is required \n" +
          "  contents must contain at least 1 items"
        );
      }
    });

  });
});
