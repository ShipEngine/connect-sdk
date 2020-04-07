"use strict";

const { flatRatePackaging, largePaddedEnvelope } = require("../package-types");


const groundService = {
  default: {
    id: "2a20b066-71c3-11ea-bc55-0242ac130003",

    name: "Ground",

    class: "ground",

    grade: "standard",

    carrier: "../../configs/carrier/carrier.yaml",
    originCountries: [
      "US"
    ],

    destinationCountries: [
      "US",
      "CA",
      "MX",
    ],

    packaging: [
      flatRatePackaging,
      largePaddedEnvelope
    ]
  }
};

module.exports = new Promise((res) => {
  res(groundService);
});


// let x = await import("foo");

// let x = await Promise.resolve({ default: require("foo") });
