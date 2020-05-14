"use strict";

const path = require("path");

const pojo = module.exports = {
  app (props = {}) {
    return {
      name: "@company-name/app-name",
      version: "1.23.456",
      ...props,
    };
  },

  carrierApp (props = {}) {
    return {
      ...pojo.app(),
      carrier: pojo.carrier(),
      ...props,
    };
  },

  connectionApp (props = {}) {
    return {
      ...pojo.app(),
      connection: pojo.connection(),
      ...props,
    };
  },

  carrier (props = {}) {
    return {
      id: "11111111-1111-1111-1111-111111111111",
      name: "Dummy Carrier",
      websiteURL: "https://example.com/",
      logo: path.resolve("logo.svg"),
      deliveryServices: [pojo.deliveryService()],
      ...props,
    };
  },

  deliveryService (props = {}) {
    return {
      id: "22222222-2222-2222-2222-222222222222",
      name: "Dummy Delivery Service",
      class: "ground",
      grade: "standard",
      originCountries: ["US"],
      destinationCountries: ["US"],
      packaging: [pojo.packaging()],
      ...props,
    };
  },

  pickupService (props = {}) {
    return {
      id: "33333333-3333-3333-3333-333333333333",
      name: "Dummy Pickup Service",
      ...props,
    };
  },

  packaging (props = {}) {
    return {
      id: "44444444-4444-4444-4444-444444444444",
      name: "Dummy Packaging",
      ...props,
    };
  },

  deliveryConfirmation (props = {}) {
    return {
      id: "55555555-5555-5555-5555-555555555555",
      name: "Dummy Confirmation",
      type: "signature",
      ...props,
    };
  },

  connection (props = {}) {
    return {
      id: "66666666-6666-6666-6666-666666666666",
      name: "Dummy Connection",
      websiteURL: "https://example.com/",
      logo: path.resolve("logo.svg"),
      connectionForm: pojo.form(),
      connect () {},
      ...props,
    };
  },

  form (props = {}) {
    return {
      dataSchema: {},
      uiSchema: {},
      ...props,
    };
  },

  transaction (props = {}) {
    return {
      id: "12345678-1234-1234-1234-123456789012",
      ...props,
    };
  },

  document (props = {}) {
    return {
      type: "label",
      size: "letter",
      format: "pdf",
      data: Buffer.from("data"),
      ...props,
    };
  },

  shipment (props = {}) {
    return {
      ...pojo.shipmentIdentifier(),
      ...pojo.newShipment(),
      ...props,
    };
  },

  shipmentIdentifier (props = {}) {
    return {
      ...props,
    };
  },

  newShipment (props = {}) {
    return {
      deliveryServiceID: "22222222-2222-2222-2222-222222222222",
      shipFrom: pojo.addressWithContactInfo(),
      shipTo: pojo.addressWithContactInfo(),
      shipDateTime: new Date(),
      packages: [pojo.newPackage()],
      ...props,
    };
  },

  shipmentConfirmation (props = {}) {
    return {
      ...pojo.shipmentIdentifier(),
      charges: [pojo.shippingCharge()],
      packages: [pojo.packageConfirmation()],
      ...props,
    };
  },

  pickupShipment (props = {}) {
    return {
      ...pojo.shipmentIdentifier(),
      deliveryServiceID: "22222222-2222-2222-2222-222222222222",
      packages: [pojo.pickupPackage()],
      ...props,
    };
  },

  package (props = {}) {
    return {
      ...pojo.packageIdentifier(),
      ...pojo.newPackage(),
      ...props,
    };
  },

  packageIdentifier (props = {}) {
    return {
      ...props,
    };
  },

  packageConfirmation (props = {}) {
    return {
      ...pojo.packageIdentifier(),
      documents: [pojo.document()],
      ...props,
    };
  },

  newPackage (props = {}) {
    return {
      packagingID: "44444444-4444-4444-4444-444444444444",
      label: pojo.newLabel(),
      ...props,
    };
  },

  pickupPackage (props = {}) {
    return {
      packagingID: "44444444-4444-4444-4444-444444444444",
      ...props,
    };
  },

  newLabel (props = {}) {
    return {
      format: "pdf",
      size: "letter",
      ...props,
    };
  },

  addressWithContactInfo (props = {}) {
    return {
      ...pojo.address(),
      ...pojo.contactInfo(),
      ...props,
    };
  },

  address (props = {}) {
    return {
      addressLines: ["123 Main St."],
      cityLocality: "Austin",
      stateProvince: "TX",
      postalCode: "78754",
      country: "US",
      timeZone: "America/Chicago",
      ...props,
    };
  },

  contactInfo (props = {}) {
    return {
      name: "John Doe",
      ...props,
    };
  },

  shippingCharge (props = {}) {
    return {
      type: "shipping",
      amount: pojo.monetaryValue(),
      ...props,
    };
  },

  monetaryValue (props = {}) {
    return {
      value: "12.34",
      currency: "USD",
      ...props,
    };
  },

  rateCriteria (props = {}) {
    return {
      shipDateTime: new Date(),
      shipFrom: pojo.addressWithContactInfo(),
      shipTo: pojo.addressWithContactInfo(),
      packages: [pojo.rateCriteriaPackage()],
      ...props,
    };
  },

  rateCriteriaPackage (props = {}) {
    return {
      ...props,
    };
  },

  rate (props = {}) {
    return {
      deliveryServiceID: "22222222-2222-2222-2222-222222222222",
      charges: [pojo.charge()],
      packages: [{
        packagingID: "44444444-4444-4444-4444-444444444444",
      }],
      ...props,
    };
  },

  charge (props = {}) {
    return {
      type: "shipping",
      amount: {
        value: 123.456,
        currency: "CAD",
      },
      ...props,
    };
  },

  pickupRequest (props = {}) {
    return {
      pickupServiceID: "33333333-3333-3333-3333-333333333333",
      timeWindow: pojo.timeRange(),
      address: pojo.address(),
      contact: pojo.contactInfo(),
      shipments: [pojo.pickupShipment()],
      ...props,
    };
  },

  timeRange (props = {}) {
    return {
      startDateTime: new Date(),
      endDateTime: new Date(),
      ...props,
    };
  },
};
