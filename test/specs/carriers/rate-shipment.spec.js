"use strict";

const { CarrierApp } = require("../../../lib/internal");
const pojo = require("../../utils/pojo");
const { expect, assert } = require("chai");

describe("rateShipment", () => {

  it("should return a rate from minimal return values", async () => {
    let app = new CarrierApp(pojo.carrierApp({
      rateShipment: () => [{
        deliveryService: {
          id: "22222222-2222-2222-2222-222222222222"
        },
        charges: [{
          type: "shipping",
          amount: {
            value: 123.456,
            currency: "CAD",
          },
        }],
        packages: [{
          packaging: {
            id: "44444444-4444-4444-4444-444444444444",
          }
        }]
      }]
    }));

    let rates = await app.rateShipment(pojo.transaction(), pojo.rateCriteria());

    expect(rates).to.deep.equal([{
      deliveryService: {
        ...rates[0].deliveryService,
        id: "22222222-2222-2222-2222-222222222222",
      },
      shipDateTime: undefined,
      deliveryDateTime: undefined,
      isNegotiatedRate: false,
      isTrackable: false,
      notes: [],
      totalAmount: {
        value: 123.46,
        currency: "CAD",
      },
      charges: [{
        name: "",
        type: "shipping",
        amount: {
          value: 123.46,
          currency: "CAD",
        }
      }],
      packages: [{
        packaging: {
          ...rates[0].packages[0].packaging,
          id: "44444444-4444-4444-4444-444444444444",
        },
        deliveryConfirmation: undefined,
      }],
    }]);
  });

  it("should return a rate from using a delivery service, packaging, and confirmation codes", async () => {

    const carrierAppDef = pojo.carrierApp({
      rateShipment: () => [{
        deliveryService: "dummy-ds-code",
        charges: [{
          type: "shipping",
          amount: {
            value: 123.456,
            currency: "CAD",
          },
        }],
        packages: [{
          packaging: "dummy-packaging-code",
          deliveryConfirmation: "dummy-confirmation-code"
        }]
      }]
    });

    carrierAppDef.deliveryServices[0].deliveryConfirmations = [pojo.deliveryConfirmation()];

    let app = new CarrierApp(carrierAppDef);

    const rateCriteria = pojo.rateCriteria({
      deliveryService: "dummy-ds-code"
    });

    rateCriteria.packages[0].deliveryConfirmations = ["dummy-confirmation-code"];

    let rates = await app.rateShipment(pojo.transaction(), rateCriteria);

    expect(rates).to.deep.equal([{
      deliveryService: {
        ...rates[0].deliveryService,
        id: "22222222-2222-2222-2222-222222222222",
        code: "dummy-ds-code"
      },
      shipDateTime: undefined,
      deliveryDateTime: undefined,
      isNegotiatedRate: false,
      isTrackable: false,
      notes: [],
      totalAmount: {
        value: 123.46,
        currency: "CAD",
      },
      charges: [{
        name: "",
        type: "shipping",
        amount: {
          value: 123.46,
          currency: "CAD",
        }
      }],
      packages: [{
        packaging: {
          ...rates[0].packages[0].packaging,
          id: "44444444-4444-4444-4444-444444444444",
          code: "dummy-packaging-code"
        },
        deliveryConfirmation: {
          id: "55555555-5555-5555-5555-555555555555",
          code: "dummy-confirmation-code",
          name: "Dummy Confirmation",
          description: "",
          identifiers: {},
          type: "signature"
        },
      }],
    }]);
  });

  it("should return a rate from all possible return values", async () => {
    let app = new CarrierApp(pojo.carrierApp({
      deliveryServices: [
        pojo.deliveryService({
          deliveryConfirmations: [pojo.deliveryConfirmation()],
        })
      ],
      rateShipment: () => [{
        deliveryService: {
          id: "22222222-2222-2222-2222-222222222222",
          identifiers: {},
        },
        shipDateTime: "2005-05-05T05:05:05.005+00:30",
        deliveryDateTime: new Date("2005-05-05T05:05:05.005-07:00"),
        isNegotiatedRate: true,
        isTrackable: true,
        notes: "This is a note",
        charges: [
          {
            name: "Shipping Charge",
            type: "shipping",
            amount: {
              value: 123.456,
              currency: "CAD",
            },
          },
          {
            name: "Delivery Confirmation Charge",
            type: "delivery_confirmation",
            amount: {
              value: 1.5,
              currency: "CAD",
            },
          },
        ],
        packages: [{
          packaging: {
            id: "44444444-4444-4444-4444-444444444444",
            identifiers: {},
          },
          deliveryConfirmation: {
            id: "55555555-5555-5555-5555-555555555555",
            identifiers: {},
          }
        }]
      }]
    }));

    let rates = await app.rateShipment(pojo.transaction(), pojo.rateCriteria());

    expect(rates).to.deep.equal([{
      deliveryService: {
        ...rates[0].deliveryService,
        id: "22222222-2222-2222-2222-222222222222",
      },
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
      isNegotiatedRate: true,
      isTrackable: true,
      notes: [
        {
          type: "uncategorized",
          text: "This is a note",
        }
      ],
      totalAmount: {
        value: 124.96,
        currency: "CAD",
      },
      charges: [
        {
          name: "Shipping Charge",
          type: "shipping",
          amount: {
            value: 123.46,
            currency: "CAD",
          }
        },
        {
          name: "Delivery Confirmation Charge",
          type: "delivery_confirmation",
          amount: {
            value: 1.50,
            currency: "CAD",
          }
        }
      ],
      packages: [{
        packaging: {
          ...rates[0].packages[0].packaging,
          id: "44444444-4444-4444-4444-444444444444",
        },
        deliveryConfirmation: {
          ...rates[0].packages[0].deliveryConfirmation,
          id: "55555555-5555-5555-5555-555555555555",
        },
      }]
    }]);
  });

  describe("Failure tests", () => {

    it("should throw an error if called with no arguments", async () => {
      let app = new CarrierApp(pojo.carrierApp({
        rateShipment () { }
      }));

      try {
        await app.rateShipment();
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

    it("should throw an error if called without a shipment", async () => {
      let app = new CarrierApp(pojo.carrierApp({
        rateShipment () { }
      }));

      try {
        await app.rateShipment(pojo.transaction());
        assert.fail("An error should have been thrown");
      }
      catch (error) {
        expect(error.message).to.equal(
          "Invalid input to the rateShipment method. \n" +
          "Invalid shipment: \n" +
          "  A value is required"
        );
      }
    });

    it("should throw an error if called with an invalid shipment", async () => {
      let app = new CarrierApp(pojo.carrierApp({
        rateShipment () { }
      }));

      try {
        await app.rateShipment(pojo.transaction(), {
          deliveryService: 12345678123412341234123456789012,

          deliveryDateTime: "9999-99-99T99:99:99.999Z",
          packages: [],
        });
        assert.fail("An error should have been thrown");
      }
      catch (error) {
        expect(error.message).to.equal(
          "Invalid input to the rateShipment method. \n" +
          "Invalid shipment: \n" +
          "  deliveryService must be one of object, string \n" +
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
        rateShipment () { }
      }));

      try {
        await app.rateShipment(pojo.transaction(), pojo.rateCriteria());
        assert.fail("An error should have been thrown");
      }
      catch (error) {
        expect(error.message).to.equal(
          "Error in the rateShipment method. \n" +
          "Invalid rate: \n" +
          "  A value is required"
        );
      }
    });

    it("should throw an error if an invalid rate is returned", async () => {
      let app = new CarrierApp(pojo.carrierApp({
        rateShipment: () => [{
          deliveryDateTime: "9999-99-99T99:99:99.999Z",
          isNegotiatedRate: "no",
          charges: [],
          notes: false,
          packages: [
            {
              deliveryConfirmation: {
                id: "Handshake",
              }
            }
          ]
        }]
      }));

      try {
        await app.rateShipment(pojo.transaction(), pojo.rateCriteria());
        assert.fail("An error should have been thrown");
      }
      catch (error) {
        expect(error.message).to.equal(
          "Error in the rateShipment method. \n" +
          "Invalid rate: \n" +
          "  [0].deliveryService is required \n" +
          "  [0].deliveryDateTime must be a valid date/time \n" +
          "  [0].isNegotiatedRate must be a boolean \n" +
          "  [0].charges must contain at least 1 items \n" +
          "  [0].notes must be one of string, array \n" +
          "  [0].packages[0].packaging is required \n" +
          "  [0].packages[0].deliveryConfirmation.id must be a valid GUID"
        );
      }
    });

    it("should throw an error if an invalid deliveryService is returned", async () => {
      let app = new CarrierApp(pojo.carrierApp({
        rateShipment: () => [
          pojo.rate({
            deliveryService: {
              id: "12345678-1234-1234-1234-123456789012",
            }
          })
        ]
      }));

      try {
        await app.rateShipment(pojo.transaction(), pojo.rateCriteria());
        assert.fail("An error should have been thrown");
      }
      catch (error) {
        expect(error.message).to.equal(
          "Error in the rateShipment method. \n" +
          "Unable to find delivery service ID: 12345678-1234-1234-1234-123456789012"
        );
      }
    });

    it("should throw an error if an invalid packaging is returned", async () => {
      let app = new CarrierApp(pojo.carrierApp({
        rateShipment: () => [
          pojo.rate({
            packages: [{
              packaging: {
                id: "12345678-1234-1234-1234-123456789012",
              }
            }]
          })
        ]
      }));

      try {
        await app.rateShipment(pojo.transaction(), pojo.rateCriteria());
        assert.fail("An error should have been thrown");
      }
      catch (error) {
        expect(error.message).to.equal(
          "Error in the rateShipment method. \n" +
          "Unable to find packaging ID: 12345678-1234-1234-1234-123456789012"
        );
      }
    });

    it("should throw an error if an invalid deliveryConfirmation is returned", async () => {
      let app = new CarrierApp(pojo.carrierApp({
        rateShipment: () => [
          pojo.rate({
            packages: [
              pojo.ratePackage({
                deliveryConfirmation: {
                  id: "22222222-2222-2222-2222-222222222222",
                }
              })
            ]
          })
        ]
      }));

      try {
        await app.rateShipment(pojo.transaction(), pojo.rateCriteria());
        assert.fail("An error should have been thrown");
      }
      catch (error) {
        expect(error.message).to.equal(
          "Error in the rateShipment method. \n" +
          "22222222-2222-2222-2222-222222222222 is a delivery service ID not a delivery confirmation ID"
        );
      }
    });
  });
});
