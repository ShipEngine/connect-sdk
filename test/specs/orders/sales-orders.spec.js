const { expect } = require("chai");
const { SalesOrders } = require("../../../lib/internal/orders/sales-orders");


describe("When a sales orders is created", () => {

  it("should validate each sales order when not in production", () =>{
  
    const salesOrdersPOJO = {
      salesOrders: [{
        foo: "bar"
      }]
    };

    expect(() => new SalesOrders(salesOrdersPOJO)).to.throw();

  });

  it("should not validate each sales order in production", () => {

    process.env.CONNECT_ENV = "production";

    const salesOrdersPOJO = {
      salesOrders: [{
        createdDateTime: new Date(),
        status: "awaiting_payment",
        buyer: { name: "John Doe" },
        requestedFulfillments: []
      }]
    };

    expect(() => new SalesOrders(salesOrdersPOJO)).to.not.throw();
  });

  afterEach(() => {
    process.env.CONNECT_ENV = undefined;
  });

});