ShipEngine Integration Platform SDK
==============================================

[![Cross-Platform Compatibility](https://shipengine.github.io/img/badges/os-badges.svg)](https://github.com/ShipEngine/shipengine-integration-platform-sdk/actions)
[![Build Status](https://github.com/ShipEngine/shipengine-integration-platform-sdk/workflows/CI-CD/badge.svg)](https://github.com/ShipEngine/shipengine-integration-platform-sdk/actions)

[![Coverage Status](https://coveralls.io/repos/github/ShipEngine/shipengine-integration-platform-sdk/badge.svg?branch=master)](https://coveralls.io/github/ShipEngine/shipengine-integration-platform-sdk)
[![Dependencies](https://david-dm.org/ShipEngine/shipengine-integration-platform-sdk.svg)](https://david-dm.org/ShipEngine/shipengine-integration-platform-sdk)

[![npm](https://img.shields.io/npm/v/@shipengine/integration-platform-sdk.svg)](https://www.npmjs.com/package/@shipengine/integration-platform-sdk)
[![License](https://img.shields.io/npm/l/@shipengine/integration-platform-sdk.svg)](LICENSE)



This is the official SDK for building [**ShipEngine Integration Platform apps**](https://www.shipengine.com/docs/integration-platform/).



About ShipEngine Integration Platform Apps
--------------------------------------------
Apps are just [NPM packages](https://docs.npmjs.com/about-packages-and-modules) that export an object with properties and methods that define the app's functionality.

An app must have a [`package.json` file](https://docs.npmjs.com/files/package.json) in its root directory, which specifies its name, version number, and dependencies. This SDK (`@shipengine/integration-platform-sdk`) must be listed as a dependency or devDependency.

Other than that, the folder structure and file names are entirely up to you.  As long as your app exports an object with the right structure, it doesn't matter whether that object is defined in a single file or spread across many files.



Installation
--------------------------
You can install the ShipEngine Integration Platform SDK via [npm](https://docs.npmjs.com/about-npm/).

```bash
npm install @shipengine/integration-platform-sdk
```



Example Usage
-----------------------
In addition to [our documentation](https://www.shipengine.com/docs/integration-platform/), you can also look at [these sample apps](https://github.com/ShipEngine/shipengine-integration-platform-sample-apps) to learn how to use the ShipEngine Integration Platform SDK.  The sample apps demonstrate various features of the platform, as well as different posible ways to build and structure apps.
