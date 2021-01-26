"use strict";

const { CarrierApp } = require("../../../lib/internal");
const { expect } = require("chai");
const pojo = require("../../utils/pojo");

describe("PersonName", () => {

  async function createPersonName(personNamePOJO) {
    let personName;

    let app = new CarrierApp(pojo.carrierApp({
      createShipment(_, shipment) {
        personName = shipment.shipFrom.name;
        return pojo.shipmentConfirmation();
      }
    }));

    await app.createShipment(pojo.transaction(), pojo.newShipment({
      shipFrom: pojo.address({
        name: personNamePOJO,
      })
    }));

    return personName;
  }

  it("should create a PersonName from a string", async () => {
    let name = await createPersonName("John Doe");

    expect(name).to.deep.equal({
      given: "John Doe",
      family: "",
      middle: "",
      suffix: "",
      title: "",
    });
  });

  it("should create a PersonName from a POJO with minimal fields", async () => {
    let name = await createPersonName({
      given: "John",
    });

    expect(name).to.deep.equal({
      given: "John",
      family: "",
      middle: "",
      suffix: "",
      title: "",
    });
  });

  it("should create a PersonName from a POJO with all possible fields", async () => {
    let name = await createPersonName({
      title: "Mr",
      given: "John",
      middle: "Henry",
      family: "Doe",
      suffix: "III",
    });

    expect(name).to.deep.equal({
      title: "Mr",
      given: "John",
      middle: "Henry",
      family: "Doe",
      suffix: "III",
    });
  });
});
