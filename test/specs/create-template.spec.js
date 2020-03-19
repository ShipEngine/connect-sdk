"use strict";

const { expect } = require("chai");
const fs = require("fs");
const fsExtra = require("fs-extra");
const path = require("path");
const proxyquire = require("proxyquire").noCallThru();
const sinon = require("sinon");

let createTemplateStub;
let cliPromptStub;

const tmpDirPath = path.join(process.cwd(), "test", "tmp");

describe("createTemplate()", () => {

  beforeEach(() => {
    if (!fs.existsSync(tmpDirPath)) {
      fs.mkdirSync(tmpDirPath);
    }

    cliPromptStub = {
      cliPrompt: sinon.stub().returns(Promise.resolve({ "project-name": "ipaas-integration" }))
    };

    createTemplateStub = proxyquire("../../lib/create-template", { "./utils/cli-prompt": cliPromptStub });
  });

  afterEach(() => {
    fsExtra.emptyDirSync(tmpDirPath);
  });

  after(() => {
    fsExtra.removeSync(tmpDirPath);
  });

  it("should create a new project in the directory that the user specifies", async () => {
    await createTemplateStub.createTemplate(tmpDirPath);

    const integrationDir = path.join(tmpDirPath, "ipaas-integration");
    const srcDir = path.join(integrationDir, "src");

    const rootFilesDir = ["package.json", "tsconfig.json", "tslint.yaml", "src"];

    expect(integrationDir).to.be.a.directory().with.contents(rootFilesDir);
    expect(srcDir).to.be.a.directory().with.contents(["index.ts"]);
  });

  it("should overwrite the package.json 'name' property with the project name that the user specifies", async () => {
    await createTemplateStub.createTemplate(tmpDirPath);
    const integrationDir = path.join(tmpDirPath, "ipaas-integration");

    expect(path.join(integrationDir, "package.json")).to.be.a.file().with.contents.that.match(/"name": "ipaas-integration"/);
  });

  it("should throw an error if the project directory already exists", async () => {
    await createTemplateStub.createTemplate(tmpDirPath);

    try {
      await createTemplateStub.createTemplate(tmpDirPath);
    }
    catch (e) {
      expect(e.message).to.equal("A project with the name ipaas-integration already exists");
    }
  });
});
