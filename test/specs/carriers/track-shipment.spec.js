"use strict";

const { CarrierApp } = require("../../../lib/internal");
const pojo = require("../../utils/pojo");
const { expect, assert } = require("chai");

describe("trackShipment", () => {

  it("should return trackingInfo with minimal return values", async () => {
    let app = new CarrierApp(pojo.carrierApp({
      trackShipment: () => ({
        trackingNumber: "1234-5678",
        packages: [],
        events: [{
          name: "Dummy Event",
          dateTime: new Date("2005-05-05T05:05:05.005Z"),
          status: "accepted"
        }]
      })
    }));


    let confirmation = await app.trackShipment(pojo.transaction(), pojo.trackingCriteria());

    expect(confirmation).to.deep.equal({
      trackingNumber: "1234-5678",
      packages: [],
      identifiers: {},
      deliveryDateTime: undefined,
      events: [{
        address: undefined,
        code: "",
        description: "",
        isError: false,
        notes: [],
        signer: undefined,
        name: "Dummy Event",
        dateTime: {
          offset: "+00:00",
          timeZone: "UTC",
          value: "2005-05-05T05:05:05.005"
        },
        status: "accepted"
      }]
    });
  });

  it("should return trackingInfo from all possible return values", async () => {

    let app = new CarrierApp(pojo.carrierApp({
      trackShipment: () => ({
        trackingNumber: "1234-5678",
        identifiers: {},
        deliveryDateTime: new Date("2005-05-05T05:05:05.005Z"),
        packages: [{
          packaging: "dummy-packaging-code",
          dimensions: {
            length: 12,
            width: 12,
            height: 12,
            unit: "in"
          },
          weight: {
            value: 1,
            unit: "lb"
          }
        }],
        events: [{
          name: "Dummy Event",
          dateTime: new Date("2005-05-05T05:05:05.005Z"),
          status: "accepted",
          isError: false,
          code: "carrier_code",
          description: "a description",
          address: {
            company: "Dummy Company",
            addressLines: ["123 Main Street"],
            cityLocality: "Austin",
            stateProvince: "TX",
            postalCode: "78665",
            country: "US",
            isResidential: false
          },
          signer: "John Doe",
          notes: [{ text: "A note", type: "message_to_buyer" }]
        }]
      })
    }));

    let confirmation = await app.trackShipment(pojo.transaction(), pojo.trackingCriteria());

    expect(confirmation).to.deep.equal({
      trackingNumber: "1234-5678",
      packages: [{
        packaging: {
          code: "dummy-packaging-code",
          description: "",
          id: "44444444-4444-4444-4444-444444444444",
          identifiers: {},
          name: "Dummy Packaging",
          requiresDimensions: false,
          requiresWeight: false
        },
        dimensions: {
          length: 12,
          width: 12,
          height: 12,
          unit: "in"
        },
        weight: {
          value: 1,
          unit: "lb"
        }
      }],
      identifiers: {},
      deliveryDateTime: {
        offset: "+00:00",
        timeZone: "UTC",
        value: "2005-05-05T05:05:05.005"
      },
      events: [{
        address: {
          company: "Dummy Company",
          addressLines: ["123 Main Street"],
          cityLocality: "Austin",
          stateProvince: "TX",
          postalCode: "78665",
          country: "US",
          isResidential: false
        },
        code: "carrier_code",
        description: "a description",
        isError: false,
        notes: [{
          text: "A note",
          type: "message_to_buyer"
        }],
        signer: {
          family: "",
          given: "John Doe",
          middle: "",
          suffix: "",
          title: ""
        },
        name: "Dummy Event",
        dateTime: {
          offset: "+00:00",
          timeZone: "UTC",
          value: "2005-05-05T05:05:05.005"
        },
        status: "accepted"
      }]
    });
  });

  describe("Failure tests", () => {

    it("should throw an error if called with no arguments", async () => {
      let app = new CarrierApp(pojo.carrierApp({
        trackShipment() { }
      }));

      try {
        await app.trackShipment();
        assert.fail("An error should have been thrown");
      }
      catch (error) {
        expect(error.message).to.equal("Invalid input to the trackShipment method. Invalid transaction: A value is required");
      }
    });

    it("should throw an error if called without a shipment", async () => {
      let app = new CarrierApp(pojo.carrierApp({
        trackShipment() { }
      }));

      try {
        await app.trackShipment(pojo.transaction());
        assert.fail("An error should have been thrown");
      }
      catch (error) {
        expect(error.message).to.equal("Invalid input to the trackShipment method. Invalid shipment: A value is required");
      }
    });

    it("should throw an error if called with an invalid trackingCriteria", async () => {
      let app = new CarrierApp(pojo.carrierApp({
        trackShipment() { }
      }));

      try {
        await app.trackShipment(pojo.transaction(), {
          trackingNumber: 12345,
          return: "2012-12-12"
        });
        assert.fail("An error should have been thrown");
      }
      catch (error) {
        expect(error.message).to.equal("Invalid input to the trackShipment method. Invalid shipment: trackingNumber must be a string, return is not allowed");
      }
    });

    it("should throw an error if nothing is returned", async () => {
      let app = new CarrierApp(pojo.carrierApp({
        trackShipment() { }
      }));

      try {
        await app.trackShipment(pojo.transaction(), pojo.trackingCriteria());
        assert.fail("An error should have been thrown");
      }
      catch (error) {
        expect(error.message).to.equal("Invalid tracking info: A value is required Invalid tracking info: A value is required");
      }
    });

    it("should throw an error if an invalid package is returned", async () => {
      let app = new CarrierApp(pojo.carrierApp({
        trackShipment: () => ({
          trackingNumber: "1234-5678",
          identifiers: {},
          deliveryDateTime: new Date("2005-05-05T05:05:05.005Z"),
          packages: [{
            package: "dummy-packaging-code",
            dimension: {
              length: 12,
              width: 12,
              height: 12,
              unit: "in"
            },
            weight: {
              value: 1,
              unit: "lb"
            }
          }],
          events: [{
            name: "Dummy Event",
            dateTime: new Date("2005-05-05T05:05:05.005Z"),
            status: "accepted",
            isError: false,
            code: "carrier_code",
            description: "a description",
            address: {
              company: "Dummy Company",
              addressLines: ["123 Main Street"],
              cityLocality: "Austin",
              stateProvince: "TX",
              postalCode: "78665",
              country: "US",
              isResidential: false
            },
            signer: "John Doe",
            notes: [{ text: "A note", type: "message_to_buyer" }]
          }]
        })
      }));

      try {
        await app.trackShipment(pojo.transaction(), pojo.trackingCriteria());
        assert.fail("An error should have been thrown");
      }
      catch (error) {
        expect(error.message).to.equal("Invalid tracking info: packages[0].package is not allowed, packages[0].dimension is not allowed Invalid tracking info: packages[0].package is not allowed, packages[0].dimension is not allowed");
      }
    });

    it("should throw an error if the event is invalid", async () => {
      let app = new CarrierApp(pojo.carrierApp({
        trackShipment: () => ({
          trackingNumber: "1234-5678",
          identifiers: {},
          deliveryDateTime: new Date("2005-05-05T05:05:05.005Z"),
          packages: [{
            packaging: "dummy-packaging-code",
            dimensions: {
              length: 12,
              width: 12,
              height: 12,
              unit: "in"
            },
            weight: {
              value: 1,
              unit: "lb"
            }
          }],
          events: [{
            name: "Dummy Event",
            dateTime: new Date("2005-05-05T05:05:05.005Z"),
            status: "accepted",
            isError: false,
            code: "carrier_code",
            description: "a description",
            address: {
              company: "Dummy Company",
              addressLines: ["123 Main Street"],
              cityLocality: "Austin",
              stateProvince: "TX",
              postalCode: "78665",
              country: "US",
              isResidential: false
            },
            signer: "John Doe",
            note: "A note"
          }]
        }),
      }));

      try {
        await app.trackShipment(pojo.transaction(), pojo.trackingCriteria());
        assert.fail("An error should have been thrown");
      }
      catch (error) {
        expect(error.message).to.equal("Invalid tracking info: events[0].note is not allowed Invalid tracking info: events[0].note is not allowed");
      }
    });
  });
});
