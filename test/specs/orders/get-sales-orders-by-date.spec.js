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
    expect(salesOrders).not.to.be.an("array");

    // Instead, it should wrap it in an async iterable
    expect(salesOrders[Symbol.asyncIterator]).to.be.a("function");

    // NOT a synchronous iterable
    expect(salesOrders[Symbol.iterator]).not.to.be.a("function");

    // The sales orders should be returned in order
    let index = 0;
    for await (let salesOrder of salesOrders) {
      expect(salesOrder).to.be.an.instanceOf(SalesOrder);
      expect(salesOrder.id).to.equal(`Order${++index}`);
    }
  });

  it("should work with an empty array", async () => {
    let app = new OrderApp(pojo.orderApp({
      getSalesOrdersByDate: () => []
    }));

    let salesOrders = await app.getSalesOrdersByDate(pojo.transaction(), pojo.timeRange());

    for await (let salesOrder of salesOrders) {
      assert.fail(salesOrder, undefined, "The iterable should not return any values");
    }
  });

  it("should work with a synchronous generator", async () => {
    let app = new OrderApp(pojo.orderApp({
      *getSalesOrdersByDate () {
        yield pojo.salesOrder({ id: "Order1" });
        yield pojo.salesOrder({ id: "Order2" });
        yield pojo.salesOrder({ id: "Order3" });
      }
    }));

    let salesOrders = await app.getSalesOrdersByDate(pojo.transaction(), pojo.timeRange());

    // It should NOT return a synchronous iterable
    expect(salesOrders[Symbol.iterator]).not.to.be.a("function");

    // Instead, it should wrap it in an asynchronous iterable
    expect(salesOrders[Symbol.asyncIterator]).to.be.a("function");

    // The sales orders should be returned in order
    let index = 0;
    for await (let salesOrder of salesOrders) {
      expect(salesOrder).to.be.an.instanceOf(SalesOrder);
      expect(salesOrder.id).to.equal(`Order${++index}`);
    }
  });

  it("should work with an asynchronous generator", async () => {
    let app = new OrderApp(pojo.orderApp({
      async *getSalesOrdersByDate () {
        await new Promise((resolve) => setTimeout(resolve, 100));
        yield pojo.salesOrder({ id: "Order1" });

        await new Promise((resolve) => setTimeout(resolve, 100));
        yield pojo.salesOrder({ id: "Order2" });

        await new Promise((resolve) => setTimeout(resolve, 100));
        yield pojo.salesOrder({ id: "Order3" });
      }
    }));

    let salesOrders = await app.getSalesOrdersByDate(pojo.transaction(), pojo.timeRange());

    // It should return an asynchronous iterable
    expect(salesOrders[Symbol.asyncIterator]).to.be.a("function");

    // The sales orders should be returned in order
    let index = 0;
    for await (let salesOrder of salesOrders) {
      expect(salesOrder).to.be.an.instanceOf(SalesOrder);
      expect(salesOrder.id).to.equal(`Order${++index}`);
    }
  });

  describe("Failure tests", () => {

    it("should throw an error if called with no arguments", async () => {
      let app = new OrderApp(pojo.orderApp());
      let iterable = app.getSalesOrdersByDate();
      let iterator = iterable[Symbol.asyncIterator]();

      try {
        await iterator.next();
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
      let iterable = app.getSalesOrdersByDate(pojo.transaction());
      let iterator = iterable[Symbol.asyncIterator]();

      try {
        await iterator.next();
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
      let iterable = app.getSalesOrdersByDate(pojo.transaction(), {
        startDateTime: "9999-99-99T99:99:99.999Z",
      });
      let iterator = iterable[Symbol.asyncIterator]();

      try {
        await iterator.next();
        assert.fail("An error should have been thrown");
      }
      catch (error) {
        expect(error.message).to.equal(
          "Invalid input to the getSalesOrdersByDate method. \n" +
          "Invalid time range: \n" +
          "  startDateTime must be a valid date/time \n" +
          "  endDateTime is required"
        );
      }
    });

    it("should throw an error if nothing is returned", async () => {
      let app = new OrderApp(pojo.orderApp({
        getSalesOrdersByDate () {}
      }));

      let iterable = app.getSalesOrdersByDate(pojo.transaction(), pojo.timeRange());
      let iterator = iterable[Symbol.asyncIterator]();

      try {
        await iterator.next();
        assert.fail("An error should have been thrown");
      }
      catch (error) {
        expect(error.message).to.equal(
          "Error in the getSalesOrdersByDate method. \n" +
          "The return value is not iterable"
        );
      }
    });

    it("should throw an error if an invalid sales order is returned", async () => {
      let app = new OrderApp(pojo.orderApp({
        *getSalesOrdersByDate () {
          yield {
            identifiers: true,
            createdDateTime: "9999-99-99T99:99:99.999Z",
            status: 5,
            items: [],
          };
        }
      }));

      let iterable = app.getSalesOrdersByDate(pojo.transaction(), pojo.timeRange());
      let iterator = iterable[Symbol.asyncIterator]();

      try {
        await iterator.next();
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
          "  items must contain at least 1 items"
        );
      }
    });

  });
});
