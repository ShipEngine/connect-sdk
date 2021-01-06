"use strict";

const { SalesOrderItem } = require("../../../lib/internal");
const { validate } = require("../../../lib/internal/common/validation");
const { _internal } = require("../../../lib/internal/common/utils");
const pojo = require("../../utils/pojo");
const { expect } = require("chai");

describe("The sales order item object", () => {

  it("is valid with leading/trailing whitespace", () => {

    const salesOrderItemPOJO = pojo.salesOrderItem();
    salesOrderItemPOJO.name = " name ";
    salesOrderItemPOJO.description = " test ";

    const {err} =  validate(salesOrderItemPOJO, SalesOrderItem[_internal].label, SalesOrderItem[_internal].schema);
    expect(err).to.equal(undefined);
  });
});
