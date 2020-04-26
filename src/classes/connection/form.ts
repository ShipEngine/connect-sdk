import { JSONSchema6 } from "json-schema";
import { UiSchema } from "react-jsonschema-form";
import { FormPOJO } from "../../pojos/connection";
import { Joi } from "../../validation";

/**
 * Defines a user-interface form that collects data from the user.
 */
export class Form {
  //#region Class Fields

  public static readonly label = "form";

  /** @internal */
  public static readonly schema = Joi.object({
    dataSchema: Joi.object().required(),
    uiSchema: Joi.object().required(),
  });

  //#endregion
  //#region Instance Fields

  /**
   * A JSON Schema that defines the data collected by the form, including its constratints.
   */
  public readonly dataSchema: JSONSchema6;

  /**
   * A UI Schema that defines the appearance of the form.
   */
  public readonly uiSchema: UiSchema;

  //#endregion

  public constructor(pojo: FormPOJO) {
    this.dataSchema = pojo.dataSchema;
    this.uiSchema = pojo.uiSchema;

    // Prevent modifications after validation
    Object.freeze(this);
    Object.freeze(this.dataSchema);
    Object.freeze(this.uiSchema);
  }
}
