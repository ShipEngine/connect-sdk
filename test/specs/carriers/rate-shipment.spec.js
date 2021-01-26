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
        deliveryConfirmation: undefined,
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
      deliveryConfirmation: undefined,
      packages: [{
        packaging: {
          ...rates[0].packages[0].packaging,
          id: "44444444-4444-4444-4444-444444444444",
        }
      }],
    }]);
  });

  it("allows the delivery service to be an empty string", async () => {
    let app = new CarrierApp(pojo.carrierApp({
      rateShipment: () => [{
        deliveryService: "",
        charges: [{
          type: "shipping",
          amount: {
            value: 123.456,
            currency: "CAD",
          },
        }],
        deliveryConfirmation: undefined,
        packages: [{
          packaging: {
            id: "44444444-4444-4444-4444-444444444444",
          }
        }]
      }]
    }));

    try {
      await app.rateShipment(pojo.transaction(), pojo.rateCriteria({ deliveryService: "" }));
    } catch (error) {
      console.log(error);
      assert.fail("It should not throw an error.")
    }
  });

  it("should return a rate when a delivery confirmation type is used", async () => {

    const appDef = pojo.carrierApp({
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
        deliveryConfirmation: undefined,
        packages: [{
          packaging: {
            id: "44444444-4444-4444-4444-444444444444",
          }
        }]
      }]
    });

    const deliveryConfirmation = {
      id: "66666666-6666-6666-6666-666666666666",
      code: "another-dummy-confirmation-code",
      name: "Another Dummy Confirmation",
      type: "adult_signature",
    };

    appDef.deliveryServices[0].deliveryConfirmations = [pojo.deliveryConfirmation(), deliveryConfirmation];

    let app = new CarrierApp(appDef);

    const rateCriteria = pojo.rateCriteria();
    rateCriteria.deliveryService = "dummy-ds-code";
    // Specify the delivery confirmation type
    rateCriteria.deliveryConfirmation = "adult_signature";

    let rates = await app.rateShipment(pojo.transaction(), rateCriteria);

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
      deliveryConfirmation: undefined,
      packages: [{
        packaging: {
          ...rates[0].packages[0].packaging,
          id: "44444444-4444-4444-4444-444444444444",
        },
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
        deliveryConfirmation: "dummy-confirmation-code",
        packages: [{
          packaging: "dummy-packaging-code",
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
      deliveryConfirmation: {
        id: "55555555-5555-5555-5555-555555555555",
        code: "dummy-confirmation-code",
        name: "Dummy Confirmation",
        description: "",
        identifiers: {},
        type: "signature"
      },
      packages: [{
        packaging: {
          ...rates[0].packages[0].packaging,
          id: "44444444-4444-4444-4444-444444444444",
          code: "dummy-packaging-code"
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
        notes: [{ type: "internal", text: "This is a note." }],
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
        deliveryConfirmation: {
          id: "55555555-5555-5555-5555-555555555555",
          identifiers: {},
        },
        packages: [{
          packaging: {
            id: "44444444-4444-4444-4444-444444444444",
            identifiers: {},
          }
        }]
      }]
    }));


    const rateCritera = pojo.rateCriteria();

    rateCritera.shippingOptions = {
      billDutiesToSender: true,
      dangerousGoodsCategory: "Lithium Metal"
    };

    rateCritera.packages[0].customs = {
      contents: [{
        type: "gift",
        quantity: {
          value: 1
        },
        unitValue: {
          value: 10,
          currency: "usd"
        }
      }]
    };

    let rates = await app.rateShipment(pojo.transaction(), rateCritera);

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
      notes: [{
        type: "internal",
        text: "This is a note."
      }],
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
      deliveryConfirmation: {
        id: "55555555-5555-5555-5555-555555555555",
        identifiers: {},
        name: "Dummy Confirmation",
        code: "dummy-confirmation-code",
        description: "",
        type: "signature"
      },
      packages: [{
        packaging: {
          ...rates[0].packages[0].packaging,
          id: "44444444-4444-4444-4444-444444444444",
        },
      }]
    }]);
  });
});
