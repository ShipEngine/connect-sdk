"use strict";

const { OrderApp } = require("../../../lib/internal");
const pojo = require("../../utils/pojo");
const { expect, assert } = require("chai");

describe("getSalesOrder", () => {

  it("should return a sales order from minimal return values", async () => {
    let app = new OrderApp(pojo.orderApp({
      getSalesOrder: () => ({
        id: "ORDER_123456",
        createdDateTime: "2005-05-05T05:05:05.000+05:30",
        status: "awaiting_shipment",
        shipTo: pojo.addressWithContactInfo(),
        seller: {
          id: "SELLER_123456"
        },
        buyer: {
          id: "BUYER_123456",
          name: "John Doe",
        },
        items: [{
          id: "ITEM_123456",
          name: "Widget",
          quantity: {
            value: 4,
            unit: "ea",
          },
          unitPrice: {
            value: "12.34",
            currency: "USD"
          }
        }],
      })
    }));

    let salesOrder = await app.getSalesOrder(pojo.transaction(), pojo.sellerIdentifier());

    expect(salesOrder).to.deep.equal({
      id: "ORDER_123456",
      identifiers: {},
      createdDateTime: {
        value: "2005-05-05T05:05:05.000",
        timeZone: "+05:30",
        offset: "+05:30",
      },
      modifiedDateTime: {
        value: "2005-05-05T05:05:05.000",
        timeZone: "+05:30",
        offset: "+05:30",
      },
      status: "awaiting_shipment",
      fulfillmentStatus: undefined,
      paymentStatus: undefined,
      paymentMethod: undefined,
      orderURL: undefined,
      shipTo: salesOrder.shipTo,
      seller: {
        id: "SELLER_123456",
        identifiers: {},
      },
      buyer: {
        id: "BUYER_123456",
        identifiers: {},
        name: {
          given: "John Doe",
          family: "",
          middle: "",
          suffix: "",
          title: "",
        },
        email: "",
        phoneNumber: "",
        phoneNumberExtension: "",
      },
      charges: [],
      items: [{
        id: "ITEM_123456",
        identifiers: {},
        sku: "",
        name: "Widget",
        description: "",
        fulfillmentStatus: undefined,
        product: undefined,
        quantity: {
          value: 4,
          unit: "ea",
        },
        unitPrice: {
          value: "12.34",
          currency: "USD"
        },
        totalPrice: {
          value: "49.36",
          currency: "USD"
        },
        unitWeight: undefined,
        itemURL: undefined,
        trackingURL: undefined,
        shippingPreferences: {
          containsAlcohol: false,
          deliveryConfirmationType: undefined,
          deliveryDateTime: undefined,
          expeditedService: false,
          insuredValue: undefined,
          saturdayDelivery: false,
        },
        charges: [],
        totalCharges: {
          value: "0.00",
          currency: "USD"
        },
        totalAmount: {
          value: "49.36",
          currency: "USD"
        },
        notes: [],
        metadata: {},
      }],
      totalCharges: {
        value: "0.00",
        currency: "USD"
      },
      totalAmount: {
        value: "49.36",
        currency: "USD"
      },
      shippingPreferences: {
        containsAlcohol: false,
        deliveryConfirmationType: undefined,
        deliveryDateTime: undefined,
        expeditedService: false,
        insuredValue: undefined,
        saturdayDelivery: false,
      },
      notes: [],
      metadata: {},
    });
  });

  it("should return a sales order from all possible return values", async () => {
    let app = new OrderApp(pojo.orderApp({
      getSalesOrder: () => ({
        id: "ORDER_123456",
        identifiers: {
          myOrderID: "order-123"
        },
        createdDateTime: {
          value: "2005-05-05T05:05:05.000",
          timeZone: "America/New_York",
        },
        modifiedDateTime: {
          value: "2005-05-05T05:05:05.000",
          timeZone: "Asia/Tokyo",
        },
        status: "awaiting_shipment",
        fulfillmentStatus: "unfulfilled",
        paymentStatus: "paid",
        paymentMethod: "credit_card",
        orderURL: "http://example.com",
        shipTo: {
          name: "John Doe",
          addressLines: ["123 Main St."],
          cityLocality: "Austin",
          stateProvince: "TX",
          postalCode: "78754",
          country: "US",
          timeZone: "America/Chicago",
        },
        seller: {
          id: "SELLER_123456",
          identifiers: {
            mySellerID: "seller-123"
          },
        },
        buyer: {
          id: "BUYER_123456",
          identifiers: {
            myBuyerID: "buyer-123"
          },
          name: {
            given: "John",
            family: "Doe",
            suffix: "Sr",
          },
          email: "jdoe@example.com",
          phoneNumber: "555-555-5555",
          phoneNumberExtension: "123",
        },
        charges: [{
          name: "Gift Wrapping",
          description: "pretty paper and ribbons",
          code: "GW",
          type: "gift_wrapping",
          amount: {
            value: "1.23",
            currency: "USD"
          },
          notes: [{
            type: "gift_message",
            text: "Happy birthday!"
          }]
        }],
        items: [{
          id: "ITEM_123456",
          identifiers: {
            myItemID: "item-123"
          },
          sku: "1234567890",
          name: "Widget",
          description: "As seen on TV",
          fulfillmentStatus: "unfulfilled",
          product: {
            id: "PRODUCT_123456",
            sku: "1234567890",
            identifiers: {
              myProductID: "product-123"
            }
          },
          quantity: {
            value: 4,
            unit: "ea",
          },
          unitPrice: {
            value: "12.34",
            currency: "USD"
          },
          unitWeight: {
            value: 2,
            unit: "lb"
          },
          itemURL: "http://example.com",
          trackingURL: "http://example.com/tracking",
          shippingPreferences: {
            containsAlcohol: true,
            deliveryConfirmationType: "adult_signature",
            deliveryDateTime: "2005-05-05T05:05:05Z",
            expeditedService: true,
            insuredValue: {
              value: 123.45,
              currency: "USD",
            },
            saturdayDelivery: true,
          },
          charges: [{
            name: "Taxes",
            description: "Uncle sam's cut",
            code: "TX",
            type: "tax",
            amount: {
              value: "1.23",
              currency: "USD"
            },
            notes: "4% sales tax",
          }],
          notes: [{
            type: "back_order",
            text: "Item will be available in 2 weeks"
          }],
          metadata: {
            foo: 42,
            bar: {
              baz: false
            }
          },
        }],
        shippingPreferences: {
          containsAlcohol: true,
          deliveryConfirmationType: "adult_signature",
          deliveryDateTime: "2005-05-05T05:05:05Z",
          expeditedService: true,
          insuredValue: {
            value: 123.45,
            currency: "USD",
          },
          saturdayDelivery: true,
        },
        notes: "Thanks for shopping with us!",
        metadata: {
          foo: false,
          bar: {
            baz: 42
          }
        },
      })
    }));

    let salesOrder = await app.getSalesOrder(pojo.transaction(), pojo.sellerIdentifier());

    expect(salesOrder).to.deep.equal({
      id: "ORDER_123456",
      identifiers: {
        myOrderID: "order-123"
      },
      createdDateTime: {
        value: "2005-05-05T05:05:05.000",
        timeZone: "America/New_York",
        offset: "-04:00",
      },
      modifiedDateTime: {
        value: "2005-05-05T05:05:05.000",
        timeZone: "Asia/Tokyo",
        offset: "+09:00"
      },
      status: "awaiting_shipment",
      fulfillmentStatus: "unfulfilled",
      paymentStatus: "paid",
      paymentMethod: "credit_card",
      orderURL: new URL("http://example.com"),
      shipTo: {
        name: {
          given: "John Doe",
          middle: "",
          family: "",
          suffix: "",
          title: "",
        },
        email: "",
        phoneNumber: "",
        phoneNumberExtension: "",
        company: "",
        addressLines: ["123 Main St."],
        cityLocality: "Austin",
        stateProvince: "TX",
        postalCode: "78754",
        country: "US",
        timeZone: "America/Chicago",
        isResidential: undefined,
        coordinates: undefined,
      },
      seller: {
        id: "SELLER_123456",
        identifiers: {
          mySellerID: "seller-123"
        },
      },
      buyer: {
        id: "BUYER_123456",
        identifiers: {
          myBuyerID: "buyer-123"
        },
        name: {
          given: "John",
          family: "Doe",
          suffix: "Sr",
          middle: "",
          title: "",
        },
        email: "jdoe@example.com",
        phoneNumber: "555-555-5555",
        phoneNumberExtension: "123",
      },
      charges: [{
        name: "Gift Wrapping",
        description: "pretty paper and ribbons",
        code: "GW",
        type: "gift_wrapping",
        amount: {
          value: "1.23",
          currency: "USD"
        },
        notes: [{
          type: "gift_message",
          text: "Happy birthday!"
        }]
      }],
      items: [{
        id: "ITEM_123456",
        identifiers: {
          myItemID: "item-123"
        },
        sku: "1234567890",
        name: "Widget",
        description: "As seen on TV",
        fulfillmentStatus: "unfulfilled",
        product: {
          id: "PRODUCT_123456",
          sku: "1234567890",
          identifiers: {
            myProductID: "product-123"
          }
        },
        quantity: {
          value: 4,
          unit: "ea",
        },
        unitPrice: {
          value: "12.34",
          currency: "USD"
        },
        totalPrice: {
          value: "49.36",
          currency: "USD"
        },
        unitWeight: {
          value: 2,
          unit: "lb"
        },
        itemURL: new URL("http://example.com"),
        trackingURL: new URL("http://example.com/tracking"),
        shippingPreferences: {
          containsAlcohol: true,
          deliveryConfirmationType: "adult_signature",
          deliveryDateTime: {
            value: "2005-05-05T05:05:05",
            timeZone: "UTC",
            offset: "+00:00",
          },
          expeditedService: true,
          insuredValue: {
            value: "123.45",
            currency: "USD",
          },
          saturdayDelivery: true,
        },
        charges: [{
          name: "Taxes",
          description: "Uncle sam's cut",
          code: "TX",
          type: "tax",
          amount: {
            value: "1.23",
            currency: "USD"
          },
          notes: [{
            type: "uncategorized",
            text: "4% sales tax",
          }]
        }],
        totalCharges: {
          value: "1.23",
          currency: "USD",
        },
        totalAmount: {
          value: "50.59",
          currency: "USD",
        },
        notes: [{
          type: "back_order",
          text: "Item will be available in 2 weeks"
        }],
        metadata: {
          foo: 42,
          bar: {
            baz: false
          }
        },
      }],
      totalCharges: {
        value: "1.23",
        currency: "USD",
      },
      totalAmount: {
        value: "51.82",
        currency: "USD",
      },
      shippingPreferences: {
        containsAlcohol: true,
        deliveryConfirmationType: "adult_signature",
        deliveryDateTime: {
          value: "2005-05-05T05:05:05",
          timeZone: "UTC",
          offset: "+00:00",
        },
        expeditedService: true,
        insuredValue: {
          value: "123.45",
          currency: "USD",
        },
        saturdayDelivery: true,
      },
      notes: [{
        type: "uncategorized",
        text: "Thanks for shopping with us!",
      }],
      metadata: {
        foo: false,
        bar: {
          baz: 42
        }
      },
    });
  });

  describe("Failure tests", () => {

    it("should throw an error if called with no arguments", async () => {
      let app = new OrderApp(pojo.orderApp());

      try {
        await app.getSalesOrder();
        assert.fail("An error should have been thrown");
      }
      catch (error) {
        expect(error.message).to.equal(
          "Invalid input to the getSalesOrder method. \n" +
          "Invalid transaction: \n" +
          "  A value is required"
        );
      }
    });

    it("should throw an error if called without a sales order", async () => {
      let app = new OrderApp(pojo.orderApp());

      try {
        await app.getSalesOrder(pojo.transaction());
        assert.fail("An error should have been thrown");
      }
      catch (error) {
        expect(error.message).to.equal(
          "Invalid input to the getSalesOrder method. \n" +
          "Invalid sales order: \n" +
          "  A value is required"
        );
      }
    });

    it("should throw an error if called with an invalid sales order", async () => {
      let app = new OrderApp(pojo.orderApp({
        getSalesOrder () {}
      }));

      try {
        await app.getSalesOrder(pojo.transaction(), {
          identifiers: true,
          createdDateTime: "9999-99-99T99:99:99.999Z",
        });
        assert.fail("An error should have been thrown");
      }
      catch (error) {
        expect(error.message).to.equal(
          "Invalid input to the getSalesOrder method. \n" +
          "Invalid sales order: \n" +
          "  id is required \n" +
          "  identifiers must be of type object \n" +
          "  createdDateTime is not allowed"
        );
      }
    });

    it("should throw an error if nothing is returned", async () => {
      let app = new OrderApp(pojo.orderApp({
        getSalesOrder () {}
      }));

      try {
        await app.getSalesOrder(pojo.transaction(), pojo.sellerIdentifier());
        assert.fail("An error should have been thrown");
      }
      catch (error) {
        expect(error.message).to.equal(
          "Error in the getSalesOrder method. \n" +
          "Invalid sales order: \n" +
          "  A value is required"
        );
      }
    });

    it("should throw an error if an invalid sales order is returned", async () => {
      let app = new OrderApp(pojo.orderApp({
        getSalesOrder: () => ({
          identifiers: true,
          createdDateTime: "9999-99-99T99:99:99.999Z",
          status: 5,
          items: [],
        })
      }));

      try {
        await app.getSalesOrder(pojo.transaction(), pojo.sellerIdentifier());
        assert.fail("An error should have been thrown");
      }
      catch (error) {
        expect(error.message).to.equal(
          "Error in the getSalesOrder method. \n" +
          "Invalid sales order: \n" +
          "  id is required \n" +
          "  identifiers must be of type object \n" +
          "  createdDateTime must be a valid date/time \n" +
          "  status must be a string \n" +
          "  shipTo is required \n" +
          "  seller is required \n" +
          "  buyer is required \n" +
          "  items must contain at least 1 items"
        );
      }
    });

    it("should throw an error if an order charge is in a different currency than the items", async () => {
      let app = new OrderApp(pojo.orderApp({
        getSalesOrder: () => pojo.salesOrder({
          charges: [
            pojo.charge({ amount: pojo.monetaryValue({ currency: "EUR" }) }),
          ],
          items: [
            pojo.salesOrderItem({
              unitPrice: pojo.monetaryValue({ currency: "USD" }),
            })
          ]
        })
      }));

      try {
        await app.getSalesOrder(pojo.transaction(), pojo.sellerIdentifier());
        assert.fail("An error should have been thrown");
      }
      catch (error) {
        expect(error.message).to.equal(
          "Error in the getSalesOrder method. \n" +
          "Currency mismatch: EUR, USD. All monetary values must be in the same currency."
        );
      }
    });

    it("should throw an error if an item charge is in a different currency than the price", async () => {
      let app = new OrderApp(pojo.orderApp({
        getSalesOrder: () => pojo.salesOrder({
          items: [
            pojo.salesOrderItem({
              unitPrice: pojo.monetaryValue({ currency: "CAD" }),
              charges: [
                pojo.charge({ amount: pojo.monetaryValue({ currency: "CAD" }) }),
                pojo.charge({ amount: pojo.monetaryValue({ currency: "NZD" }) }),
                pojo.charge({ amount: pojo.monetaryValue({ currency: "AUD" }) }),
              ],
            })
          ]
        })
      }));

      try {
        await app.getSalesOrder(pojo.transaction(), pojo.sellerIdentifier());
        assert.fail("An error should have been thrown");
      }
      catch (error) {
        expect(error.message).to.equal(
          "Error in the getSalesOrder method. \n" +
          "All charges must be in the same currency. \n" +
          "Currency mismatch: CAD, NZD, AUD. All monetary values must be in the same currency."
        );
      }
    });

    it("should throw an error if an order charge is in a different currency than item charges", async () => {
      let app = new OrderApp(pojo.orderApp({
        getSalesOrder: () => pojo.salesOrder({
          charges: [
            pojo.charge({ amount: pojo.monetaryValue({ currency: "USD" }) }),
          ],
          items: [
            pojo.salesOrderItem({
              unitPrice: pojo.monetaryValue({ currency: "USD" }),
              charges: [
                pojo.charge({ amount: pojo.monetaryValue({ currency: "GBP" }) }),
              ],
            })
          ]
        })
      }));

      try {
        await app.getSalesOrder(pojo.transaction(), pojo.sellerIdentifier());
        assert.fail("An error should have been thrown");
      }
      catch (error) {
        expect(error.message).to.equal(
          "Error in the getSalesOrder method. \n" +
          "Currency mismatch: USD, GBP. All monetary values must be in the same currency."
        );
      }
    });

  });
});
