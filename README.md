ShipEngine IPaaS
==============================================
Core Library for all IPaaS integration related functionality, used by the [ShipEngine CLI](https://github.com/ShipEngine/shipengine-cli) to provide a development environment for customers integrating with the ShipEngine ecosytem.

> **NOTE:** This is an **internal library** that is only intended to be used by CodeEngine. Using it outside of CodeEngine is discouraged.

Example
--------------------------

```typescript
import { createTemplate }  from "@shipengine/ipaas";

await createTemplate("path-to-template-dir");
```



Installation
--------------------------
You can install ShipEngine IPaaS via [npm](https://docs.npmjs.com/about-npm/).

```bash
npm install @shipengine/ipaas
```


Contributing
--------------------------
Contributions, enhancements, and bug-fixes are welcome!  [File an issue](https://github.com/ShipEngine/shipengine-ipaas/issues) on GitHub and [submit a pull request](https://github.com/ShipEngine/shipengine-ipaas/pulls).

#### Building
To build the project locally on your computer:

1. __Clone this repo__<br>
`git clone https://github.com/ShipEngine/shipengine-ipaas.git`

2. __Install dependencies__<br>
`npm install`

3. __Build the code__<br>
`npm run build`

4. __Run the tests__<br>
`npm test`