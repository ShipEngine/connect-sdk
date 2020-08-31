"use strict";

const { SalesOrder } = require("../../../lib/internal");
const pojo = require("../../utils/pojo");
const { expect } = require("chai");

describe("The sales order object", () => {

  it("should return an amount of 0 when no charges or adjustments are present", () => {

    const salesOrderPOJO = pojo.salesOrder();
    let salesOrder = new SalesOrder(salesOrderPOJO);

    expect(salesOrder.totalCharges.value).to.equal(0);

  });

  it("should correctly calculate total adjustments and charges", () => {

    const salesOrderPOJO = pojo.salesOrder();

    salesOrderPOJO.charges = [
      {
        name: "a charge",
        type: "shipping",
        amount: {
          value: 10,
          currency: "usd"
        }
      },
      {
        name: "a charge",
        type: "delivery",
        amount: {
          value: 5,
          currency: "usd"
        }
      }
    ];

    let salesOrder = new SalesOrder(salesOrderPOJO);

    expect(salesOrder.totalCharges.value).to.equal(15);

  });

});
