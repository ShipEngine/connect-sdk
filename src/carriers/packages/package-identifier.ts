// tslint:disable: max-classes-per-file
import { Identifiers, IdentifiersPOJO } from "../../common";
import { hideAndFreeze, Joi, _internal } from "../../common/internal";

/**
 * Identifies a package
 */
export interface PackageIdentifierPOJO {
  /**
   * The carrier tracking number
   */
  trackingNumber?: string;

  /**
   * Your own identifiers for this package
   */
  identifiers?: IdentifiersPOJO;
}


/**
 * Abstract base class for package identity
 */
export abstract class PackageIdentifierBase {
  //#region Public Fields

  /**
   * The carrier tracking number
   */
  public readonly trackingNumber: string;

  /**
   * Your own identifiers for this package
   */
  public readonly identifiers: Identifiers;

  //#endregion

  public constructor(pojo: PackageIdentifierPOJO) {
    this.trackingNumber = pojo.trackingNumber || "";
    this.identifiers = new Identifiers(pojo.identifiers);
  }
}


/**
 * Identifies a package
 */
export class PackageIdentifier extends PackageIdentifierBase {
  //#region Private/Internal Fields

  /** @internal */
  public static readonly [_internal] = {
    label: "package",
    schema: Joi.object({
      trackingNumber: Joi.string().trim().singleLine().allow("").max(100),
      identifiers: Identifiers[_internal].schema,
    }),
  };

  //#endregion

  public constructor(pojo: PackageIdentifierPOJO) {
    super(pojo);

    // Make this object immutable
    hideAndFreeze(this);
  }
}

// Prevent modifications to the class
hideAndFreeze(PackageIdentifier);
