"use strict";

const { OrderApp } = require("../../../lib");
const pojo = require("../../utils/pojo");
const { expect, assert } = require("chai");

describe("getSeller", () => {

  it("should return a shipment from minimal return values", async () => {
    let app = new OrderApp(pojo.orderApp({
      marketplace: pojo.marketplace({
        getSeller: () => ({
          sellerID: "SELLER_123456",
          store: {
            storeID: "STORE_123456",
            name: "My Store",
          }
        })
      }),
    }));

    let confirmation = await app.marketplace.getSeller(pojo.transaction(), pojo.sellerIdentifier());

    expect(confirmation).to.deep.equal({
      sellerID: "SELLER_123456",
      identifiers: {},
      contact: undefined,
      metadata: {},
      store: {
        storeID: "STORE_123456",
        identifiers: {},
        name: "My Store",
        warehouses: [],
      }
    });
  });

  it("should return a shipment from all possible return values", async () => {
    let app = new OrderApp(pojo.orderApp({
      marketplace: pojo.marketplace({
        getSeller: () => ({
          sellerID: "SELLER_123456",
          identifiers: {
            mySellerID: "seller-123456",
          },
          contact: {
            name: "John Doe",
            email: "john.doe@example.com",
            phoneNumber: "123-456-7890",
            phoneNumberExtension: "12345",
          },
          metadata: {
            foo: "bar",
            biz: {
              baz: false,
            }
          },
          store: {
            storeID: "STORE_123456",
            identifiers: {
              myStoreID: "store-123456",
            },
            name: "My Store",
            warehouses: [{
              warehouseID: "WAREHOUSE-123456",
              identifiers: {
                myWarehouseID: "warehouse-123456",
              },
              name: "My Warehouse",
              shipFrom: {
                company: "My Company",
                addressLines: [
                  "123 Main St"
                ],
                cityLocality: "Beverly Hills",
                stateProvince: "CA",
                postalCode: "90210",
                country: "US",
                timeZone: "America/Los_Angeles",
                isResidential: false,
                coordinates: {
                  latitude: -90,
                  longitude: -180,
                },
              },
              returnTo: {
                company: "My Return Location",
                addressLines: [
                  "456 Wall St"
                ],
                cityLocality: "Springfield",
                stateProvince: "IL",
                postalCode: "12345",
                country: "US",
                timeZone: "America/Chicago",
                isResidential: true,
                coordinates: {
                  latitude: 90,
                  longitude: 180,
                },
              },
            }]
          }
        })
      }),
    }));

    let confirmation = await app.marketplace.getSeller(pojo.transaction(), pojo.sellerIdentifier());

    expect(confirmation).to.deep.equal({
      sellerID: "SELLER_123456",
      identifiers: {
        mySellerID: "seller-123456",
      },
      contact: {
        name: {
          given: "John Doe",
          family: "",
          middle: "",
          suffix: "",
          title: "",
        },
        email: "john.doe@example.com",
        phoneNumber: "123-456-7890",
        phoneNumberExtension: "12345",
      },
      metadata: {
        foo: "bar",
        biz: {
          baz: false,
        }
      },
      store: {
        storeID: "STORE_123456",
        identifiers: {
          myStoreID: "store-123456",
        },
        name: "My Store",
        warehouses: [{
          warehouseID: "WAREHOUSE-123456",
          identifiers: {
            myWarehouseID: "warehouse-123456",
          },
          name: "My Warehouse",
          shipFrom: {
            company: "My Company",
            addressLines: [
              "123 Main St"
            ],
            cityLocality: "Beverly Hills",
            stateProvince: "CA",
            postalCode: "90210",
            country: "US",
            timeZone: "America/Los_Angeles",
            isResidential: false,
            coordinates: {
              latitude: -90,
              longitude: -180,
            },
          },
          returnTo: {
            company: "My Return Location",
            addressLines: [
              "456 Wall St"
            ],
            cityLocality: "Springfield",
            stateProvince: "IL",
            postalCode: "12345",
            country: "US",
            timeZone: "America/Chicago",
            isResidential: true,
            coordinates: {
              latitude: 90,
              longitude: 180,
            },
          },
        }]
      }
    });
  });

  describe("Failure tests", () => {

    it("should throw an error if called with no arguments", async () => {
      let app = new OrderApp(pojo.orderApp());

      try {
        await app.marketplace.getSeller();
        assert.fail("An error should have been thrown");
      }
      catch (error) {
        expect(error.message).to.equal(
          "Invalid input to the getSeller method. \n" +
          "Invalid transaction: \n" +
          "  A value is required"
        );
      }
    });

    it("should throw an error if called without a shipment", async () => {
      let app = new OrderApp(pojo.orderApp());

      try {
        await app.marketplace.getSeller(pojo.transaction());
        assert.fail("An error should have been thrown");
      }
      catch (error) {
        expect(error.message).to.equal(
          "Invalid input to the getSeller method. \n" +
          "Invalid seller: \n" +
          "  A value is required"
        );
      }
    });

    it("should throw an error if called with an invalid seller", async () => {
      let app = new OrderApp(pojo.orderApp({
        marketplace: pojo.marketplace({
          getSeller () {}
        }),
      }));

      try {
        await app.marketplace.getSeller(pojo.transaction(), {
          identifiers: true,
          store: {},
        });
        assert.fail("An error should have been thrown");
      }
      catch (error) {
        expect(error.message).to.equal(
          "Invalid input to the getSeller method. \n" +
          "Invalid seller: \n" +
          "  sellerID is required \n" +
          "  identifiers must be of type object \n" +
          "  store is not allowed"
        );
      }
    });

    it("should throw an error if nothing is returned", async () => {
      let app = new OrderApp(pojo.orderApp({
        marketplace: pojo.marketplace({
          getSeller () {}
        }),
      }));

      try {
        await app.marketplace.getSeller(pojo.transaction(), pojo.sellerIdentifier());
        assert.fail("An error should have been thrown");
      }
      catch (error) {
        expect(error.message).to.equal(
          "Error in the getSeller method. \n" +
          "Invalid seller: \n" +
          "  A value is required"
        );
      }
    });

    it("should throw an error if an invalid seller is returned", async () => {
      let app = new OrderApp(pojo.orderApp({
        marketplace: pojo.marketplace({
          getSeller: () => ({
            identifiers: true,
            contact: 42,
            store: {}
          })
        }),
      }));

      try {
        await app.marketplace.getSeller(pojo.transaction(), pojo.sellerIdentifier());
        assert.fail("An error should have been thrown");
      }
      catch (error) {
        expect(error.message).to.equal(
          "Error in the getSeller method. \n" +
          "Invalid seller: \n" +
          "  sellerID is required \n" +
          "  identifiers must be of type object \n" +
          "  store.storeID is required \n" +
          "  store.name is required \n" +
          "  contact must be of type object"
        );
      }
    });

  });
});
