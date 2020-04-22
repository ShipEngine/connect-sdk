"use strict";

const { expect } = require("chai");
const { Transaction } = require("../../lib");

describe("Transaction", () => {

  it("should create a Transaction with the minimum required fields", () => {
    let transaction = new Transaction({
      id: "12345678-1234-1234-1234-123456789012",
    });

    expect(transaction).to.deep.equal({
      id: "12345678-1234-1234-1234-123456789012",
      isRetry: false,
      useSandbox: false,
      session: {},
    });
  });

  it("should create a Transaction with all possible fields", () => {
    let transaction = new Transaction({
      id: "12345678-1234-1234-1234-123456789012",
      isRetry: true,
      useSandbox: false,
      session: {
        foo: "bar",
        biz: "baz",
      }
    });

    expect(transaction).to.deep.equal({
      id: "12345678-1234-1234-1234-123456789012",
      isRetry: true,
      useSandbox: false,
      session: {
        foo: "bar",
        biz: "baz",
      }
    });
  });

  it("should serialize to JSON correctly", () => {
    let transaction = new Transaction({
      id: "12345678-1234-1234-1234-123456789012",
      session: {
        foo: "bar",
        biz: "baz",
      }
    });

    let json = JSON.stringify(transaction);
    let pojo = JSON.parse(json);

    expect(pojo).to.deep.equal({
      id: "12345678-1234-1234-1234-123456789012",
      isRetry: false,
      useSandbox: false,
      session: {
        foo: "bar",
        biz: "baz",
      }
    });
  });

  describe("Failure tests", () => {

    it("should throw an error if called without any arguments", () => {
      expect(() => new Transaction()).to.throw(
        TypeError,
        "Invalid transaction: undefined. A value is required."
      );
    });

    it("should throw an error if called with an invalid config", () => {
      expect(() => new Transaction(12345)).to.throw(
        TypeError,
        "Invalid transaction: 12345. Expected an object."
      );
    });

    it("should throw an error if called with an invalid ID", () => {
      expect(() => new Transaction({
        id: "12345",
      })
      ).to.throw(
        TypeError,
        'Invalid transaction ID: "12345". Expected a UUID string.'
      );
    });

    it("should throw an error if called with an invalid isRetry flag", () => {
      expect(() => new Transaction({
        id: "12345678-1234-1234-1234-123456789012",
        isRetry: "yes"
      })
      ).to.throw(
        Error,
        'Invalid isRetry flag: "yes". Expected a boolean.'
      );
    });

    it("should throw an error if called with an invalid useSandbox flag", () => {
      expect(() => new Transaction({
        id: "12345678-1234-1234-1234-123456789012",
        useSandbox: "no"
      })
      ).to.throw(
        Error,
        'Invalid useSandbox flag: "no". Expected a boolean.'
      );
    });

    it("should throw an error if called with an invalid session object", () => {
      expect(() => new Transaction({
        id: "12345678-1234-1234-1234-123456789012",
        session: 12345,
      })
      ).to.throw(
        TypeError,
        "Invalid session data: 12345. Expected an object."
      );
    });

    it("should throw an error if the session object contains non-string values", () => {
      expect(() => new Transaction({
        id: "12345678-1234-1234-1234-123456789012",
        session: {
          foo: true
        },
      })
      ).to.throw(
        TypeError,
        "Invalid session data value: true. Expected a string."
      );
    });

  });
});
