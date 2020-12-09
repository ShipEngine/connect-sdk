"use strict";

const { OrderApp, SalesOrder } = require("../../../lib/internal");
const pojo = require("../../utils/pojo");
const { expect, assert } = require("chai");

describe("getSalesOrdersByDate", () => {

  it("should work with an array", async () => {
    let app = new OrderApp(pojo.orderApp({
      getSalesOrdersByDate: () => {
        return {
          salesOrders: [
            pojo.salesOrder({ id: "Order1" }),
            pojo.salesOrder({ id: "Order2" }),
            pojo.salesOrder({ id: "Order3" }),
          ]
        }
      }
    }));

    let response = await app.getSalesOrdersByDate(pojo.transaction(), pojo.timeRange());

    // It should return the array
    expect(response.salesOrders).to.be.an("array");

    // NOT a synchronous iterable
    expect(response.salesOrders[Symbol.iterator]).to.be.a("function");

    // The sales orders should be returned in order
    let index = 0;
    for await (let salesOrder of response.salesOrders) {
      expect(salesOrder).to.be.an.instanceOf(SalesOrder);
      expect(salesOrder.id).to.equal(`Order${++index}`);
    }
  });

  it("should work with an array with paging data", async () => {
    let app = new OrderApp(pojo.orderApp({
      getSalesOrdersByDate() {

        return {
          salesOrders: [
            pojo.salesOrder({ id: "Order1" }),
            pojo.salesOrder({ id: "Order2" }),
            pojo.salesOrder({ id: "Order3" }),
          ],
          paging: {
            pageSize: 5,
            pageNumber: 2,
            pageCount: 10,
            cursor: "cursor"
          }
        }
      }
    }));

    let response = await app.getSalesOrdersByDate(pojo.transaction(), pojo.timeRange());

    // The sales orders should be returned in order
    let index = 0;
    for (let salesOrder of response.salesOrders) {
      expect(salesOrder).to.be.an.instanceOf(SalesOrder);
      expect(salesOrder.id).to.equal(`Order${++index}`);
    }
    expect(response.paging).to.deep.equal({
      pageSize: 5,
      pageNumber: 2,
      pageCount: 10,
      cursor: "cursor"
    });
  });

  it("should work with an array with statusMapping data", async () => {
    let app = new OrderApp(pojo.orderApp({
      getSalesOrdersByDate() {

        return {
          salesOrders: [
            pojo.salesOrder({ id: "Order1" }),
            pojo.salesOrder({ id: "Order2" }),
            pojo.salesOrder({ id: "Order3" }),
          ],
          paging: {
            pageSize: 5,
            pageNumber: 2,
            pageCount: 10,
            cursor: "cursor"
          }
        }
      }
    }));

    const timeRange = pojo.timeRange();

    timeRange.statusMappings = {
      "customStatus1": "awaiting_payment",
      "customStatus2": "on_hold"
    }

    let response = await app.getSalesOrdersByDate(pojo.transaction(), timeRange);

    // The sales orders should be returned in order
    let index = 0;
    for (let salesOrder of response.salesOrders) {
      expect(salesOrder).to.be.an.instanceOf(SalesOrder);
      expect(salesOrder.id).to.equal(`Order${++index}`);
    }
    expect(response.paging).to.deep.equal({
      pageSize: 5,
      pageNumber: 2,
      pageCount: 10,
      cursor: "cursor"
    });
  });


  describe("Failure tests", () => {

    it("should throw an error if called with no arguments", async () => {
      let app = new OrderApp(pojo.orderApp());

      try {
        await app.getSalesOrdersByDate();
        assert.fail("An error should have been thrown");
      }
      catch (error) {
        expect(error.message).to.equal("Invalid input to the getSalesOrdersByDate method. Invalid transaction: A value is required");
      }
    });

    it("should throw an error if called without a time range", async () => {
      let app = new OrderApp(pojo.orderApp());

      try {
        await app.getSalesOrdersByDate(pojo.transaction());
        assert.fail("An error should have been thrown");
      }
      catch (error) {
        expect(error.message).to.equal("Invalid input to the getSalesOrdersByDate method. Invalid time range: A value is required");
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
        expect(error.message).to.equal("Invalid input to the getSalesOrdersByDate method. Invalid time range: startDateTime must be a valid date/time, endDateTime must be a valid date/time");
      }
    });

    it.skip("should throw an error if nothing is returned", async () => {
      let app = new OrderApp(pojo.orderApp({
        getSalesOrdersByDate() { }
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
        getSalesOrdersByDate() {
          return {
            salesOrders: [{
              identifiers: true,
              createdDateTime: "9999-99-99T99:99:99.999Z",
              status: 5,
              requestedFulfillments: [
                {
                  items: []
                }
              ]
            }]
          };
        }
      }));

      try {
        await app.getSalesOrdersByDate(pojo.transaction(), pojo.timeRange());
        assert.fail("An error should have been thrown");
      }
      catch (error) {
        expect(error.message).to.equal("Error in the getSalesOrdersByDate method. Invalid sales order: id is required, identifiers must be of type object, createdDateTime must be a valid date/time, status must be a string, buyer is required, requestedFulfillments[0].items must contain at least 1 items, requestedFulfillments[0].shipTo is required");
      }
    });
  });
});
