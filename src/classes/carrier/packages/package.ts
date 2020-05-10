import { hideAndFreeze, Joi, _internal } from "../../../internal";
import { PackagePOJO } from "../../../pojos/carrier";
import { App } from "../../common/app";
import { NewPackage, newPackageMixin } from "./new-package";
import { PackageIdentifier, packageIdentifierMixin } from "./package-identifier";

/**
 * A complete package that already exists and has identifiers
 */
export interface Package extends PackageIdentifier, NewPackage {}

/**
 * A complete package that already exists and has identifiers
 */
export class Package extends newPackageMixin(packageIdentifierMixin()) {
  //#region Private/Internal Fields

  /** @internal */
  public static readonly [_internal] = {
    label: "package",
    schema: PackageIdentifier[_internal].schema.concat(NewPackage[_internal].schema).keys({
      metadata: Joi.object(),
    }),
  };

  //#endregion
  //#region Public Fields

  /**
   * Arbitrary data that was returned for this package when the label was created.
   */
  public readonly metadata: object;

  //#endregion

  public constructor(pojo: PackagePOJO, app: App) {
    super(pojo, app);

    this.metadata = pojo.metadata || {};

    // Make this object immutable
    hideAndFreeze(this);
  }
}

// Prevent modifications to the class
hideAndFreeze(Package);
