import { JSONSchema6 } from "json-schema";
import { UiSchema } from "react-jsonschema-form";
import { Form as IForm, FormPOJO } from "../../definitions";
import { hideAndFreeze, _internal } from "./utils";
import { Joi } from "./validation";

const _private = Symbol("private fields");

export class Form implements IForm {
  public static readonly [_internal] = {
    label: "form",
    schema: Joi.object({
      dataSchema: Joi.object().required(),
      uiSchema: Joi.object().required()
    })
  };

  public readonly dataSchema: JSONSchema6;
  public readonly uiSchema: UiSchema;

  public constructor(pojo: FormPOJO) {
    this.dataSchema = pojo.dataSchema;
    this.uiSchema = pojo.uiSchema;

    // Make this object immutable
    hideAndFreeze(this);
  }
}
