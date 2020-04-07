import { JSONSchema6 } from "json-schema";
import { UiSchema } from "react-jsonschema-form";
import { assert } from "../assert";
import { FormConfig } from "../config";

/**
 * Defines a user-interface form that collects data from the user.
 */
export class Form {
  /**
   * A JSON Schema that defines the data collected by the form, including its constratints.
   */
  public readonly dataSchema: JSONSchema6;

  /**
   * A UI Schema that defines the appearance of the form.
   */
  public readonly uiSchema: UiSchema;

  /**
   * Creates a Form object from a fully-resolved config object
   */
  public constructor(config: FormConfig) {
    assert.type.object(config, "form");
    this.dataSchema = assert.type.object(config.dataSchema, "form dataSchema");
    this.uiSchema = assert.type.object(config.uiSchema, "form uiSchema");

    // Prevent modifications after validation
    Object.freeze(this);
    Object.freeze(this.dataSchema);
    Object.freeze(this.uiSchema);
  }
}
