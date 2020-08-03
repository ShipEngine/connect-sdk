import { PersonName as IPersonName, PersonName as PersonNamePOJO } from "../../../definitions";
import { hideAndFreeze, _internal } from "../utils";
import { Joi } from "../validation";

export class PersonName implements IPersonName {
  public static [_internal] = {
    label: "name",
    schema: Joi.alternatives(
      Joi.string().trim().singleLine().min(1).max(100),
      Joi.object({
        title: Joi.string().trim().singleLine().allow("").max(100),
        given: Joi.string().trim().singleLine().min(1).max(100).required(),
        middle: Joi.string().trim().singleLine().allow("").max(100),
        family: Joi.string().trim().singleLine().allow("").max(100),
        suffix: Joi.string().trim().singleLine().allow("").max(100),
      })
    ),
  };

  public title?: string;
  public given?: string;
  public middle?: string;
  public family?: string;
  public suffix?: string;

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
