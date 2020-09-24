"use strict";

const { CarrierApp } = require("../../../lib/internal");
const pojo = require("../../utils/pojo");
const { expect, assert } = require("chai");

describe("createShipment", () => {

  it("should return a shipment from minimal return values", async () => {
    let app = new CarrierApp(pojo.carrierApp({
      createShipment: () => ({
        charges: [{
          type: "shipping",
          amount: {
            value: 123.456,
            currency: "CAD",
          },
        }],
        label: {
          type: "label",
          size: "letter",
          format: "pdf",
          data: Buffer.from("data"),
        }
      })
    }));

    let confirmation = await app.createShipment(pojo.transaction(), pojo.newShipment());

    expect(confirmation).to.deep.equal({
      trackingNumber: "",
      identifiers: {},
      deliveryDateTime: undefined,
      charges: [{
        name: "",
        type: "shipping",
        amount: {
          value: 123.46,
          currency: "CAD",
        }
      }],
      label: {
        name: "Label",
        type: "label",
        size: "letter",
        format: "pdf",
        data: Buffer.from("data"),
        referenceFields: [],
      },
      form: undefined,
      totalAmount: {
        value: 123.46,
        currency: "CAD",
      },
      packages: []
    });
  });

  it("should return a shipment from using a delivery service code", async () => {
    let app = new CarrierApp(pojo.carrierApp({
      createShipment: () => ({
        charges: [{
          type: "shipping",
          amount: {
            value: 123.456,
            currency: "CAD",
          },
        }],
        label: {
          type: "label",
          size: "letter",
          format: "pdf",
          data: Buffer.from("data"),
        },
        packages: [{
        }]
      })
    }));

    const newShipment = pojo.newShipment();
    newShipment.deliveryService = "dummy-ds-code";

    let confirmation = await app.createShipment(pojo.transaction(), newShipment);

    expect(confirmation).to.deep.equal({
      trackingNumber: "",
      identifiers: {},
      deliveryDateTime: undefined,
      charges: [{
        name: "",
        type: "shipping",
        amount: {
          value: 123.46,
          currency: "CAD",
        }
      }],
      label: {
        name: "Label",
        type: "label",
        size: "letter",
        format: "pdf",
        data: Buffer.from("data"),
        referenceFields: [],
      },
      form: undefined,
      totalAmount: {
        value: 123.46,
        currency: "CAD",
      },
      packages: [{
        trackingNumber: "",
        identifiers: {},
        metadata: {}
      }],
    });
  });

  it("should return a shipment when a delivery confirmation type is used", async () => {

    const appDef = pojo.carrierApp({
      createShipment: () => ({
        charges: [{
          type: "shipping",
          amount: {
            value: 123.456,
            currency: "CAD",
          },
        }],
        label: {
          type: "label",
          size: "letter",
          format: "pdf",
          data: Buffer.from("data"),
        },
        packages: [{
        }]
      })
    });

    const deliveryConfirmation = {
      id: "66666666-6666-6666-6666-666666666666",
      code: "another-dummy-confirmation-code",
      name: "Another Dummy Confirmation",
      type: "adult_signature",
    };

    appDef.deliveryServices[0].deliveryConfirmations = [pojo.deliveryConfirmation(), deliveryConfirmation];

    let app = new CarrierApp(appDef);

    const newShipment = pojo.newShipment();
    newShipment.deliveryService = "dummy-ds-code";
    // Specify the delivery confirmation type
    newShipment.deliveryConfirmation = "adult_signature";


    let confirmation = await app.createShipment(pojo.transaction(), newShipment);

    expect(confirmation).to.deep.equal({
      trackingNumber: "",
      identifiers: {},
      deliveryDateTime: undefined,
      charges: [{
        name: "",
        type: "shipping",
        amount: {
          value: 123.46,
          currency: "CAD",
        }
      }],
      label: {
        name: "Label",
        type: "label",
        size: "letter",
        format: "pdf",
        data: Buffer.from("data"),
        referenceFields: [],
      },
      form: undefined,
      totalAmount: {
        value: 123.46,
        currency: "CAD",
      },
      packages: [{
        trackingNumber: "",
        identifiers: {},
        metadata: {}
      }],
    });
  });

  it("should return a shipment from all possible return values", async () => {
    let app = new CarrierApp(pojo.carrierApp({
      createShipment: () => ({
        trackingNumber: "123456-ABCDEF",
        identifiers: {
          myShipmentID: "123456-ABCDEF",
        },
        deliveryDateTime: "2005-05-05T05:05:05.0005Z",
        label: {
          name: "Shipping Label",
          type: "label",
          size: "letter",
          format: "pdf",
          data: Buffer.from("label data"),
          referenceFields: ["one", "two", "three"],
        },
        form: {
          name: "Customs Form",
          type: "customs_form",
          size: "A4",
          format: "png",
          data: Buffer.from("customs form data"),
        },
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
        packages: [{
          trackingNumber: "ABCDEF-123456",
          identifiers: {
            myPackageID: "123456-ABCDEF-1",
          },
          metadata: {
            fizz: "buzz",
          },
        }],
      })
    }));

    let confirmation = await app.createShipment(pojo.transaction(), pojo.newShipment());

    expect(confirmation).to.deep.equal({
      trackingNumber: "123456-ABCDEF",
      identifiers: {
        myShipmentID: "123456-ABCDEF",
      },
      deliveryDateTime: {
        value: "2005-05-05T05:05:05.0005",
        offset: "+00:00",
        timeZone: "UTC",
      },
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
            value: 2.00,
            currency: "GBP",
          }
        },
      ],
      totalAmount: {
        value: 10.95,
        currency: "GBP",
      },
      label: {
        name: "Shipping Label",
        type: "label",
        size: "letter",
        format: "pdf",
        data: Buffer.from("label data"),
        referenceFields: ["one", "two", "three"],
      },
      form: {
        name: "Customs Form",
        type: "customs_form",
        size: "A4",
        format: "png",
        data: Buffer.from("customs form data"),
      },
      packages: [{
        trackingNumber: "ABCDEF-123456",
        identifiers: {
          myPackageID: "123456-ABCDEF-1",
        },
        metadata: {
          fizz: "buzz",
        },
      }],
    });
  });


  it("should accept decimals as a package weight value", async () => {
    let app = new CarrierApp(pojo.carrierApp({
      createShipment: () => ({
        charges: [{
          type: "shipping",
          amount: {
            value: 123.456,
            currency: "CAD",
          },
        }],
        label: {
          type: "label",
          size: "letter",
          format: "pdf",
          data: Buffer.from("data"),
        },
        packages: [{}]
      })
    }));


    const newShipment = pojo.newShipment();
    newShipment.packages[0].weight = {
      value: 11.3,
      unit: "g"
    };

    let confirmation = await app.createShipment(pojo.transaction(), newShipment);

    expect(confirmation).to.deep.equal({
      trackingNumber: "",
      identifiers: {},
      deliveryDateTime: undefined,
      charges: [{
        name: "",
        type: "shipping",
        amount: {
          value: 123.46,
          currency: "CAD",
        }
      }],
      totalAmount: {
        value: 123.46,
        currency: "CAD",
      },
      label: {
        name: "Label",
        type: "label",
        size: "letter",
        format: "pdf",
        data: Buffer.from("data"),
        referenceFields: [],
      },
      form: undefined,
      packages: [{
        trackingNumber: "",
        identifiers: {},
        metadata: {}
      }],
    });
  });

  describe("Failure tests", () => {
    it("should throw an error if called with no arguments", async () => {
      let app = new CarrierApp(pojo.carrierApp({
        createShipment() { }
      }));

      try {
        await app.createShipment();
        assert.fail("An error should have been thrown");
      }
      catch (error) {
        expect(error.message).to.equal("Invalid input to the createShipment method. Invalid transaction: A value is required"
        );
      }
    });

    it("should throw an error if called without a shipment", async () => {
      let app = new CarrierApp(pojo.carrierApp({
        createShipment() { }
      }));

      try {
        await app.createShipment(pojo.transaction());
        assert.fail("An error should have been thrown");
      }
      catch (error) {
        expect(error.message).to.equal(
          "Invalid input to the createShipment method. Invalid shipment: A value is required"
        );
      }
    });

    it("should throw an error if called with an invalid shipment", async () => {
      let app = new CarrierApp(pojo.carrierApp({
        createShipment() { }
      }));

      try {
        await app.createShipment(pojo.transaction(), {
          shipFrom: "here",
          shipTo: "there",
          shipDateTime: true,
          packages: [],
        });
        assert.fail("An error should have been thrown");
      }
      catch (error) {
        expect(error.message).to.equal("Invalid input to the createShipment method. Invalid shipment: deliveryService is required, shipFrom must be of type object, shipTo must be of type object, shipDateTime must be one of date, string, object, packages must contain at least 1 items");
      }
    });

    it("should throw an error if nothing is returned", async () => {
      let app = new CarrierApp(pojo.carrierApp({
        createShipment() { }
      }));

      try {
        await app.createShipment(pojo.transaction(), pojo.newShipment());
        assert.fail("An error should have been thrown");
      }
      catch (error) {
        expect(error.message).to.equal("Error in the createShipment method. Invalid shipment: A value is required");
      }
    });

    it("should throw an error if an invalid shipment is returned", async () => {
      let app = new CarrierApp(pojo.carrierApp({
        createShipment: () => ({
          deliveryDateTime: true,
          packages: []
        })
      }));

      try {
        await app.createShipment(pojo.transaction(), pojo.newShipment());
        assert.fail("An error should have been thrown");
      }
      catch (error) {
        expect(error.message).to.equal("Error in the createShipment method. Invalid shipment: label is required, deliveryDateTime must be one of date, string, object, charges is required");
      }
    });

    it("should throw an error if the label is invalid", async () => {
      let app = new CarrierApp(pojo.carrierApp({
        createShipment: () => pojo.shipmentConfirmation({
          label:
          {
            name: "   \n\t  ",
            type: "letter",
          },
          packages: [
            pojo.packageConfirmation(),
          ]
        }),
      }));

      try {
        await app.createShipment(pojo.transaction(), pojo.newShipment());
        assert.fail("An error should have been thrown");
      }
      catch (error) {
        expect(error.message).to.equal("Error in the createShipment method. Invalid shipment: label.name must not have leading or trailing whitespace, label.name cannot contain newlines or tabs, label.type must be one of label, customs_form, scan_form, label.size is required, label.format is required, label.data is required");
      }
    });

    it("should throw an error if the document is empty", async () => {
      let app = new CarrierApp(pojo.carrierApp({
        createShipment: () => pojo.shipmentConfirmation({
          label: pojo.document({
            data: Buffer.alloc(0),
          }),
          packages: [
            pojo.packageConfirmation(),
          ]
        }),
      }));

      try {
        await app.createShipment(pojo.transaction(), pojo.newShipment());
        assert.fail("An error should have been thrown");
      }
      catch (error) {
        expect(error.message).to.equal("Error in the createShipment method. Label data cannot be empty");
      }
    });
  });
});
