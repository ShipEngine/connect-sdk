"use strict";

const { ipaasLoader } = require("../../lib");
const { expect } = require("chai");
let yamlConfig;

describe("ipaasLoader() with reference to yaml config files that have nested references", () => {

  beforeEach(async () => {
    yamlConfig = await ipaasLoader("../fixtures/integration-apps/carrier-yaml-app.js");
  });

  it("should properly dereference a config file", () => {
    expect(yamlConfig.name).to.equal("My Carrier");
    expect(yamlConfig.description).to.equal("My Carrier description goes here");
    expect(yamlConfig.websiteURL.href).to.equal("https://www.my-carrier.com/");
    expect(yamlConfig.logo.colorSVG).to.be.a("string");
    expect(yamlConfig.logo.colorSVG).to.be.contain("<svg");

    expect(yamlConfig.logo.blackAndWhiteSVG).to.be.a("string");
    expect(yamlConfig.logo.blackAndWhiteSVG).to.be.contain("<svg");


    expect(yamlConfig.deliveryServices).to.be.an("array");
    expect(yamlConfig.deliveryServices).to.be.an("array").with.lengthOf(1);
    expect(yamlConfig.deliveryServices[0].name).to.equal("Priority Overnight");


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

  it("should properly dereference an array that has inline and references to config files", () => {

  });

});
