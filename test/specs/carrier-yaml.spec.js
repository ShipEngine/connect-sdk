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


    expect(yamlConfig.pickupServices).to.be.an("array");
    expect(yamlConfig.pickupServices).to.be.an("array").with.lengthOf(2);
    expect(yamlConfig.pickupServices[0].name).to.equal("Drop Off Pickup");
    expect(yamlConfig.pickupServices[1].name).to.equal("One Time Pickup");

    expect(yamlConfig.loginForm).to.be.an("object");
    expect(yamlConfig.loginForm.dataSchema.title).to.equal("Carrier One Registration");

    expect(yamlConfig.settingsForm).to.be.an("object");
    expect(yamlConfig.settingsForm.dataSchema.title).to.equal("Carrier One Settings");

    expect(yamlConfig.login).to.be.a("function");
    expect(yamlConfig.requestPickup).to.be.a("function");
    expect(yamlConfig.cancelPickup).to.be.a("function");
    expect(yamlConfig.createLabel).to.be.a("function");
    expect(yamlConfig.voidLabel).to.be.a("function");
    expect(yamlConfig.getRates).to.be.a("function");
    expect(yamlConfig.getTrackingUrl).to.be.a("function");
    expect(yamlConfig.track).to.be.a("function");
    expect(yamlConfig.createManifest).to.be.a("function");
  });

});
