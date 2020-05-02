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
      class: "signature",
      ...props,
    };
  },

  connection (props = {}) {
    return {
      id: "66666666-6666-6666-6666-666666666666",
      name: "Dummy Connection",
      websiteURL: "https://example.com/",
      logo: path.resolve("logo.svg"),
      connectForm: pojo.form(),
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
};
