"use strict";

const path = require("path");

const pojo = module.exports = {
  app(props = {}) {
    return {
      id: "11111111-1111-1111-1111-111111111111",
      manifest: pojo.appManifest(),
      ...props,
    };
  },

  appManifest(props = {}) {
    return {
      name: "@company-name/app-name",
      version: "1.23.456",
      ...props,
    };
  },

  connectionApp(props = {}) {
    return {
      ...pojo.app(),
      name: "Dummy App",
      websiteURL: "https://example.com/",
      logo: path.resolve("logo.svg"),
      icon: path.resolve("logo.svg"),
      connectionForm: pojo.form(),
      connect() { },
      ...props,
    };
  },

  carrierApp(props = {}) {
    return {
      ...pojo.connectionApp(),
      deliveryServices: [pojo.deliveryService()],
      manifestType: "digital",
      ...props,
    };
  },

  orderApp(props = {}) {
    return {
      ...pojo.connectionApp(),
      getSalesOrdersByDate() { },
      ...props,
    };
  },

  deliveryService(props = {}) {
    return {
      id: "22222222-2222-2222-2222-222222222222",
      code: "dummy-ds-code",
      name: "Dummy Delivery Service",
      availableCountries: ["US"],
      manifestType: "digital",
      packaging: [pojo.packaging()],
      ...props,
    };
  },

  pickupService(props = {}) {
    return {
      id: "33333333-3333-3333-3333-333333333333",
      name: "Dummy Pickup Service",
      ...props,
    };
  },

  packaging(props = {}) {
    return {
      id: "44444444-4444-4444-4444-444444444444",
      code: "dummy-packaging-code",
      name: "Dummy Packaging",
      ...props,
    };
  },

  deliveryConfirmation(props = {}) {
    return {
      id: "55555555-5555-5555-5555-555555555555",
      code: "dummy-confirmation-code",
      name: "Dummy Confirmation",
      type: "signature",
      ...props,
    };
  },

  form(props = {}) {
    return {
      dataSchema: {},
      uiSchema: {},
      ...props,
    };
  },

  transaction(props = {}) {
    return {
      id: "12345678-1234-1234-1234-123456789012",
      language: 'en',
      ...props,
    };
  },

  document(props = {}) {
    return {
      type: "label",
      size: "letter",
      format: "pdf",
      data: Buffer.from("data"),
      ...props,
    };
  },

  shipment(props = {}) {
    return {
      ...pojo.shipmentIdentifier(),
      ...pojo.newShipment(),
      ...props,
    };
  },

  trackingCriteria(props = {}) {
    return {
      trackingNumber: "1234-5678",
      returns: {
        isReturn: false
      },
      ...props
    }
  },

  trackingInfo(props = {}) {
    return {
      events: [...pojo.trackingEvent()],

      ...props
    }
  },

  trackingEvent(props = {}) {
    return {
      name: "Dummy Event",
      dateTime: new Date(),
      status: "accepted",
      ...props
    }
  },
  shipmentIdentifier(props = {}) {
    return {
      ...props,
    };
  },

  newShipment(props = {}) {
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

  shipmentConfirmation(props = {}) {
    return {
      ...pojo.shipmentIdentifier(),
      charges: [pojo.charge()],
      packages: [pojo.packageConfirmation()],
      label: pojo.document(),
      ...props,
    };
  },

  pickupShipment(props = {}) {
    return {
      ...pojo.shipmentIdentifier(),
      deliveryService: {
        id: "22222222-2222-2222-2222-222222222222",
      },
      packages: [pojo.pickupPackage()],
      ...props,
    };
  },

  acknowledgedSalesOrder(props = {}) {
    return {
      ...pojo.salesOrderIdentifier(),
      succeeded: true,
      ...props
    }
  },

  salesOrderShipment(props = {}) {
    return {
      ...pojo.shipmentIdentifier(),
      shipFrom: pojo.addressWithContactInfo(),
      shipTo: pojo.addressWithContactInfo(),
      shipDateTime: new Date(),
      salesOrder: pojo.salesOrderIdentifier(),
      contents: [pojo.salesOrderPackageItem()],
      ...props,
    };
  },

  salesOrderNotification(props = {}) {
    return {
      ...pojo.salesOrderIdentifier(),
      orderNumber: "55555555-5555-5555-5555-555555555555",
      importedDate: new Date(),
      ...props
    }
  },

  package(props = {}) {
    return {
      ...pojo.packageIdentifier(),
      ...pojo.newPackage(),
      ...props,
    };
  },

  packageIdentifier(props = {}) {
    return {
      ...props,
    };
  },

  packageConfirmation(props = {}) {
    return {
      ...pojo.packageIdentifier(),
      ...props,
    };
  },

  newPackage(props = {}) {
    return {
      packaging: {
        id: "44444444-4444-4444-4444-444444444444",
      },
      label: pojo.newLabel(),
      ...props,
    };
  },

  pickupPackage(props = {}) {
    return {
      packaging: {
        id: "44444444-4444-4444-4444-444444444444",
      },
      ...props,
    };
  },

  salesOrderPackageItem(props = {}) {
    return {
      salesOrderItem: pojo.salesOrderItemIdentifier(),
      quantity: pojo.quantity(),
      ...props,
    };
  },

  newLabel(props = {}) {
    return {
      format: "pdf",
      size: "letter",
      ...props,
    };
  },

  addressWithContactInfo(props = {}) {
    return {
      ...pojo.address(),
      ...pojo.contactInfo(),
      ...props,
    };
  },

  address(props = {}) {
    return {
      addressLines: ["123 Main St."],
      cityLocality: "Austin",
      stateProvince: "TX",
      postalCode: "78754",
      country: "US",
      ...props,
    };
  },

  contactInfo(props = {}) {
    return {
      name: "John Doe",
      ...props,
    };
  },

  charge(props = {}) {
    return {
      type: "shipping",
      amount: pojo.monetaryValue(),
      ...props,
    };
  },

  quantity(props = {}) {
    return {
      value: 1,
      ...props,
    };
  },

  monetaryValue(props = {}) {
    return {
      value: 12.34,
      currency: "USD",
      ...props,
    };
  },

  rateCriteria(props = {}) {
    return {
      shipDateTime: new Date(),
      shipFrom: pojo.addressWithContactInfo(),
      shipTo: pojo.addressWithContactInfo(),
      packages: [pojo.rateCriteriaPackage()],
      ...props,
    };
  },

  rateCriteriaPackage(props = {}) {
    return {
      ...props,
    };
  },

  rate(props = {}) {
    return {
      deliveryService: {
        id: "22222222-2222-2222-2222-222222222222",
      },
      charges: [pojo.charge()],
      packages: [pojo.ratePackage()],
      ...props,
    };
  },

  ratePackage(props = {}) {
    return {
      packaging: {
        id: "44444444-4444-4444-4444-444444444444",
      },
      ...props,
    };
  },

  pickupRequest(props = {}) {
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

  timeRange(props = {}) {
    return {
      startDateTime: new Date(),
      endDateTime: new Date(),
      ...props,
    };
  },

  buyerIdentifier(props = {}) {
    return {
      id: "DUMMY_BUYER_ID",
      ...props,
    };
  },

  storeIdentifier(props = {}) {
    return {
      id: "DUMMY_STORE_ID",
      ...props,
    };
  },

  warehouseIdentifier(props = {}) {
    return {
      id: "DUMMY_WAREHOUSE_ID",
      ...props,
    };
  },

  salesOrderIdentifier(props = {}) {
    return {
      id: "DUMMY_SALES_ORDER_ID",
      orderNumber: "",
      ...props,
    };
  },

  salesOrderItemIdentifier(props = {}) {
    return {
      id: "DUMMY_SALES_ORDER_ITEM_ID",
      ...props,
    };
  },

  productIdentifier(props = {}) {
    return {
      id: "DUMMY_PRODUCT_ID",
      ...props,
    };
  },

  salesOrder(props = {}) {
    return {
      ...pojo.salesOrderIdentifier(),
      createdDateTime: "2005-05-05T05:05:05Z",
      status: "awaiting_shipment",
      buyer: pojo.buyer(),
      paymentMethod: "cash",
      requestedFulfillments: [
        {
          items: [pojo.salesOrderItem()],
          shippingPreferences: {
            saturdayDelivery: true
          },
          shipTo: pojo.addressWithContactInfo(),
        }
      ],
      ...props,
    };
  },

  salesOrderItem(props = {}) {
    return {
      ...pojo.salesOrderItemIdentifier(),
      name: "My Item",
      quantity: pojo.quantity(),
      unitPrice: pojo.monetaryValue(),
      product: pojo.productIdentifier(),
      ...props,
    };
  },

  store(props = {}) {
    return {
      ...pojo.storeIdentifier(),
      name: "My Store",
      ...props,
    };
  },

  buyer(props = {}) {
    return {
      address: pojo.address(),
      ...pojo.buyerIdentifier(),
      ...pojo.contactInfo(),
      ...props,
    };
  },

  oauthConfig(props = {}) {
    return {
      tokenProperties: {
        accessTokenExpirationLength: 100,
        refreshTokenExpirationLength: 100,
        tokenExpirationLengthTimeUnit: "s"
      },
      authorizationProcess: {
        loginRequest: {
          method: 'GET',
          url: 'https://sandbox.merchant.wish.com/v3/oauth/authorize',
          bodyParameters: [],
          headerParameters: [],
          contentType: "",
          queryParameters: [
            {
              name: 'client_id',
              value: '{CLIENT_ID}',
              encoding: ""
            }
          ],
        },
        redirectRequest: {
          bodyParameters: [],
          queryParameters: [
            {
              name: 'code',
              value: '{AUTHORIZATION_CODE}',
              encoding: ""
            }
          ],
        },
        authorizeRequest: {
          method: 'GET',
          url: 'https://sandbox.merchant.wish.com/api/v3/oauth/access_token',
          bodyParameters: [],
          headerParameters: [],
          contentType: "application/json",
          queryParameters: [
            {
              name: 'client_id',
              value: '{CLIENT_ID}',
              encoding: ""
            },
            {
              name: 'client_secret',
              value: '{CLIENT_SECRET}',
              encoding: ""
            },
            {
              name: 'code',
              value: '{AUTHORIZATION_CODE}',
              encoding: ""
            },
            {
              name: 'grant_type',
              value: 'authorization_code',
              encoding: ""
            },
            {
              name: 'redirect_uri',
              value: 'https://ss-devss103.sslocal.com/api/oauth/redirect/WishV2',
              encoding: ""
            }
          ],
        },
        authorizeResponse: {
          bodyParameters: [
            {
              name: '$.data.access_token',
              value: '{ACCESS_TOKEN}',
              encoding: ""
            },
            {
              name: '$.data.refresh_token',
              value: '{REFRESH_TOKEN}',
              encoding: ""
            }
          ]
        }
      },
      refreshTokenProcess: {
        refreshTokenRequest: {
          method: 'GET',
          url: 'https://sandbox.merchant.wish.com/api/v3/oauth/refresh_token',
          bodyParameters: [],
          headerParameters: [],
          contentType: "application/json",
          queryParameters: [
            {
              name: 'client_id',
              value: '{CLIENT_ID}',
              encoding: ""
            },
            {
              name: 'client_secret',
              value: '{CLIENT_SECRET}',
              encoding: ""
            },
            {
              name: 'grant_type',
              value: 'refresh_token',
              encoding: ""
            },
            {
              name: 'refresh_token',
              value: '{REFRESH_TOKEN}',
              encoding: ""
            }
          ],
        },
        refreshTokenResponse: {
          bodyParameters: [
            {
              name: '$.data.access_token',
              value: '{ACCESS_TOKEN}',
              encoding: ""
            },
            {
              name: '$.data.refresh_token',
              value: '{REFRESH_TOKEN}',
              encoding: ""
            }
          ]
        }
      },
      ...props,
    };
  },
};
