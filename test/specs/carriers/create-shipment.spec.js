"use strict";

const { CarrierApp } = require("../../../lib/internal");
const pojo = require("../../utils/pojo");
const { expect } = require("chai");

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

    const newShipment = pojo.newShipment();
    newShipment.shippingOptions = {
      billDutiesToSender: true,
      dangerousGoodsCategory: "Lithium Metal"
    }

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

  it("should accept a custom package that is not defined in the delivery service", async () => {

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

    const newShipment = pojo.newShipment();
    newShipment.packages = [{
      packaging: "A custom package",
      label: {
        size: "A4",
        format: "pdf"
      }
    }];

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
      packages: []
    });
  });

  it("should not throw an error if given a package that doesn't exist ", async () => {
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
    newShipment.packages[0].packaging = "test";

    try {
      await app.createShipment(pojo.transaction(), newShipment);
      expect(true).to.equal(true);
    }
    catch(error) {
      expect(true).to.equal(false);
    }
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

  it("should accept all values for the dimensions property", async () => {
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
    newShipment.packages[0].dimensions = {
      length: 1,
      width: 1,
      height: 1,
      unit: "in"
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

  it("should accept two values for the dimensions property", async () => {
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
    newShipment.packages[0].dimensions = {
      length: 1,
      width: 1,
      height: 0,
      unit: "in"
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
});
