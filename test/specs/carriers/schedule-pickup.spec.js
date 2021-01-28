"use strict";

const { CarrierApp } = require("../../../lib/internal");
const pojo = require("../../utils/pojo");
const { expect } = require("chai");

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
});
