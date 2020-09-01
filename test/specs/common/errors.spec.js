"use strict";

const { CarrierApp } = require("../../../lib/internal");
const pojo = require("../../utils/pojo");
const { assert, expect } = require("chai");
const ShipEngineErrors = require("../../../lib/public/common/index");

describe("Errors", () => {
  /**
   * All errors thrown by the SDK should be ShipEngineErrors
   */
  function validateShipEngineError (error, expected) {
    // Validate the structure of the ShipEngineError
    expect(error).to.be.an.instanceOf(Error);
    expect(error.message).to.be.a("string").with.length.above(0);
    expect(error.code).to.be.a("string").with.length.above(0);
    error.transactionID && expect(error.transactionID).to.be.a("string").with.length.above(0);

    // Validate that the error matches the expected values
    expect(error.toJSON()).to.deep.equal({
      ...expected,
      name: error.name,
      stack: error.stack,
    });
  }

  it("should throw a validation error", () => {
    try {
      // eslint-disable-next-line no-new
      new CarrierApp();
      assert.fail("An error should have been thrown");
    }
    catch (error) {
      validateShipEngineError(error, {
        code: "ERR_INVALID",
        message:
          "Invalid ShipEngine Connect carrier app: \n" +
          "  A value is required",
      });
    }
  });

  it("should throw a validation error with details", () => {
    try {
      // eslint-disable-next-line no-new
      new CarrierApp(12345);
      assert.fail("An error should have been thrown");
    }
    catch (error) {
      validateShipEngineError(error, {
        code: "ERR_INVALID",
        message:
          "Invalid ShipEngine Connect carrier app: \n" +
          "  value must be of type object",
        details: [
          {
            type: "object.base",
            message: "value must be of type object",
            path: [],
            context: {
              label: "value",
              type: "object",
              value: 12345
            },
          }
        ]
      });
    }
  });

  it("should throw an invalid input error", async () => {
    let app = new CarrierApp(pojo.carrierApp({
      createShipment () { }
    }));

    try {
      await app.createShipment();
      assert.fail("An error should have been thrown");
    }
    catch (error) {
      validateShipEngineError(error, {
        code: "ERR_INVALID_INPUT",
        message:
          "Invalid input to the createShipment method. \n" +
          "Invalid transaction: \n" +
          "  A value is required",
      });
    }
  });

  it("should throw an invalid input error with details", async () => {
    let app = new CarrierApp(pojo.carrierApp({
      createShipment () { }
    }));

    try {
      await app.createShipment({});
      assert.fail("An error should have been thrown");
    }
    catch (error) {
      validateShipEngineError(error, {
        code: "ERR_INVALID_INPUT",
        message:
          "Invalid input to the createShipment method. \n" +
          "Invalid transaction: \n" +
          "  id is required",
        details: [
          {
            type: "any.required",
            message: "id is required",
            path: ["id"],
            context: {
              label: "id",
              key: "id",
            },
          }
        ]
      });
    }
  });

  it("should throw an app error", async () => {
    let app = new CarrierApp(pojo.carrierApp({
      createShipment () { }
    }));

    try {
      await app.createShipment(pojo.transaction(), pojo.newShipment());
      assert.fail("An error should have been thrown");
    }
    catch (error) {
      validateShipEngineError(error, {
        code: "ERR_INVALID",
        transactionID: error.transactionID,
        message:
          "Error in the createShipment method. \n" +
          "Invalid shipment: \n" +
          "  A value is required",
      });
    }
  });

  it("should throw an app error with details", async () => {
    let app = new CarrierApp(pojo.carrierApp({
      createShipment () {
        return {};
      }
    }));

    try {
      await app.createShipment(pojo.transaction(), pojo.newShipment());
      assert.fail("An error should have been thrown");
    }
    catch (error) {
      validateShipEngineError(error, {
        code: "ERR_INVALID",
        transactionID: error.transactionID,
        message:
          "Error in the createShipment method. \n" +
          "Invalid shipment: \n" +
          "  label is required \n" +
          "  charges is required",
        details: [
          {
            type: "any.required",
            message: "label is required",
            path: ["label"],
            context: {
              label: "label",
              key: "label",
            },
          },
          {
            type: "any.required",
            message: "charges is required",
            path: ["charges"],
            context: {
              label: "charges",
              key: "charges",
            },
          }
        ]
      });
    }
  });

  it("should throw a currency mismatch error", async () => {
    let app = new CarrierApp(pojo.carrierApp({
      createShipment () { }
    }));

    try {
      await app.createShipment(pojo.transaction(), pojo.newShipment({
        packages: [
          pojo.newPackage({ insuredValue: { value: 1.23, currency: "USD" }}),
          pojo.newPackage({ insuredValue: { value: 1.23, currency: "EUR" }}),
          pojo.newPackage({ insuredValue: { value: 1.23, currency: "GBP" }}),
        ]
      }));
      assert.fail("An error should have been thrown");
    }
    catch (error) {
      validateShipEngineError(error, {
        code: "ERR_INVALID_INPUT",
        message:
          "Invalid input to the createShipment method. \n" +
          "All packages in a shipment must be insured in the same currency. \n" +
          "Currency mismatch: USD, EUR, GBP. All monetary values must be in the same currency.",
        currencies: ["USD", "EUR", "GBP"],
      });
    }
  });
});

