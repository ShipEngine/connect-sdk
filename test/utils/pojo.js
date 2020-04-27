"use strict";

const _merge = require("lodash.merge");

module.exports = {
  app (pojo = {}) {
    return _merge(pojo, {
      name: "@company-name/app-name",
      version: "1.23.456",
    });
  },

  carrierApp (pojo = {}) {
    return _merge(pojo, {
      ...this.app(pojo),
      carrier: this.carrier(pojo.carrier),
    });
  },

  connectionApp (pojo = {}) {
    return _merge(pojo, {
      ...this.app(pojo),
      connection: this.connection(pojo.connection),
    });
  },

  carrier (pojo = {}) {
    return _merge(pojo, {
      id: "11111111-1111-1111-1111-111111111111",
      name: "Dummy Carrier",
      websiteURL: "https://example.com/",
      logo: {
        colorSVG: "<svg></svg>",
        blackAndWhiteSVG: "<svg></svg>",
      },
      deliveryServices: [
        {
          id: "22222222-2222-2222-2222-222222222222",
          name: "Dummy Delivery Service",
          class: "ground",
          grade: "standard",
          originCountries: ["US"],
          destinationCountries: ["US"],
        }
      ],
    });
  },

  connection (pojo = {}) {
    return _merge(pojo, {
      id: "33333333-3333-3333-3333-333333333333",
      name: "Dummy Connection",
      websiteURL: "https://example.com/",
      logo: {
        colorSVG: "<svg></svg>",
        blackAndWhiteSVG: "<svg></svg>",
      },
      connectForm: {
        dataSchema: {},
        uiSchema: {},
      },
      connect () {},
    });
  }
};
