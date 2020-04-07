"use strict";

const { flatRatePackaging, largePaddedEnvelope } = require("../package-types");

module.export = {
  id: "2a20b066-71c3-11ea-bc55-0242ac130003",

  name: "Priority Overnight",

  class: "ground",

  grade: "overnight",

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
};

