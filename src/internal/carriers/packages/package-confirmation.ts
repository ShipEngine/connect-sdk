import { PackageConfirmation as PackageConfirmationPOJO } from "../../../public";
import { hideAndFreeze, Joi, _internal } from "../../common";
import { PackageIdentifier, PackageIdentifierBase } from "./package-identifier";


export class PackageConfirmation extends PackageIdentifierBase {
  public static readonly [_internal] = {
    label: "package",
    schema: PackageIdentifier[_internal].schema.keys({
      metadata: Joi.object(),
    }),
  };

  public readonly metadata: object;

  public constructor(pojo: PackageConfirmationPOJO) {
    super(pojo);

    this.metadata = pojo.metadata || {};

    // Make this object immutable
    hideAndFreeze(this);
  }
}
