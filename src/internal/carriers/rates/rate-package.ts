import { RatePackage as RatePackagePOJO } from "../../../public";
import { App, DefinitionIdentifier, hideAndFreeze, Joi, _internal } from "../../common";
import { Packaging } from "../packaging";
import { setPackaging } from "../utils";

export class RatePackage {
  public static readonly [_internal] = {
    label: "package",
    schema: Joi.object({
      packaging: Joi.alternatives(
        DefinitionIdentifier[_internal].schema.unknown(true),
        Joi.string().allow("")
      ).optional()
    }),
  };

  public readonly packaging?: Packaging | string;

  public constructor(pojo: RatePackagePOJO, app: App) {

    this.packaging = setPackaging(app, pojo.packaging);

    // Make this object immutable
    hideAndFreeze(this);
  }
}
