"use strict";

const { assert, expect } = require("chai");
const { CarrierApp, Transaction } = require("../../../lib/internal");
const pojo = require("../../utils/pojo");

describe("Transaction", () => {

  it("should create a Transaction with the minimum required fields", () => {
    let transaction = new Transaction({
      id: "12345678-1234-1234-1234-123456789012",
      language: "en"
    });

    expect(transaction).to.deep.equal({
      id: "12345678-1234-1234-1234-123456789012",
      language: "en",
      session: {},
    });
  });

  it("should create a Transaction with all possible fields", () => {
    let transaction = new Transaction({
      id: "12345678-1234-1234-1234-123456789012",
      language: "en",
      session: {
        foo: "bar",
        biz: {
          baz: 42,
        }
      }
    });

    expect(transaction).to.deep.equal({
      id: "12345678-1234-1234-1234-123456789012",
      language: "en",
      session: {
        foo: "bar",
        biz: {
          baz: 42,
        }
      }
    });
  });

  it("should serialize to JSON correctly", () => {
    let transaction = new Transaction({
      id: "12345678-1234-1234-1234-123456789012",
      session: {
        foo: "bar",
        biz: {
          baz: 42,
        }
      }
    });

    let transactionJSON = JSON.stringify(transaction);
    let transactionPOJO = JSON.parse(transactionJSON);

    expect(transactionPOJO).to.deep.equal({
      id: "12345678-1234-1234-1234-123456789012",
      session: {
        foo: "bar",
        biz: {
          baz: 42,
        }
      }
    });
  });

  it("should allow the session to be updated", () => {
    let transaction = new Transaction({
      id: "12345678-1234-1234-1234-123456789012",
      session: {
        foo: "bar",
        biz: {
          baz: 42,
        }
      }
    });

    // Directly editing a session field
    transaction.session.foo = "Hello, world";
    expect(transaction.session).to.deep.equal({
      foo: "Hello, world",
      biz: {
        baz: 42,
      }
    });

    // Directly deleting a session field
    delete transaction.session.foo;
    expect(transaction.session).to.deep.equal({
      biz: {
        baz: 42
      },
    });

    // Directly deleting a deep session field
    delete transaction.session.biz.baz;
    expect(transaction.session).to.deep.equal({
      biz: {},
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

    async function createTransaction(transactionPOJO) {
      let transaction;

      let app = new CarrierApp(pojo.carrierApp({
        connect(tx) {
          transaction = tx;
        }
      }));

      await app.connect(transactionPOJO, {});
      return transaction;
    }

    it("should throw an error if called without any arguments", async () => {
      try {
        await createTransaction();
        assert.fail("An error should have been thrown");
      }
      catch (error) {
        expect(error.message).to.equal("Invalid transaction: A value is required Invalid transaction: A value is required");
      }
    });

    it("should throw an error if called with an invalid pojo", async () => {
      try {
        await createTransaction(12345);
        assert.fail("An error should have been thrown");
      }
      catch (error) {
        expect(error.message).to.equal("Invalid transaction: value must be of type object Invalid transaction: value must be of type object");
      }
    });

    it("should throw an error if called with an invalid ID", async () => {
      try {
        await createTransaction({
          id: "12345",
          language: "en",
        });
        assert.fail("An error should have been thrown");
      }
      catch (error) {
        expect(error.message).to.equal("Invalid transaction: id must be a valid GUID Invalid transaction: id must be a valid GUID");
      }
    });

    it("should throw an error if called with an invalid session object", async () => {
      try {
        await createTransaction({
          id: "12345678-1234-1234-1234-123456789012",
          language: "en",
          session: 12345,
        });
        assert.fail("An error should have been thrown");
      }
      catch (error) {
        expect(error.message).to.equal("Invalid transaction: session must be of type object Invalid transaction: session must be of type object");
      }
    });

    it("should throw an error if any fields other than session are modified", async () => {
      let transaction = new Transaction({
        id: "12345678-1234-1234-1234-123456789012",
      });

      expect(() => transaction.id = "abc").to.throw(TypeError, "Cannot assign to read only property");
      expect(() => transaction.newProperty = "hello").to.throw(TypeError, "Cannot add property newProperty, object is not extensible");
    });

  });
});
