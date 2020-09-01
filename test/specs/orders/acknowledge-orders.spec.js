"use strict";

const { OrderApp } = require("../../../lib/internal");
const pojo = require("../../utils/pojo");
const { expect, assert } = require("chai");

describe("acknowledgeOrders", () => {

  it("should return valid acknowledged sales orders", async () => {

    const acknowledgedSalesOrders = [pojo.acknowledgedSalesOrder()];

    let app = new OrderApp(pojo.orderApp({
      acknowledgeOrders() {
        return acknowledgedSalesOrders;
      }
    }));

    let result = await app.acknowledgeOrders(pojo.transaction(), [pojo.salesOrderNotification()]);

    acknowledgedSalesOrders[0].failureReason = "";
    acknowledgedSalesOrders[0].identifiers = {};

    expect(result).to.deep.equal(acknowledgedSalesOrders);
  });

  describe("Failure tests", () => {

    it("should throw an error if called with no arguments", async () => {
      let app = new OrderApp(pojo.orderApp({
        acknowledgeOrders() { }
      }));

      try {
        await app.acknowledgeOrders();
        assert.fail("An error should have been thrown");
      }
      catch (error) {
        expect(error.message).to.equal(
          "Invalid input to the acknowledgeOrders method. \n" +
          "Invalid transaction: \n" +
          "  A value is required"
        );
      }
    });

    it("should throw an error if called without Sales Order Notifications", async () => {
      let app = new OrderApp(pojo.orderApp({
        acknowledgeOrders() { }
      }));

      try {
        await app.acknowledgeOrders(pojo.transaction(), []);
        assert.fail("An error should have been thrown");
      }
      catch (error) {
        expect(error.message).to.equal(
          "Invalid input to the acknowledgeOrders method. \n" +
          "Sales Order Notifications are required"
        );
      }
    });

    it("should throw an error if called with an invalid shipment", async () => {
      let app = new OrderApp(pojo.orderApp({
        acknowledgeOrders() { }
      }));

      try {
        await app.acknowledgeOrders(pojo.transaction(), [{
          orderNumber: 12345,
        }]);
        assert.fail("An error should have been thrown");
      }
      catch (error) {
        expect(error.message).to.equal(
          "Invalid input to the acknowledgeOrders method. \n" +
          "Invalid sales order notification: \n" +
          "  id is required \n" +
          "  orderNumber must be a string \n" +
          "  importedDate is required"
        );
      }
    });

  });
});