describe("BadRequestError", () => {
  it("can be initialized with a message string", () => {
    const message = "test";
    const subject = new ShipEngineErrors.BadRequestError(message);

    expect(subject.message).to.equal(message);
  });

  it("can be initialized with an object", () => {
    const message = "test";
    const subject = new ShipEngineErrors.BadRequestError({ message });

    expect(subject.message).to.equal(message);
  });

  it("sets default attributes", () => {
    const message = "test";
    const subject = new ShipEngineErrors.BadRequestError(message);

    expect(subject.code).to.equal("ERR_BAD_REQUEST");
    expect(subject.source).to.equal("external");
    expect(subject.statusCode).to.equal(400);
    expect(subject.canBeRetried).to.equal(false);
    expect(subject.fieldErrors).to.be.equal(undefined);

  });

  it("can set the transactionID", () => {
    const transactionID = "test";
    const subject = new ShipEngineErrors.BadRequestError({ transactionID });

    expect(subject.transactionID).to.equal(transactionID);
  });

  it("can set the originalError", () => {
    const originalError = new Error("test");
    const subject = new ShipEngineErrors.BadRequestError({ originalError });

    expect(subject.originalError).to.eql(originalError);
  });
});

describe("UnauthorizedError", () => {
  it("can be initialized with a message string", () => {
    const message = "test";
    const subject = new ShipEngineErrors.UnauthorizedError(message);

    expect(subject.message).to.equal(message);
  });

  it("can be initialized with an object", () => {
    const message = "test";
    const subject = new ShipEngineErrors.UnauthorizedError({ message });

    expect(subject.message).to.equal(message);
  });

  it("sets default attributes", () => {
    const message = "test";
    const subject = new ShipEngineErrors.UnauthorizedError(message);

    expect(subject.code).to.equal("ERR_UNAUTHORIZED");
    expect(subject.source).to.equal("external");
    expect(subject.statusCode).to.equal(401);
    expect(subject.canBeRetried).to.equal(false);
  });

  it("can set the transactionID", () => {
    const transactionID = "test";
    const subject = new ShipEngineErrors.UnauthorizedError({ transactionID });

    expect(subject.transactionID).to.equal(transactionID);
  });

  it("can set the originalError", () => {
    const originalError = new Error("test");
    const subject = new ShipEngineErrors.UnauthorizedError({ originalError });

    expect(subject.originalError).to.eql(originalError);
  });
});

