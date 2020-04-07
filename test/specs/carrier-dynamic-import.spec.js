"use strict";

const ipaasLoader = require("../../lib");
const { expect } = require("chai");
let jsonConfig;

describe.skip("ipaasLoader() with reference to json config files that have nested schema references", () => {

  beforeEach(async () => {
    jsonConfig = await ipaasLoader("../fixtures/integration-apps/carrier-dynamic-import");
  });

  it("should properly dereference a config file that has dynamic imports", () => {
    expect(jsonConfig.type).to.equal("shipping_provider");
    expect(jsonConfig.name).to.equal("My Carrier");
    expect(jsonConfig.description).to.equal("My Carrier description goes here");
    expect(jsonConfig.websiteURL.href).to.equal("https://www.my-carrier.com/");
    expect(jsonConfig.logo.colorSVG).to.be.instanceof(Buffer);
    expect(jsonConfig.logo.blackAndWhiteSVG).to.be.instanceof(Buffer);

    expect(jsonConfig.deliveryServices).to.be.an("array");
    expect(jsonConfig.deliveryServices).to.be.an("array").with.lengthOf(1);
    expect(jsonConfig.deliveryServices[0].name).to.equal("Ground");


    // expect(jsonConfig.pickupServices).to.be.an("array");
    // expect(jsonConfig.pickupServices).to.be.an("array").with.lengthOf(3);
    // expect(jsonConfig.pickupServices[0].name).to.equal("One Time Pickup");
    // expect(jsonConfig.pickupServices[2].name).to.equal("One Time Pickup");
    // expect(jsonConfig.pickupServices[3].name).to.equal("Recurring Pickup");


    // expect(jsonConfig.registrationForm).to.be.an("object");
    // expect(jsonConfig.registrationForm.dataSchema.title).to.equal("Carrier One Registration");

    // expect(jsonConfig.settingsForm).to.be.an("object");
    // expect(jsonConfig.settingsForm.dataSchema.title).to.equal("Carrier One Settings");

    // expect(jsonConfig.requestPickup).to.be.a("function");
  });

});
