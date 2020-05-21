import { JSONSchema6 } from "json-schema";
import { UiSchema } from "react-jsonschema-form";
import { FormPOJO, LocalizedFormPOJO } from "./form-pojo";
import { Localization, localize } from "./internal/localization";
import { hideAndFreeze, _internal } from "./internal/utils";
import { Joi } from "./internal/validation";

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
      localization: Joi.object().localization({
        dataSchema: Joi.object(),
        uiSchema: Joi.object(),
      }),
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
    let { localization } = this[_private];
    let localizedValues = locale ? localization.lookup(locale) : {};

    return {
      ...this,
      localization: localization.toJSON(),
      dataSchema: deepPatch(this.dataSchema, localizedValues.dataSchema),
      uiSchema: deepPatch(this.uiSchema, localizedValues.uiSchema),
    };
  }
}

// Prevent modifications to the class
hideAndFreeze(Form);

/**
 * Creates a clone of the `original` object, patched with the values of the `patch` object
 */
function deepPatch<T>(original: T, patch = {}): T {
  let record = original as Record<string, unknown>;
  let merged = { ...record };

  for (let [key, value] of Object.entries(patch)) {
    let isPOJO = typeof value === "object" && value && value.constructor === Object;

    if (isPOJO) {
      merged[key] = deepPatch(record[key], value as object);
    }
    else {
      merged[key] = value;
    }
  }

  return merged as unknown as T;
}
