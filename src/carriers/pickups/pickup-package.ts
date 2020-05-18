import { Dimensions, Weight } from "../../common";
import { App, DefinitionIdentifier, hideAndFreeze, Joi, _internal } from "../../common/internal";
import { PackageIdentifier, packageIdentifierMixin } from "../packages/package-identifier";
import { Packaging } from "../packaging";
import { PickupPackagePOJO } from "./pickup-shipment-pojo";


/**
 * The package information needed to schedule a pickup
 */
export class PickupPackage extends packageIdentifierMixin() {
  //#region Private/Internal Fields

  /** @internal */
  public static readonly [_internal] = {
    label: "package",
    schema: PackageIdentifier[_internal].schema.keys({
      packaging: DefinitionIdentifier[_internal].schema.required(),
      dimensions: Dimensions[_internal].schema,
      weight: Weight[_internal].schema,
      metadata: Joi.object(),
    }),
  };

  //#endregion
  //#region Public Fields

  /**
   * The packaging used
   */
  public readonly packaging: Packaging;

  /**
   * The package dimensions
   */
  public readonly dimensions?: Dimensions;

  /**
   * The package weight
   */
  public readonly weight?: Weight;

  /**
   * Arbitrary data about this package that was previously persisted by the ShipEngine Platform.
   */
  public readonly metadata: object;

  //#endregion

  public constructor(pojo: PickupPackagePOJO, app: App) {
    super(pojo);

    this.packaging = app[_internal].references.lookup(pojo.packaging, Packaging);
    this.dimensions = pojo.dimensions && new Dimensions(pojo.dimensions);
    this.weight = pojo.weight && new Weight(pojo.weight);
    this.metadata = pojo.metadata || {};

    // Make this object immutable
    hideAndFreeze(this);
  }
}

// Prevent modifications to the class
hideAndFreeze(PickupPackage);
