"use strict";

const config = {

  type: "shipping_provider",
  name: "My Carrier",
  description: "My Carrier description goes here",
  websiteURL: "https://www.my-carrier.com",
  logo: {
    blackAndWhiteSVG: "../logo.svg",
    colorSVG: "../logo.svg"
  },

  deliveryServices: [{
    id: "2a20b066-71c3-11ea-bc55-0242ac130003",
    name: "Priority Overnight",
    class: "ground",
    grade: "overnight",
    requiresManifest: false,

    carrier: {
      id: "8ea1989e-d504-433f-b031-b04d5d9ace94",
      name: "Test Carrier",
      description: "Test Carrier description",
      websiteURL: "https://my-test-site.com",
      logo: {
        colorSVG: "../logo.svg",
        blackAndWhiteSVG: "../logo.svg"
      }
    },

    originCountries: ["US"],
    destinationCountries: ["US", "CA", "MX"],
    packaging: [
      {
        id: "7c012ad2-71c3-11ea-bc55-0242ac130003",
        name: "Flat-Rate Box"
      },
      {
        id: "e7d6906a-72ba-11ea-bc55-0242ac130003",
        name: "Large Padded Envelope"
      }
    ]
  }],

  pickupServices: [{
    id: "27483200-72b4-11ea-bc55-0242ac130003",
    name: "Drop Off Pickup",
    description: "Take your package to the specified carrier location.",
    carrier: {
      id: "8ea1989e-d504-433f-b031-b04d5d9ace94",
      name: "Test Carrier",
      description: "Test Carrier description",
      websiteURL: "https://my-test-site.com",
      logo: {
        colorSVG: "../logo.svg",
        blackAndWhiteSVG: "../logo.svg"
      }
    }
  }],

  loginForm: {
    dataSchema: {
      title: "Carrier One Registration",
      description: "Login with your Carrier One account information.",
      type: "object",
      required: [
        "userName",
        "password"
      ],
      properties: {
        userName: {
          type: "string",
          title: "User Name"
        },
        password: {
          type: "string",
          title: "Password",
          minLength: 3
        }
      }
    },
    uiSchema: {
      userName: {
        "ui:autofocus": true,
        "ui:emptyValue": "Email Address"
      },
      password: {
        "ui:widget": "text",
        "ui:help": "Password for carrier account"
      }
    }
  },

  settingsForm: {
    dataSchema: {
      title: "Carrier One Settings",
      description: "Update your Carrier One account information.",
      type: "object",
      required: [
        "userName",
        "password"
      ],
      properties: {
        userName: {
          type: "string",
          title: "User Name"
        },
        password: {
          type: "string",
          title: "Password",
          minLength: 3
        }
      }
    },
    uiSchema: {
      userName: {
        "ui:autofocus": true,
        "ui:emptyValue": "Email Address"
      },
      password: {
        "ui:widget": "text",
        "ui:help": "Password for carrier account"
      }
    }
  },


  login () {},
  requestPickup () { },
  cancelPickup () { },

  createLabel () { },
  voidLabel () { },
  getRates () { },
  getTrackingUrl () { },
  track () { },
  createManifest () { }

};

module.exports = config;
