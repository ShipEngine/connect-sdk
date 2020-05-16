import { Identifiers, IdentifiersPOJO } from "../../common";
import { Constructor, hideAndFreeze, Joi, _internal } from "../../internal";

/**
 * Identifies a package
 */
export interface PackageIdentifierPOJO {
  /**
   * The carrier tracking number
   */
  trackingNumber?: string;

  /**
   * Custom identifiers for this package
   */
  identifiers?: IdentifiersPOJO;
}


/**
 * Identifies a package
 */
export class PackageIdentifier extends packageIdentifierMixin() {
  //#region Private/Internal Fields

  /** @internal */
  public static readonly [_internal] = {
    label: "package",
    schema: Joi.object({
      trackingNumber: Joi.string().trim().singleLine().min(1).max(100),
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

/**
 * Extends a base class with the fields of a package identifier
 * @internal
 */
export function packageIdentifierMixin(base: Constructor = Object) {
  return class PackageIdentifierMixin extends base {
    //#region Public Fields

    /**
     * The carrier tracking number
     */
    public readonly trackingNumber: string;

    /**
     * Custom identifiers for this package
     */
    public readonly identifiers: Identifiers;

    //#endregion

    public constructor(pojo: PackageIdentifierPOJO) {
      base === Object ? super() : super(pojo);

      this.trackingNumber = pojo.trackingNumber || "";
      this.identifiers = new Identifiers(pojo.identifiers);
    }
  };
}
