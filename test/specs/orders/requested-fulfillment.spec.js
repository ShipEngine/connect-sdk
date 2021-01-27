"use strict";

const { RequestedFulfillment } = require("../../../lib/internal");
const { validate } = require("../../../lib/internal/common/validation");
const { _internal } = require("../../../lib/internal/common/utils");
const pojo = require("../../utils/pojo");
const { expect } = require("chai");

describe("The requested fulfillment object", () => {

  it("is valid with extensions", () => {

    const requestedFulfillmentsPOJO = {
      items: [pojo.salesOrderItem()],
      shipTo: pojo.addressWithContactInfo(),
      shippingPreferences: {},
      extensions: {
        customField1: "1",
        customField2: "2",
        customField3: "3"
      }
    }

    const {err} =  validate(requestedFulfillmentsPOJO, RequestedFulfillment[_internal].label, RequestedFulfillment[_internal].schema);
    expect(err).to.equal(undefined);
  });
});
