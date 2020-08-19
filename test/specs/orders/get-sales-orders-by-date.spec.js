"use strict";

const { OrderApp, SalesOrder } = require("../../../lib/internal");
const pojo = require("../../utils/pojo");
const { expect, assert } = require("chai");

describe("getSalesOrdersByDate", () => {

  it("should work with an array", async () => {
    let app = new OrderApp(pojo.orderApp({
      getSalesOrdersByDate: () => [
        pojo.salesOrder({ id: "Order1" }),
        pojo.salesOrder({ id: "Order2" }),
        pojo.salesOrder({ id: "Order3" }),
      ]
    }));

    let salesOrders = await app.getSalesOrdersByDate(pojo.transaction(), pojo.timeRange());

    // It should NOT return the array
    expect(salesOrders).to.be.an("array");

    // NOT a synchronous iterable
    expect(salesOrders[Symbol.iterator]).to.be.a("function");

    // The sales orders should be returned in order
    let index = 0;
    for await (let salesOrder of salesOrders) {
      expect(salesOrder).to.be.an.instanceOf(SalesOrder);
      expect(salesOrder.id).to.equal(`Order${++index}`);
    }
  });

  it("should work with a populated array", async () => {
    let app = new OrderApp(pojo.orderApp({
      getSalesOrdersByDate () {
        return [
          pojo.salesOrder({ id: "Order1" }),
          pojo.salesOrder({ id: "Order2" }),
          pojo.salesOrder({ id: "Order3" })
        ];
      }
    }));

    let salesOrders = await app.getSalesOrdersByDate(pojo.transaction(), pojo.timeRange());

    // The sales orders should be returned in order
    let index = 0;
    for (let salesOrder of salesOrders) {
      expect(salesOrder).to.be.an.instanceOf(SalesOrder);
      expect(salesOrder.id).to.equal(`Order${++index}`);
    }
  });

  describe("Failure tests", () => {

    it("should throw an error if called with no arguments", async () => {
      let app = new OrderApp(pojo.orderApp());

      try {
        await app.getSalesOrdersByDate();
        assert.fail("An error should have been thrown");
      }
      catch (error) {
        expect(error.message).to.equal(
          "Invalid input to the getSalesOrdersByDate method. \n" +
          "Invalid transaction: \n" +
          "  A value is required"
        );
      }
    });

    it("should throw an error if called without a time range", async () => {
      let app = new OrderApp(pojo.orderApp());

      try {
        await app.getSalesOrdersByDate(pojo.transaction());
        assert.fail("An error should have been thrown");
      }
      catch (error) {
        expect(error.message).to.equal(
          "Invalid input to the getSalesOrdersByDate method. \n" +
          "Invalid time range: \n" +
          "  A value is required"
        );
      }
    });

    it("should throw an error if called with an invalid time range", async () => {
      let app = new OrderApp(pojo.orderApp());

      try {
        await app.getSalesOrdersByDate(pojo.transaction(), {
          startDateTime: "9999-99-99T99:99:99.999Z",
          endDateTime: "9999-99-99T99:99:99.999Z",
        });
        assert.fail("An error should have been thrown");
      }
      catch (error) {
        expect(error.message).to.equal(
          "Invalid input to the getSalesOrdersByDate method. \n" +
          "Invalid time range: \n" +
          "  startDateTime must be a valid date/time \n" +
          "  endDateTime must be a valid date/time"
        );
      }
    });

    it("should throw an error if nothing is returned", async () => {
      let app = new OrderApp(pojo.orderApp({
        getSalesOrdersByDate () { }
      }));

      try {
        await app.getSalesOrdersByDate(pojo.transaction(), pojo.timeRange());
        assert.fail("An error should have been thrown");
      }
      catch (error) {
        expect(error.message).to.equal(
          "Error in the getSalesOrdersByDate method. \n" +
          "salesOrders is not iterable"
        );
      }
    });

    it("should throw an error if an invalid sales order is returned", async () => {
      let app = new OrderApp(pojo.orderApp({
        getSalesOrdersByDate () {
          return [{
            identifiers: true,
            createdDateTime: "9999-99-99T99:99:99.999Z",
            status: 5,
            requestedFulfillments: [
              {
                items: []
              }
            ]
          }];
        }
      }));

      try {
        await app.getSalesOrdersByDate(pojo.transaction(), pojo.timeRange());
        assert.fail("An error should have been thrown");
      }
      catch (error) {
        expect(error.message).to.equal(
          "Error in the getSalesOrdersByDate method. \n" +
          "Invalid sales order: \n" +
          "  id is required \n" +
          "  identifiers must be of type object \n" +
          "  createdDateTime must be a valid date/time \n" +
          "  status must be a string \n" +
          "  shipTo is required \n" +
          "  buyer is required \n" +
          "  requestedFulfillments[0].items must contain at least 1 items"
        );
      }
    });

  });
});
