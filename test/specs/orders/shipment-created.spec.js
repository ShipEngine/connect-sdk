"use strict";

const { OrderApp } = require("../../../lib/internal");
const pojo = require("../../utils/pojo");
const { expect } = require("chai");

describe("shipmentCreated", () => {

  it("should not return anything", async () => {
    let app = new OrderApp(pojo.orderApp({
      shipmentCreated() {
        return "Hello world!";
      }
    }));

    let result = await app.shipmentCreated(pojo.transaction(), pojo.salesOrderShipment());

    expect(result).to.equal(undefined);
  });
});
