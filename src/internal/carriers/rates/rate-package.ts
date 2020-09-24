import { RatePackage as RatePackagePOJO } from "../../../public";
import { App, DefinitionIdentifier, hideAndFreeze, Joi, _internal } from "../../common";
import { Packaging } from "../packaging";

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
    let pkg;

    try {
      pkg = app[_internal].references.lookup(pojo.packaging, Packaging);
    } catch {
      if (typeof pojo.packaging === 'string') {
        pkg = pojo.packaging;
      }
    }

    this.packaging = pkg;

    // Make this object immutable
    hideAndFreeze(this);
  }
}
