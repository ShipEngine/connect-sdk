import { PackagePOJO } from "../../../pojos/carrier";
import { CustomData } from "../../common";
import { App } from "../../common/app";
import { hideAndFreeze, _internal } from "../../utils";
import { NewPackage, newPackageMixin } from "./new-package";
import { PackageIdentifier, packageIdentifierMixin } from "./package-identifier";

/**
 * A package that has already been created and assigned identifiers
 */
export interface Package extends PackageIdentifier, NewPackage {}

/**
 * A package that has already been created and assigned identifiers
 */
export class Package extends newPackageMixin(packageIdentifierMixin()) {
  //#region Private/Internal Fields

  /** @internal */
  public static readonly [_internal] = {
    label: "package",
    schema: PackageIdentifier[_internal].schema.concat(NewPackage[_internal].schema).keys({
      customData: CustomData[_internal].schema,
    }),
  };

  //#endregion
  //#region Public Fields

  /**
   * Arbitrary data that was returned for this package when the label was created.
   */
  public readonly customData: CustomData;

  //#endregion

  public constructor(pojo: PackagePOJO, app: App) {
    super(pojo, app);

    this.customData = new CustomData(pojo.customData);

    // Make this object immutable
    hideAndFreeze(this);
  }
}

// Prevent modifications to the class
hideAndFreeze(Package);
