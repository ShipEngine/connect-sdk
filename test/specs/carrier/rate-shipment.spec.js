"use strict";

const { CarrierApp } = require("../../../lib");
const pojo = require("../../utils/pojo");
const { expect, assert } = require("chai");

describe("rateShipment", () => {

  it("should return a rate from minimal return values", async () => {
    let app = new CarrierApp(pojo.carrierApp({
      carrier: pojo.carrier({
        rateShipment: () => ({
          rates: [{
            deliveryServiceID: "22222222-2222-2222-2222-222222222222",
            packagingID: "44444444-4444-4444-4444-444444444444",
            charges: [{
              type: "shipping",
              amount: {
                value: 123.456,
                currency: "CAD",
              },
            }],
          }]
        })
      }),
    }));

    let quote = await app.carrier.rateShipment(pojo.transaction(), pojo.rateCriteria());

    expect(quote).to.deep.equal({
      rates: [{
        deliveryService: {
          ...quote.rates[0].deliveryService,
          id: "22222222-2222-2222-2222-222222222222",
        },
        packaging: {
          ...quote.rates[0].packaging,
          id: "44444444-4444-4444-4444-444444444444",
        },
        deliveryConfirmation: undefined,
        fulfillmentService: undefined,
        shipDateTime: undefined,
        deliveryDateTime: undefined,
        minimumDeliveryDays: undefined,
        maximumDeliveryDays: undefined,
        zone: undefined,
        isNegotiatedRate: false,
        isGuaranteed: false,
        isTrackable: false,
        notes: "",
        totalAmount: {
          value: "123.46",
          currency: "CAD",
        },
        charges: [{
          name: "",
          description: "",
          code: "",
          notes: "",
          type: "shipping",
          amount: {
            value: "123.46",
            currency: "CAD",
          }
        }],
      }]
    });
  });

  it("should return a rate from all possible return values", async () => {
    let app = new CarrierApp(pojo.carrierApp({
      carrier: pojo.carrier({
        deliveryServices: [
          pojo.deliveryService({
            deliveryConfirmations: [pojo.deliveryConfirmation()],
          })
        ],
        rateShipment: () => ({
          rates: [{
            deliveryServiceID: "22222222-2222-2222-2222-222222222222",
            packagingID: "44444444-4444-4444-4444-444444444444",
            deliveryConfirmationID: "55555555-5555-5555-5555-555555555555",
            fulfillmentService: "ups_ground",
            shipDateTime: "2005-05-05T05:05:05.005+00:30",
            deliveryDateTime: new Date("2005-05-05T05:05:05.005-07:00"),
            minimumDeliveryDays: 0,
            maximumDeliveryDays: 1,
            zone: 1,
            isNegotiatedRate: true,
            isGuaranteed: true,
            isTrackable: true,
            notes: "This is a note",
            charges: [
              {
                name: "Shipping Charge",
                description: "Charge for shipping",
                code: "SHP",
                notes: "you were charged extra because reasons",
                type: "shipping",
                amount: {
                  value: 123.456,
                  currency: "CAD",
                },
              },
              {
                name: "Delivery Confirmation Charge",
                description: "Charge for delivery conirmation",
                code: "DEL",
                notes: "Signatures cost extra",
                type: "delivery_confirmation",
                amount: {
                  value: 1.5,
                  currency: "CAD",
                },
              },
            ],
          }]
        })
      }),
    }));

    let quote = await app.carrier.rateShipment(pojo.transaction(), pojo.rateCriteria());

    expect(quote).to.deep.equal({
      rates: [{
        deliveryService: {
          ...quote.rates[0].deliveryService,
          id: "22222222-2222-2222-2222-222222222222",
        },
        packaging: {
          ...quote.rates[0].packaging,
          id: "44444444-4444-4444-4444-444444444444",
        },
        deliveryConfirmation: {
          ...quote.rates[0].deliveryConfirmation,
          id: "55555555-5555-5555-5555-555555555555",
        },
        fulfillmentService: "ups_ground",
        shipDateTime: {
          value: "2005-05-05T05:05:05.005",
          offset: "+00:30",
          timeZone: "+00:30",
        },
        deliveryDateTime: {
          value: "2005-05-05T12:05:05.005",
          offset: "+00:00",
          timeZone: "UTC",
        },
        minimumDeliveryDays: 0,
        maximumDeliveryDays: 1,
        zone: 1,
        isNegotiatedRate: true,
        isGuaranteed: true,
        isTrackable: true,
        notes: "This is a note",
        totalAmount: {
          value: "124.96",
          currency: "CAD",
        },
        charges: [
          {
            name: "Shipping Charge",
            description: "Charge for shipping",
            code: "SHP",
            notes: "you were charged extra because reasons",
            type: "shipping",
            amount: {
              value: "123.46",
              currency: "CAD",
            }
          },
          {
            name: "Delivery Confirmation Charge",
            description: "Charge for delivery conirmation",
            code: "DEL",
            notes: "Signatures cost extra",
            type: "delivery_confirmation",
            amount: {
              value: "1.50",
              currency: "CAD",
            }
          }
        ],
      }]
    });
  });

  describe("Failure tests", () => {

    it("should throw an error if called with no arguments", async () => {
      let app = new CarrierApp(pojo.carrierApp({
        carrier: pojo.carrier({
          rateShipment () {}
        }),
      }));

      try {
        await app.carrier.rateShipment();
        assert.fail("An error should have been thrown");
      }
      catch (error) {
        expect(error.message).to.equal(
          "Invalid input to the rateShipment method. \n" +
          "Invalid transaction: \n" +
          "  A value is required"
        );
      }
    });

    it("should throw an error if called without a RateCriteria", async () => {
      let app = new CarrierApp(pojo.carrierApp({
        carrier: pojo.carrier({
          rateShipment () {}
        }),
      }));

      try {
        await app.carrier.rateShipment(pojo.transaction());
        assert.fail("An error should have been thrown");
      }
      catch (error) {
        expect(error.message).to.equal(
          "Invalid input to the rateShipment method. \n" +
          "Invalid rate criteria: \n" +
          "  A value is required"
        );
      }
    });

    it("should throw an error if called without an invalid RateCriteria", async () => {
      let app = new CarrierApp(pojo.carrierApp({
        carrier: pojo.carrier({
          rateShipment () {}
        }),
      }));

      try {
        await app.carrier.rateShipment(pojo.transaction(), {
          deliveryServices: "12345678-1234-1234-1234-123456789012",
          packaging: ["Large Box"],
          deliveryDateTime: "9999-99-99T99:99:99.999Z",
          packages: [],
        });
        assert.fail("An error should have been thrown");
      }
      catch (error) {
        expect(error.message).to.equal(
          "Invalid input to the rateShipment method. \n" +
          "Invalid rate criteria: \n" +
          "  deliveryServices must be an array \n" +
          "  packaging[0] must be a valid GUID \n" +
          "  shipDateTime is required \n" +
          "  deliveryDateTime must be a valid date/time \n" +
          "  shipFrom is required \n" +
          "  shipTo is required \n" +
          "  packages must contain at least 1 items"
        );
      }
    });

    it("should throw an error if nothing is returned", async () => {
      let app = new CarrierApp(pojo.carrierApp({
        carrier: pojo.carrier({
          rateShipment () {}
        }),
      }));

      try {
        await app.carrier.rateShipment(pojo.transaction(), pojo.rateCriteria());
        assert.fail("An error should have been thrown");
      }
      catch (error) {
        expect(error.message).to.equal(
          "Error in rateShipment method. \n" +
          "Invalid rate quote: \n" +
          "  A value is required"
        );
      }
    });

    it("should throw an error if an invalid rate is returned", async () => {
      let app = new CarrierApp(pojo.carrierApp({
        carrier: pojo.carrier({
          rateShipment: () => ({
            rates: [{
              deliveryConfirmationID: "Handshake",
              deliveryDateTime: "9999-99-99T99:99:99.999Z",
              isNegotiatedRate: "no",
              charges: [],
              notes: false,
            }]
          })
        }),
      }));

      try {
        await app.carrier.rateShipment(pojo.transaction(), pojo.rateCriteria());
        assert.fail("An error should have been thrown");
      }
      catch (error) {
        expect(error.message).to.equal(
          "Error in rateShipment method. \n" +
          "Invalid rate quote: \n" +
          "  rates[0].deliveryServiceID is required \n" +
          "  rates[0].packagingID is required \n" +
          "  rates[0].deliveryConfirmationID must be a valid GUID \n" +
          "  rates[0].deliveryDateTime must be a valid date/time \n" +
          "  rates[0].isNegotiatedRate must be a boolean \n" +
          "  rates[0].charges must contain at least 1 items \n" +
          "  rates[0].notes must be a string"
        );
      }
    });

    it("should throw an error if an invalid deliveryServiceID is returned", async () => {
      let app = new CarrierApp(pojo.carrierApp({
        carrier: pojo.carrier({
          rateShipment: () => ({
            rates: [{
              deliveryServiceID: "12345678-1234-1234-1234-123456789012",
              packagingID: "44444444-4444-4444-4444-444444444444",
              charges: [{
                type: "shipping",
                amount: {
                  value: 123.45,
                  currency: "CAD",
                },
              }],
            }]
          })
        }),
      }));

      try {
        await app.carrier.rateShipment(pojo.transaction(), pojo.rateCriteria());
        assert.fail("An error should have been thrown");
      }
      catch (error) {
        expect(error.message).to.equal(
          "Error in rateShipment method. \n" +
          "Unable to find delivery service ID: 12345678-1234-1234-1234-123456789012"
        );
      }
    });

    it("should throw an error if an invalid packagingID is returned", async () => {
      let app = new CarrierApp(pojo.carrierApp({
        carrier: pojo.carrier({
          rateShipment: () => ({
            rates: [{
              deliveryServiceID: "22222222-2222-2222-2222-222222222222",
              packagingID: "12345678-1234-1234-1234-123456789012",
              charges: [{
                type: "shipping",
                amount: {
                  value: 123.45,
                  currency: "CAD",
                },
              }],
            }]
          })
        }),
      }));

      try {
        await app.carrier.rateShipment(pojo.transaction(), pojo.rateCriteria());
        assert.fail("An error should have been thrown");
      }
      catch (error) {
        expect(error.message).to.equal(
          "Error in rateShipment method. \n" +
          "Unable to find packaging ID: 12345678-1234-1234-1234-123456789012"
        );
      }
    });

    it("should throw an error if an invalid deliveryConfirmationID is returned", async () => {
      let app = new CarrierApp(pojo.carrierApp({
        carrier: pojo.carrier({
          rateShipment: () => ({
            rates: [{
              deliveryServiceID: "22222222-2222-2222-2222-222222222222",
              packagingID: "44444444-4444-4444-4444-444444444444",
              deliveryConfirmationID: "22222222-2222-2222-2222-222222222222",
              charges: [{
                type: "shipping",
                amount: {
                  value: 123.45,
                  currency: "CAD",
                },
              }],
            }]
          })
        }),
      }));

      try {
        await app.carrier.rateShipment(pojo.transaction(), pojo.rateCriteria());
        assert.fail("An error should have been thrown");
      }
      catch (error) {
        expect(error.message).to.equal(
          "Error in rateShipment method. \n" +
          "22222222-2222-2222-2222-222222222222 is a delivery service ID not a delivery confirmation ID"
        );
      }
    });

    it("should throw an error if minimumDeliveryDays is greater than maximumDeliveryDays", async () => {
      let app = new CarrierApp(pojo.carrierApp({
        carrier: pojo.carrier({
          rateShipment: () => ({
            rates: [{
              deliveryServiceID: "22222222-2222-2222-2222-222222222222",
              packagingID: "44444444-4444-4444-4444-444444444444",
              minimumDeliveryDays: 5,
              maximumDeliveryDays: 3,
              charges: [{
                type: "shipping",
                amount: {
                  value: 123.45,
                  currency: "CAD",
                },
              }],
            }]
          })
        }),
      }));

      try {
        await app.carrier.rateShipment(pojo.transaction(), pojo.rateCriteria());
        assert.fail("An error should have been thrown");
      }
      catch (error) {
        expect(error.message).to.equal(
          "Error in rateShipment method. \n" +
          "Invalid delivery time range: minimumDeliveryDays must be less than or equal to maximumDeliveryDays"
        );
      }
    });

  });
});
