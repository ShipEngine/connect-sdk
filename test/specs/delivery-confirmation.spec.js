"use strict";

const { expect } = require("chai");
const { DeliveryConfirmation } = require("../../");
const MockApp = require("../utils/mock-app");

describe("DeliveryConfirmation", () => {

  it("should create a DeliveryConfirmation with the minimum required fields", () => {
    let app = new MockApp();
    let confirmation = new DeliveryConfirmation(app, {
      id: "12345678-1234-1234-1234-123456789012",
      name: "Handshake",
      class: "signature",
    });

    expect(confirmation).to.deep.equal({
      id: "12345678-1234-1234-1234-123456789012",
      name: "Handshake",
      class: "signature",
      description: "",
    });
  });

  it("should create a DeliveryConfirmation with all possible fields", () => {
    let app = new MockApp();
    let confirmation = new DeliveryConfirmation(app, {
      id: "12345678-1234-1234-1234-123456789012",
      name: "Handshake",
      class: "signature",
      description: "A firm handshake"
    });

    expect(confirmation).to.deep.equal({
      id: "12345678-1234-1234-1234-123456789012",
      name: "Handshake",
      class: "signature",
      description: "A firm handshake",
    });
  });

  describe("Failure tests", () => {

    it("should throw an error if called without any arguments", () => {
      expect(() => new DeliveryConfirmation()).to.throw(
        TypeError,
        "Invalid delivery confirmation: undefined. A value is required."
      );
    });

    it("should throw an error if called with an invalid config", () => {
      let app = new MockApp();
      expect(() => new DeliveryConfirmation(app, 12345)).to.throw(
        TypeError,
        "Invalid delivery confirmation: 12345. Expected an object."
      );
    });

    it("should throw an error if called with an invalid ID", () => {
      let app = new MockApp();
      expect(() => new DeliveryConfirmation(app, {
        id: "12345",
      })
      ).to.throw(
        TypeError,
        'Invalid delivery confirmation ID: "12345". Expected a UUID string.'
      );
    });

    it("should throw an error if called with an invalid name", () => {
      let app = new MockApp();
      expect(() => new DeliveryConfirmation(app, {
        id: "12345678-1234-1234-1234-123456789012",
        name: "   ",
      })
      ).to.throw(
        Error,
        'Invalid delivery confirmation name: "   ". It cannot be all whitespace.'
      );
    });

    it("should throw an error if called with an invalid description", () => {
      let app = new MockApp();
      expect(() => new DeliveryConfirmation(app, {
        id: "12345678-1234-1234-1234-123456789012",
        name: "My Confirmation",
        description: 12345,
      })
      ).to.throw(
        TypeError,
        "Invalid delivery confirmation description: 12345. Expected a string."
      );
    });

    it("should throw an error if called with an invalid class", () => {
      let app = new MockApp();
      expect(() => new DeliveryConfirmation(app, {
        id: "12345678-1234-1234-1234-123456789012",
        name: "My Confirmation",
        class: "handshake"
      })
      ).to.throw(
        TypeError,
        'Invalid delivery confirmation class: "handshake". ' +
        "Expected delivery, signature, adult_signature, or direct_signature."
      );
    });

  });
});
