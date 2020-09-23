"use strict";

const { AppError, ValidationError, UnauthorizedError, ExternalError } = require("../../../");
const { CarrierApp } = require("../../../lib/internal");
const pojo = require("../../utils/pojo");
const { assert, expect } = require("chai");

describe("Errors", () => {
  /**
   * All errors thrown by the SDK should be ShipEngineErrors
   */
  function validateShipEngineError(error, expected) {
    // Validate the structure of the ShipEngineError
    expect(error).to.be.an.instanceOf(Error);
    expect(error.message).to.be.a("string").with.length.above(0);
    expect(error.code).to.be.a("string").with.length.above(0);
    error.transactionID && expect(error.transactionID).to.be.a("string").with.length.above(0);

    // Validate that the error matches the expected values
    for (const [key, value] of Object.entries(expected)) {
      if (key === "originalError") continue;
      expect(error[key]).to.deep.equal(value, `error.${key}`);
    }

    // Validate the original error, if any
    if (error.originalError || expected.originalError) {
      expect(error.originalError).to.be.an.instanceOf(Error, "error.origianlError");
      expect(expected.originalError).to.be.an("object", "error.origianlError");
      for (const [key, value] of Object.entries(expected.originalError)) {
        expect(error.originalError[key]).to.deep.equal(value, `error.originalError.${key}`);
      }
    }
  }

  it("should throw a validation error", () => {
    try {
      // eslint-disable-next-line no-new
      new CarrierApp();
      assert.fail("An error should have been thrown");
    }
    catch (error) {
      validateShipEngineError(error, {
        name: "Error",
        code: "ERR_INVALID",
        message:
          "Invalid ShipEngine Connect carrier app: A value is required"
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
        name: "Error",
        code: "ERR_INVALID",
        message:
          "Invalid ShipEngine Connect carrier app: value must be of type object",
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
      createShipment() { }
    }));

    try {
      await app.createShipment();
      assert.fail("An error should have been thrown");
    }
    catch (error) {
      validateShipEngineError(error, {
        name: "Error",
        code: "ERR_INVALID_INPUT",
        message: "Invalid input to the createShipment method. Invalid transaction: A value is required",
        originalError: {
          name: "Error",
          code: "ERR_INVALID",
          message: "Invalid transaction: A value is required"
        }
      });
    }
  });

  it("should throw an invalid input error with details", async () => {
    let app = new CarrierApp(pojo.carrierApp({
      createShipment() { }
    }));

    try {
      await app.createShipment({});
      assert.fail("An error should have been thrown");
    }
    catch (error) {
      validateShipEngineError(error, {
        name: "Error",
        code: "ERR_INVALID_INPUT",
        message: "Invalid input to the createShipment method. Invalid transaction: id is required",
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
        ],
        originalError: {
          name: "Error",
          code: "ERR_INVALID",
          message: "Invalid transaction: id is required"
        }
      });
    }
  });

  it("should throw an app error", async () => {
    let app = new CarrierApp(pojo.carrierApp({
      createShipment() { }
    }));

    try {
      await app.createShipment(pojo.transaction(), pojo.newShipment());
      assert.fail("An error should have been thrown");
    }
    catch (error) {
      validateShipEngineError(error, {
        name: "Error",
        code: "ERR_APP_ERROR",
        transactionID: error.transactionID,
        message: "Invalid shipment: A value is required Invalid shipment: A value is required",
        originalError: {
          name: "Error",
          code: "ERR_INVALID",
          message:
            "Invalid shipment: A value is required",
        }
      });
    }
  });

  it("should throw an app error with details", async () => {
    let app = new CarrierApp(pojo.carrierApp({
      createShipment() {
        return {};
      }
    }));

    try {
      await app.createShipment(pojo.transaction(), pojo.newShipment());
      assert.fail("An error should have been thrown");
    }
    catch (error) {
      validateShipEngineError(error, {
        name: "Error",
        code: "ERR_APP_ERROR",
        transactionID: error.transactionID,
        message: "Invalid shipment: label is required, charges is required Invalid shipment: label is required, charges is required",
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
        ],
        originalError: {
          name: "Error",
          code: "ERR_INVALID",
          message: "Invalid shipment: label is required, charges is required",
        }
      });
    }
  });

  it("should throw a currency mismatch error", async () => {
    let app = new CarrierApp(pojo.carrierApp({
      createShipment() { }
    }));

    try {
      await app.createShipment(pojo.transaction(), pojo.newShipment({
        packages: [
          pojo.newPackage({ insuredValue: { value: 1.23, currency: "USD" } }),
          pojo.newPackage({ insuredValue: { value: 1.23, currency: "EUR" } }),
          pojo.newPackage({ insuredValue: { value: 1.23, currency: "GBP" } }),
        ]
      }));
      assert.fail("An error should have been thrown");
    }
    catch (error) {
      validateShipEngineError(error, {
        name: "Error",
        code: "ERR_INVALID_INPUT",
        message: "Invalid input to the createShipment method. All packages in a shipment must be insured in the same currency. Currency mismatch: USD, EUR, GBP. All monetary values must be in the same currency.",
        currencies: ["USD", "EUR", "GBP"],
        originalError: {
          name: "Error",
          code: "ERR_CURRENCY_MISMATCH",
          message:
            "Currency mismatch: USD, EUR, GBP. All monetary values must be in the same currency.",
        }
      });
    }
  });

  const errorClasses = [
    { ErrorClass: AppError, code: "ERR_APP_ERROR" },
    { ErrorClass: ValidationError, code: "ERR_INVALID" },
    { ErrorClass: UnauthorizedError, code: "ERR_UNAUTHORIZED" },
    { ErrorClass: ExternalError, code: "ERR_EXTERNAL" },
  ];

  for (const { ErrorClass, code } of errorClasses) {
    describe(ErrorClass.name, () => {
      it("can be initialized with a message string", () => {
        const error = new ErrorClass("test");
        validateShipEngineError(error, {
          name: ErrorClass.name,
          message: "test",
          code,
        });
      });

      it("can be initialized with an object", () => {
        const error = new ErrorClass({ message: "test" });
        validateShipEngineError(error, {
          name: ErrorClass.name,
          message: "test",
          code,
        });
      });

      it("can be initialized with props", () => {
        const error = new ErrorClass({
          message: "test",
          statusCode: 509,
          originalError: new SyntaxError("bad syntax"),
          customProperty: "foo",
        });

        validateShipEngineError(error, {
          name: ErrorClass.name,
          message: "test",
          code,
          statusCode: 509,
          customProperty: "foo",
          originalError: {
            name: "SyntaxError",
            message: "bad syntax"
          }
        });
      });

      it("should copy props from the original error", () => {
        const error = new ErrorClass({
          message: "test",
          originalError: Object.assign(new SyntaxError("bad syntax"), {
            customProperty: "foo"
          }),
        });

        validateShipEngineError(error, {
          name: ErrorClass.name,
          message: "test",
          code,
          customProperty: "foo",
          originalError: {
            name: "SyntaxError",
            message: "bad syntax",
            customProperty: "foo",
          }
        });
      });

      it("should NOT override the code from props or original error", () => {
        const error = new ErrorClass({
          message: "test",
          code: "SOME_CODE",
          originalError: Object.assign(new SyntaxError("bad syntax"), {
            code: "SOME OTHER CODE"
          }),
        });

        validateShipEngineError(error, {
          name: ErrorClass.name,
          message: "test",
          code,
          originalError: {
            name: "SyntaxError",
            message: "bad syntax",
            code: "SOME OTHER CODE",
          }
        });
      });
    });
  }

  describe("ExternalError-specific functionality", () => {
    it("should have externalErrors and externalWarnings, even if none were specified", () => {
      const error = new ExternalError({
        message: "test",
        statusCode: 509,
      });

      validateShipEngineError(error, {
        name: "ExternalError",
        message: "test",
        code: "ERR_EXTERNAL",
        statusCode: 509,
        externalErrors: [],
        externalWarnings: [],
      });
    });

    it("can be initialized with external errors/warnings", () => {
      const error = new ExternalError({
        message: "test",
        statusCode: 509,
        externalErrors: ["one", "two", "three"],
        externalWarnings: ["four", "five", "six"],
      });

      validateShipEngineError(error, {
        name: "ExternalError",
        message: "test",
        code: "ERR_EXTERNAL",
        statusCode: 509,
        externalErrors: ["one", "two", "three"],
        externalWarnings: ["four", "five", "six"],
      });
    });
  });
});
