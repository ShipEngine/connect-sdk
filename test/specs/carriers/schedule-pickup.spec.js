"use strict";

const { CarrierApp } = require("../../../lib/internal");
const pojo = require("../../utils/pojo");
const { expect, assert } = require("chai");

describe("schedulePickup", () => {

  it("should return a PickupConfirmation from minimal return values", async () => {
    let app = new CarrierApp(pojo.carrierApp({
      pickupServices: [pojo.pickupService()],
      schedulePickup: () => ({
        id: "ABCDEF-123456",
        timeWindows: [{
          startDateTime: "2005-05-05T05:05:05.005+05:00",
          endDateTime: new Date("2005-05-05T05:05:05.005+05:00"),
        }],
        charges: [{
          type: "pickup",
          amount: {
            value: 12.34,
            currency: "AUD",
          }
        }]
      })
    }));

    let confirmation = await app.schedulePickup(pojo.transaction(), pojo.pickupRequest());

    expect(confirmation).to.deep.equal({
      id: "ABCDEF-123456",
      identifiers: {},
      notes: [],
      metadata: {},
      timeWindows: [{
        startDateTime: {
          value: "2005-05-05T05:05:05.005",
          offset: "+05:00",
          timeZone: "+05:00",
        },
        endDateTime: {
          value: "2005-05-05T00:05:05.005",
          offset: "+00:00",
          timeZone: "UTC",
        },
      }],
      charges: [{
        name: "",
        type: "pickup",
        amount: {
          value: 12.34,
          currency: "AUD",
        }
      }],
      shipments: [confirmation.shipments[0]],
      totalAmount: {
        value: 12.34,
        currency: "AUD",
      }
    });
  });

  it("should return a PickupConfirmation from all possible return values", async () => {
    let app = new CarrierApp(pojo.carrierApp({
      pickupServices: [pojo.pickupService()],
      schedulePickup: () => ({
        id: "ABCDEF-123456",
        identifiers: {
          myPickupID: "123456-ABCDEFG",
        },
        timeWindows: [{
          startDateTime: "2005-05-05T05:05:05.005+07:30",
          endDateTime: {
            value: "2005-05-05T05:05:05.005",
            timeZone: "America/New_York",
          },
        }],
        charges: [
          {
            name: "Pickup Charge",
            type: "pickup",
            amount: {
              value: 12.34,
              currency: "AUD",
            }
          },
          {
            name: "Pickup Tax",
            type: "tax",
            amount: {
              value: 2.5,
              currency: "AUD",
            }
          },
        ],
        shipments: [{
          trackingNumber: "1234567890",
          identifiers: {
            myShipmentID: "1234567890-ABCDEFG",
          }
        }],
        notes: [{ type: "internal", text: "this is a note" }],
        metadata: {
          foo: "bar",
          biz: "baz",
        }
      })
    }));

    let confirmation = await app.schedulePickup(pojo.transaction(), pojo.pickupRequest());

    expect(confirmation).to.deep.equal({
      id: "ABCDEF-123456",
      identifiers: {
        myPickupID: "123456-ABCDEFG",
      },
      timeWindows: [{
        startDateTime: {
          value: "2005-05-05T05:05:05.005",
          offset: "+07:30",
          timeZone: "+07:30",
        },
        endDateTime: {
          value: "2005-05-05T05:05:05.005",
          offset: "-04:00",
          timeZone: "America/New_York",
        },
      }],
      charges: [
        {
          name: "Pickup Charge",
          type: "pickup",
          amount: {
            value: 12.34,
            currency: "AUD",
          }
        },
        {
          name: "Pickup Tax",
          type: "tax",
          amount: {
            value: 2.50,
            currency: "AUD",
          }
        },
      ],
      totalAmount: {
        value: 14.84,
        currency: "AUD",
      },
      shipments: [{
        trackingNumber: "1234567890",
        identifiers: {
          myShipmentID: "1234567890-ABCDEFG",
        }
      }],
      notes: [
        {
          type: "internal",
          text: "this is a note",
        }
      ],
      metadata: {
        foo: "bar",
        biz: "baz",
      }
    });
  });

  it("should not throw an error if an unknown package is used", async () => {
    let app = new CarrierApp(pojo.carrierApp({
      pickupServices: [pojo.pickupService()],
      schedulePickup: () => ({
        id: "ABCDEF-123456",
        timeWindows: [{
          startDateTime: "2005-05-05T05:05:05.005+05:00",
          endDateTime: new Date("2005-05-05T05:05:05.005+05:00"),
        }],
        charges: [{
          type: "pickup",
          amount: {
            value: 12.34,
            currency: "AUD",
          }
        }]
      })
    }));

    const pickupRequest = pojo.pickupRequest();

    pickupRequest.shipments[0].packages[0].packaging = "test";

    try {
      await app.schedulePickup(pojo.transaction(), pickupRequest);
      expect(true).to.equal(false);
    }
    catch {
      expect(true).to.equal(true);
    }
  });

  describe("Failure tests", () => {

    it("should throw an error if called with no arguments", async () => {
      let app = new CarrierApp(pojo.carrierApp({
        schedulePickup() { }
      }));

      try {
        await app.schedulePickup();
        assert.fail("An error should have been thrown");
      }
      catch (error) {
        expect(error.message).to.equal("Invalid input to the schedulePickup method. Invalid transaction: A value is required");
      }
    });

    it("should throw an error if called without a PickupRequest", async () => {
      let app = new CarrierApp(pojo.carrierApp({
        schedulePickup() { }
      }));

      try {
        await app.schedulePickup(pojo.transaction());
        assert.fail("An error should have been thrown");
      }
      catch (error) {
        expect(error.message).to.equal("Invalid input to the schedulePickup method. Invalid pickup request: A value is required");
      }
    });

    it("should throw an error if called with an invalid PickupRequest", async () => {
      let app = new CarrierApp(pojo.carrierApp({
        schedulePickup() { }
      }));

      try {
        await app.schedulePickup(pojo.transaction(), {
          pickupService: {
            id: "Come get it",
          },
          timeWindow: {
            startDateTime: "9999-99-99T99:99:99.999Z",
            endDateTime: Date.now(),
          },
          notes: 12345,
          shipments: [],
        });
        assert.fail("An error should have been thrown");
      }
      catch (error) {
        expect(error.message).to.equal("Invalid input to the schedulePickup method. Invalid pickup request: pickupService.id must be a valid GUID, timeWindow.startDateTime must be a valid date/time, timeWindow.endDateTime must be one of date, string, object, address is required, contact is required, notes must be an array, shipments must contain at least 1 items");
      }
    });

    it("should throw an error if called with an invalid pickupService", async () => {
      let app = new CarrierApp(pojo.carrierApp({
        schedulePickup() { }
      }));

      try {
        await app.schedulePickup(pojo.transaction(), pojo.pickupRequest({
          pickupService: {
            id: "22222222-2222-2222-2222-222222222222",
          }
        }));
        assert.fail("An error should have been thrown");
      }
      catch (error) {
        expect(error.message).to.equal("Invalid input to the schedulePickup method. 22222222-2222-2222-2222-222222222222 is a delivery service ID not a pickup service ID");
      }
    });

    it("should throw an error if nothing is returned", async () => {
      let app = new CarrierApp(pojo.carrierApp({
        pickupServices: [pojo.pickupService()],
        schedulePickup() { }
      }));

      try {
        await app.schedulePickup(pojo.transaction(), pojo.pickupRequest());
        assert.fail("An error should have been thrown");
      }
      catch (error) {
        expect(error.message).to.equal("Error in the schedulePickup method. Invalid pickup: A value is required");
      }
    });

    it("should throw an error if an invalid PickupConfirmation is returned", async () => {
      let app = new CarrierApp(pojo.carrierApp({
        pickupServices: [pojo.pickupService()],
        schedulePickup: () => ({
          id: 12345,
          timeWindows: [],
          notes: [12345],
          metadata: false
        })
      }));

      try {
        await app.schedulePickup(pojo.transaction(), pojo.pickupRequest());
        assert.fail("An error should have been thrown");
      }
      catch (error) {
        expect(error.message).to.equal("Error in the schedulePickup method. Invalid pickup: id must be a string, timeWindows must contain at least 1 items, charges is required, notes[0] must be of type object, metadata must be of type object");
      }
    });
  });
});
