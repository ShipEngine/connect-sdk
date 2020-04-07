"use strict";

const { ipaasLoader } = require("../../lib");
const { expect } = require("chai");
let jsonConfig;

describe("ipaasLoader() with reference to json config files that have nested schema references", () => {

  beforeEach(async () => {
    jsonConfig = await ipaasLoader("../fixtures/integration-apps/carrier-json-app.js");
  });

  it("should properly dereference a config file", () => {
    expect(jsonConfig.name).to.equal("My Carrier");
    expect(jsonConfig.description).to.equal("My Carrier description goes here");
    expect(jsonConfig.websiteURL.href).to.equal("https://www.my-carrier.com/");
    expect(jsonConfig.logo.colorSVG).to.be.a("string");
    expect(jsonConfig.logo.colorSVG).to.be.contain("<svg");

    expect(jsonConfig.logo.blackAndWhiteSVG).to.be.a("string");
    expect(jsonConfig.logo.blackAndWhiteSVG).to.be.contain("<svg");

    expect(jsonConfig.deliveryServices).to.be.an("array");
    expect(jsonConfig.deliveryServices).to.be.an("array").with.lengthOf(1);
    expect(jsonConfig.deliveryServices[0].name).to.equal("Priority Overnight");
    // expect(jsonConfig.deliveryServices[0].packaging[1].name).to.equal("Large Padded Envelope");



    // expect(jsonConfig.pickupServices).to.be.an("array");
    // expect(jsonConfig.pickupServices).to.be.an("array").with.lengthOf(2);
    // expect(jsonConfig.pickupServices[0].name).to.equal("Drop Off Pickup");
    // expect(jsonConfig.pickupServices[1].name).to.equal("One Time Pickup");

    // expect(jsonConfig.registrationForm).to.be.an("object");
    // expect(jsonConfig.registrationForm.dataSchema.title).to.equal("Carrier One Registration");

    // expect(jsonConfig.settingsForm).to.be.an("object");
    // expect(jsonConfig.settingsForm.dataSchema.title).to.equal("Carrier One Settings");

    // expect(jsonConfig.requestPickup).to.be.a("function");
  });

});
