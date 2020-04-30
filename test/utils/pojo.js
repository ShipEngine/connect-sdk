"use strict";

const _merge = require("lodash.merge");

const pojo = module.exports = {
  app (props = {}) {
    return _merge({
      name: "@company-name/app-name",
      version: "1.23.456",
    }, props);
  },

  carrierApp (props = {}) {
    return _merge({
      ...pojo.app(),
      carrier: pojo.carrier(),
    }, props);
  },

  connectionApp (props = {}) {
    return _merge({
      ...pojo.app(),
      connection: pojo.connection(),
    }, props);
  },

  logo (props = {}) {
    return _merge({
      colorSVG: "<svg></svg>",
      blackAndWhiteSVG: "<svg></svg>",
    }, props);
  },

  carrier (props = {}) {
    return _merge({
      id: "11111111-1111-1111-1111-111111111111",
      name: "Dummy Carrier",
      websiteURL: "https://example.com/",
      logo: pojo.logo(),
      deliveryServices: props.deliveryServices || [pojo.deliveryService()],
    }, props);
  },

  deliveryService (props = {}) {
    return _merge({
      id: "22222222-2222-2222-2222-222222222222",
      name: "Dummy Delivery Service",
      class: "ground",
      grade: "standard",
      originCountries: ["US"],
      destinationCountries: ["US"],
    }, props);
  },

  pickupService (props = {}) {
    return _merge({
      id: "33333333-3333-3333-3333-333333333333",
      name: "Dummy Pickup Service",
    }, props);
  },

  packaging (props = {}) {
    return _merge({
      id: "44444444-4444-4444-4444-444444444444",
      name: "Dummy Packaging",
    }, props);
  },

  deliveryConfirmation (props = {}) {
    return _merge({
      id: "55555555-5555-5555-5555-555555555555",
      name: "Dummy Confirmation",
      class: "signature",
    }, props);
  },

  connection (props = {}) {
    return _merge({
      id: "66666666-6666-6666-6666-666666666666",
      name: "Dummy Connection",
      websiteURL: "https://example.com/",
      logo: pojo.logo(),
      connectForm: pojo.form(),
      connect () {},
    }, props);
  },

  form (props = {}) {
    return _merge({
      dataSchema: {},
      uiSchema: {},
    }, props);
  },
};
