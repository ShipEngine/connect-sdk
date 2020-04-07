"use strict";

const { importApp } = require("../../lib");
const { expect } = require("chai");
let inlineConfig;

describe("ipaasLoader() with inline config", () => {

  beforeEach(async () => {
    inlineConfig = await importApp("../fixtures/integration-apps/carrier-inline-app.js");
  });

  it("should not attempt to dereference a config that has all properties inlined", () => {
    expect(inlineConfig.name).to.equal("My Carrier");
    expect(inlineConfig.description).to.equal("My Carrier description goes here");
    expect(inlineConfig.websiteURL.href).to.equal("https://www.my-carrier.com/");
    expect(inlineConfig.logo.colorSVG).to.be.a("string");
    expect(inlineConfig.logo.colorSVG).to.be.contain("<svg");

    expect(inlineConfig.logo.blackAndWhiteSVG).to.be.a("string");
    expect(inlineConfig.logo.blackAndWhiteSVG).to.be.contain("<svg");

    expect(inlineConfig.deliveryServices).to.be.an("array");
    expect(inlineConfig.deliveryServices).to.be.an("array").with.lengthOf(1);
    expect(inlineConfig.deliveryServices[0].name).to.equal("Priority Overnight");


    expect(inlineConfig.pickupServices).to.be.an("array");
    expect(inlineConfig.pickupServices).to.be.an("array").with.lengthOf(1);
    expect(inlineConfig.pickupServices[0].name).to.equal("Drop Off Pickup");

    expect(inlineConfig.loginForm).to.be.an("object");
    expect(inlineConfig.loginForm.dataSchema.title).to.equal("Carrier One Registration");

    expect(inlineConfig.settingsForm).to.be.an("object");
    expect(inlineConfig.settingsForm.dataSchema.title).to.equal("Carrier One Settings");


    expect(inlineConfig.login).to.be.a("function");
    expect(inlineConfig.requestPickup).to.be.a("function");
    expect(inlineConfig.cancelPickup).to.be.a("function");
    expect(inlineConfig.createLabel).to.be.a("function");
    expect(inlineConfig.voidLabel).to.be.a("function");
    expect(inlineConfig.getRates).to.be.a("function");
    expect(inlineConfig.getTrackingUrl).to.be.a("function");
    expect(inlineConfig.track).to.be.a("function");
    expect(inlineConfig.createManifest).to.be.a("function");

  });

});
