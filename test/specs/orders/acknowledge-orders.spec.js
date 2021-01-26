"use strict";

const { OrderApp } = require("../../../lib/internal");
const pojo = require("../../utils/pojo");
const { expect } = require("chai");

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
});
