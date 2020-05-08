"use strict";

const { expect } = require("chai");
const { Transaction } = require("../../..");

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

  it("should allow the session to be updated", () => {
    let transaction = new Transaction({
      id: "12345678-1234-1234-1234-123456789012",
      session: {
        foo: "bar",
        biz: "baz",
      }
    });

    // Directly editing a session field
    transaction.session.foo = "Hello, world";
    expect(transaction.session).to.deep.equal({
      foo: "Hello, world",
      biz: "baz",
    });

    // Directly deleting a session field
    delete transaction.session.foo;
    expect(transaction.session).to.deep.equal({
      biz: "baz",
    });

    // Setting the session property
    transaction.session = {
      firstName: "John",
      lastName: "Doe",
    };
    expect(transaction.session).to.deep.equal({
      firstName: "John",
      lastName: "Doe",
    });
  });

  describe("Failure tests", () => {

    it("should throw an error if called without any arguments", () => {
      expect(() => new Transaction()).to.throw(
        "Invalid transaction: \n" +
        "  A value is required"
      );
    });

    it("should throw an error if called with an invalid pojo", () => {
      expect(() => new Transaction(12345)).to.throw(
        "Invalid transaction: \n" +
        "  value must be of type object"
      );
    });

    it("should throw an error if called with an invalid ID", () => {
      expect(() => new Transaction({
        id: "12345",
      })
      ).to.throw(
        "Invalid transaction: \n" +
        "  id must be a valid GUID"
      );
    });

    it("should throw an error if called with an invalid isRetry flag", () => {
      expect(() => new Transaction({
        id: "12345678-1234-1234-1234-123456789012",
        isRetry: "yes"
      })
      ).to.throw(
        "Invalid transaction: \n" +
        "  isRetry must be a boolean"
      );
    });

    it("should throw an error if called with an invalid useSandbox flag", () => {
      expect(() => new Transaction({
        id: "12345678-1234-1234-1234-123456789012",
        useSandbox: "no"
      })
      ).to.throw(
        "Invalid transaction: \n" +
        "  useSandbox must be a boolean"
      );
    });

    it("should throw an error if called with an invalid session object", () => {
      expect(() => new Transaction({
        id: "12345678-1234-1234-1234-123456789012",
        session: 12345,
      })
      ).to.throw(
        "Invalid transaction: \n" +
        "  session must be of type object"
      );
    });

    it("should throw an error if the session object contains non-strings", () => {
      expect(() => new Transaction({
        id: "12345678-1234-1234-1234-123456789012",
        session: {
          foo: true,
        },
      })
      ).to.throw(
        "Invalid transaction: \n" +
        "  session.foo must be a string"
      );
    });

    it("should throw an error if a session property is set to a non-string", () => {
      let transaction = new Transaction({
        id: "12345678-1234-1234-1234-123456789012",
      });

      expect(() => transaction.session = { foo: 123 }).to.throw(
        "Invalid session data: \n" +
        "  foo must be a string"
      );
    });

    it("should throw an error if any fields other than session are modified", () => {
      let transaction = new Transaction({
        id: "12345678-1234-1234-1234-123456789012",
      });

      expect(() => transaction.id = "abc").to.throw(TypeError, "Cannot assign to read only property");
      expect(() => transaction.isRetry = true).to.throw(TypeError, "Cannot assign to read only property");
      expect(() => transaction.useSandbox = true).to.throw(TypeError, "Cannot assign to read only property");
      expect(() => transaction.newProperty = "hello").to.throw(TypeError, "Cannot add property newProperty, object is not extensible");
    });

  });
});
