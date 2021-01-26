"use strict";

const { CarrierApp } = require("../../../lib/internal");
const pojo = require("../../utils/pojo");
const { expect } = require("chai");

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

  it("should allow an unknown package to be returned", async () => {
    let app = new CarrierApp(pojo.carrierApp({
      trackShipment: () => ({
        trackingNumber: "1234-5678",
        packages: [{
          packaging: "test"
        }],
        events: [{
          name: "Dummy Event",
          dateTime: new Date("2005-05-05T05:05:05.005Z"),
          status: "accepted"
        }]
      })
    }));


    let confirmation = await app.trackShipment(pojo.transaction(), pojo.trackingCriteria());

    expect(confirmation.packages[0].packaging.code).to.equal("custom");
    expect(confirmation.packages[0].packaging.name).to.equal("test");
    expect(confirmation.packages[0].packaging.description).to.equal("test");
  });
});
