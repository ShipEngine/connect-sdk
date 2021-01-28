"use strict";

const { OrderApp, SalesOrder } = require("../../../lib/internal");
const pojo = require("../../utils/pojo");
const { expect } = require("chai");

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
});
