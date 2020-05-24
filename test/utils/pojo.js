"use strict";

const path = require("path");

const pojo = module.exports = {
  app (props = {}) {
    return {
      id: "11111111-1111-1111-1111-111111111111",
      manifest: pojo.appManifest(),
      ...props,
    };
  },

  appManifest (props = {}) {
    return {
      name: "@company-name/app-name",
      version: "1.23.456",
      ...props,
    };
  },

  connectionApp (props = {}) {
    return {
      ...pojo.app(),
      name: "Dummy App",
      websiteURL: "https://example.com/",
      logo: path.resolve("logo.svg"),
      connectionForm: pojo.form(),
      connect () {},
      ...props,
    };
  },

  carrierApp (props = {}) {
    return {
      ...pojo.connectionApp(),
      deliveryServices: [pojo.deliveryService()],
      ...props,
    };
  },

  orderApp (props = {}) {
    return {
      ...pojo.connectionApp(),
      getSeller () {},
      getSalesOrder () {},
      getSalesOrdersByDate () {},
      ...props,
    };
  },

  deliveryService (props = {}) {
    return {
      id: "22222222-2222-2222-2222-222222222222",
      name: "Dummy Delivery Service",
      class: "ground",
      grade: "standard",
      originCountries: ["US"],
      destinationCountries: ["US"],
      packaging: [pojo.packaging()],
      ...props,
    };
  },

  pickupService (props = {}) {
    return {
      id: "33333333-3333-3333-3333-333333333333",
      name: "Dummy Pickup Service",
      ...props,
    };
  },

  packaging (props = {}) {
    return {
      id: "44444444-4444-4444-4444-444444444444",
      name: "Dummy Packaging",
      ...props,
    };
  },

  deliveryConfirmation (props = {}) {
    return {
      id: "55555555-5555-5555-5555-555555555555",
      name: "Dummy Confirmation",
      type: "signature",
      ...props,
    };
  },

  form (props = {}) {
    return {
      dataSchema: {},
      uiSchema: {},
      ...props,
    };
  },

  transaction (props = {}) {
    return {
      id: "12345678-1234-1234-1234-123456789012",
      ...props,
    };
  },

  document (props = {}) {
    return {
      type: "label",
      size: "letter",
      format: "pdf",
      data: Buffer.from("data"),
      ...props,
    };
  },

  shipment (props = {}) {
    return {
      ...pojo.shipmentIdentifier(),
      ...pojo.newShipment(),
      ...props,
    };
  },

  shipmentIdentifier (props = {}) {
    return {
      ...props,
    };
  },

  newShipment (props = {}) {
    return {
      deliveryService: {
        id: "22222222-2222-2222-2222-222222222222",
      },
      shipFrom: pojo.addressWithContactInfo(),
      shipTo: pojo.addressWithContactInfo(),
      shipDateTime: new Date(),
      packages: [pojo.newPackage()],
      ...props,
    };
  },

  shipmentConfirmation (props = {}) {
    return {
      ...pojo.shipmentIdentifier(),
      charges: [pojo.charge()],
      packages: [pojo.packageConfirmation()],
      ...props,
    };
  },

  pickupShipment (props = {}) {
    return {
      ...pojo.shipmentIdentifier(),
      deliveryService: {
        id: "22222222-2222-2222-2222-222222222222",
      },
      packages: [pojo.pickupPackage()],
      ...props,
    };
  },

  salesOrderShipment (props = {}) {
    return {
      ...pojo.shipmentIdentifier(),
      shipFrom: pojo.addressWithContactInfo(),
      shipTo: pojo.addressWithContactInfo(),
      shipDateTime: new Date(),
      packages: [pojo.salesOrderPackage()],
      ...props,
    };
  },

  package (props = {}) {
    return {
      ...pojo.packageIdentifier(),
      ...pojo.newPackage(),
      ...props,
    };
  },

  packageIdentifier (props = {}) {
    return {
      ...props,
    };
  },

  packageConfirmation (props = {}) {
    return {
      ...pojo.packageIdentifier(),
      documents: [pojo.document()],
      ...props,
    };
  },

  newPackage (props = {}) {
    return {
      packaging: {
        id: "44444444-4444-4444-4444-444444444444",
      },
      label: pojo.newLabel(),
      ...props,
    };
  },

  pickupPackage (props = {}) {
    return {
      packaging: {
        id: "44444444-4444-4444-4444-444444444444",
      },
      ...props,
    };
  },

  salesOrderPackage (props = {}) {
    return {
      ...pojo.packageIdentifier(),
      contents: [pojo.salesOrderPackageItem()],
      ...props,
    };
  },

  salesOrderPackageItem (props = {}) {
    return {
      salesOrder: pojo.salesOrderIdentifier(),
      salesOrderItem: pojo.salesOrderItemIdentifier(),
      quantity: pojo.quantity(),
      ...props,
    };
  },

  newLabel (props = {}) {
    return {
      format: "pdf",
      size: "letter",
      ...props,
    };
  },

  addressWithContactInfo (props = {}) {
    return {
      ...pojo.address(),
      ...pojo.contactInfo(),
      ...props,
    };
  },

  address (props = {}) {
    return {
      addressLines: ["123 Main St."],
      cityLocality: "Austin",
      stateProvince: "TX",
      postalCode: "78754",
      country: "US",
      timeZone: "America/Chicago",
      ...props,
    };
  },

  contactInfo (props = {}) {
    return {
      name: "John Doe",
      ...props,
    };
  },

  charge (props = {}) {
    return {
      type: "shipping",
      amount: pojo.monetaryValue(),
      ...props,
    };
  },

  quantity (props = {}) {
    return {
      value: 1,
      unit: "ea",
      ...props,
    };
  },

  monetaryValue (props = {}) {
    return {
      value: "12.34",
      currency: "USD",
      ...props,
    };
  },

  rateCriteria (props = {}) {
    return {
      shipDateTime: new Date(),
      shipFrom: pojo.addressWithContactInfo(),
      shipTo: pojo.addressWithContactInfo(),
      packages: [pojo.rateCriteriaPackage()],
      ...props,
    };
  },

  rateCriteriaPackage (props = {}) {
    return {
      ...props,
    };
  },

  rate (props = {}) {
    return {
      deliveryService: {
        id: "22222222-2222-2222-2222-222222222222",
      },
      charges: [pojo.charge()],
      packages: [pojo.ratePackage()],
      ...props,
    };
  },

  ratePackage (props = {}) {
    return {
      packaging: {
        id: "44444444-4444-4444-4444-444444444444",
      },
      ...props,
    };
  },

  pickupRequest (props = {}) {
    return {
      pickupService: {
        id: "33333333-3333-3333-3333-333333333333",
      },
      timeWindow: pojo.timeRange(),
      address: pojo.address(),
      contact: pojo.contactInfo(),
      shipments: [pojo.pickupShipment()],
      ...props,
    };
  },

  timeRange (props = {}) {
    return {
      startDateTime: new Date(),
      endDateTime: new Date(),
      ...props,
    };
  },

  sellerIdentifier (props = {}) {
    return {
      id: "DUMMY_SELLER_ID",
      ...props,
    };
  },

  buyerIdentifier (props = {}) {
    return {
      id: "DUMMY_BUYER_ID",
      ...props,
    };
  },

  storeIdentifier (props = {}) {
    return {
      id: "DUMMY_STORE_ID",
      ...props,
    };
  },

  warehouseIdentifier (props = {}) {
    return {
      id: "DUMMY_WAREHOUSE_ID",
      ...props,
    };
  },

  salesOrderIdentifier (props = {}) {
    return {
      id: "DUMMY_SALES_ORDER_ID",
      ...props,
    };
  },

  salesOrderItemIdentifier (props = {}) {
    return {
      id: "DUMMY_SALES_ORDER_ITEM_ID",
      ...props,
    };
  },

  productIdentifier (props = {}) {
    return {
      id: "DUMMY_PRODUCT_ID",
      ...props,
    };
  },

  salesOrder (props = {}) {
    return {
      ...pojo.salesOrderIdentifier(),
      createdDateTime: "2005-05-05T05:05:05Z",
      status: "awaiting_shipment",
      shipTo: pojo.addressWithContactInfo(),
      seller: pojo.sellerIdentifier(),
      buyer: pojo.buyer(),
      items: [pojo.salesOrderItem()],
      ...props,
    };
  },

  salesOrderItem (props = {}) {
    return {
      ...pojo.salesOrderItemIdentifier(),
      name: "My Item",
      quantity: pojo.quantity(),
      unitPrice: pojo.monetaryValue(),
      ...props,
    };
  },

  seller (props = {}) {
    return {
      ...pojo.sellerIdentifier(),
      store: pojo.store(),
      ...props,
    };
  },

  store (props = {}) {
    return {
      ...pojo.storeIdentifier(),
      name: "My Store",
      ...props,
    };
  },

  buyer (props = {}) {
    return {
      ...pojo.buyerIdentifier(),
      ...pojo.contactInfo(),
      ...props,
    };
  },
};
