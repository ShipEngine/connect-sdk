import { JSONSchema6 } from "json-schema";
import { UiSchema } from "react-jsonschema-form";
import { Form as IForm, FormPOJO, LocalizedFormPOJO } from "../../public";
import { Localization, localize } from "./localization";
import { hideAndFreeze, _internal } from "./utils";
import { Joi } from "./validation";

const _private = Symbol("private fields");

export class Form implements IForm {
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

  private readonly [_private]: {
    readonly localization: Localization<LocalizedFormPOJO>;
  };

  public readonly dataSchema: JSONSchema6;
  public readonly uiSchema: UiSchema;

  public constructor(pojo: FormPOJO) {
    this.dataSchema = pojo.dataSchema;
    this.uiSchema = pojo.uiSchema;

    this[_private] = {
      localization: new Localization(pojo.localization || {}),
    };

    // Make this object immutable
    hideAndFreeze(this);
  }

  public localize(locale: string): Form {
    let pojo = localize(this, locale);
    return new Form(pojo);
  }

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


/**
 * Creates a clone of the `original` object, patched with the values of the `patch` object
 */
function deepPatch<T>(original: T, patch = {}): T {
  let record = original as Record<string, unknown>;
  let merged = { ...record };

  for (let [key, value] of Object.entries(patch)) {
    let isObject = typeof value === "object" && value && value.constructor === Object;

    if (isObject) {
      merged[key] = deepPatch(record[key], value as object);
    }
    else {
      merged[key] = value;
    }
  }

  return merged as unknown as T;
}
