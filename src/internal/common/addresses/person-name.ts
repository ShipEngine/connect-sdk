import { PersonName as IPersonName, PersonNamePOJO } from "../../../public";
import { hideAndFreeze, _internal } from "../utils";
import { Joi } from "../validation";

export class PersonName implements IPersonName {
  public static readonly [_internal] = {
    label: "name",
    schema: Joi.alternatives(
      Joi.string().allow("").max(100).optional(),
      Joi.object({
        title: Joi.string().trim().singleLine().allow("").max(100),
        given: Joi.string().trim().singleLine().min(1).max(100).required(),
        middle: Joi.string().trim().singleLine().allow("").max(100),
        family: Joi.string().trim().singleLine().allow("").max(100),
        suffix: Joi.string().trim().singleLine().allow("").max(100),
      })
    ),
  };

  public readonly title: string;
  public readonly given: string;
  public readonly middle: string;
  public readonly family: string;
  public readonly suffix: string;

  public constructor(pojo: string | PersonNamePOJO) {
    if (typeof pojo === "string") {
      pojo = { given: pojo, family: "" };
    }

    this.title = pojo.title || "";
    this.given = pojo.given;
    this.middle = pojo.middle || "";
    this.family = pojo.family || "";
    this.suffix = pojo.suffix || "";

    // Make this object immutable
    hideAndFreeze(this);
  }
}
