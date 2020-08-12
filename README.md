ShipEngine Connect SDK
==============================================

[![Cross-Platform Compatibility](https://shipengine.github.io/img/badges/os-badges.svg)](https://github.com/ShipEngine/connect-sdk/actions)
[![Build Status](https://github.com/ShipEngine/connect-sdk/workflows/CI-CD/badge.svg)](https://github.com/ShipEngine/connect-sdk/actions)

[![Coverage Status](https://coveralls.io/repos/github/ShipEngine/connect-sdk/badge.svg?branch=master)](https://coveralls.io/github/ShipEngine/connect-sdk)
[![Dependencies](https://david-dm.org/ShipEngine/connect-sdk.svg)](https://david-dm.org/ShipEngine/connect-sdk)

[![npm](https://img.shields.io/npm/v/@shipengine/connect-sdk.svg)](https://www.npmjs.com/package/@shipengine/connect-sdk)
[![License](https://img.shields.io/npm/l/@shipengine/connect-sdk.svg)](LICENSE)



This is the official SDK for building [**ShipEngine Connect apps**](https://connect.shipengine.com/docs/).


About ShipEngine Connect Apps
--------------------------------------------
Apps are just [NPM packages](https://docs.npmjs.com/about-packages-and-modules) that export an object with properties and methods that define the app's functionality.

An app must have a [`package.json` file](https://docs.npmjs.com/files/package.json) in its root directory, which specifies its name, version number, and dependencies. This SDK (`@shipengine/connect-sdk`) must be listed as a dependency or devDependency.

Other than that, the folder structure and file names are entirely up to you.  As long as your app exports an object with the right structure, it doesn't matter whether that object is defined in a single file or spread across many files.



Installation
--------------------------
You can install the ShipEngine Connect SDK via [npm](https://docs.npmjs.com/about-npm/).

```bash
npm install @shipengine/connect-sdk
```



Example Usage
-----------------------
In addition to [our documentation](https://connect.shipengine.com/docs/), you can also look at [these sample apps](https://github.com/ShipEngine/connect-sample-apps) to learn how to use the ShipEngine Connect SDK.  The sample apps demonstrate various features of the platform, as well as different possible ways to build and structure apps.
