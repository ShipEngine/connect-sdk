import { PackageConfirmation as IPackageConfirmation, PackageConfirmation as PackageConfirmationPOJO } from "../../../definitions";
import { hideAndFreeze, Joi, _internal } from "../../common";

import { PackageIdentifier, PackageIdentifierBase } from "./package-identifier";

export class PackageConfirmation extends PackageIdentifierBase implements IPackageConfirmation {
  public static [_internal] = {
    label: "package",
    schema: PackageIdentifier[_internal].schema.keys({
      metadata: Joi.object(),
    }),
  };

  public metadata: object;

  public constructor(pojo: PackageConfirmationPOJO) {
    super(pojo);

    this.metadata = pojo.metadata || {};

    // Make this object immutable
    hideAndFreeze(this);
  }
}
