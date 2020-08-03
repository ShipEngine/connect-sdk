import { Identifiers as IIdentifiers, Identifiers as IdentifiersPOJO } from "../../definitions";
import { hideAndFreeze, _internal } from "./utils";
import { Joi } from "./validation";

export class Identifiers implements IIdentifiers {
  public static [_internal] = {
    label: "identifiers",
    schema: Joi.object().pattern(
      Joi.string(), Joi.string().trim().singleLine().allow("").max(100),
    ),
  };

  [key: string]: string | undefined;

  public constructor(pojo: IdentifiersPOJO = {}) {
    // NOTE: Don't use Object.assign() here because it also copies Symbol properties
    for (let [key, value] of Object.entries(pojo)) {
      this[key] = value;
    }

    // Make this object immutable
    hideAndFreeze(this);
  }
}