describe("NotFoundError", () => {
  it("can be initialized with a message string", () => {
    const message = "test";
    const subject = new ShipEngineErrors.NotFoundError(message);

    expect(subject.message).to.equal(message);
  });

  it("can be initialized with an object", () => {
    const message = "test";
    const subject = new ShipEngineErrors.NotFoundError({ message });

    expect(subject.message).to.equal(message);
  });

  it("sets default attributes", () => {
    const message = "test";
    const subject = new ShipEngineErrors.NotFoundError(message);

    expect(subject.code).to.equal("ERR_NOT_FOUND");
    expect(subject.source).to.equal("external");
    expect(subject.statusCode).to.equal(404);
    expect(subject.canBeRetried).to.equal(false);
  });

  it("can set the transactionID", () => {
    const transactionID = "test";
    const subject = new ShipEngineErrors.NotFoundError({ transactionID });

    expect(subject.transactionID).to.equal(transactionID);
  });

  it("can set the originalError", () => {
    const originalError = new Error("test");
    const subject = new ShipEngineErrors.NotFoundError({ originalError });

    expect(subject.originalError).to.eql(originalError);
  });
});

describe("RateLimitError", () => {
  it("can be initialized with a message string", () => {
    const message = "test";
    const subject = new ShipEngineErrors.NotFoundError(message);

    expect(subject.message).to.equal(message);
  });

  it("can be initialized with an object", () => {
    const message = "test";
    const subject = new ShipEngineErrors.RateLimitError({ message });

    expect(subject.message).to.equal(message);
  });

  it("sets default attributes", () => {
    const message = "test";
    const subject = new ShipEngineErrors.RateLimitError(message);

    expect(subject.code).to.equal("ERR_RATE_LIMIT");
    expect(subject.source).to.equal("external");
    expect(subject.statusCode).to.equal(429);
    expect(subject.canBeRetried).to.equal(true);
    expect(subject.retryInMilliseconds).to.equal(undefined);
  });

  it("can set the transactionID", () => {
    const transactionID = "test";
    const subject = new ShipEngineErrors.RateLimitError({ transactionID });

    expect(subject.transactionID).to.equal(transactionID);
  });

  it("can set the originalError", () => {
    const originalError = new Error("test");
    const subject = new ShipEngineErrors.RateLimitError({ originalError });

    expect(subject.originalError).to.eql(originalError);
  });

  it("can set the retryInMilliseconds", () => {
    const retryInMilliseconds = 2000;
    const subject = new ShipEngineErrors.RateLimitError({ retryInMilliseconds });

    expect(subject.retryInMilliseconds).to.equal(retryInMilliseconds);
  });
});

describe("ExternalServiceError", () => {
  it("can be initialized with a message string", () => {
    const message = "test";
    const subject = new ShipEngineErrors.ExternalServiceError(message);

    expect(subject.message).to.equal(message);
  });

  it("can be initialized with an object", () => {
    const message = "test";
    const subject = new ShipEngineErrors.ExternalServiceError({ message });

    expect(subject.message).to.equal(message);
  });

  it("sets default attributes", () => {
    const message = "test";
    const subject = new ShipEngineErrors.ExternalServiceError(message);

    expect(subject.code).to.equal("ERR_EXTERNAL_SERVICE_ERROR");
    expect(subject.source).to.equal("external");
    expect(subject.statusCode).to.equal(520);
    expect(subject.canBeRetried).to.equal(true);
    expect(subject.externalErrors).to.equal(undefined);
    expect(subject.externalWarnings).to.equal(undefined);
  });

  it("can set the transactionID", () => {
    const transactionID = "test";
    const subject = new ShipEngineErrors.ExternalServiceError({ transactionID });

    expect(subject.transactionID).to.equal(transactionID);
  });

  it("can set the originalError", () => {
    const originalError = new Error("test");
    const subject = new ShipEngineErrors.ExternalServiceError({ originalError });

    expect(subject.originalError).to.eql(originalError);
  });

  it("can set the externalErrors", () => {
    const externalErrors = ["test"];
    const subject = new ShipEngineErrors.ExternalServiceError({ externalErrors });

    expect(subject.externalErrors).to.eql(externalErrors);
  });

  it("can set the externalWarnings", () => {
    const externalWarnings = ["test"];
    const subject = new ShipEngineErrors.ExternalServiceError({ externalWarnings });

    expect(subject.externalWarnings).to.eql(externalWarnings);
  });
});
