import { PackageIdentifier as IPackageIdentifier, PackageIdentifier as PackageIdentifierPOJO } from "../../../definitions";
import { hideAndFreeze, Identifiers, Joi, _internal } from "../../common";

export abstract class PackageIdentifierBase implements IPackageIdentifier {
  public trackingNumber: string;
  public identifiers: Identifiers;

  public constructor(pojo: PackageIdentifierPOJO) {
    this.trackingNumber = pojo.trackingNumber || "";
    this.identifiers = new Identifiers(pojo.identifiers);
  }
}


export class PackageIdentifier extends PackageIdentifierBase {
  public static [_internal] = {
    label: "package",
    schema: Joi.object({
      trackingNumber: Joi.string().trim().singleLine().allow("").max(100),
      identifiers: Identifiers[_internal].schema,
    }),
  };

  public constructor(pojo: PackageIdentifierPOJO) {
    super(pojo);

    // Make this object immutable
    hideAndFreeze(this);
  }
}
