import { JSONSchema6 } from "json-schema";
import { UiSchema } from "react-jsonschema-form";
import { hideAndFreeze, Joi, _internal } from "../../internal";
import { FormPOJO, LocalizedFormPOJO } from "../../pojos/connection";
import { Localization, localize } from "../common/localization";

const _private = Symbol("private fields");

/**
 * Defines a user-interface form that collects data from the user.
 */
export class Form {
  //#region Private/Internal Fields

  /** @internal */
  public static readonly [_internal] = {
    label: "form",
    schema: Joi.object({
      dataSchema: Joi.object().required(),
      uiSchema: Joi.object().required(),
      localization: Joi.object().localization(),
    }),
  };

  /** @internal */
  private readonly [_private]: {
    readonly localization: Localization<LocalizedFormPOJO>;
  };

  //#endregion
  //#region Public Fields

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

    this[_private] = {
      localization: new Localization(pojo.localization || {}),
    };

    // Make this object immutable
    hideAndFreeze(this);
  }

  /**
   * Creates a copy of the form, localized for the specified locale if possible.
   */
  public localize(locale: string): Form {
    let pojo = localize(this, locale);
    return new Form(pojo);
  }

  /**
   * Returns the form as a POJO that can be safely serialized as JSON.
   * Optionally returns the POJO localized to the specifeid language and region.
   */
  public toJSON(locale?: string): FormPOJO {
    let localizedValues = locale ? this[_private].localization.lookup(locale) : {};

    return {
      ...this,
      ...localizedValues,
    };
  }
}

// Prevent modifications to the class
hideAndFreeze(Form);
