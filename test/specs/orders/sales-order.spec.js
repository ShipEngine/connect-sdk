"use strict";

const { SalesOrder } = require("../../../lib/internal");
const pojo = require("../../utils/pojo");
const { expect } = require("chai");

describe("The sales order object", () => {

  it("should return an amount of 0 when no charges or adjustments are present", () => {

    const salesOrderPOJO = pojo.salesOrder();
    let salesOrder = new SalesOrder(salesOrderPOJO);

    expect(salesOrder.totalAdjustments.value).to.equal(0);
    expect(salesOrder.totalCharges.value).to.equal(0);

  });

  it("should correctly calculate total adjustments and charges", () => {

    const salesOrderPOJO = pojo.salesOrder();
    salesOrderPOJO.adjustments = [
      {
        type: "shipping",
        amount: {
          value: 10,
          currency: "usd"
        }
      },
      {
        type: "delivery",
        amount: {
          value: 15,
          currency: "usd"
        }
      },
    ];

    salesOrderPOJO.charges = {
      subTotal: {
        value: 10,
        currency: "usd"
      },
      taxAmount: {
        value: 5,
        currency: "usd"
      }
    };

    let salesOrder = new SalesOrder(salesOrderPOJO);

    expect(salesOrder.totalAdjustments.value).to.equal(25);
    expect(salesOrder.totalCharges.value).to.equal(15);

  });

});
