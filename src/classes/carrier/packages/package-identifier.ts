import { Constructor } from "../../../internal-types";
import { PackageIdentifierPOJO } from "../../../pojos/carrier";
import { Joi } from "../../../validation";
import { Identifier } from "../../common";
import { hideAndFreeze, _internal } from "../../utils";

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
      identifiers: Joi.array().items(Identifier[_internal].schema),
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
    public readonly trackingNumber?: string;

    /**
     * Alternative identifiers associated with this package
     */
    public readonly identifiers: ReadonlyArray<Identifier>;

    //#endregion

    public constructor(pojo: PackageIdentifierPOJO) {
      base === Object ? super() : super(pojo);

      this.trackingNumber = pojo.trackingNumber;
      this.identifiers = pojo.identifiers ? pojo.identifiers.map((id) => new Identifier(id)) : [];
    }
  };
}
