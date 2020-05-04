"use strict";

const { CarrierApp } = require("../../..");
const pojo = require("../../utils/pojo");
const { expect, assert } = require("chai");

describe("createLabel", () => {

  it("should return a LabelConfirmation from minimal return values", async () => {
    let app = new CarrierApp(pojo.carrierApp({
      carrier: pojo.carrier({
        createLabel: () => ({
          charges: [{
            type: "shipping",
            amount: {
              value: 123.456,
              currency: "CAD",
            },
          }],
          shipment: {
            packages: [{
              label: {
                size: "letter",
                format: "pdf",
                data: Buffer.from("data"),
              }
            }]
          }
        })
      }),
    }));

    let confirmation = await app.carrier.createLabel(pojo.transaction(), pojo.labelSpec());

    expect(confirmation).to.deep.equal({
      confirmationID: "",
      totalAmount: {
        value: "123.46",
        currency: "CAD",
      },
      charges: [{
        name: "",
        type: "shipping",
        amount: {
          value: "123.46",
          currency: "CAD",
        }
      }],
      shipment: {
        trackingNumber: "",
        trackingURL: undefined,
        identifiers: [],
        fulfillmentService: undefined,
        deliveryDateTime: undefined,
        customData: undefined,
        packages: [{
          trackingNumber: "",
          trackingURL: undefined,
          identifiers: [],
          customsForm: undefined,
          customData: undefined,
          label: {
            name: "Label",
            size: "letter",
            format: "pdf",
            data: Buffer.from("data"),
          }
        }],
      },
    });
  });

  it("should return a LabelConfirmation from all possible return values", async () => {
    let app = new CarrierApp(pojo.carrierApp({
      carrier: pojo.carrier({
        createLabel: () => ({
          confirmationID: "ABCDEF-123456",
          charges: [
            {
              name: "Shipping Charges",
              type: "shipping",
              amount: {
                value: 8.95,
                currency: "GBP",
              }
            },
            {
              name: "VAT",
              type: "tax",
              amount: {
                value: 2,
                currency: "GBP",
              }
            },
          ],
          shipment: {
            trackingNumber: "123456-ABCDEF",
            trackingURL: "http://example.com/",
            identifiers: [{
              name: "Shipment ID",
              id: "123456-ABCDEF",
            }],
            fulfillmentService: "ups_ground",
            deliveryDateTime: new Date("2005-05-05T05:05:05.0005Z"),
            customData: {
              foo: "bar",
              biz: "baz",
            },
            packages: [{
              trackingNumber: "ABCDEF-123456",
              trackingURL: new URL("https://example.com"),
              identifiers: [{
                name: "Package ID",
                id: "123456-ABCDEF-1",
              }],
              label: {
                name: "Shipping Label",
                size: "letter",
                format: "pdf",
                data: Buffer.from("label data"),
              },
              customsForm: {
                name: "Customs Form",
                size: "A4",
                format: "html",
                data: Buffer.from("customs form data"),
              },
              customData: {
                fizz: "buzz",
              },
            }],
          },
        })
      }),
    }));

    let confirmation = await app.carrier.createLabel(pojo.transaction(), pojo.labelSpec());

    expect(confirmation).to.deep.equal({
      confirmationID: "ABCDEF-123456",
      charges: [
        {
          name: "Shipping Charges",
          type: "shipping",
          amount: {
            value: "8.95",
            currency: "GBP",
          }
        },
        {
          name: "VAT",
          type: "tax",
          amount: {
            value: "2.00",
            currency: "GBP",
          }
        },
      ],
      totalAmount: {
        value: "10.95",
        currency: "GBP",
      },
      shipment: {
        trackingNumber: "123456-ABCDEF",
        trackingURL: new URL("http://example.com"),
        identifiers: [{
          name: "Shipment ID",
          id: "123456-ABCDEF",
        }],
        fulfillmentService: "ups_ground",
        deliveryDateTime: new Date("2005-05-05T05:05:05.0005Z"),
        customData: {
          foo: "bar",
          biz: "baz",
        },
        packages: [{
          trackingNumber: "ABCDEF-123456",
          trackingURL: new URL("https://example.com"),
          identifiers: [{
            name: "Package ID",
            id: "123456-ABCDEF-1",
          }],
          label: {
            name: "Shipping Label",
            size: "letter",
            format: "pdf",
            data: Buffer.from("label data"),
          },
          customsForm: {
            name: "Customs Form",
            size: "A4",
            format: "html",
            data: Buffer.from("customs form data"),
          },
          customData: {
            fizz: "buzz",
          },
        }],
      },
    });
  });

  describe("Failure tests", () => {

    it("should throw an error if called with no arguments", async () => {
      let app = new CarrierApp(pojo.carrierApp({
        carrier: pojo.carrier({
          createLabel () {}
        }),
      }));

      try {
        await app.carrier.createLabel();
        assert.fail("An error should have been thrown");
      }
      catch (error) {
        expect(error.message).to.equal(
          "Invalid input to the createLabel method. \n" +
          "Invalid transaction: \n" +
          "  A value is required"
        );
      }
    });

    it("should throw an error if called without a LabelSpec", async () => {
      let app = new CarrierApp(pojo.carrierApp({
        carrier: pojo.carrier({
          createLabel () {}
        }),
      }));

      try {
        await app.carrier.createLabel(pojo.transaction());
        assert.fail("An error should have been thrown");
      }
      catch (error) {
        expect(error.message).to.equal(
          "Invalid input to the createLabel method. \n" +
          "Invalid label specification: \n" +
          "  A value is required"
        );
      }
    });

    it("should throw an error if called without an invalid LabelSpec", async () => {
      let app = new CarrierApp(pojo.carrierApp({
        carrier: pojo.carrier({
          createLabel () {}
        }),
      }));

      try {
        await app.carrier.createLabel(pojo.transaction(), {
          format: "paper",
          size: "large",
          shipment: true,
        });
        assert.fail("An error should have been thrown");
      }
      catch (error) {
        expect(error.message).to.equal(
          "Invalid input to the createLabel method. \n" +
          "Invalid label specification: \n" +
          "  format must be one of pdf, html, zpl, png \n" +
          "  size must be one of A4, letter, 4x6, 4x8 \n" +
          "  shipment must be of type object"
        );
      }
    });

    it("should throw an error if nothing is returned", async () => {
      let app = new CarrierApp(pojo.carrierApp({
        carrier: pojo.carrier({
          createLabel () {}
        }),
      }));

      try {
        await app.carrier.createLabel(pojo.transaction(), pojo.labelSpec());
        assert.fail("An error should have been thrown");
      }
      catch (error) {
        expect(error.message).to.equal(
          "Error in createLabel method. \n" +
          "Invalid label confirmation: \n" +
          "  A value is required"
        );
      }
    });

    it("should throw an error if an invalid LabelConfirmation is returned", async () => {
      let app = new CarrierApp(pojo.carrierApp({
        carrier: pojo.carrier({
          createLabel: () => ({
            confirmationID: 12345,
            shipment: {
              packages: []
            }
          })
        }),
      }));

      try {
        await app.carrier.createLabel(pojo.transaction(), pojo.labelSpec());
        assert.fail("An error should have been thrown");
      }
      catch (error) {
        expect(error.message).to.equal(
          "Error in createLabel method. \n" +
          "Invalid label confirmation: \n" +
          "  confirmationID must be a string \n" +
          "  charges is required \n" +
          "  shipment.packages must contain at least 1 items"
        );
      }
    });

    it("should throw an error if the label data is empty", async () => {
      let app = new CarrierApp(pojo.carrierApp({
        carrier: pojo.carrier({
          createLabel: () => pojo.labelConfirmation({
            shipment: pojo.shipmentConfirmation({
              packages: [
                pojo.packageConfirmation({
                  label: pojo.document({
                    data: Buffer.alloc(0),
                  }),
                }),
              ]
            }),
          }),
        }),
      }));

      try {
        await app.carrier.createLabel(pojo.transaction(), pojo.labelSpec());
        assert.fail("An error should have been thrown");
      }
      catch (error) {
        expect(error.message).to.equal(
          "Error in createLabel method. \n" +
          "Label data cannot be empty"
        );
      }
    });

    it("should throw an error if the customs form data is empty", async () => {
      let app = new CarrierApp(pojo.carrierApp({
        carrier: pojo.carrier({
          createLabel: () => pojo.labelConfirmation({
            shipment: pojo.shipmentConfirmation({
              packages: [
                pojo.packageConfirmation({
                  label: pojo.document(),
                  customsForm: pojo.document({
                    data: Buffer.alloc(0),
                  }),
                }),
              ]
            }),
          }),
        }),
      }));

      try {
        await app.carrier.createLabel(pojo.transaction(), pojo.labelSpec());
        assert.fail("An error should have been thrown");
      }
      catch (error) {
        expect(error.message).to.equal(
          "Error in createLabel method. \n" +
          "Customs Form data cannot be empty"
        );
      }
    });

  });
});
