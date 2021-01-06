import { PackageIdentifier as IPackageIdentifier, PackageIdentifierPOJO } from "../../../public";
import { hideAndFreeze, Identifiers, Joi, _internal } from "../../common";

export abstract class PackageIdentifierBase implements IPackageIdentifier {
  public readonly trackingNumber: string;
  public readonly identifiers: Identifiers;

  public constructor(pojo: PackageIdentifierPOJO) {
    this.trackingNumber = pojo.trackingNumber || "";
    this.identifiers = new Identifiers(pojo.identifiers);
  }
}


export class PackageIdentifier extends PackageIdentifierBase {
  public static readonly [_internal] = {
    label: "package",
    schema: Joi.object({
      trackingNumber: Joi.string().singleLine().allow(""),
      identifiers: Identifiers[_internal].schema,
    }),
  };

  public constructor(pojo: PackageIdentifierPOJO) {
    super(pojo);

    // Make this object immutable
    hideAndFreeze(this);
  }
}
