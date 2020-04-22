"use strict";

const { ReferenceMap } = require("../../lib/reference-map");

/**
 * Mocks the App class for testing purposes
 */
module.exports = class MockApp {
  constructor ({ version } = {}) {
    this.version = version;
    this._references = new ReferenceMap();
  }
};
