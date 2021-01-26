"use strict";

const { expect } = require("chai");
const { Transaction } = require("../../../lib/internal");

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
});
