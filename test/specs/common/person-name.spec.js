"use strict";

const { CarrierApp } = require("../../../");
const { assert, expect } = require("chai");
const pojo = require("../../utils/pojo");

describe("PersonName", () => {

  async function createPersonName (personNamePOJO) {
    let personName;

    let app = new CarrierApp(pojo.carrierApp({
      createShipment (_, shipment) {
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

  describe("Failure tests", () => {

    it("should throw an error if the value is invalid", async () => {
      try {
        await createPersonName(12345);
        assert.fail("An error should have been thrown");
      }
      catch (error) {
        expect(error.message).to.equal(
          "Invalid input to the createShipment method. \n" +
          "Invalid shipment: \n" +
          "  shipFrom.name must be one of string, object"
        );
      }
    });

    it("should throw an error if the value is an empty string", async () => {
      try {
        await createPersonName("");
        assert.fail("An error should have been thrown");
      }
      catch (error) {
        expect(error.message).to.equal(
          "Invalid input to the createShipment method. \n" +
          "Invalid shipment: \n" +
          "  shipFrom.name is not allowed to be empty"
        );
      }
    });

    it("should throw an error if the value is an invalid string", async () => {
      try {
        await createPersonName(" \n\t  ");
        assert.fail("An error should have been thrown");
      }
      catch (error) {
        expect(error.message).to.equal(
          "Invalid input to the createShipment method. \n" +
          "Invalid shipment: \n" +
          "  shipFrom.name does not match any of the allowed types"
        );
      }
    });

    it("should throw an error if the value is an invalid object", async () => {
      try {
        await createPersonName(new Date());
        assert.fail("An error should have been thrown");
      }
      catch (error) {
        expect(error.message).to.equal(
          "Invalid input to the createShipment method. \n" +
          "Invalid shipment: \n" +
          "  shipFrom.name.given is required"
        );
      }
    });

    it("should throw an error if the value is an empty object", async () => {
      try {
        await createPersonName({});
        assert.fail("An error should have been thrown");
      }
      catch (error) {
        expect(error.message).to.equal(
          "Invalid input to the createShipment method. \n" +
          "Invalid shipment: \n" +
          "  shipFrom.name.given is required"
        );
      }
    });

    it("should throw an error if the value does not have a given name", async () => {
      try {
        await createPersonName({
          title: "Mr",
          middle: "Henry",
          family: "Doe",
          suffix: "III",
        });
        assert.fail("An error should have been thrown");
      }
      catch (error) {
        expect(error.message).to.equal(
          "Invalid input to the createShipment method. \n" +
          "Invalid shipment: \n" +
          "  shipFrom.name.given is required"
        );
      }
    });

    it("should throw an error if the given name is invalid", async () => {
      try {
        await createPersonName({
          given: 12345
        });
        assert.fail("An error should have been thrown");
      }
      catch (error) {
        expect(error.message).to.equal(
          "Invalid input to the createShipment method. \n" +
          "Invalid shipment: \n" +
          "  shipFrom.name.given must be a string"
        );
      }
    });

    it("should throw an error if the given name is an empty string", async () => {
      try {
        await createPersonName({
          given: ""
        });
        assert.fail("An error should have been thrown");
      }
      catch (error) {
        expect(error.message).to.equal(
          "Invalid input to the createShipment method. \n" +
          "Invalid shipment: \n" +
          "  shipFrom.name.given is not allowed to be empty"
        );
      }
    });

    it("should throw an error if the given name is an invalid string", async () => {
      try {
        await createPersonName({
          given: "  \n\t   "
        });
        assert.fail("An error should have been thrown");
      }
      catch (error) {
        expect(error.message).to.equal(
          "Invalid input to the createShipment method. \n" +
          "Invalid shipment: \n" +
          "  shipFrom.name does not match any of the allowed types"
        );
      }
    });

    it("should throw an error if an optional field is invalid", async () => {
      try {
        await createPersonName({
          title: 12345,
          given: "John",
          middle: false,
          family: [],
          suffix: /suffix/,
        });
        assert.fail("An error should have been thrown");
      }
      catch (error) {
        expect(error.message).to.equal(
          "Invalid input to the createShipment method. \n" +
          "Invalid shipment: \n" +
          "  shipFrom.name does not match any of the allowed types"
        );
      }
    });

  });
});
