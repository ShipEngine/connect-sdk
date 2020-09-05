[![ShipEngine Connect](https://connect.shipengine.com/img/logos/shipengine-connect-logo.png)](https://connect.shipengine.com)

ShipEngine Connect SDK
==============================================

[![Cross-Platform Compatibility](https://shipengine.github.io/img/badges/os-badges.svg)](https://github.com/ShipEngine/connect-sdk/actions)
[![Build Status](https://github.com/ShipEngine/connect-sdk/workflows/CI-CD/badge.svg)](https://github.com/ShipEngine/connect-sdk/actions)

[![Coverage Status](https://coveralls.io/repos/github/ShipEngine/connect-sdk/badge.svg?branch=master)](https://coveralls.io/github/ShipEngine/connect-sdk)
[![Dependencies](https://david-dm.org/ShipEngine/connect-sdk.svg)](https://david-dm.org/ShipEngine/connect-sdk)
[![npm](https://img.shields.io/npm/v/@shipengine/connect-sdk.svg)](https://www.npmjs.com/package/@shipengine/connect-sdk)
[![License](https://img.shields.io/npm/l/@shipengine/connect-sdk.svg)](LICENSE)


<p><br></p>

> ### ⚠ WARNING: This is an internal package
> Using this package directly is discouraged and unsupported. Instead, you should install
> [**@shipengine/connect**](https://www.npmjs.com/package/@shipengine/connect) which uses this package under the hood.
> See [our documentation](https://connect.shipengine.com/docs/cli) for more information.

<p><br></p>


This library contains TypeScript type definitions for ShipEngine Connect app developers, as well as internal classes, functions, etc. that's used by the ShipEngine Connect platform for testing, validation, and runtime.



Local Development
--------------------------
To build/test the library locally on your computer:

1. __Install dependencies__<br>
`npm install`

2. __Run the build script__<br>
`npm run build` or `npm run watch`

3. __Run the tests__<br>
`npm test`



Releasing
--------------------------
To release a new version of the SDK, use the command below.

```bash
npm run release
```

This will do the following:

- Display any outdated dependencies and prompt you to update them
- Run a security vulnerability audit
- Do a clean re-build
- Run all tests
- Run linter checks
- Prompt you for the version number to bump to
- Tag, commit, and push to GitHub

Once the commit is merged to the `master` branch, the [CI/CD script](.github/workflows/CI-CD.yaml) will publish it to NPM.
